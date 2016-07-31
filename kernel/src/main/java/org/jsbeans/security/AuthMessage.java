package org.jsbeans.security;

import org.jsbeans.messages.AbstractMessage;

public class AuthMessage extends AbstractMessage<String> {
    private static final long serialVersionUID = -201552780645905785L;
    private String userName;
    private Target target = Target.API;
    private boolean temp = false;
    public AuthMessage(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return this.userName;
    }

    public Target getTarget() {
        return this.target;
    }

    public void setTarget(Target t) {
        this.target = t;
    }

    public boolean isTemporary() {
        return this.temp;
    }

    public void setTemporary(boolean b) {
        this.temp = b;
    }

    public enum Target {
        API,
        WEB
    }
}
