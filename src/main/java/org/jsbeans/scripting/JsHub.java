/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.scripting;

import akka.actor.ActorRef;
import akka.actor.ActorSelection;
import akka.actor.Cancellable;
import akka.actor.Scheduler;
import akka.util.Timeout;

import org.eclipse.wst.jsdt.debug.rhino.debugger.RhinoDebugger;
import org.jboss.netty.channel.ChannelException;
import org.jsbeans.Core;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.messages.Message;
import org.jsbeans.messages.Messages;
import org.jsbeans.monads.Chain;
import org.jsbeans.monads.CompleteMonad;
import org.jsbeans.monads.FutureMonad;
import org.jsbeans.scripting.JsTimeoutMessage.TimeoutType;
import org.jsbeans.security.PrincipalMessage;
import org.jsbeans.security.SecurityService;
import org.jsbeans.serialization.GsonWrapper;
import org.jsbeans.serialization.JsObjectSerializerHelper;
import org.jsbeans.services.DependsOn;
import org.jsbeans.services.Service;
import org.jsbeans.types.JsonObject;
import org.mozilla.javascript.*;
import org.mozilla.javascript.tools.debugger.Main;
import org.mozilla.javascript.tools.debugger.ScopeProvider;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;

import javax.security.auth.Subject;
import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.security.PrivilegedExceptionAction;
import java.text.MessageFormat;
import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

@DependsOn({SecurityService.class})
public class JsHub extends Service {
    private static final boolean openDebugger = ConfigHelper.has("kernel.jshub.openDebugger") ? ConfigHelper.getConfigBoolean("kernel.jshub.openDebugger") : false;
    private static final boolean createDump = ConfigHelper.has("kernel.jshub.createDump") ? ConfigHelper.getConfigBoolean("kernel.jshub.createDump"):false;
    
    private static final long completeDelta = ConfigHelper.getConfigInt("kernel.jshub.stateCompleteTimeout");
    private static final long execDelta = ConfigHelper.getConfigInt("kernel.jshub.stateExecutingTimeout");
    private static final long garbageCollectorInterval = ConfigHelper.getConfigInt("kernel.jshub.garbageCollectorInterval");
    private static final long sessionExpire = ConfigHelper.getConfigInt("kernel.jshub.sessionExpireTimeout");
    private static final int jsOptimizationLevel = -1;
    private static final int jsLanguageVersion = Context.VERSION_ES6;
    
    private final Map<String, JsCmdState> stateMap = new ConcurrentHashMap<String, JsCmdState>();
    
    private ThreadPoolExecutor threadPool = null;
    private BlockingQueue<Runnable> threadQueue = null;
    private final Map<String, Cancellable> timeoutMap = new ConcurrentHashMap<String, Cancellable>();
    private final Map<String, Map<String, Object>> execMapScript = new ConcurrentHashMap<String, Map<String, Object>>();
    private Main debugger;
    
    private static ContextFactory contextFactory = new ContextFactory(){
        @Override
        protected boolean hasFeature(Context cx, int featureIndex)
        {
        	if(featureIndex == Context.FEATURE_V8_EXTENSIONS){
        		return true;
        	}
        	if(featureIndex == Context.FEATURE_THREAD_SAFE_OBJECTS) {
        		return true;
            }
            return super.hasFeature(cx, featureIndex);
        }
    };

    public class InterceptWrapFactory extends WrapFactory{
        private final Map<String, Object> locals = new HashMap<>();
        {
            Context context = Context.getCurrentContext();
            this.locals.put("token", context.getThreadLocal("token"));
            this.locals.put("session", context.getThreadLocal("session"));
            this.locals.put("user", context.getThreadLocal("user"));
            this.locals.put("userToken", context.getThreadLocal("token"));
            this.locals.put("clientAddr", context.getThreadLocal("clientAddr"));
            this.locals.put("clientRequestId", context.getThreadLocal("clientRequestId"));
            this.locals.put("scope", context.getThreadLocal("scope"));
            this.locals.put("_jsbCallingContext", context.getThreadLocal("_jsbCallingContext"));
        }
        @Override
        public Scriptable wrapAsJavaObject(Context cx, Scriptable scope, Object javaObject, Class<?> staticType) {
            return new InterceptNativeObject(scope, javaObject, staticType, locals);
        }
    }

    public class InterceptNativeObject extends NativeJavaObject {
        private final Map<String, Object> locals;
        @Override
        public Object get(String name, Scriptable start) {
            Object res = super.get(name, start);
            if (res instanceof NativeJavaMethod) {
                NativeJavaMethod method = (NativeJavaMethod) res;
                return new JavaMethodWrapper(method, locals);
            }
            return res;
        }
        public InterceptNativeObject(Scriptable scope, Object javaObject, Class<?> staticType, Map<String, Object> locals) {
            super(scope, javaObject, staticType);
            this.locals = locals;
        }
    }

    private static class JavaMethodWrapper implements Function {
        private final Map<String, Object> locals;
        private final NativeJavaMethod method;
        public JavaMethodWrapper(NativeJavaMethod method, Map<String, Object> locals) {
            this.method = method;
            this.locals = locals;
        }
        public boolean hasInstance(Scriptable instance) {
            return method.hasInstance(instance);
        }
        public Object call(Context cx, Scriptable scope, Scriptable thisObj, Object[] args) {
            if(cx.getThreadLocal("session") == null) {
                cx.putThreadLocal("token", this.locals.get("token"));
                cx.putThreadLocal("session", this.locals.get("session"));
                cx.putThreadLocal("user", this.locals.get("user"));
                cx.putThreadLocal("userToken", this.locals.get("token"));
                cx.putThreadLocal("clientAddr", this.locals.get("clientAddr"));
                cx.putThreadLocal("clientRequestId", this.locals.get("clientRequestId"));
                cx.putThreadLocal("scope", this.locals.get("scope"));
                cx.putThreadLocal("_jsbCallingContext", this.locals.get("_jsbCallingContext"));
            }

            return method.call(cx, scope, thisObj, args);
        }
        public boolean has(int index, Scriptable start) {
            return method.has(index, start);
        }
        public Scriptable construct(Context cx, Scriptable scope, Object[] args) {
            return method.construct(cx, scope, args);
        }
        public void put(int index, Scriptable start, Object value) {
            method.put(index, start, value);
        }
        public void delete(int index) {
            method.delete(index);
        }
        public Scriptable createObject(Context cx, Scriptable scope) {
            return method.createObject(cx, scope);
        }
        public boolean has(String name, Scriptable start) {
            return method.has(name, start);
        }
        public void defineConst(String name, Scriptable start) {
            method.defineConst(name, start);
        }
        public void put(String name, Scriptable start, Object value) {
            method.put(name, start, value);
        }
        public void delete(String name) {
            method.delete(name);
        }
        public Scriptable getPrototype() {
            return method.getPrototype();
        }
        public void setPrototype(Scriptable m) {
            method.setPrototype(m);
        }
        public Scriptable getParentScope() {
            return method.getParentScope();
        }
        public void setParentScope(Scriptable m) {
            method.setParentScope(m);
        }
        public Object[] getIds() {
            return method.getIds();
        }
        public Object get(int index, Scriptable start) {
            return method.get(index, start);
        }
        public Object get(String name, Scriptable start) {
            return method.get(name, start);
        }
        public String getClassName() {
            return method.getClassName();
        }
        public Object getDefaultValue(Class<?> typeHint) {
            return method.getDefaultValue(typeHint);
        }
    }
    
    public static ContextFactory getContextFactory(){
    	return contextFactory;
    }
    
    private Context context;
    private ScriptableObject sharedScope;
    

    private static String serializeFunction(Function func) throws UnsupportedEncodingException {
        String script;
        Scriptable s = func.getParentScope();
        JsObjectSerializerHelper jser = new JsObjectSerializerHelper();
        if (s != null && s.has("deferProc", s)) {
            // defer or deferUntil
            script = jser.serializeNative(s.get("deferProc", s)).toJS();
        } else {
            script = jser.serializeNative(func).toJS();
        }
        return script;
    }

    @Override
    protected void onInit() throws PlatformException {
    	int threadPoolSize = 0;
    	if(ConfigHelper.has("kernel.jshub.threadPoolSize")){
    		threadPoolSize = ConfigHelper.getConfigInt("kernel.jshub.threadPoolSize");
    	}
    	
    	this.threadQueue = new SynchronousQueue<Runnable>(true);
    	this.threadPool = new ThreadPoolExecutor(0, threadPoolSize > 0 ? threadPoolSize : Integer.MAX_VALUE, 60L, TimeUnit.SECONDS, this.threadQueue );
        this.context = contextFactory.enterContext();
        this.context.setOptimizationLevel(jsOptimizationLevel);
        this.context.setLanguageVersion(jsLanguageVersion);
        this.sharedScope = this.context.initStandardObjects(null, true);
        
        Object wrappedBridge = Context.javaToJS(JsBridge.getInstance(), sharedScope);
        ScriptableObject.putProperty(sharedScope, "Bridge", wrappedBridge);
        JsObjectSerializerHelper.getInstance().initScopeTree(sharedScope);

        if (openDebugger) {
            this.openDebugger(new DebuggerMessage());
/*            
            try {
				this.enableEclipseDebugger();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
*/			
        }

        this.completeInitialization();

        // Run garbage collection timer to avoid old sessions
        Core.getActorSystem().scheduler().schedule(
                Duration.Zero(),
                Duration.create(garbageCollectorInterval, TimeUnit.MILLISECONDS),
                getSelf(),
                Message.TICK,
                Core.getActorSystem().dispatcher(),
                getSelf());
    }

    public void openDebugger(DebuggerMessage msg) {
        if (!msg.isStop()) {
            if (debugger == null) {
                debugger = new Main("Rhino JavaScript Debugger: " + getClass().getSimpleName());
                debugger.setExitAction(new Runnable() {
                    @Override
                    public void run() {
                        System.exit(0);
                    }
                });
                debugger.attachTo(contextFactory);
                debugger.setScopeProvider(new ScopeProvider() {
                    @Override
                    public Scriptable getScope() {
                        return sharedScope;
                    }
                });
            }

            if (msg.isBreakOnStart()) debugger.doBreak();
            debugger.setBreakOnEnter(msg.isBreakOnEnter());
            debugger.setBreakOnExceptions(msg.isBreakOnExceptions());
            debugger.setBreakOnReturn(msg.isBreakOnReturn());
            debugger.pack();
            debugger.setSize(1024, 768);
            debugger.setVisible(true);
        } else {
            debugger.detach();
            debugger.dispose();
            debugger = null;
        }
    }
    
    private void enableEclipseDebugger() throws Exception {
    	int port = 9999;
    	String transport = "socket";
    	boolean suspend = false; // suspend until debugger attaches itself
    	boolean trace = false; // trace-log the debug agent
    	
    	final String configString = MessageFormat.format(
			"transport={0},suspend={1},address={2}",
			new Object[] { transport, suspend ? "y" : "n",
				String.valueOf(port), trace ? "y" : "n" });
    	
		RhinoDebugger d = new RhinoDebugger(configString);
		d.start();
		getContextFactory().addListener(d);
    }


    @Override
    protected void onMessage(Object msg) throws PlatformException {
        if (msg instanceof String && msg.equals(Message.TICK)) {
            this.updateStates();
        } else if (msg instanceof DebuggerMessage) {
            this.openDebugger(((DebuggerMessage) msg));
        } else if (msg instanceof ExecuteScriptMessage) {
            this.executeScript((ExecuteScriptMessage) msg);
        } else if (msg instanceof UpdateStatusMessage) {
            this.updateExecutionStatus((UpdateStatusMessage) msg);
        } else if (msg instanceof QueryStatusMessage) {
            this.proceedQueryExecutionStatus((QueryStatusMessage) msg);
        } else if (msg instanceof JsAskMessage) {
            this.handleJsAsk((JsAskMessage) msg);
        } else if (msg instanceof JsTimeoutMessage) {
            this.handleJsTimeout((JsTimeoutMessage) msg);
        } else if (msg instanceof RemoveScopeMessage) {
            this.handleRemoveScope((RemoveScopeMessage) msg);
        } else if (msg instanceof JsDumpMessage) {
            this.handleJsDumpMessage((JsDumpMessage) msg);
        } else {
            this.utilizeMessage(msg);
        }

    }

    private void handleJsDumpMessage(JsDumpMessage msg) {

        List<JsonObject> retLst = new ArrayList<>();
        for (String id : execMapScript.keySet()) {
            Map<String, Object> mObj = execMapScript.get(id);
            JsonObject retObj = new JsonObject();
            if (mObj.containsKey("script")) {
                retObj.put("script", mObj.get("script").toString());
            } else if (mObj.containsKey("function")) {
                String script = "";
                try {
                    Function f = (Function) mObj.get("function");
                    script = serializeFunction(f);

                } catch (UnsupportedEncodingException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (PlatformException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
                retObj.put("script", script);
            }
            retObj.put("time", System.currentTimeMillis() - (long) mObj.get("started"));
            retLst.add(retObj);
        }
        getSender().tell(msg.createResponse(retLst), getSelf());
    }
/*    
    private MessageDispatcher getDispatcher(String dName) {
        return Core.getActorSystem().dispatchers().lookup(dName);
    }
*/
    private void handleRemoveScope(RemoveScopeMessage msg) {
        this.clearScope(msg.getScopePath());
        if(getSender() != ActorRef.noSender()){
        	getSender().tell(msg.createResponse("ok"), getSelf());
        }
    }
    
    private void clearScope(String scopePath){
    	// clear beans
    	String script = "var sessionScope = JSB().getSessionInstancesScope(); var beanIdsArr = Object.keys(sessionScope); for(var bidx = 0; bidx < beanIdsArr.length; bidx++){ var bInst = sessionScope[beanIdsArr[bidx]]; if(bInst && bInst.destroy){ try{ bInst.destroy();} catch(e){ JSB.getLogger().error(e);} } }";
    	try {
	    	Scriptable scope = JsObjectSerializerHelper.getInstance().getScopeTree().touch(scopePath, false);
	    	Context cx = contextFactory.enterContext();
	        cx.setOptimizationLevel(jsOptimizationLevel);
	        cx.setLanguageVersion(jsLanguageVersion);
	        cx.putThreadLocal("session", scopePath);
	        cx.putThreadLocal("scope", scope);
	        cx.putThreadLocal("_jsbCallingContext", null);
	        
	        cx.evaluateString(scope, script, "session_disposal", 1, null);
	        
    	} catch(Throwable e){
            StringBuilder sb = new StringBuilder("Execute script error: ");
            sb.append(e.getMessage()).append("\n");
            sb.append("--> Script executed: ");
            sb.append(script);
            if (e instanceof RhinoException) {
                RhinoException re = (RhinoException) e;
                sb.append("\n--> Stack trace:\n").append(re.getScriptStackTrace());
            }
            getLog().error(sb.toString(), e);
    	} finally {
            Context.exit();
		}
        
    	// remove from scope tree
    	JsObjectSerializerHelper.getInstance().getScopeTree().remove(scopePath);
    }

    private void utilizeMessage(Object msg) {
        this.getLog().debug("Utilized unused message: '{}'", msg);
    }

    private String subclassToken(String token) {
        String subToken = UUID.randomUUID().toString();
        if (this.stateMap.containsKey(token)) {
            JsCmdState s = this.stateMap.get(token);
            if (s.subTokens == null) {
                s.subTokens = new ArrayList<String>();
            }
            s.subTokens.add(subToken);
        }
        return subToken;
    }

    private void handleJsTimeout(JsTimeoutMessage msg) {
        if (msg.getType() == TimeoutType.setInterval || msg.getType() == TimeoutType.setTimeout) {
            Scheduler sch = Core.getActorSystem().scheduler();
            Cancellable c = null;
            String subToken = null;
            if (msg.getCallback() != null) {
                subToken = this.subclassToken(msg.getToken());
            }
            final ExecuteScriptMessage execMsg = new ExecuteScriptMessage(subToken, (Function) msg.getCallback(), new Object[]{});
            execMsg.setScopePath(msg.getScopePath());
            execMsg.setPreserveScope(false);
            execMsg.setUser(msg.getUser());
            execMsg.setUserToken(msg.getUserToken());
            execMsg.setClientRequestId(msg.getClientRequestId());
            execMsg.setClientAddr(msg.getClientAddr());

            final String key = UUID.randomUUID().toString();
            if (msg.getType() == TimeoutType.setTimeout) {
                c = sch.scheduleOnce(
                        Duration.create(msg.getDuration(), TimeUnit.MILLISECONDS),
                        new Runnable() {
                            @Override
                            public void run() {
                                getSelf().tell(execMsg, getSelf());
                                getSelf().tell(JsTimeoutMessage.createClearTimeout(key), getSelf());
                            }
                        },
                        Core.getActorSystem().dispatcher());
            } else {
                c = sch.schedule(
                        Duration.Zero(),
                        Duration.create(msg.getDuration(), TimeUnit.MILLISECONDS),
                        getSelf(),
                        execMsg,
                        Core.getActorSystem().dispatcher(),
                        getSelf());
            }
            this.timeoutMap.put(key, c);
            msg.setKey(key);
            if (getSender() == null || getSender().equals(ActorRef.noSender())) {
                ActorRef.noSender().tell(msg, getSelf()); // test
            } else {
                getSender().tell(msg, getSelf());
            }
        } else {
            if (!this.timeoutMap.containsKey(msg.getKey())) {
//                this.getLog().warning("Invalid timeout key specified '{}'", msg.getKey());
                return;
            }
            Cancellable c = this.timeoutMap.get(msg.getKey());
            if (!c.isCancelled()) {
                c.cancel();
            }
            this.timeoutMap.remove(msg.getKey());
        }
    }

    private void handleJsAsk(JsAskMessage msg) throws PlatformException {
        // associate callback to token if existed
        String subToken = null;
        if (msg.getCallback() != null) {
            subToken = this.subclassToken(msg.getToken());
        }
        
        this.createChain(Core.getActorSystem().dispatcher(), JsAskMessage.class, Object.class, msg)
                .add(new FutureMonad<JsAskMessage, Object>(JsObjectSerializerHelper.getInstance().getScopeTree().getRoot().scope()) {
                    @Override
                    public Future<Object> run(JsAskMessage msg) throws ChannelException {
                        // obtain target actor
                        ActorSelection targetActor = null;
                        if(msg.getNode() != null){
                        	// clustered ask
                        	targetActor = ActorHelper.getActorSelection(msg.getNode(), msg.getTargetServiceName());
                        } else {
                        	targetActor = ActorHelper.getActorSelection(msg.getTargetServiceName());
                        }
                        if (targetActor == null) {
                            throw new ChannelException(String.format("Unable to locate service with name: '%s' due to trying to send them message from JS", msg.getTargetServiceName()));
                        }
                        Object msgToSend = null;
                        // lookup message type
                        if (!Messages.getInstance().contains(msg.getMessageTypeName())) {
                            // send pure string instead of Message
                            msgToSend = msg.getMessageTypeName();
                        } else {
                            Class<? extends Message> msgCls = Messages.getInstance().get(msg.getMessageTypeName());
                            String json = "{}";
                            if (msg.getMessageBody() != null) {
/*
							Context lCtx = Context.enter();
							json = NativeJSON.stringify(lCtx, sharedScope, msg.getMessageBody(), null, null).toString();
							Context.exit();
*/

                                try {
                                    json = JsObjectSerializerHelper.getInstance().serializeNative(msg.getMessageBody()).toJS(false);
                                } catch (UnsupportedEncodingException e) {
                                    e.printStackTrace();
                                } catch (PlatformException e) {
                                    e.printStackTrace();
                                }

                            }
                            msgToSend = GsonWrapper.fromJson(json, msgCls);
                            if (msgToSend instanceof PrincipalMessage<?>) {
                                ((PrincipalMessage<?>) msgToSend).setUserPrincipal(msg.getUser());
                            }
                        }

                        if (msg.isTell()) {
                            targetActor.tell(msgToSend, JsHub.this.getSelf());
                            return akka.dispatch.Futures.future(new Callable<Object>() {
                                @Override
                                public Object call() throws Exception {
                                    return null;
                                }
                            }, Core.getActorSystem().dispatcher());
                        }
                        Timeout timeout = msg.getTimeout() != null ? msg.getTimeout() : ActorHelper.getServiceCommTimeout();
                        return ActorHelper.futureAsk(targetActor, msgToSend, timeout);
                    }
                }).add(new CompleteMonad<Object>(this.getSender(), msg, subToken) {
            @Override
            public void onComplete(Chain<?, Object> chain, Object result, Throwable fail) throws ChannelException {
                if (result instanceof Throwable) {
                    fail = (Throwable) result;
                }
                ActorRef sender = this.getArgument(0);
                JsAskMessage msg = this.getArgument(1);
                String subToken = this.getArgument(2);

                JsWrappedResponseMessage respMsg = null;
                if (fail == null) {
                    // wrap result into response message
                    if (result instanceof String) {
                        respMsg = new JsWrappedResponseMessage(result.toString());
                    } else if (result instanceof Message) {
                        respMsg = new JsWrappedResponseMessage((Message) result);
                    } else {
                        respMsg = new JsWrappedResponseMessage((Serializable) result);
                    }

                } else {
                    respMsg = new JsWrappedResponseMessage(fail);
                    //getLog().error(fail.getMessage(), fail);
                }

                if (!msg.isTell()) {
                    if (msg.getCallback() == null) {
                        sender.tell(respMsg, getSelf());
                    } else {
                        ExecuteScriptMessage execMsg = new ExecuteScriptMessage(subToken, (Function) msg.getCallback(), new Object[]{respMsg});
                        execMsg.setScopePath(msg.getScopePath());
                        execMsg.setPreserveScope(false);
                        execMsg.setUser(msg.getUser());
                        execMsg.setUserToken(msg.getUserToken());
                        execMsg.setClientRequestId(msg.getClientRequestId());
                        execMsg.setClientAddr(msg.getClientAddr());
                        getSelf().tell(execMsg, sender);
                    }
                }
            }
        });
    }

    private void updateStates() {
        this.updateTokens();
        this.updateSessions();
    }


    private void updateTokens() {
        List<String> tokensToRemove = new ArrayList<String>();
        long curTime = System.currentTimeMillis();
        for (String token : this.stateMap.keySet()) {
            JsCmdState state = this.stateMap.get(token);
            if (state.status == ExecutionStatus.SUCCESS || state.status == ExecutionStatus.FAIL) {
                if (curTime - state.updateTime > completeDelta) {
                    tokensToRemove.add(token);
                }
            } else if (state.status == ExecutionStatus.EXECUTING) {
                if (curTime - state.updateTime > execDelta) {
                    tokensToRemove.add(token);
                }
            }
        }

        for (String token : tokensToRemove) {
            this.removeState(token);
        }
    }

    private void updateSessions() {
        try {
            List<String> sessionsToRemove = JsObjectSerializerHelper.getInstance().getScopeTree().getRoot().updateEldest(sessionExpire);
            if(sessionsToRemove != null){
            	for(String scopeId : sessionsToRemove){
            		this.clearScope(scopeId);
            	}
            }
        } catch (Exception e) {
            getLog().error("JsHub failed to collect garbage sessions with message: " + e.getMessage(), e);
        }
    }

    private void removeState(String token) {
        if (this.stateMap.containsKey(token)) {
            this.stateMap.remove(token);
        }
    }

    private void proceedQueryExecutionStatus(QueryStatusMessage msg) {
        UpdateStatusMessage respMsg = new UpdateStatusMessage(msg.token);

        if (!this.stateMap.containsKey(msg.token)) {
            respMsg.status = ExecutionStatus.MISSING;
        } else {
            JsCmdState state = this.stateMap.get(msg.token);
            respMsg.status = state.status;
            respMsg.result = state.result;
            respMsg.error = state.error;
            if (state.subTokens != null && state.subTokens.size() > 0) {
                respMsg.subTokens = new ArrayList<String>(state.subTokens);
            }

            if (state.status == ExecutionStatus.SUCCESS || state.status == ExecutionStatus.FAIL) {
                this.removeState(state.token);
            }
        }
        getSender().tell(respMsg, getSelf());
    }

    private void updateExecutionStatus(UpdateStatusMessage msg) {
        if (!this.stateMap.containsKey(msg.token)) {
            return;
        }
        JsCmdState state = this.stateMap.get(msg.token);
        state.result = msg.result;
        state.status = msg.status;
        state.error = msg.error;
        state.updateTime = System.currentTimeMillis();
        this.stateMap.remove(msg.token);
        this.stateMap.put(msg.token, state);
    }

    private synchronized void dumpScript(String id, String script, Function func, boolean begin) {
        if (begin) {
            Map<String, Object> mObj = new HashMap<>();
            if (script != null) {
                mObj.put("script", script);
            } else if (func != null) {
                mObj.put("function", func);
            }
            mObj.put("started", System.currentTimeMillis());
            execMapScript.put(id, mObj);
        } else {
            if (execMapScript.containsKey(id)) {
                execMapScript.remove(id);
            }
        }
    }
	
/*	
	private String runMD5(String str){
		MessageDigest mdProc = null;
		try {
			mdProc = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
		}
		mdProc.reset();
		mdProc.update(str.getBytes());
		BigInteger bigInt = new BigInteger(1, mdProc.digest());
		String md5Hex = bigInt.toString(16);
	    while( md5Hex.length() < 32 ){
	        md5Hex = "0" + md5Hex;
	    }
	    return md5Hex;
	}
*/

    private void executeScript(ExecuteScriptMessage msg) throws PlatformException {
        String token = msg.getToken() != null ? msg.getToken() : UUID.randomUUID().toString();

        if (msg.isAsync()) {
            JsCmdState state = new JsCmdState(token);
            if (this.stateMap.containsKey(token)) {
                this.stateMap.remove(token);
            }
            this.stateMap.put(token, state);

            // respond to caller
            UpdateStatusMessage respMsg = new UpdateStatusMessage(token);
            respMsg.status = ExecutionStatus.INIT;
            respMsg.token = token;
            this.getSender().tell(respMsg, this.getSelf());
        }

        if (msg.getScopePath() == null) {
            msg.setScopePath("");
        }
        
        ActorRef self = this.getSelf();
        ActorRef sender = this.getSender();
        Scriptable scope = JsObjectSerializerHelper.getInstance().getScopeTree().touch(msg.getScopePath(), msg.isScopePreserved());
        Runnable r = new Runnable() {
			@Override
			public void run() {
                // put wrapped entries if any
                if (msg.getWrapped() != null) {
                    for (String key : msg.getWrapped().keySet()) {
                        Object obj = msg.getWrapped().get(key);
                        ScriptableObject.putProperty(scope, key, obj);
                    }
                }

                Context cx = contextFactory.enterContext();
                cx.setOptimizationLevel(jsOptimizationLevel);
                cx.setLanguageVersion(jsLanguageVersion);
                String scriptId = UUID.randomUUID().toString();
                try {
                    if (msg.isAsync()) {
                        // send local message to update status
                        UpdateStatusMessage uMsg = new UpdateStatusMessage(token);
                        uMsg.status = ExecutionStatus.EXECUTING;
                        uMsg.token = token;
                        self.tell(uMsg, self);
                    }

                    // execute script
                    cx.putThreadLocal("token", token);
                    cx.putThreadLocal("session", msg.getScopePath());
                    cx.putThreadLocal("user", msg.getUser());
                    cx.putThreadLocal("userToken", msg.getUserToken());
                    cx.putThreadLocal("clientAddr", msg.getClientAddr());
                    cx.putThreadLocal("clientRequestId", msg.getClientRequestId());
                    cx.putThreadLocal("scope", scope);
                    cx.putThreadLocal("_jsbCallingContext", null);

                    cx.setWrapFactory(new InterceptWrapFactory());

                    Subject subj = Subject.getSubject(msg.getAccessControlContext());
                    Object resultObj = null;
                    if (msg.getBody() != null) {
                    	if(createDump){
                    		dumpScript(scriptId, msg.getBody(), null, true);
                    	}

                        resultObj = Subject.doAs(
                                subj,
                                (PrivilegedExceptionAction<Object>) () -> cx.evaluateString(scope, msg.getBody(), getScriptNameByToken(token), 1, null)
                        );
                    } else if (msg.getFunction() != null) {
                    	Object[] args = msg.getArgs();
                        List<Object> objArr = new ArrayList<Object>();
                    	if(args.length > 0){
                            JsObjectSerializerHelper jser = new JsObjectSerializerHelper();
                            for (Object obj : args) {
                                objArr.add(jser.jsonElementToNativeObject(GsonWrapper.toGsonJsonElement(obj), cx, scope));
                            }
                    	}
                        if(createDump){
                        	dumpScript(scriptId, null, msg.getFunction(), true);
                        }
                        resultObj = Subject.doAs(
                                subj,
                                (PrivilegedExceptionAction<Object>) () -> msg.getFunction().call(cx, scope, scope, objArr.toArray())
                        );
                    }

                    UpdateStatusMessage uMsg = new UpdateStatusMessage(token);
                    if (msg.isTemporaryScope()) {
                        self.tell(new RemoveScopeMessage(msg.getScopePath()), ActorRef.noSender());
                    }
                    // success
                    uMsg.status = ExecutionStatus.SUCCESS;
                    
                    if(msg.isRespondNative()){
                    	uMsg.result = resultObj;
                    } else {
                    	uMsg.result = new JsObjectSerializerHelper().serializeNative(resultObj);
                    }
                    
                    if (msg.isAsync()) {
                        self.tell(uMsg, self);
                    } else {
                        if (!sender.equals(ActorRef.noSender()) && msg.isNeedResponse()) {
                            sender.tell(uMsg, self);
                        }
                    }
                } catch (Throwable e) {
                    StringBuilder sb = new StringBuilder("Execute script error: ");
                    sb.append(e.getMessage()).append("\n");
                    if (msg.getBody() != null) {
                        sb.append("--> Script executed: ");
                        sb.append(msg.getBody());
                    } else {
/*                    	
// commented out because of invalid function serialization
                        sb.append("--> Serialized function: \n");
                        try {
                            sb.append(serializeFunction(msg.getFunction()));
                        } catch (UnsupportedEncodingException e1) {
                            sb.append("(serialize error: " + e1.getMessage() + ")");
                        }
*/                        
                    }

                    if (e instanceof RhinoException) {
                        RhinoException re = (RhinoException) e;
                        sb.append("\n--> Stack trace:\n").append(re.getScriptStackTrace());
                    }
                    getLog().error(sb.toString(), e);

                    String messageStr = "";
                    Throwable ex = e.getCause();
                    if (ex != null && (ex.getCause() instanceof EcmaError)) {
                        messageStr = ex.getLocalizedMessage();
                    } else {
                        messageStr = e.getMessage();
                    }
                    UpdateStatusMessage uMsg = new UpdateStatusMessage(token);
                    uMsg.status = ExecutionStatus.FAIL;
                    uMsg.error = messageStr;
                    if(msg.isRespondNative()){
                    	uMsg.result = e;
                    }
                    if (msg.isAsync()) {
                        self.tell(uMsg, self);
                    } else {
                        if (!sender.equals(ActorRef.noSender()) && msg.isNeedResponse()) {
                            sender.tell(uMsg, self);
                        }
                    }
                } finally {
                	if(createDump){
                		dumpScript(scriptId, null, null, false);
                	}
                    Context.exit();
                }
			}
		};
        
		try {
			this.threadPool.execute(r);
		} catch(RejectedExecutionException re){
			getLog().warn(re.getLocalizedMessage());
			self.tell(msg, sender);
		} catch(Exception e){
			getLog().error(e.getLocalizedMessage(), e);
		}

    }

    private String getScriptNameByToken(String token) {
        return String.format("<cmd:%s>", token);
    }
/*
    private String getTokenByScript(String scriptName) {
        return scriptName.substring("<cmd:".length(), scriptName.length() - 1);
    }
*/
    private class JsCmdState {
        private final String token;
        private ExecutionStatus status = ExecutionStatus.INIT;
        private Object result;
        private String error;
        private long updateTime;
        private List<String> subTokens = null;

        public JsCmdState(String t) {
            this.token = t;
        }
    }

}
