package org.jsbeans.web;

import org.jsbeans.helpers.ConfigHelper;

import javax.security.auth.Subject;

import java.io.Serializable;
import java.security.Principal;

public class AnonymousPrincipal implements Principal, Serializable {
	private static final long serialVersionUID = -5630816785619767100L;

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
