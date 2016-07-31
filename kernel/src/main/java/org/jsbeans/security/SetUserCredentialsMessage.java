package org.jsbeans.security;

import org.jsbeans.types.JsonObject;

public class SetUserCredentialsMessage extends PrincipalMessage<Boolean> {
    private static final long serialVersionUID = -8953184341658426013L;
    private String userName;
    private JsonObject credentials;

    public SetUserCredentialsMessage(String userName, JsonObject credentials) {
        this.userName = userName;
        this.credentials = credentials;
    }

    public String getUserName() {
        return this.userName;
    }

    public JsonObject getCredentials() {
        return credentials;
    }
}