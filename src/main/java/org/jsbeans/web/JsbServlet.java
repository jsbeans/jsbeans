/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.web;

import akka.actor.ActorRef;
import akka.dispatch.OnFailure;
import akka.dispatch.OnSuccess;
import akka.util.Timeout;
import org.jsbeans.Core;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.scripting.jsb.JsbRegistryService;
import org.jsbeans.scripting.jsb.LookupJsoMessage;
import org.jsbeans.scripting.jsb.RpcMessage;
import org.jsbeans.scripting.jsb.UploadMessage;
import org.jsbeans.types.JsObject;
import org.jsbeans.types.JsObject.JsObjectType;
import org.jsbeans.types.JsonElement;
import org.jsbeans.types.JsonObject;
import org.slf4j.LoggerFactory;
import scala.concurrent.Await;
import scala.concurrent.Future;

import javax.security.auth.Subject;
import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.security.AccessController;
import java.security.Principal;
import java.security.PrivilegedExceptionAction;
import java.util.Collections;
import java.util.Map;

public class JsbServlet extends HttpServlet {
    private static final long serialVersionUID = -4914554821670876067L;

    private static Boolean isDebug = ConfigHelper.getConfigBoolean("web.debug");
    private static Boolean bES5Compatible = ConfigHelper.getConfigBoolean("web.es5Compatible");
    private static Boolean bMinifyScripts = ConfigHelper.getConfigBoolean("web.minifyScripts");

    private static String prepareGetJsoResponse(LookupJsoMessage jsoResult, boolean onlyBody, boolean bEncode) {
        JsObject jObj = new JsObject(JsObjectType.JSONOBJECT);
        try {
            if (!jsoResult.isSuccess() || jsoResult.getResult() == null) {
                return null;    // say not found error
            }

            jObj.addToObject("success", jsoResult.isSuccess());
            if (jsoResult.getError() != null) {
                jObj.addToObject("error", jsoResult.getError());
            } else {
                jObj.addToObject("error", "");
            }
            if (jsoResult != null && jsoResult.getResult() != null) {
                JsObject jsoFull = jsoResult.getResult();
/*                
                if (jsoFull.getResultType() == JsObjectType.JSONARRAY) {
                    for (int i = 0; i < jsoFull.getArraySize(); i++) {
                        JsObject item = jsoFull.getArrayItem(i);
                        if (item.getAttribute("server") != null) {
                            item.removeFromObject("server");
                        }
                        if(item.getAttribute("clientProcs") != null){
                        	item.removeFromObject("clientProcs");
                        }
                    }
                } else if (jsoFull.getResultType() == JsObjectType.JSONOBJECT) {
                    if (jsoFull.getAttribute("server") != null) {
                        jsoFull.removeFromObject("server");
                    }
                    if (jsoFull.getAttribute("clientProcs") != null) {
                        jsoFull.removeFromObject("clientProcs");
                    }
                }
*/
                jObj.addToObject("result", jsoFull);
            } else {
                jObj.addToObject("result", "");
            }

            if (onlyBody) {
                jObj = jsoResult.getResult();
            }

            String jsbCode = jObj.toJS(bEncode);
            if((bMinifyScripts != null && bMinifyScripts.booleanValue()) || (bES5Compatible != null && bES5Compatible.booleanValue())) {
            	jsbCode = JsMinifier.minify(jsbCode, true, bMinifyScripts != null && bMinifyScripts.booleanValue(), bES5Compatible != null && bES5Compatible.booleanValue());
            }

            return jsbCode;
        } catch (Exception e) {
            return null;    // say not found error
        }

    }

    public static String getJsbCode(final String jsoName, final String sessionId, final String clientAddr, final String userName, final String rid, final String userToken) throws Exception {
        Timeout timeout = ActorHelper.getServiceCommTimeout();
        Future<Object> f = ActorHelper.futureAsk(
                ActorHelper.getActorSelection(JsbRegistryService.class),
                new LookupJsoMessage(jsoName, sessionId, clientAddr, userName, rid, userToken),
                timeout);

        LookupJsoMessage respMsg = (LookupJsoMessage) Await.result(f, timeout.duration());
        return prepareGetJsoResponse(respMsg, true, false);
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String cmd = req.getParameter("cmd");
        String rid = WebHelper.extractHeadersFromRequest(req);

        if (cmd == null || cmd.trim().length() == 0) {
            cmd = "get";
        }
        AsyncContext ac = req.startAsync(req, resp);
        ac.setTimeout(0);	// disable async timeout - use future timeout
        final Principal principal = req.getUserPrincipal() == null
                ? (ConfigHelper.getConfigBoolean("kernel.security.enabled") ? new AnonymousPrincipal() : new AdminPrincipal())
                : req.getUserPrincipal();
        final String userName = principal != null ? principal.getName() : null;
        final Object userTokenObj = req.getSession().getAttribute("token");
        final String userToken = (userTokenObj != null ? userTokenObj.toString() : null);
        final String clientIp = WebHelper.extractRealIpFromRequest(req);
        final String cmdf = cmd;

        Subject subj = null;
        if (principal != null) {
            // if subject initialized with current principal
            Subject accessControlSubject = Subject.getSubject(AccessController.getContext());
            if (accessControlSubject != null) {
                for (Principal pr : accessControlSubject.getPrincipals()) {
                    if (pr == principal) {
                        subj = accessControlSubject;
                        break;
                    }
                }
            }
            if (subj == null) {
                subj = new Subject(true, Collections.singleton(principal), Collections.emptySet(), Collections.emptySet());
            }
        }

        try {
            Subject.doAs(subj, new PrivilegedExceptionAction<String>() {
                @Override
                public String run() throws Exception {
                    if ("get".equals(cmdf)) {
                        handleGetJsoCommand(ac, clientIp, userName, rid, userToken);
                    } else if ("rpc".equals(cmdf)) {
                        handleRpcCommand(ac, clientIp, userName, rid, userToken);
                    } else if ("upload".equals(cmdf)) {
                        handleUploadCommand(ac, clientIp, userName, rid, userToken);
                    }
                    return null;
                }
            });
        }catch(Exception e) {
            // respond error (404)
            ((HttpServletResponse) ac.getResponse()).sendError(404);
            ac.complete();
        }
    }

    private void handleUploadCommand(AsyncContext ac, String remoteAddr, String userName, String rid, String userToken) throws IOException {
    	String streamId = ac.getRequest().getParameter("id");
    	InputStream is = ac.getRequest().getInputStream();
    	HttpServletRequest req = ((HttpServletRequest) ac.getRequest());
    	
    	((HttpServletResponse) ac.getResponse()).addHeader("Run-Tag", Core.RUN_TAG);
    	
    	InputStream iss = new UploadStream(ac, is);
		
		ActorHelper.getActorSelection(JsbRegistryService.class).tell(new UploadMessage(streamId, iss, req.getSession().getId(), remoteAddr, userName, rid, userToken), ActorRef.noSender());
	}

	private void responseResult(AsyncContext ac, String result) throws UnsupportedEncodingException, IOException {
        if (result != null && result.length() > 0) {
            if (ac.getRequest().getParameterMap().containsKey("callback")) {
            	String callbackStr = ac.getRequest().getParameter("callback");
            	if(callbackStr.indexOf(';') >= 0) {
            		callbackStr = callbackStr.substring(0, callbackStr.indexOf(';'));
            	}
                result = String.format("%s(%s);", callbackStr, result);
            }
            try {
            	((HttpServletResponse) ac.getResponse()).addHeader("Run-Tag", Core.RUN_TAG);
            	ac.getResponse().getOutputStream().write(result.getBytes("UTF-8"));
            } catch(Exception e){}
        } else {
            // respond error (404)
            ((HttpServletResponse) ac.getResponse()).sendError(404);
        }
        
        ac.complete();
    }

    private void handleRpcCommand(final AsyncContext ac, final String clientAddr, final String userName, final String rid, final String userToken) throws UnsupportedEncodingException {
        String data = URLDecoder.decode(ac.getRequest().getParameter("data"), "UTF-8");

        Timeout timeout = ActorHelper.getServiceCommTimeout();
        HttpServletRequest req = ((HttpServletRequest) ac.getRequest());
        Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsbRegistryService.class), new RpcMessage(req.getSession().getId(), clientAddr, data, userName, rid, userToken), timeout);

        future.onSuccess(new OnSuccess<Object>() {
            @Override
            public void onSuccess(Object obj) throws Throwable {
                responseResult(ac, prepareRpcResponse((RpcMessage) obj));
            }
        }, Core.getActorSystem().dispatcher());

        future.onFailure(new OnFailure() {
            @Override
            public void onFailure(Throwable e) throws Throwable {
                responseResult(ac, prepareRpcResponse(new RpcMessage(e)));
            }
        }, Core.getActorSystem().dispatcher());

    }

    private String prepareRpcResponse(RpcMessage respObj) {
        JsObject jObj = new JsObject(JsObjectType.JSONOBJECT);
        jObj.addToObject("success", respObj.getSuccess());
        if (respObj.getError() != null) {
            jObj.addToObject("error", respObj.getError());
        } else {
            jObj.addToObject("error", "");
        }
        if (respObj != null && respObj.getResult() != null) {
            jObj.addToObject("result", respObj.getResult());
        } else {
            jObj.addToObject("result", "");
        }

        try {
            return jObj.toJS(false);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return null;
    }

    private void handleGetJsoCommand(final AsyncContext ac, final String clientAddr, final String userName, final String rid, final String userToken) throws IOException {
        final String jsoName = ac.getRequest().getParameter("name");
        if (jsoName == null || jsoName.length() == 0) {
            LoggerFactory.getLogger(JsbServlet.class).error("Invalid JSB name specified: null");
            responseResult(ac, null);
            return;
        }
        if (WebCache.contains(jsoName)) {
            this.responseResult(ac, WebCache.get(jsoName));
        } else {
            Timeout timeout = ActorHelper.getServiceCommTimeout();
            Future<Object> f = ActorHelper.futureAsk(
                    ActorHelper.getActorSelection(JsbRegistryService.class),
                    new LookupJsoMessage(jsoName, ((HttpServletRequest) ac.getRequest()).getSession().getId(), clientAddr, userName, rid, userToken),
                    timeout);

            f.onSuccess(new OnSuccess<Object>() {
                @Override
                public void onSuccess(Object obj) throws Throwable {
                    String jsoStr = prepareGetJsoResponse((LookupJsoMessage) obj, false, false);
                    WebCache.put(jsoName, jsoStr);
                    responseResult(ac, jsoStr);
                }
            }, Core.getActorSystem().dispatcher());

            f.onFailure(new OnFailure() {
                @Override
                public void onFailure(Throwable arg0) throws Throwable {
                    responseResult(ac, null);
                }
            }, Core.getActorSystem().dispatcher());
        }
    }
}
