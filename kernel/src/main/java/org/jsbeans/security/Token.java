package org.jsbeans.security;

import java.util.UUID;

public abstract class Token {
    private String token;
    private String userName;
    private long created;
    private long lastUpdated;

    public Token(String userName) {
        this.userName = userName;
        this.lastUpdated = this.created = System.currentTimeMillis();
        this.token = UUID.randomUUID().toString();
    }

    public String getToken() {
        return this.token;
    }

    public abstract boolean isExpired();

    public String getUserName() {
        return this.userName;
    }

    public void update() {
        this.lastUpdated = System.currentTimeMillis();
    }

    public long getCreated() {
        return this.created;
    }

    public long getLastUpdated() {
        return this.lastUpdated;
    }

}
