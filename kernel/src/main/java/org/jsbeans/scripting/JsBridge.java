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
import akka.util.Timeout;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.*;
import org.jsbeans.serialization.GsonWrapper;
import org.jsbeans.serialization.JsObjectSerializerHelper;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.IdScriptableObject;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptableObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import scala.concurrent.Await;
import scala.concurrent.Future;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

public class JsBridge {
    private static JsBridge instance = new JsBridge();
    private ConcurrentHashMap<String, ReentrantLock> lockMap = new ConcurrentHashMap<>();

/*	
	private Object mutex = new Object();
	private int askCounter = 0;
*/

    public static JsBridge getInstance() {
        return instance;
    }

    public void lock(String str) {
        if (!lockMap.containsKey(str)) {
            synchronized (lockMap) {
                if (!lockMap.containsKey(str)) {
                    ReentrantLock l = new ReentrantLock();
                    lockMap.put(str, l);
                }
            }
        }
        lockMap.get(str).lock();
    }

    public void unlock(String str) {
        if (!lockMap.containsKey(str)) {
            return;
        }
        ReentrantLock l = (ReentrantLock) lockMap.get(str);
        if (l != null) {
            if (l.isLocked()) {
                l.unlock();
            }
        }
    }

    public void clearLock(String str) {
        if (!lockMap.containsKey(str)) {
            return;
        }
        synchronized (lockMap) {
            lockMap.remove(str);
        }
    }
    
    public synchronized void putThreadLocal(String key, ScriptableObject val){
    	Context.getCurrentContext().putThreadLocal(key, val);
    }
    
    public ScriptableObject getThreadLocal(String key){
    	return (ScriptableObject)Context.getCurrentContext().getThreadLocal(key);
    }
    
    public void removeThreadLocal(String key){
    	Context.getCurrentContext().removeThreadLocal(key);
    }

    public void sleep(final long msec) throws Exception {
        Thread.sleep(msec);
/*		
		Future<Object> future = akka.dispatch.Futures.future(new Callable<Object>(){
			@Override
			public Object call() throws Exception {
				Thread.sleep(msec);
				return null;
			}}, Core.getActorSystem().dispatcher());
		Await.result(future, Duration.Inf());
*/
    }

    public String setTimeout(ScriptableObject callback, long duration) {
        return this.setTimeoutOrInterval(true, callback, duration);
    }

    public String setInterval(ScriptableObject callback, long duration) {
        return this.setTimeoutOrInterval(false, callback, duration);
    }

    public String getCurrentUser() {
        Object userObj = Context.getCurrentContext().getThreadLocal("user");
        if (userObj != null) {
            return userObj.toString();
        }
        return null;
    }

    public String getCurrentSession() {
        Object sessionObj = Context.getCurrentContext().getThreadLocal("session");
        if (sessionObj != null) {
            return sessionObj.toString();
        }
        return null;
    }

    public String getClientAddress() {
        Object addrObj = Context.getCurrentContext().getThreadLocal("clientAddr");
        if (addrObj != null) {
            return addrObj.toString();
        }
        return null;
    }

    public String getUserToken() {
        Object addrObj = Context.getCurrentContext().getThreadLocal("userToken");
        if (addrObj != null) {
            return addrObj.toString();
        }
        return null;
    }

    public String getClientRequestId() {
        Object addrObj = Context.getCurrentContext().getThreadLocal("clientRequestId");
        if (addrObj != null) {
            return addrObj.toString();
        }
        return null;
    }


    private String setTimeoutOrInterval(boolean isTimeout, ScriptableObject callback, long duration) {
        ActorSelection jsHubSvc = ActorHelper.getActorSelection(JsHub.class);
        String token = Context.getCurrentContext().getThreadLocal("token").toString();
        String sessionId = Context.getCurrentContext().getThreadLocal("session").toString();
        Object user = Context.getCurrentContext().getThreadLocal("user");
        Object userToken = Context.getCurrentContext().getThreadLocal("userToken");
        Object clientAddr = Context.getCurrentContext().getThreadLocal("clientAddr");
        Object clientRequestId = Context.getCurrentContext().getThreadLocal("clientRequestId");
        JsTimeoutMessage msg = null;
        if (isTimeout) {
            msg = JsTimeoutMessage.createSetTimeout(token, sessionId, callback, duration);
        } else {
            msg = JsTimeoutMessage.createSetInterval(token, sessionId, callback, duration);
        }
        if (user != null) {
            msg.setUser(user.toString());
        }
        if (userToken != null) {
            msg.setUserToken(userToken.toString());
        }
        if (clientAddr != null) {
            msg.setClientAddr(clientAddr.toString());
        }

        if (clientRequestId != null) {
            msg.setClientRequestId(clientRequestId.toString());
        }
        Timeout timeout = ActorHelper.getServiceCommTimeout();
        Future<Object> f = ActorHelper.futureAsk(jsHubSvc, msg, timeout);
        Object result = null;
        try {
            result = Await.result(f, timeout.duration());
            if (!(result instanceof JsTimeoutMessage)) {
                throw new PlatformException(String.format("Invalid response. Expected message of type '%s' but received '%s'", JsTimeoutMessage.class.getName(), result.getClass().getName()));
            }
            JsTimeoutMessage resp = (JsTimeoutMessage) result;
            return resp.getKey();
        } catch (Exception e) {
            final Logger la = LoggerFactory.getLogger(JsBridge.class.getName() + ".JS:" + sessionId);
            la.error(e.getMessage(), e);
            return null;
        }
    }

    public void clearTimeout(String key) {
        this.clearTimeoutOrInterval(true, key);
    }

    public void clearInterval(String key) {
        this.clearTimeoutOrInterval(false, key);
    }

    private void clearTimeoutOrInterval(boolean isTimeout, String key) {
        ActorSelection jsHubSvc = ActorHelper.getActorSelection(JsHub.class);
        JsTimeoutMessage msg = null;
        if (isTimeout) {
            msg = JsTimeoutMessage.createClearTimeout(key);
        } else {
            msg = JsTimeoutMessage.createClearInterval(key);
        }
        jsHubSvc.tell(msg, ActorRef.noSender());
    }

    public void log(String type, Object msgObj) {
        Object session = Context.getCurrentContext().getThreadLocal("session");
        String sessionStr = (session != null && session.toString().length() > 0) ? session.toString() : "(root)";
        final Logger la = LoggerFactory.getLogger(JsBridge.class.getName() + ".JS:" + sessionStr);
        StringBuilder sb = new StringBuilder();
        if (msgObj instanceof Throwable) {
            sb.append(msgObj.toString());
            sb.append("\n");
            sb.append(ExceptionHelper.getStackTrace((Throwable) msgObj));
        } else if (type.equals("error") && msgObj instanceof IdScriptableObject) {
            ScriptableObject ido = (ScriptableObject) msgObj;
            sb.append(ido.get("name")).append(": ").append(ido.get("message"));
            sb.append("\r\n\t at ").append(ido.get("fileName")).append(":").append(ido.get("lineNumber"));
//			sb.append("\r\n\t script ==> ").append(ido.get("script"));
        } else {
            sb.append(msgObj.toString());
        }
        if ("error".equals(type)) {
            la.error(sb.toString());
        } else if ("debug".equals(type)) {
            la.debug(sb.toString());
        } else if ("warning".equals(type)) {
            la.warn(sb.toString());
        } else {
            la.info(sb.toString());
        }
    }

    public void tell(NativeObject tellObject) {
        Context ctx = Context.enter();
        Object tObj = ctx.getThreadLocal("token");
        Object sObj = ctx.getThreadLocal("session");
        Object user = ctx.getThreadLocal("user");
        Object userToken = ctx.getThreadLocal("userToken");
        Object clientAddr = ctx.getThreadLocal("clientAddr");
        Object clientRequestId = ctx.getThreadLocal("clientRequestId");
        String token = tObj == null ? "" : tObj.toString();
        String sessionId = sObj == null ? "" : sObj.toString();
        Context.exit();

        String svcName = tellObject.get("serviceName").toString();
        String msgType = tellObject.get("messageType").toString();

        NativeObject msgBody = (NativeObject) tellObject.get("messageBody");
        ActorSelection jsHubSvc = ActorHelper.getActorSelection(JsHub.class);
        JsAskMessage msg = null;
        if (msgBody != null) {
            msg = new JsAskMessage(token, sessionId, svcName, msgType, msgBody);
        } else {
            msg = new JsAskMessage(token, sessionId, svcName, msgType);
        }
        if (user != null) {
            msg.setUser(user.toString());
        }
        if (userToken != null) {
            msg.setUserToken(userToken.toString());
        }
        if (clientAddr != null) {
            msg.setClientAddr(clientAddr.toString());
        }
        if (clientRequestId != null) {
            msg.setClientRequestId(clientRequestId.toString());
        }
        msg.setTell(true);
        jsHubSvc.tell(msg, ActorRef.noSender());
    }

    public Object ask(NativeObject askObject) {
/*		
		synchronized(mutex){
			askCounter++;
			final Logger la = LoggerFactory.getLogger(JsBridge.class.getName());
			la.debug("Ask count: " + askCounter);
		}
*/
        ActorSelection jsHubSvc = ActorHelper.getActorSelection(JsHub.class);
        Context ctx = Context.enter();
        Object tObj = ctx.getThreadLocal("token");
        Object sObj = ctx.getThreadLocal("session");
        Object user = ctx.getThreadLocal("user");
        Object userToken = ctx.getThreadLocal("userToken");
        Object clientAddr = ctx.getThreadLocal("clientAddr");
        Object clientRequestId = ctx.getThreadLocal("clientRequestId");

        String token = tObj == null ? "" : tObj.toString();
        String sessionId = sObj == null ? "" : sObj.toString();
        Timeout timeout = ActorHelper.getServiceCommTimeout();
        try {
            String svcName = askObject.get("serviceName").toString();
            String msgType = askObject.get("messageType").toString();

            // parse timeout
            Object toObj = askObject.get("timeout");
            if (toObj != null) {
                if (toObj instanceof String) {
                    timeout = ConfigHelper.parseTimeout(toObj.toString());
                } else {
                    timeout = new Timeout(Double.valueOf(toObj.toString()).longValue());
                }
            }

            NativeObject msgBody = (NativeObject) askObject.get("messageBody");
            Boolean async = (Boolean) askObject.get("async");

            if (async.booleanValue()) {
                ScriptableObject callback = (ScriptableObject) askObject.get("callback");
                JsAskMessage askMsg = new JsAskMessage(token, sessionId, svcName, msgType, msgBody, callback, timeout);
                if (user != null) {
                    askMsg.setUser(user.toString());
                }
                if (userToken != null) {
                    askMsg.setUserToken(userToken.toString());
                }
                if (clientAddr != null) {
                    askMsg.setClientAddr(clientAddr.toString());
                }
                if (clientRequestId != null) {
                    askMsg.setClientRequestId(clientRequestId.toString());
                }

                jsHubSvc.tell(askMsg, ActorRef.noSender());
                return new JsObjectSerializerHelper().jsonElementToNativeObject(
                        GsonWrapper.toGsonJsonElement(new JsWrappedResponseMessage("")),
                        ctx,
                        askObject.getParentScope());
            } else {
                JsAskMessage askMsg = new JsAskMessage(token, sessionId, svcName, msgType, msgBody);
                if (user != null) {
                    askMsg.setUser(user.toString());
                }
                Future<Object> f = ActorHelper.futureAsk(jsHubSvc, askMsg, timeout);
                Object result = null;
                try {
                    result = Await.result(f, timeout.duration());
                } catch (Exception e) {
                    result = new JsWrappedResponseMessage(e);
                }

                return new JsObjectSerializerHelper().jsonElementToNativeObject(
                        GsonWrapper.toGsonJsonElement(result),
                        ctx,
                        askObject.getParentScope());
            }
        } catch (Exception ex) {
            return new JsObjectSerializerHelper().jsonElementToNativeObject(
                    GsonWrapper.toGsonJsonElement(new JsWrappedResponseMessage(ex)),
                    ctx,
                    askObject.getParentScope());
        } finally {
            Context.exit();
/*			
			synchronized(mutex){
				askCounter--;
				final Logger la = LoggerFactory.getLogger(JsBridge.class.getName());
				la.debug("Ask count: " + askCounter);
			}
*/
        }
    }

    public FileHelper getFileHelper() {
        return FileHelper.getInstance();
    }

    public ConfigHelper getConfigHelper() {
        return ConfigHelper.getInstance();
    }

    public ReflectionHelper getReflectionHelper() {
        return ReflectionHelper.getInstance();
    }

    public JsObjectSerializerHelper getJsObjectSerializerHelper() {
        return JsObjectSerializerHelper.getInstance();
    }
}
