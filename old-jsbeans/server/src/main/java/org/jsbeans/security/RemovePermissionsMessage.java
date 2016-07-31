package org.jsbeans.security;

public class RemovePermissionsMessage extends PrincipalMessage<Integer> {
    private static final long serialVersionUID = -8953184341658426013L;
    private String userName;
    private String permission;
    private String permissionKey;

    public RemovePermissionsMessage(String userName, String permissionKey, String permission) {
        this.userName = userName;
        this.permission = permission;
        this.permissionKey = permissionKey;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getPermission() {
        return permission;
    }

    public String getPermissionKey() {
        return permissionKey;
    }
}