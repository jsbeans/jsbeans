/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

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