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
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.scripting.*;
import org.jsbeans.scripting.jsb.JsbTemplateEngine;
import org.jsbeans.types.JsObject;
import org.jsbeans.types.JsObject.JsObjectType;
import scala.concurrent.Await;
import scala.concurrent.Future;

import javax.naming.AuthenticationException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;

public class JSEndPointServlet extends HttpServlet {
    private static final long serialVersionUID = -8093030776258401896L;

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String rid = WebHelper.extractHeadersFromRequest(req);
        String type = req.getParameter("type");
        UpdateStatusMessage respObj = null;
        if (type.equalsIgnoreCase("execute")) {
            respObj = this.performExecute(req, rid);
        } else if (type.equalsIgnoreCase("check")) {
            respObj = this.performCheck(req, rid);
        } else if (type.equalsIgnoreCase("break")) {

        }

        JsObject jObj = new JsObject(JsObjectType.JSONOBJECT);
        jObj.addToObject("status", respObj.status.toString());
        jObj.addToObject("token", respObj.token);
        if (respObj.subTokens != null && respObj.subTokens.size() > 0) {
            JsObject jSubTokens = new JsObject(JsObjectType.JSONARRAY);
            for (String subToken : respObj.subTokens) {
                JsObject arrElt = new JsObject(JsObjectType.STRING);
                arrElt.setString(subToken);
                jSubTokens.addToArray(arrElt);
            }
            jObj.addToObject("subTokens", jSubTokens);
        }

        if (respObj.error != null) {
            jObj.addToObject("error", respObj.error);
        } else {
            jObj.addToObject("error", "");
        }

        if (respObj != null && respObj.result != null) {
            jObj.addToObject("result", respObj.result);
        } else {
            jObj.addToObject("result", "");
        }
        String result = jObj.toJS();
        if (req.getParameterMap().containsKey("callback")) {
            result = String.format("%s(%s);", req.getParameter("callback"), result);
        }

        resp.getOutputStream().write(result.getBytes("UTF-8"));
    }

    private UpdateStatusMessage performCheck(HttpServletRequest req, String rid) throws UnsupportedEncodingException, IOException {
        String token = req.getParameter("token");
        try {
            if (req.getUserPrincipal() == null && ConfigHelper.getConfigBoolean("kernel.security.enabled")) {
                throw new AuthenticationException("Logged in user privileges required");
            }
            Timeout timeout = ActorHelper.getServiceCommTimeout();
            Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), new QueryStatusMessage(token), timeout);
            return (UpdateStatusMessage) Await.result(future, timeout.duration());
        } catch (Exception e) {
            UpdateStatusMessage retObj = new UpdateStatusMessage(token);
            retObj.status = ExecutionStatus.FAIL;
            retObj.error = e.getMessage();
            return retObj;
        }
    }

    private UpdateStatusMessage performExecute(HttpServletRequest req, String rid) throws UnsupportedEncodingException, IOException {
        try {
            if (req.getUserPrincipal() == null && ConfigHelper.getConfigBoolean("kernel.security.enabled")) {
                throw new AuthenticationException("Logged in user privileges required");
            }
            String script = req.getParameter("data");
            String token = req.getParameter("token");
            Object userTokenObj = req.getSession().getAttribute("token");
            String userToken = (userTokenObj != null ? userTokenObj.toString() : null);
            Timeout timeout = ActorHelper.getServiceCommTimeout();
            ExecuteScriptMessage execMsg = new ExecuteScriptMessage(JsbTemplateEngine.perform(script, null), true);
            execMsg.setScopePath(req.getSession().getId());
            execMsg.setUserToken(userToken);
            execMsg.setClientAddr(req.getRemoteAddr());
            Principal p = req.getUserPrincipal();
            if (p != null) {
                execMsg.setUser(p.getName());
            }
            if (token != null && token.length() > 0) {
                execMsg.setToken(token);
            }
            execMsg.setClientRequestId(rid);
            Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), execMsg, timeout);
            return (UpdateStatusMessage) Await.result(future, timeout.duration());
        } catch (Exception e) {
            UpdateStatusMessage retObj = new UpdateStatusMessage("");
            retObj.status = ExecutionStatus.FAIL;
            retObj.error = e.getMessage();
            return retObj;
        }
    }

}
