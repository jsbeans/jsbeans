package org.jsbeans.web;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.scripting.JsBridge;
import org.jsbeans.types.Tuple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.security.auth.Subject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.security.PrivilegedActionException;
import java.security.PrivilegedExceptionAction;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.BiFunction;

public abstract class AuthenticatedHttpServlet extends HttpServlet {

//    private static final String SESSION_ATTR_USER_ROLES = "userRolePrincipals";
//    private static final String SESSION_ATTR_USER_ROLES_UPDATED = "userRolePrincipalsUpdated";

    public static final String LOGOUT_URI = "/logout.jsb";
    public static final String LOGOUT_URI2 = "/logout";
    public static final String LOGIN_URI = "/login.jsb";
    public static final String REDIRECT_URI_PARAM = "redirectURI";
    public static final String FORCE_UPDATE_ROLES_URI_PARAM = "forceUpdateRoles";

    private static BiFunction<HttpServletRequest, HttpServletResponse, Boolean> requestHandler;

    private static final Map<String, Tuple<Set<? extends Principal>, Long>> _cachedUsers = new ConcurrentHashMap<>();
    
    public static void resetUserRoles(String principalName){
    	_cachedUsers.remove(principalName);
    }

    public static void applyRequestInterceptor(BiFunction<HttpServletRequest, HttpServletResponse, Boolean> requestInerceptor) {
        if(AuthenticatedHttpServlet.requestHandler != null) {
            final BiFunction<HttpServletRequest, HttpServletResponse, Boolean> prev = AuthenticatedHttpServlet.requestHandler;
            AuthenticatedHttpServlet.requestHandler = new BiFunction<HttpServletRequest, HttpServletResponse, Boolean>() {
                @Override
                public Boolean apply(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
                    if(prev.apply(httpServletRequest, httpServletResponse)) {
                        return true;
                    }
                    return requestInerceptor.apply(httpServletRequest, httpServletResponse);
                }
            };
        } else {
            AuthenticatedHttpServlet.requestHandler = requestInerceptor;
        }
    }

    static {
        applyRequestInterceptor((req, resp) -> {
            try {
                if (req.getRequestURI().equals(LOGOUT_URI) || req.getRequestURI().equals(LOGOUT_URI2)) {
                    req.logout();
                    _cachedUsers.remove(req.getUserPrincipal().getName());
                    String uri = req.getParameter(REDIRECT_URI_PARAM);
                    if (uri != null && uri.length() > 1) {
                        resp.sendRedirect(uri);
                    } else {
                        resp.setStatus(200);
                    }
                    return true;
                }
                if (req.getRequestURI().equals(LOGIN_URI)) {
                    String uri = req.getParameter(REDIRECT_URI_PARAM);
                    if (uri != null && uri.length() > 1) {
                        resp.sendRedirect(uri);
                    } else {
                        resp.setStatus(200);
                    }
                    return true;
                }
            }catch (IOException | ServletException e) {
                throw new RuntimeException(e);
            }
            return false;
        });
    }

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        final Principal principal = req.getUserPrincipal() == null
                ? (ConfigHelper.getConfigBoolean("kernel.security.enabled")
                        ? new AnonymousPrincipal()
                        : new AdminPrincipal()
                    )
                : req.getUserPrincipal();

        if (requestHandler != null) {
            try {
                if (requestHandler.apply(
                        new HttpServletRequestWrapper(req) {
                            @Override
                            public Principal getUserPrincipal() {
                                return principal;
                            }
                        },
                        resp)) {
                    return;
                }
            } catch (RuntimeException e) {
                if(e.getCause() instanceof IOException) {
                    throw (IOException)e.getCause();
                }
                if(e.getCause() instanceof ServletException) {
                    throw (ServletException)e.getCause();
                }
                throw e;
            }
        }

        final Subject subject = new Subject(false, new HashSet<>(1), Collections.emptySet(), Collections.emptySet());
        subject.getPrincipals().add(principal);

        try {
            if(ConfigHelper.getConfigBoolean("kernel.security.enabled")) {
                Subject.doAs(new Subject(false, Collections.singleton(new SystemPrincipal()), Collections.emptySet(), Collections.emptySet()), new PrivilegedExceptionAction<String>() {
                    @Override
                    public String run() throws Exception {
//                        Set<? extends Principal> roles = (Set<? extends Principal>)req.getSession().getAttribute(SESSION_ATTR_USER_ROLES);
//                        Long updated = (Long)req.getSession().getAttribute(SESSION_ATTR_USER_ROLES_UPDATED);
//                        if(roles == null || System.currentTimeMillis() >= updated + ConfigHelper.getConfigLong("web.userUpdateInterval")) {
//                            JsBridge.getInstance().lock("AuthenticatedHttpServlet-" + principal.getName());
//                            try {
//                                roles = (Set<? extends Principal>)req.getSession().getAttribute(SESSION_ATTR_USER_ROLES);
//                                if(roles == null) {
//                                    roles = AuthenticatedHttpServlet.this.loginRoles(principal);
//                                    req.getSession().setAttribute(SESSION_ATTR_USER_ROLES, roles);
//                                    req.getSession().setAttribute(SESSION_ATTR_USER_ROLES_UPDATED, System.currentTimeMillis());
//                                }
//                            }finally {
//                                JsBridge.getInstance().unlock("AuthenticatedHttpServlet-" + principal.getName());
//                            }
//                        }

                        String forceUpdateRoles = req.getParameter(FORCE_UPDATE_ROLES_URI_PARAM);
                        if(forceUpdateRoles != null) {
                            final Logger la = LoggerFactory.getLogger(AuthenticatedHttpServlet.class.getName());
                            la.info("Force reset user roles for " + principal.getName());
                            _cachedUsers.remove(principal.getName());
                        }
                        Tuple<Set<? extends Principal>, Long> stored = _cachedUsers.get(principal.getName());
                        if(stored == null || System.currentTimeMillis() >= stored.getSecond() + ConfigHelper.getConfigLong("web.userUpdateInterval")) {
                            JsBridge.getInstance().lock("AuthenticatedHttpServlet-" + principal.getName());
                            try {
                                stored = _cachedUsers.get(principal.getName());
                                if(stored == null) {
                                    Set<? extends Principal> roles = AuthenticatedHttpServlet.this.loginRoles(principal);
                                    _cachedUsers.put(principal.getName(), stored = new Tuple<>(roles, System.currentTimeMillis()));
                                }
                            }finally {
                                JsBridge.getInstance().unlock("AuthenticatedHttpServlet-" + principal.getName());
                            }
                        } else {
                            "".toString();
                        }
                        subject.getPrincipals().addAll(stored.getFirst());
                        return null;
                    }
                });
            }
            subject.setReadOnly();

            Subject.doAs(subject, new PrivilegedExceptionAction<String>() {
                @Override
                public String run() throws Exception {
                    AuthenticatedHttpServlet.this.doService(req, resp);
                    return null;
                }
            });
        } catch (PrivilegedActionException e) {
            throw new RuntimeException(e);
        }

    }

    protected Set<? extends Principal> loginRoles(Principal principal) throws ServletException, IOException {
        return JsBridge.getInstance().loginUserRoles(principal);
    }

    protected abstract void doService(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException;
}
