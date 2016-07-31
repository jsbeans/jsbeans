package org.jsbeans.security;

import org.jsbeans.types.JsonObject;

public class GetUserCredentialsMessage extends PrincipalMessage<JsonObject> {
    private static final long serialVersionUID = -8953184341658426013L;
    private String userName;

    public GetUserCredentialsMessage(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return this.userName;
    }

}
