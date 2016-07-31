package org.jsbeans.security;

import org.jsbeans.messages.AbstractMessage;

public class PrincipalMessage<T> extends AbstractMessage<T> {
    private static final long serialVersionUID = 1484319924369516792L;

    private String userPrincipal = null;

    public String getUserPrincipal() {
        return this.userPrincipal;
    }

    public void setUserPrincipal(String p) {
        this.userPrincipal = p;
    }
}
