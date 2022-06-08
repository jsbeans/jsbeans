package org.jsbeans.web;

import org.jsbeans.helpers.ConfigHelper;

import java.io.Serializable;
import java.security.Principal;

public class SystemPrincipal implements Principal, Serializable {
	private static final long serialVersionUID = 3127181207377663198L;

	@Override
    public String getName() {
        return ConfigHelper.getConfigString("kernel.security.system.user");
    }

    public int hashCode() {
        return SystemPrincipal.class.hashCode();
    }

    public boolean equals(Object o) {
        if (this == o || o instanceof SystemPrincipal) {
            return true;
        }
        return false;
    }
}
