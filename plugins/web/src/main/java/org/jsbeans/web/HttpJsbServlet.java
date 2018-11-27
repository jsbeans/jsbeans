/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.web;

import akka.util.Timeout;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.scripting.ExecuteScriptMessage;
import org.jsbeans.scripting.ExecutionStatus;
import org.jsbeans.scripting.JsHub;
import org.jsbeans.scripting.UpdateStatusMessage;
import org.jsbeans.serialization.GsonWrapper;
import org.jsbeans.types.JsObject;
import org.jsbeans.types.JsObject.JsObjectType;
import org.jsbeans.types.JsonElement;
import org.jsbeans.types.JsonObject;
import scala.concurrent.Await;
import scala.concurrent.Future;

import javax.security.auth.Subject;
import javax.security.auth.kerberos.KerberosPrincipal;
import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.AccessController;
import java.security.Principal;
import java.security.PrivilegedExceptionAction;
import java.util.Collections;
import java.util.Map;

public class HttpJsbServlet extends HttpServlet {
	private static final long serialVersionUID = 4803233014924737807L;

	public static String getFullURL(HttpServletRequest request) throws UnsupportedEncodingException {
        StringBuffer requestURL = request.getRequestURL();
        String queryString = request.getQueryString();

        if (queryString == null) {
            return requestURL.toString();
        } else {
            return requestURL.append('?').append(queryString).toString();
        }
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String rid = WebHelper.extractHeadersFromRequest(req);
        try {
            final String session = req.getSession().getId();
            final Object tokenObj = req.getSession().getAttribute("token");
            final String token = tokenObj != null ? tokenObj.toString() : null;
            final Principal principal = req.getUserPrincipal();
            final String user = principal != null ? principal.getName() : null;
            
            // construct proc 
            final String proc = req.getMethod().toLowerCase();
            
            // construct bean path
            final String beanPath = req.getServletPath().toLowerCase();
            
            // construct params json
            final JsonObject pObj = new JsonObject();

            Map<String, String[]> pMap = req.getParameterMap();
            for (String pName : pMap.keySet()) {
                String value = req.getParameter(pName).trim();
                if (value.startsWith("{") || value.startsWith("[")) {
                    JsonElement jElt = GsonWrapper.fromJson(value, JsonElement.class);
                    pObj.put(pName, jElt);
                } else {
                    try {
                        JsonElement jElt = GsonWrapper.fromJson(value, JsonElement.class);
                        pObj.put(pName, jElt);
                    } catch (Throwable e) {
                        pObj.put(pName, value);
                    }
                }
            }

            Subject subj = principal != null
                    ? new Subject(true, Collections.singleton(principal), Collections.emptySet(), Collections.emptySet())
                    : null;
            UpdateStatusMessage respObj = Subject.doAs(subj, new PrivilegedExceptionAction<UpdateStatusMessage>() {
                @Override
                public UpdateStatusMessage run() throws Exception {
                    String params = pObj.toJson();
                    return HttpJsbServlet.this.execCmd(beanPath, proc, params, session, req.getRemoteAddr(), user, rid, getFullURL(req), token, req, resp);
                }
            });
           	this.responseResult(respObj, req, resp, rid);

        } catch (Exception ex) {
            this.responseError(ex, req, resp, rid);
        }
    }

    public void responseError(Throwable th, HttpServletRequest req, HttpServletResponse resp, String rid) throws UnsupportedEncodingException, IOException {
        JsObject jObj = new JsObject(JsObjectType.JSONOBJECT);
        jObj.addToObject("success", false);
        jObj.addToObject("result", "");
        jObj.addToObject("error", th.getMessage());

        this.responseJson(jObj, req, resp);
    }

    public void responseResult(UpdateStatusMessage respObj, HttpServletRequest req, HttpServletResponse resp, String rid) throws IOException {
        String mode = req.getParameter("mode");
        String contentType = null, encoding = null, contentDisposition = null;
        if (mode == null || mode.trim().length() == 0) {
            if (respObj != null && respObj.result != null) {
                JsObject execOpts = respObj.result.getAttribute("opts");
                JsObject modeObj = execOpts.getAttribute("mode");
                if (modeObj != null && modeObj.getResultType() == JsObjectType.STRING) {
                    mode = modeObj.getString();
                }
            }
        }

        if (respObj != null && respObj.result != null) {
            JsObject execOpts = respObj.result.getAttribute("opts");

            JsObject ctObj = execOpts.getAttribute("contentType");
            if (ctObj != null && ctObj.getResultType() == JsObjectType.STRING) {
                contentType = ctObj.getString();
            }

            JsObject encObj = execOpts.getAttribute("encoding");
            if (encObj != null && encObj.getResultType() == JsObjectType.STRING) {
                encoding = encObj.getString();
            }

            JsObject dispObj = execOpts.getAttribute("contentDisposition");
            if (dispObj != null && dispObj.getResultType() == JsObjectType.STRING) {
                contentDisposition = dispObj.getString();
            }
        }

        if (mode == null || mode.trim().length() == 0) {
            mode = "text";
        }

        if (mode.equalsIgnoreCase("json")) {

            JsObject jObj = new JsObject(JsObjectType.JSONOBJECT);

            jObj.addToObject("success", respObj.status == ExecutionStatus.SUCCESS);
            if (respObj.status == ExecutionStatus.FAIL) {
                jObj.addToObject("error", respObj.error);
            } else {
                jObj.addToObject("error", "");
            }
            if (respObj != null && respObj.result != null) {
                JsObject execObj = respObj.result.getAttribute("exec");
                jObj.addToObject("result", execObj);
            } else {
                jObj.addToObject("result", "");
            }

            this.responseJson(jObj, req, resp);


        } else if (mode.equalsIgnoreCase("binary") || mode.equalsIgnoreCase("bytes") || mode.equalsIgnoreCase("text") || mode.equalsIgnoreCase("html")) {
            if (respObj.status == ExecutionStatus.SUCCESS) {
                if (contentType != null) {
                    resp.setContentType(contentType);
                }
                if (encoding != null) {
                    resp.setCharacterEncoding(encoding);
                }
                if (contentDisposition != null) {
                    resp.addHeader("Content-disposition", contentDisposition);
                }
                this.responseBytes(respObj.result.getAttribute("exec").toByteArray(), req, resp);
            } else {
                this.responseBytes(new byte[]{}, req, resp);
                throw new PlatformException(respObj.error);
            }
        }

    }

    private void responseBytes(byte[] byteArr, HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.getOutputStream().write(byteArr);
    }

    private void responseJson(JsObject jObj, HttpServletRequest req, HttpServletResponse resp) throws UnsupportedEncodingException, IOException {
        String result = jObj.toJS(false);

        if (result != null && result.length() > 0) {
            if (req.getParameterMap().containsKey("callback")) {
                result = String.format("%s(%s);", req.getParameter("callback"), result);
            }
            resp.setCharacterEncoding("UTF-8");
            resp.setContentType("application/json; charset=UTF-8");
            resp.getOutputStream().write(result.getBytes("UTF-8"));
        } else {
            // respond error (404)
            resp.sendError(404);
        }

    }

    private UpdateStatusMessage execCmd(String beanPath, String proc, String params, String session, String clientAddr, String user, String rid, String uri, String token, HttpServletRequest req, HttpServletResponse resp) throws UnsupportedEncodingException {
        Timeout timeout = ActorHelper.getServiceCommTimeout();
        ExecuteScriptMessage msg = new ExecuteScriptMessage(String.format("(function(){ var Web = JSB.getInstance('JSB.Web'); var result = JSB.getInstance('JSB.HttpJsb').exec('%s','%s', [%s, decodeURIComponent('%s')]); var opts = {}; if(result instanceof Web.Response){opts = result.opts; result = result.data; } return {exec: result, opts: opts};})()", beanPath, proc, params, URLEncoder.encode(uri, "UTF-8")), false);
        msg.setUserToken(token);
        msg.setScopePath(session);
        msg.setClientAddr(clientAddr);
        msg.setUser(user);
        msg.setClientRequestId(rid);
        msg.addWrapped("__request", req);
        msg.addWrapped("__response", resp);
        Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), msg, timeout);
        UpdateStatusMessage respObj = null;
        try {
            respObj = (UpdateStatusMessage) Await.result(future, timeout.duration());
        } catch (Exception e) {
            respObj = new UpdateStatusMessage("");
            respObj.error = e.getMessage();
            respObj.status = ExecutionStatus.FAIL;
        }

        return respObj;
    }


}

