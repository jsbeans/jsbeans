package org.jsbeans.security;

public abstract class TokenIterable implements Runnable {
    private Token token = null;

    public Token getToken() {
        return this.token;
    }

    public void setToken(Token t) {
        this.token = t;
    }
}
