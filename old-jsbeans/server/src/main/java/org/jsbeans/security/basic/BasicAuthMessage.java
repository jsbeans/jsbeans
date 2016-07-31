package org.jsbeans.security.basic;

import org.jsbeans.security.Auth;
import org.jsbeans.security.AuthMessage;

@Auth(auth = BasicAuthenticator.class)
public class BasicAuthMessage extends AuthMessage {
    private static final long serialVersionUID = -3574566574473586943L;
    private String password;

    public BasicAuthMessage(String userName, String password) {
        super(userName);
        this.password = password;
    }

    public String getPassword() {
        return this.password;
    }
}
