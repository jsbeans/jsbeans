package org.jsbeans.security;

import org.jsbeans.helpers.ConfigHelper;

public class WebToken extends Token {

    private long inactivityExpireTimeout;

    public WebToken(String userName) {
        this(userName, ConfigHelper.getConfigLong("kernel.security.webToken.inactivityExpireTimeout"));
    }

    public WebToken(String userName, long inactivityExpireTimeout) {
        super(userName);
        this.inactivityExpireTimeout = inactivityExpireTimeout;
    }

    @Override
    public boolean isExpired() {
        return System.currentTimeMillis() - this.getLastUpdated() > this.inactivityExpireTimeout;
    }

}
