package org.jsbeans.security;

public class FullAccessToken extends Token {

    public FullAccessToken(String userName) {
        super(userName);
    }

    @Override
    public boolean isExpired() {
        return false;
    }

}
