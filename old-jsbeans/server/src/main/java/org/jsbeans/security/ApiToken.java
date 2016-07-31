package org.jsbeans.security;

import org.jsbeans.helpers.ConfigHelper;

public class ApiToken extends Token {

    private long ttl;

    public ApiToken(String userName) {
        super(userName);
        this.ttl = ConfigHelper.getConfigInt("kernel.security.apiToken.ttl");
    }

    public ApiToken(String userName, long ttl) {
        super(userName);
        this.ttl = ttl;
    }

    @Override
    public boolean isExpired() {
        return System.currentTimeMillis() - this.getCreated() > this.ttl;
    }

}
