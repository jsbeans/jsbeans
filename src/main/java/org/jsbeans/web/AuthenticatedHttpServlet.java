package org.jsbeans.web;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.scripting.JsBridge;

import javax.security.auth.Subject;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.security.Principal;
import java.security.PrivilegedActionException;
import java.security.PrivilegedExceptionAction;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public abstract class AuthenticatedHttpServlet extends HttpServlet {

    private static final String SESSION_ATTR_USER_ROLES = "userRolePrincipals";
    private static final String SESSION_ATTR_USER_ROLES_UPDATED = "userRolePrincipalsUpdated";

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        final Principal principal = req.getUserPrincipal() == null
                ? (ConfigHelper.getConfigBoolean("kernel.security.enabled")
                        ? new AnonymousPrincipal()
                        : new AdminPrincipal()
                    )
                : req.getUserPrincipal();
        final Subject subject = new Subject(false, new HashSet<>(1), Collections.emptySet(), Collections.emptySet());
        subject.getPrincipals().add(principal);

        try {

            if(ConfigHelper.getConfigBoolean("kernel.security.enabled")) {
                Subject.doAs(new Subject(false, Collections.singleton(new SystemPrincipal()), Collections.emptySet(), Collections.emptySet()), new PrivilegedExceptionAction<String>() {
                    @Override
                    public String run() throws Exception {
                        Set<? extends Principal> roles = (Set<? extends Principal>)req.getSession().getAttribute(SESSION_ATTR_USER_ROLES);
                        Long updated = (Long)req.getSession().getAttribute(SESSION_ATTR_USER_ROLES_UPDATED);
                        if(roles == null || System.currentTimeMillis() >= updated + ConfigHelper.getConfigLong("web.userUpdateInterval")) {
                            roles = AuthenticatedHttpServlet.this.loginRoles(principal);
                            req.getSession().setAttribute(SESSION_ATTR_USER_ROLES, roles);
                            req.getSession().setAttribute(SESSION_ATTR_USER_ROLES_UPDATED, System.currentTimeMillis());
                        }
                        subject.getPrincipals().addAll(roles);
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
