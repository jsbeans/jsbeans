package org.jsbeans.security;

import org.jsbeans.types.JsonObject;

public class CheckPermissionMessage extends PrincipalMessage<JsonObject> {
    private static final long serialVersionUID = -8953184341658426013L;
    private String userName;
    private String permission;
    private boolean use;

    public CheckPermissionMessage(String userName, String permission, boolean use) {
        this.userName = userName;
        this.permission = permission;
        this.use = use;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getPermission() {
        return permission;
    }

    public boolean getUse() {
        return use;
    }
}