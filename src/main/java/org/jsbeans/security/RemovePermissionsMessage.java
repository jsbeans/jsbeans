/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

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