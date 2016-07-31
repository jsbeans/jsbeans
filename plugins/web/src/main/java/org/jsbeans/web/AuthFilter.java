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
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.security.GetTokenMessage;
import org.jsbeans.security.SecurityService;
import scala.concurrent.Await;
import scala.concurrent.Future;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.Principal;

public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        final HttpServletResponse resp = (HttpServletResponse) response;

        chain.doFilter(new HttpServletRequestWrapper((HttpServletRequest) request) {
            private String token = null;

            @Override
            public String getRemoteAddr() {
                String realIP = super.getHeader("X-Real-IP");
                return realIP != null ? realIP : super.getRemoteAddr();
            }

            @Override
            public String getRemoteHost() {
                try {
                    return InetAddress.getByName(getRemoteAddr()).getHostName();
                } catch (UnknownHostException e) {
                    return getRemoteAddr();
                }
            }

            @Override
            public Principal getUserPrincipal() {
                boolean needSaveSession = false;
                boolean needClearAll = false;
                boolean bThrowException = false;
                HttpSession session = null;

                if (!ConfigHelper.getConfigBoolean("kernel.security.enabled")) {
                    return new Principal() {
                        @Override
                        public String getName() {
                            return ConfigHelper.getConfigString("kernel.security.admin.user");
                        }
                    };
                }

                // try to read principal from session
                session = this.getSession(true);
                final Object pObj = session.getAttribute("principal");
                if (pObj != null) {
                    return new Principal() {
                        @Override
                        public String getName() {
                            return pObj.toString();
                        }
                    };
                }


                // try to read token from session
                if (token == null) {
                    Object tAttr = session.getAttribute("token");
                    if (tAttr != null) {
                        this.token = tAttr.toString();
                        needSaveSession = false;
                    }
                }

                // try to read token from the cookies
                if (token == null) {
                    needSaveSession = true;
                    Cookie[] cArr = this.getCookies();
                    for (Cookie c : cArr) {
                        if (c.getName().equalsIgnoreCase("token")) {
                            this.token = c.getValue();
                            break;
                        }
                    }
                }

                // try to get token from params
                if (token == null) {
                    token = this.getParameter("_token_");
                }

                if (token != null) {
                    // obtain a full token descriptor from the SecurityService
                    Timeout timeout = ActorHelper.getServiceCommTimeout();
                    Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(SecurityService.class), new GetTokenMessage(token), timeout);
                    try {
                        Object r = Await.result(future, timeout.duration());
                        if (r instanceof GetTokenMessage) {
                            GetTokenMessage tokenResp = (GetTokenMessage) r;
                            final String userName = tokenResp.getResponse().getUserName();
                            if (userName == null || userName.length() == 0) {
                                throw new PlatformException("Failed to get actual token");
                            }
                            if (needSaveSession) {
                                // store token into session
                                session.setAttribute("token", token);

                                // store principal into session
                                session.setAttribute("principal", userName);
                            }

                            return new Principal() {
                                @Override
                                public String getName() {
                                    return userName;
                                }
                            };
                        } else {
                            bThrowException = true;
                            needClearAll = true;
                        }
                    } catch (Exception e) {
                        needClearAll = true;
                    }

                    if (needClearAll) {
                        // clear session
                        session.removeAttribute("token");
                        session.removeAttribute("principal");

                        // clear cookies
                        Cookie[] cArr = this.getCookies();
                        boolean bFound = false;
                        for (Cookie c : cArr) {
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
                    }
                    if (bThrowException) {
                        throw new PlatformException("Access token is wrong or expired");
                    }
                }

                return null;
            }
        }, response);
    }

    @Override
    public void destroy() {
    }

}
