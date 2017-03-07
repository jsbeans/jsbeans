/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.scripting.jso;

import akka.actor.ActorRef;
import akka.util.Timeout;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.jsbeans.Core;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.helpers.FileHelper;
import org.jsbeans.helpers.ReflectionHelper;
import org.jsbeans.messages.Message;
import org.jsbeans.monads.Chain;
import org.jsbeans.monads.CompleteMonad;
import org.jsbeans.monads.FutureMonad;
import org.jsbeans.scripting.ExecuteScriptMessage;
import org.jsbeans.scripting.ExecutionStatus;
import org.jsbeans.scripting.JsHub;
import org.jsbeans.scripting.UpdateStatusMessage;
import org.jsbeans.services.DependsOn;
import org.jsbeans.services.Service;
import org.jsbeans.types.JsObject;
import org.jsbeans.types.JsObject.JsObjectType;
import scala.concurrent.Await;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

@DependsOn(JsHub.class)
public class JsoRegistryService extends Service {
    private static final long garbageCollectorInterval = ConfigHelper.getConfigInt("kernel.jshub.garbageCollectorInterval");
    private static final long sessionExpire = ConfigHelper.getConfigInt("kernel.jshub.sessionExpireTimeout");

    private Set<String> objectsToLoad = new HashSet<String>();
//    private Map<String, SessionEntry> sessionMap = Collections.synchronizedMap(new LinkedHashMap<String, SessionEntry>(16, 0.75F, true));
    private Map<String, SessionEntry> sessionMap = new LinkedHashMap<String, SessionEntry>(16, 0.75F, true);
    private boolean coreLoaded = false;

    @Override
    protected void onInit() throws PlatformException {
//        this.self().tell(JsoRegistryMessage.LOAD_JSO, this.getSelf());
        this.loadJSO();

        // load server-side JSS from resources
        String resourcePath = ConfigHelper.getConfigString("kernel.jsb.lookupResourcesPath");
        this.loadObjects(resourcePath, true);

        // Run garbage collection timer to avoid old sessions 
        Core.getActorSystem().scheduler().schedule(
                Duration.Zero(),
                Duration.create(garbageCollectorInterval, TimeUnit.MILLISECONDS),
                getSelf(),
                Message.TICK,
                Core.getActorSystem().dispatcher(),
                getSelf());
    }

    @Override
    protected void onMessage(Object msg) throws PlatformException {
        if (msg instanceof LookupJsoMessage) {
            this.handleLookupJso((LookupJsoMessage) msg);
        } else /* if(msg instanceof JsoLoadCompleteMessage){
            this.handleJSOLoaded((JsoLoadCompleteMessage)msg);
		} else */ if (msg instanceof RpcMessage) {
            this.handleRpc((RpcMessage) msg);
        } /*else if (msg instanceof UpdateRpcMessage) {
            this.handleUpdateRpc((UpdateRpcMessage) msg);
        } */else if (msg instanceof LoadAdditionalObjectsMessage) {
            this.handleLoadAdditionalObjects((LoadAdditionalObjectsMessage) msg);
        } else if (msg instanceof String && msg.equals(Message.TICK)) {
            this.updateSessionMap();
        } else {
            unhandled(msg);
        }
    }

    private void handleLoadAdditionalObjects(LoadAdditionalObjectsMessage msg) {
        // load client-server JSOs
        for (String path : ConfigHelper.getJssFolders()) {
            this.loadObjects(path, false);
        }
        this.completeInitialization();
    }
/*
	private void handleJSOLoaded(JsoLoadCompleteMessage msg) {
		if(objectsToLoad.contains(msg.getPath())){
			objectsToLoad.remove(msg.getPath());
		}
		if(objectsToLoad.size() == 0){
			if(!this.coreLoaded){
				this.coreLoaded = true;
				// load additional
				this.self().tell(JsoRegistryMessage.LOAD_ADDITIONAL_OBJECTS, this.getSelf());
				return;
			}
			
		}
	}
*/

    private void loadObjects(final String folder, boolean isServer) throws PlatformException {
        //String folder = ConfigHelper.getPluginHomeFolder(this);
        Collection<String> jsoPaths = null;
        if (!isServer) {
            jsoPaths = FileHelper.searchFiles(folder, "**/*.jso|**/*.jss|**/*.jsb");
        } else {
            jsoPaths = new ArrayList<>();
            String prefix = folder.startsWith("/") ? folder : folder.substring(1);
            ReflectionHelper.getPlatformReflections().getResources(Pattern.compile(".*(\\.jsb|\\.jso|\\.jss)"))
                    .stream().map("/"::concat).filter(n -> n.startsWith(prefix)).forEach(jsoPaths::add);
        }
        for (String jsoPath : jsoPaths) {
            String jsoFile = jsoPath;
            try {
                if (!isServer) {
                    jsoFile = FileHelper.normalizePath(jsoPath);
                }
                String jsoBody = isServer ? FileHelper.readStringFromResource(jsoFile) : FileHelper.readStringFromFile(jsoFile);
                if (jsoBody == null || jsoBody.length() == 0) {
                    throw new PlatformException(String.format("Problem occured due to loading JSO descriptor: '%s'", jsoFile));
                }
                // obtain relative folder
                String relPath = "";
                for (String fld : ConfigHelper.getWebFolders()) {
                    try {
                        Path webPath = jsoFile.endsWith(".jso") ? new File(fld).toPath().normalize() : (new File(folder)).toPath().normalize();
                        relPath = isServer ? "/server" : FileHelper.getFolderByPath(webPath.relativize(Paths.get(jsoFile)).toString()).replaceAll("\\\\", "/");
                        if (!relPath.startsWith("..")) break;
                    } catch (Exception ex) {
                    }
                }

                String codeToExecute = String.format("JSB().wrapJSO('%s','%s',function(){ JSB(%s); })", jsoFile, relPath, JsoTemplateEngine.perform(jsoBody, jsoFile));
                ExecuteScriptMessage scriptMsg = new ExecuteScriptMessage(codeToExecute, false);
                if (ConfigHelper.getConfigBoolean("kernel.security.enabled")) {
                    scriptMsg.setUser(ConfigHelper.getConfigString("kernel.security.admin.user"));
                }
                scriptMsg.setToken(jsoFile);
                Future<Object> f = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), scriptMsg, ActorHelper.getServiceCommTimeout());
                Object result = Await.result(f, ActorHelper.getServiceCommTimeout().duration());
                if (result instanceof UpdateStatusMessage) {
                    UpdateStatusMessage msg = (UpdateStatusMessage) result;
                    if (msg.error != null && msg.error.trim().length() > 0) {
                        getLog().error(String.format("Failed to perform JSB descriptor '%s' due to following reson: %s", jsoFile, msg.error));
                    } else {
                        // jso loaded successfully
                    }
                } else {
                    throw new PlatformException(String.format("Internal Error: Expected 'ScopeResponseMessage' but found message of type '%s' while loading JSO '%s'", result.getClass().getName(), jsoFile));
                }
            } catch (Exception e) {
                getLog().error(String.format("Failed to perform JSB descriptor '%s' due to following reson: %s", jsoFile, e.toString()));
            }
        }
    }


    private void loadJSO() throws PlatformException {
        try {
            String jsoPath = ConfigHelper.getConfigString("kernel.jsb.jsbEngineResource");
            String jsoData = FileHelper.readStringFromResource(jsoPath);
            ExecuteScriptMessage execMsg = new ExecuteScriptMessage(jsoData, false);
            if (ConfigHelper.getConfigBoolean("kernel.security.enabled")) {
                execMsg.setUser(ConfigHelper.getConfigString("kernel.security.admin.user"));
            }
            execMsg.setToken(jsoPath);
            Future<Object> f = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), execMsg, ActorHelper.getServiceCommTimeout());
            Object result = Await.result(f, ActorHelper.getServiceCommTimeout().duration());
            if (result instanceof UpdateStatusMessage) {
                UpdateStatusMessage msg = (UpdateStatusMessage) result;
                if (msg.error != null && msg.error.trim().length() > 0) {
                    getLog().error(String.format("Failed to load JSO due to following reason: %s", msg.error));
                } else {
                    // ok
                }
            } else {
                throw new PlatformException(String.format("Internal Error: Expected 'UpdateStatusMessage' but found message of type '%s' while loading JSO", result.getClass().getName()));
            }
        } catch (Exception e) {
            throw new PlatformException(e);
        }
    }


    private void handleLookupJso(LookupJsoMessage msg) throws PlatformException {
        final String jsoName = msg.getName();
        this.createChain(String.class, UpdateStatusMessage.class, jsoName)
                .add(new FutureMonad<String, Object>(msg) {
                    @Override
                    public Future<Object> run(String name) throws PlatformException {
                        // try to lookup locally via JsHub
                        LookupJsoMessage msg = this.getArgument(0);
                        ExecuteScriptMessage execMsg = new ExecuteScriptMessage(String.format("Kernel.getClientJSB('%s');", name), false);
                        execMsg.setScopePath(msg.getSession());
                        execMsg.setUser(msg.getUser());
                        execMsg.setUserToken(msg.getUserToken());
                        execMsg.setClientRequestId(msg.getClientRequestId());
                        execMsg.setClientAddr(msg.getClientAddr());

                        return ActorHelper.futureAsk(
                                ActorHelper.getActorSelection(JsHub.class),
                                execMsg,
                                ActorHelper.getServiceCommTimeout());
                    }
                })
                .add(new CompleteMonad<UpdateStatusMessage>(this.getSender()) {

                    @Override
                    public void onComplete(Chain<?, UpdateStatusMessage> chain, UpdateStatusMessage result, Throwable fail) throws PlatformException {
                        ActorRef sender = this.getArgument(0);
                        if (fail != null) {
                            getLog().error(String.format("JSB lookup failed with the following error '%s'", fail.getMessage()), fail);
                            sender.tell(new LookupJsoMessage(fail), getSelf());
                            return;
                        }
                        if (result.status == ExecutionStatus.SUCCESS) {
                            sender.tell(new LookupJsoMessage(result.result), getSelf());
                        } else {
                            getLog().error(String.format("JSB lookup completes with unsuccessfull code: '%s'", result.error), fail);
                            sender.tell(new LookupJsoMessage(new PlatformException(result.error)), getSelf());
                        }

                    }
                });
    }

/*    
    private void handleUpdateRpc(UpdateRpcMessage msg) {
        String sessionId = msg.getSessionId();
        String entryId = msg.getEntryId();
        if (!this.sessionMap.containsKey(sessionId)) {
            getLog().error(String.format("Unable to locate rpc map for session: '%s'", sessionId));
            return;
        }
        SessionEntry se = this.sessionMap.get(sessionId);
        se.update();
        if (!se.containsRpc(entryId)) {
            getLog().error(String.format("Unable to locate rpc entry: '%s' for session: '%s'", entryId, sessionId));
            return;
        }
        RpcEntry entry = se.getRpc(entryId);
        if (msg.getStatus().status == ExecutionStatus.SUCCESS) {
            entry.setResult(msg.getStatus().result);
        } else {
            entry.setError(msg.getStatus().error);
        }
        
        if(msg.needInvokeClient()){
        	try {
	        	// check whether widget and proc field are filled
	            JsObject rpcEntryResp = new JsObject(JsObjectType.JSONOBJECT);
	            rpcEntryResp.addToObject("id", entryId);
	            rpcEntryResp.addToObject("error", msg.getStatus().error);
	            rpcEntryResp.addToObject("result", msg.getStatus().result);
	            rpcEntryResp.addToObject("success", msg.getStatus().status == ExecutionStatus.SUCCESS);
	            rpcEntryResp.addToObject("completed", true);
	        	
		        String script = String.format("JSB().getProvider().rpc('handleRpcResponse', [[%s]], null, '%s');", rpcEntryResp.toJS(), sessionId);
		        ExecuteScriptMessage execMsg = new ExecuteScriptMessage(script, false);
		        execMsg.setScopePath(sessionId);
		        ActorHelper.getActorSelection(JsHub.class).tell(execMsg, ActorRef.noSender());
        	} catch(UnsupportedEncodingException e){
        		throw new PlatformException(e);
        	}
        	if(entry.isCompleted()){
        		se.removeRpc(entryId);
            }
        }
    }
*/
    
    private void handleRpc(RpcMessage msg) {
        try {
            JsObject rpcResult = new JsObject(JsObjectType.JSONARRAY);
            String sessionId = msg.getSessionId();
            String clientAddr = msg.getClientAddr();
            String user = msg.getUser();
            String userToken = msg.getUserToken();
            String clientRequestId = msg.getClientRequestId();
/*            
            SessionEntry sEntry = null;
            if (!this.sessionMap.containsKey(sessionId)) {
                sEntry = new SessionEntry();
                this.sessionMap.put(sessionId, sEntry);
            } else {
                sEntry = this.sessionMap.get(sessionId);
                sEntry.update();
            }
*/
            String data = msg.getRpcData();
            JsonElement jsonElt = null;
            try {
                jsonElt = new JsonParser().parse(data);
            } catch (Exception e) {
                getLog().error(e, "Error parsing JSON data: " + data);
                getLog().info("Request headers: " + msg.getClientRequestId());
                throw new PlatformException(e);
            }
            if (!jsonElt.isJsonArray()) {
                // json array expected
                throw new PlatformException("Json array expected due to handling bulk RPC");
            }
            JsonArray arr = jsonElt.getAsJsonArray();
            for (int i = 0; i < arr.size(); i++) {
                JsonElement elt = arr.get(i);
                if (!elt.isJsonObject()) {
                    // кидать exception тут будет неправильно, т.к. остальные элементы в батче останутся необработанными
                    // поэтому выведем в ошибку в лог и продолжим обработку
                    getLog().error("Wrong JSON object in rpc batch");
                    continue;
                }
                JsonObject obj = elt.getAsJsonObject();
                String id = obj.get("id").getAsString();
                
                // check whether widget and proc field are filled
                JsObject rpcEntryResp = new JsObject(JsObjectType.JSONOBJECT);
                rpcEntryResp.addToObject("id", id);

                if (!obj.has("jsb") || !obj.has("proc")) {
                    rpcEntryResp.addToObject("completed", true);
                    rpcEntryResp.addToObject("error", String.format("Rpc entry with id: '%s' is missing or malformed", id));
                    rpcEntryResp.addToObject("result", "");
                    rpcEntryResp.addToObject("success", false);
                    rpcResult.addToArray(rpcEntryResp);
                    continue;
                }

                if (obj.has("sync") && obj.get("sync").getAsBoolean()) {
                    // call script on synchronized manner
                    JsonElement paramElt = obj.get("params");
                    String script = String.format(
                            "JSB().getProvider().performRpc('%s','%s','%s',%s);",
                            obj.get("jsb").getAsString(),
                            obj.get("instance").getAsString(),
                            obj.get("proc").getAsString(),
                            paramElt != null ? paramElt.toString() : "null");
                    ExecuteScriptMessage execMsg = new ExecuteScriptMessage(script, false);
                    execMsg.setScopePath(sessionId);
                    execMsg.setClientAddr(clientAddr);
                    execMsg.setUser(user);
                    execMsg.setUserToken(userToken);
                    execMsg.setClientRequestId(clientRequestId);
                    Timeout timeout = ActorHelper.getServiceCommTimeout();
                    Future<Object> f = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), execMsg, timeout);
                    try {
                        UpdateStatusMessage result = (UpdateStatusMessage) Await.result(f, timeout.duration());
                        rpcEntryResp.addToObject("error", result.error);
                        rpcEntryResp.addToObject("result", result.result);
                        rpcEntryResp.addToObject("success", result.status == ExecutionStatus.SUCCESS);
                    } catch (Throwable fail) {
                        rpcEntryResp.addToObject("error", fail.getMessage());
                        rpcEntryResp.addToObject("success", false);
                        rpcEntryResp.addToObject("result", (JsObject) null);
                        getLog().error(fail, "JsoRegistryService handleRpc failed with message: " + fail.getMessage());

                    }
                    rpcEntryResp.addToObject("completed", true);
                    rpcResult.addToArray(rpcEntryResp);
                    continue;
                }

                rpcEntryResp.addToObject("completed", false);
                rpcEntryResp.addToObject("error", "");
                rpcEntryResp.addToObject("result", "");
                rpcEntryResp.addToObject("success", true);
                rpcResult.addToArray(rpcEntryResp);

                // add entry to map and run rpc monad
//                    sEntry.newRpc(id);

                this.createChain(JsonObject.class, UpdateStatusMessage.class, obj)
                    .add(new FutureMonad<JsonObject, Object>(sessionId, clientAddr, user, clientRequestId, userToken, id) {
                        @Override
                        public Future<Object> run(JsonObject obj) throws PlatformException {
                            String sessionId = this.getArgument(0);
                            String clientAddr = this.getArgument(1);
                            String user = this.getArgument(2);
                            String rid = this.getArgument(3);
                            String userToken = this.getArgument(4);
                            String rpcId = this.getArgument(5);
                            String jsoName = obj.get("jsb").getAsString();
                            String procName = obj.get("proc").getAsString();
                            String instanceId = obj.get("instance").getAsString();
                            JsonElement paramElt = obj.get("params");

                            String script = String.format("JSB().getProvider().performRpc('%s','%s','%s',%s,'%s');", jsoName, instanceId, procName, paramElt != null ? paramElt.toString() : "null", rpcId);
                            ExecuteScriptMessage execMsg = new ExecuteScriptMessage(script, false);
                            execMsg.setScopePath(sessionId);
                            execMsg.setClientAddr(clientAddr);
                            execMsg.setUser(user);
                            execMsg.setUserToken(userToken);
                            execMsg.setClientRequestId(rid);
                            return ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), execMsg, ActorHelper.getServiceCommTimeout());
                        }
                    }).add(new CompleteMonad<UpdateStatusMessage>(sessionId, id) {
	                    @Override
	                    public void onComplete(Chain<?, UpdateStatusMessage> chain, UpdateStatusMessage result, Throwable fail) throws PlatformException {
	                        String sessionId = this.getArgument(0);
	                        String id = this.getArgument(1);
	                        if (fail != null) {
	/*                            	
	                                // fail
	                                UpdateStatusMessage statusMsg = new UpdateStatusMessage(null);
	                                statusMsg.error = fail.getMessage();
	                                statusMsg.status = ExecutionStatus.FAIL;
	                                getSelf().tell(new UpdateRpcMessage(sessionId, id, statusMsg, true), getSelf());
	*/                                
	                            getLog().error(fail, "JsoRegistryService handleRpc failed with message: " + fail.getMessage());
	                        } else {
	                            // success
	  /*                              getSelf().tell(new UpdateRpcMessage(sessionId, id, result, true), getSelf());*/
	                        }
	                    }
                    });
            }

            this.getSender().tell(new RpcMessage(rpcResult), this.getSelf());
        } catch (PlatformException e) {
            getLog().error(e.getMessage());
            this.getSender().tell(new RpcMessage(e), this.getSelf());
        }
    }

    private void updateSessionMap() {
        long curTime = System.currentTimeMillis();
        List<String> sessionsToRemove = null;
        Iterator<Entry<String, SessionEntry>> itr = this.sessionMap.entrySet().iterator();
        while (itr.hasNext()) {
            Entry<String, SessionEntry> entry = itr.next();
            SessionEntry se = entry.getValue();

            if (curTime - se.getLastUpdated() > sessionExpire) {
                if (sessionsToRemove == null) {
                    sessionsToRemove = new ArrayList<String>();
                }
                sessionsToRemove.add(entry.getKey());
            } else {
            	se.updateRpcEntries();
            }
        }
        if (sessionsToRemove != null) {
            for (String s : sessionsToRemove) {
                this.sessionMap.remove(s);
            }
        }
    }


}
