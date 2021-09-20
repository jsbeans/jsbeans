package org.jsbeans.web;

import org.jsbeans.helpers.ConfigHelper;

import java.security.Principal;

public class AdminPrincipal implements Principal {
    @Override
    public String getName() {
        return ConfigHelper.getConfigString("kernel.security.admin.user");
    }

    public int hashCode() {
        return AdminPrincipal.class.hashCode();
    }

    public boolean equals(Object o) {
        if (this == o || o instanceof AdminPrincipal) {
            return true;
        }
        return false;
    }
}
