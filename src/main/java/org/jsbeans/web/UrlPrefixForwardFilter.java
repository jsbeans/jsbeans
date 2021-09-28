package org.jsbeans.web;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class UrlPrefixForwardFilter implements Filter {

    public static final String CONF_PREFIX = "urlprefixforward.prefix";
    String uriPrefix;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        if (uriPrefix == null || uriPrefix.isEmpty()) {
            filterChain.doFilter(servletRequest, servletResponse);
        } else {
            HttpServletRequest request = (HttpServletRequest) servletRequest;
            HttpServletResponse response = (HttpServletResponse) servletResponse;
            String uri = request.getRequestURI();
            request.getRequestDispatcher(uriPrefix + uri).forward(servletRequest, servletResponse);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        uriPrefix = filterConfig.getInitParameter(CONF_PREFIX);
    }

    @Override
    public void destroy() {}
}
