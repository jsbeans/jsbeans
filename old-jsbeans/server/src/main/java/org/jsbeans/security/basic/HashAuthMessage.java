package org.jsbeans.security.basic;

import org.jsbeans.security.Auth;
import org.jsbeans.security.AuthMessage;

@Auth(auth = HashAuthenticator.class)
public class HashAuthMessage extends AuthMessage {
    private static final long serialVersionUID = -372841737163141211L;
    private String hash;

    public HashAuthMessage(String userName, String hash) {
        super(userName);
        this.hash = hash;
    }

    public String getHash() {
        return this.hash;
    }
}
