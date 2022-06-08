package org.jsbeans.web;

import org.jsbeans.helpers.AuthHelper;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;

public class PassClientFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        if (request.getUserPrincipal() != null) {
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            filterChain.doFilter(new HttpServletRequestWrapper(request) {
                @Override
                public Principal getUserPrincipal() {
                    return AuthHelper.getClientPrincipal();
                }
            }, servletResponse);
        }
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {

    }

    @Override
    public void destroy() {}
}