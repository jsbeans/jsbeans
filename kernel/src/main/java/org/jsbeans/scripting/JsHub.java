/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.scripting;

import akka.actor.ActorRef;
import akka.actor.ActorSelection;
import akka.actor.Cancellable;
import akka.actor.Scheduler;
import akka.dispatch.MessageDispatcher;
import akka.util.Timeout;
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
import org.jsbeans.monads.MapMonad;
import org.jsbeans.scripting.JsTimeoutMessage.TimeoutType;
import org.jsbeans.security.PrincipalMessage;
import org.jsbeans.security.SecurityService;
import org.jsbeans.serialization.GsonWrapper;
import org.jsbeans.serialization.JsObjectSerializerHelper;
import org.jsbeans.services.DependsOn;
import org.jsbeans.services.Service;
import org.jsbeans.types.JsObject;
import org.jsbeans.types.JsonObject;
import org.mozilla.javascript.*;
import org.mozilla.javascript.tools.debugger.Main;
import org.mozilla.javascript.tools.debugger.ScopeProvider;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@DependsOn({SecurityService.class})
public class JsHub extends Service {
    private static final boolean openDebugger = ConfigHelper.getConfigBoolean("kernel.jshub.openDebugger");
    //	private static final String JSS_FOLDER_KEY = "kernel.jss.folder";
    private static final long completeDelta = ConfigHelper.getConfigInt("kernel.jshub.stateCompleteTimeout");
    private static final long execDelta = ConfigHelper.getConfigInt("kernel.jshub.stateExecutingTimeout");
    private static final long garbageCollectorInterval = ConfigHelper.getConfigInt("kernel.jshub.garbageCollectorInterval");
    private static final long sessionExpire = ConfigHelper.getConfigInt("kernel.jshub.sessionExpire");
    private static final int jsOptimizationLevel = -1;
    private static final int jsLanguageVersion = Context.VERSION_1_8;
    private final Map<String, JsCmdState> stateMap = new HashMap<>();
//	private static Global jsGlobal = new Global();
    private final Map<String, Cancellable> timeoutMap = new HashMap<>();
    private final Map<String, MessageDispatcher> dispatcherMap = new HashMap<>();
    private final Map<String, Map<String, Object>> execMapScript = new ConcurrentHashMap<String, Map<String, Object>>();
    private Main debugger;
    private ContextFactory contextFactory;
    private Context context;
    private ScriptableObject sharedScope;
    private int execCount = 0;

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
/*	
    private Object mutex = new Object();
	private int jsCallCount = 0; 
*/

    @Override
    protected void onInit() throws PlatformException {
//		try {
        this.contextFactory = new ContextFactory();
        this.context = contextFactory.enterContext();
        this.context.setOptimizationLevel(jsOptimizationLevel);
        this.context.setLanguageVersion(jsLanguageVersion);
        this.sharedScope = this.context.initStandardObjects(null, true);

        Object wrappedBridge = Context.javaToJS(JsBridge.getInstance(), sharedScope);
        ScriptableObject.putProperty(sharedScope, "Bridge", wrappedBridge);
        JsObjectSerializerHelper.getInstance().initScopeTree(sharedScope);
//			this.loadJSS();

        if (openDebugger) {
            this.openDebugger(new DebuggerMessage());
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

//		} catch (IOException e) {
//			throw new PlatformException(e);
//		}

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

    private MessageDispatcher getDispatcher() {
        return this.getDispatcher("kernel.jshub.dispatcher");
    }

    private MessageDispatcher getDispatcher(String dName) {
        return Core.getActorSystem().dispatchers().lookup(dName);
/*
		if(dispatcherMap.containsKey(dName)){
			return dispatcherMap.get(dName);
		}

		MessageDispatcher disp = Core.getActorSystem().dispatchers().lookup(dName);
		dispatcherMap.put(dName, disp);

		return disp; */

    }

    private void handleRemoveScope(RemoveScopeMessage msg) {
        JsObjectSerializerHelper.getInstance().getScopeTree().remove(msg.getScopePath());
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
                this.getLog().warning("Invalid timeout key specified '{}'", msg.getKey());
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

        String dispatcher = msg.getDispatcher();
        if (dispatcher == null) {
            dispatcher = "kernel.jshub.dispatcher";
        }
        MessageDispatcher md = this.getDispatcher(dispatcher);
        this.createChain(md, JsAskMessage.class, Object.class, msg)
                .add(new FutureMonad<JsAskMessage, Object>(JsObjectSerializerHelper.getInstance().getScopeTree().getRoot().scope(), md) {
                    @Override
                    public Future<Object> run(JsAskMessage msg) throws ChannelException {
//					Scriptable sharedScope = this.getArgument(0);
                        MessageDispatcher md = this.getArgument(1);
                        // obtain target actor
                        ActorSelection targetActor = ActorHelper.getActorSelection(msg.getTargetServiceName());
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
                            }, md);
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
                        execMsg.setUser(msg.getUser());
                        execMsg.setUserToken(msg.getUserToken());
                        execMsg.setClientRequestId(msg.getClientRequestId());
                        execMsg.setClientAddr(msg.getClientAddr());
                        getSelf().tell(execMsg, getSelf());
                    }
                }
            }
        });
    }

    private void updateStates() {
        this.updateTokens();
        this.updateSessions();
    }

/*	
	private void handleUpdateScope(UpdateScopeMessage msg) throws PlatformException {
		Context ctx = Context.enter();
		ctx.setOptimizationLevel(jsOptimizationLevel);
		ctx.setLanguageVersion(jsLanguageVersion);
		try {
			Scriptable curScope = JsObjectSerializerHelper.getInstance().getScopeTree().getRoot().scope();
			if(msg.getPath() != null || msg.getPath().trim().length() > 0){
				// create scope chain
				String[] scopes = msg.getPath().split("\\.|\\/");
				for(String scopeName : scopes){
					if(scopeName.length() > 0){
						ScriptableObject newScope;
						if(!curScope.has(scopeName, curScope)){
							// create scope
							newScope = (ScriptableObject) ctx.newObject(curScope);
							curScope.put(scopeName, curScope, newScope);
						} else {
							newScope = (ScriptableObject) curScope.get(scopeName, curScope);
						}
						curScope = newScope;
					}
				}
			}
			ctx.putThreadLocal("token", UUID.randomUUID().toString());
//			cx.putThreadLocal("session", msg.getScopePath());

			Object resObj = ctx.evaluateString(curScope, msg.getData(), msg.getFileName(), 1, null);
			JsObject jObj = new JsObjectSerializerHelper().serializeNative(resObj);
			this.getSender().tell(new ScopeResponseMessage(msg.getPath(), jObj), this.getSelf());
		} catch(Exception e){
			this.getSender().tell(new ScopeResponseMessage(msg.getPath(), e.getMessage()), this.getSelf());
			throw new PlatformException(e);
		} 
		finally {
			Context.exit();
		}
	}
*/

//	private void loadJSS() throws IOException, PlatformException {
//		String folder = ConfigHelper.getConfigString(JSS_FOLDER_KEY);
//		if(folder == null){
//			folder = "jss"; 
//		}
//
//		List<String> paths = FileHelper.searchFiles(ConfigHelper.getRootFolder() + folder, "**/*.jss");
//		for(String jss : paths){
//			String jssFile = FileHelper.readStringFromFile(jss);
//			this.context.evaluateString(this.scopeTree.getRoot().scope(), jssFile, jss, 1, null);
//		}
//		
//	}

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
            JsObjectSerializerHelper.getInstance().getScopeTree().getRoot().updateEldest(sessionExpire);
        } catch (Exception e) {
            getLog().error(e, "JsHub failed to collect garbage sessions with message: " + e.getMessage());
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
        Scriptable execScope = null;

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
        execScope = JsObjectSerializerHelper.getInstance().getScopeTree().touch(msg.getScopePath());

        String dispatcher = msg.getDispatcher();
        if (dispatcher == null) {
            dispatcher = "kernel.jshub.dispatcher";
        }

        // execute script
        this.createChain(this.getDispatcher(dispatcher), Object.class, JsObject.class, msg)
                .add(new MapMonad<Object, JsObject>(token, msg, execScope, this.getSelf()) {
                    @Override
                    public JsObject run(Object pp) throws PlatformException {
                        String token = this.getArgument(0);
                        ExecuteScriptMessage msg = this.getArgument(1);

                        Scriptable scope = this.getArgument(2);
                        ActorRef self = this.getArgument(3);
                        JsObject jsResult = null;

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
                        String scriptBody = null;
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
                            cx.putThreadLocal("_jsbCallingContext", null);
                            Object resultObj = null;
                            if (msg.getBody() != null) {
/*
							synchronized(mutex){
								getLog().debug("Js call count before: " + jsCallCount);
								jsCallCount++;
							}
*/
                                dumpScript(scriptId, msg.getBody(), null, true);

                                resultObj = cx.evaluateString(scope, msg.getBody(), getScriptNameByToken(token), 1, null);

                                dumpScript(scriptId, null, null, false);
/*
							synchronized(mutex){
								jsCallCount--;
								getLog().debug("Js call count after: " + jsCallCount);
							}
*/
                            } else if (msg.getFunction() != null) {
                                List<Object> objArr = new ArrayList<Object>();
                                JsObjectSerializerHelper jser = new JsObjectSerializerHelper();
                                for (Object obj : msg.getArgs()) {
                                    objArr.add(jser.jsonElementToNativeObject(GsonWrapper.toGsonJsonElement(obj), cx, scope));
                                }
                                dumpScript(scriptId, null, msg.getFunction(), true);
                                resultObj = msg.getFunction().call(cx, scope, scope, objArr.toArray());
                                dumpScript(scriptId, null, null, false);
                            }
                            jsResult = new JsObjectSerializerHelper().serializeNative(resultObj);

                        } catch (Throwable e) {
                            dumpScript(scriptId, null, null, false);
/*
                    	synchronized(mutex){
							jsCallCount--;
							getLog().debug("Js call count after exception: " + jsCallCount);
						}
*/
                            StringBuilder sb = new StringBuilder("Execute script error: ");
                            sb.append(e.getMessage()).append("\n");
                            sb.append("--> Script executed: ");
                            if (msg.getBody() != null) {
                                sb.append(msg.getBody());
                            } else {
                                sb.append("Serialized function: \n");
                                try {
                                    sb.append(serializeFunction(msg.getFunction()));
                                } catch (UnsupportedEncodingException e1) {
                                    sb.append("(serialize error: " + e1.getMessage() + ")");
                                }
                            }

                            if (e instanceof RhinoException) {
                                RhinoException re = (RhinoException) e;
                                sb.append("\n--> Stack trace:\n").append(re.getScriptStackTrace());
                            }
                            getLog().error(e, sb.toString());

                            throw new PlatformException(e);
                        } finally {
                            Context.exit();
                        }
                        return jsResult;
                    }
                }).add(new CompleteMonad<JsObject>(token, msg, this.getSender(), this.getSelf()) {

            @Override
            public void onComplete(Chain<?, JsObject> chain, JsObject result, Throwable fail) throws PlatformException {
                String token = this.getArgument(0);
                ExecuteScriptMessage msg = this.getArgument(1);
                ActorRef sender = this.getArgument(2);
                ActorRef self = this.getArgument(3);
                UpdateStatusMessage uMsg = new UpdateStatusMessage(token);
                if (msg.isTemporaryScope()) {
                    self.tell(new RemoveScopeMessage(msg.getScopePath()), self);
                }
                if (fail != null) {
                    // fail
                    String messageStr = "";
                    Throwable ex = fail.getCause();
                    if (ex.getCause() instanceof EcmaError) {
                        messageStr = ex.getLocalizedMessage();
                    } else {
                        messageStr = fail.getMessage();
                    }
                    uMsg.status = ExecutionStatus.FAIL;
                    uMsg.error = messageStr;
                } else {
                    // success
                    uMsg.status = ExecutionStatus.SUCCESS;
                    uMsg.result = result;
                }
                if (msg.isAsync()) {
                    self.tell(uMsg, self);
                } else {
                    if (!sender.equals(ActorRef.noSender())) {
                        sender.tell(uMsg, self);
                    }
                }
            }
        });
    }

    private String getScriptNameByToken(String token) {
        return String.format("<cmd:%s>", token);
    }

    private String getTokenByScript(String scriptName) {
        return scriptName.substring("<cmd:".length(), scriptName.length() - 1);
    }

    private class JsCmdState {
        private final String token;
        private ExecutionStatus status = ExecutionStatus.INIT;
        private JsObject result;
        private String error;
        private long updateTime;
        private List<String> subTokens = null;

        public JsCmdState(String t) {
            this.token = t;
        }
    }

}
