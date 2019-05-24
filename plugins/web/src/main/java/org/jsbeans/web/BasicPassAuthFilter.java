/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.web;

import org.jsbeans.helpers.ConfigHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.StringTokenizer;

/** BASIC auth filter that read Principal (user nae) from "Authorization: BASIC" header without credentials check.
 * */
public class BasicPassAuthFilter implements Filter {

    /** Logger */
    private static final Logger LOG = LoggerFactory.getLogger(BasicPassAuthFilter.class);

    private String realm = "Protected";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        String paramRealm = filterConfig.getInitParameter("realm");
        if (paramRealm != null && paramRealm.length() > 0) {
            realm = paramRealm;
        }
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            StringTokenizer st = new StringTokenizer(authHeader);
            if (st.hasMoreTokens()) {
                String basic = st.nextToken();

                if (basic.equalsIgnoreCase("Basic")) {
                    try {
                        String credentials = new String(new sun.misc.BASE64Decoder().decodeBuffer(st.nextToken()), "UTF-8");
                        LOG.debug("Credentials: " + credentials);
                        int p = credentials.indexOf(":");
                        if (p != -1) {
                            String username = credentials.substring(0, p).trim();
                            String password = credentials.substring(p + 1).trim();

                            filterChain.doFilter(new HttpServletRequestWrapper(request) {
                                @Override
                                public Principal getUserPrincipal() {
                                    return new Principal() {
                                        @Override
                                        public String getName() {
                                            return username;
                                        }
                                    };
                                }
                            }, servletResponse);
                        } else {
                            unauthorized(response, "Invalid authentication token");
                        }
                    } catch (UnsupportedEncodingException e) {
                        throw new Error("Couldn't retrieve authentication", e);
                    }
                }
            }
        } else {
            //unauthorized(response);
        	filterChain.doFilter(new HttpServletRequestWrapper(request) {
                @Override
                public Principal getUserPrincipal() {
                    return new Principal() {
                        @Override
                        public String getName() {
                        	return ConfigHelper.getConfigString("kernel.security.admin.user");
                        }
                    };
                }
            }, servletResponse);
        }
    }

    @Override
    public void destroy() {
    }

    private void unauthorized(HttpServletResponse response, String message) throws IOException {
        response.setHeader("WWW-Authenticate", "Basic realm=\"" + realm + "\"");
        response.sendError(401, message);
    }

    private void unauthorized(HttpServletResponse response) throws IOException {
        unauthorized(response, "Unauthorized");
    }
}
