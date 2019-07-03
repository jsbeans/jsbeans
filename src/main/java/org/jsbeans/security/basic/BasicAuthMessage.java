/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.security.basic;

import org.jsbeans.security.Auth;
import org.jsbeans.security.AuthMessage;

@Auth(auth = BasicAuthenticator.class)
public class BasicAuthMessage extends AuthMessage {
    private static final long serialVersionUID = -3574566574473586943L;
    private String password;

    public BasicAuthMessage(String userName, String password) {
        super(userName);
        this.password = password;
    }

    public String getPassword() {
        return this.password;
    }
}