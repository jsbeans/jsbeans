package org.jsbeans.security;

import org.jsbeans.types.JsonObject;

public class AddPermissionsMessage extends PrincipalMessage<Boolean> {
    private static final long serialVersionUID = -8953184341658426013L;
    private String userName;
    private String permissionKey;
    private JsonObject permissions;

    public AddPermissionsMessage(String userName, String permissionKey, JsonObject permissions) {
        this.userName = userName;
        this.permissionKey = permissionKey;
        this.permissions = permissions;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getPermissionKey() {
        return permissionKey;
    }

    public JsonObject getPermissions() {
        return permissions;
    }
}