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
import org.jsbeans.security.AuthMessage;
import org.jsbeans.security.AuthMessage.Target;
import org.jsbeans.security.RemoveTokenMessage;
import org.jsbeans.security.SecurityService;
import org.jsbeans.security.basic.BasicAuthMessage;
import org.jsbeans.security.basic.HashAuthMessage;
import org.jsbeans.security.otp.OtpAuthMessage;
import org.jsbeans.types.JsObject;
import org.jsbeans.types.JsObject.JsObjectType;
import scala.concurrent.Await;
import scala.concurrent.Future;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

public class AuthServlet extends HttpServlet {

    private static final long serialVersionUID = -6876514364341802728L;

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String rid = WebHelper.extractHeadersFromRequest(req);
        String authPath = req.getRequestURI();
        if (authPath.startsWith("/login")) {
            doLogin(req, resp, rid);
        } else {
            doLogout(req, resp, rid);
        }
    }

    private void doLogout(HttpServletRequest req, HttpServletResponse resp, String rid) throws UnsupportedEncodingException, IOException {
        String token = null;
        HttpSession session = null;

        // try to read token from session
        if (token == null) {
            session = req.getSession(false);
            if (session != null) {
                Object tAttr = session.getAttribute("token");
                if (tAttr != null) {
                    token = tAttr.toString();
                }
            }
        }

        // try to read token from the cookies
        if (token == null) {
            Cookie[] cArr = req.getCookies();
            for (Cookie c : cArr) {
                if (c.getName().equalsIgnoreCase("token")) {
                    token = c.getValue();
                    break;
                }
            }
        }

        boolean bRemoved = false;

        // avoid session
        session = req.getSession(false);
        if (session != null) {
            session.removeAttribute("token");
            session.removeAttribute("principal");
        }

        // avoid cookies
        boolean bFound = false;
        for (Cookie c : req.getCookies()) {
            if (c.getName().equals("token")) {
                bFound = true;
                break;
            }
        }
        if (bFound) {
            Cookie cookie = new Cookie("token", "");
            cookie.setMaxAge(0); //clear
            resp.addCookie(cookie);
        }

        if (token != null) {

            // clear from SecurityService
            Timeout timeout = ActorHelper.getServiceCommTimeout();
            Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(SecurityService.class), new RemoveTokenMessage(token), timeout);
            try {
                RemoveTokenMessage msg = (RemoveTokenMessage) Await.result(future, timeout.duration());
                bRemoved = msg.getResponse();
            } catch (Exception e) {
                resp.sendError(500);
                return;
            }
        }

        if (req.getParameter("mode") != null && req.getParameter("mode").equals("json")) {
            JsObject jObj = new JsObject(JsObjectType.JSONOBJECT);
            jObj.addToObject("success", true);
            jObj.addToObject("result", bRemoved ? "ok" : "not logged in");
            this.responseJson(jObj, req, resp);
        } else {
            String respStr = "ok";
            if (!bRemoved) {
                respStr = "not logged in";
            }
            resp.getOutputStream().write(respStr.getBytes("UTF-8"));
        }

    }

    private void doLogin(HttpServletRequest req, HttpServletResponse resp, String rid) throws IOException {
        try {
            String token = null;
            String userName = req.getParameter("user");
            if (userName == null || userName.length() == 0) {
                throw new PlatformException("No 'user' parameter specified");
            }
            boolean tempToken = false;
            boolean saveCookie = false;

            String cookieStr = req.getParameter("cookie");
            if (cookieStr != null && Boolean.parseBoolean(cookieStr)) {
                saveCookie = true;
            }

            String target = req.getParameter("target");
            if (target == null) {
                target = "api";
            }
            Target tgt = Target.API;
            if (target.equals("web")) {
                tgt = Target.WEB;
                if (!saveCookie) {
                    tempToken = true;
                }
            }

            String password = req.getParameter("pass");
            if (password == null || password.length() == 0) {
                password = req.getParameter("password");
            }
            if (password != null && password.length() > 0) {
                // proceed auth with login and password
                AuthMessage msg = new BasicAuthMessage(userName, password);
                msg.setTarget(tgt);
                msg.setTemporary(tempToken);
                token = this.doAuth(msg);
            } else if (req.getParameter("hash") != null) {
                AuthMessage msg = new HashAuthMessage(userName, req.getParameter("hash"));
                msg.setTarget(tgt);
                msg.setTemporary(tempToken);
                token = this.doAuth(msg);
            } else if (req.getParameter("otp") != null) {
                String otp = req.getParameter("otp");
                // proceed auth with login and otp
                AuthMessage msg = new OtpAuthMessage(userName, otp);
                msg.setTarget(tgt);
                msg.setTemporary(tempToken);
                token = this.doAuth(msg);
            } else {
                throw new PlatformException("No authentication parameter specified. It could be: pass, hash or otp");
            }

            if (token == null || token.length() == 0) {
                resp.sendError(401);
                return;
            }

            // save token in session
            HttpSession session = req.getSession(true);
            session.setAttribute("token", token);
            session.setAttribute("principal", userName);

            // save token into cookies
            if (saveCookie) {
                Cookie cookie = new Cookie("token", token);
                cookie.setMaxAge(30 * 24 * 60 * 60); //1 month
                resp.addCookie(cookie);
            }

            if (req.getParameter("mode") != null && req.getParameter("mode").equals("json")) {
                JsObject jObj = new JsObject(JsObjectType.JSONOBJECT);
                jObj.addToObject("success", true);
                jObj.addToObject("token", token);
                this.responseJson(jObj, req, resp);
            } else {
                resp.getOutputStream().write(String.format("_token_=%s", token).getBytes("UTF-8"));
            }
        } catch (Exception ex) {
            resp.sendError(400, ex.getMessage());
        }
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

    private String doAuth(AuthMessage msg) {
        Timeout timeout = ActorHelper.getServiceCommTimeout();
        Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(SecurityService.class), msg, timeout);
        try {
            AuthMessage authResp = (AuthMessage) Await.result(future, timeout.duration());
            return authResp.getResponse();
        } catch (Exception e) {
        }
        return "";
    }

}

