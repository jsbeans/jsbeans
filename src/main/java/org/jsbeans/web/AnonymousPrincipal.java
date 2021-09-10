package org.jsbeans.web;

import org.jsbeans.helpers.ConfigHelper;

import javax.security.auth.Subject;
import java.security.Principal;

public class AnonymousPrincipal implements Principal {
    @Override
    public String getName() {
        return ConfigHelper.getConfigString("kernel.security.unauthorized.user");
    }

    public int hashCode() {
        return AnonymousPrincipal.class.hashCode();
    }

    public boolean equals(Object o) {
        if (this == o || o instanceof AnonymousPrincipal) {
            return true;
        }
        return false;
    }
}
