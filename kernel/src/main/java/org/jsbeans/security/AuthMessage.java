/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.security;

import org.jsbeans.messages.AbstractMessage;

public class AuthMessage extends AbstractMessage<String> {
    private static final long serialVersionUID = -201552780645905785L;
    private String userName;
    private Target target = Target.API;
    private boolean temp = false;
    public AuthMessage(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return this.userName;
    }

    public Target getTarget() {
        return this.target;
    }

    public void setTarget(Target t) {
        this.target = t;
    }

    public boolean isTemporary() {
        return this.temp;
    }

    public void setTemporary(boolean b) {
        this.temp = b;
    }

    public enum Target {
        API,
        WEB
    }
}
