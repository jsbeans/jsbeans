/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.security.basic;

import org.jsbeans.security.Auth;
import org.jsbeans.security.AuthMessage;

@Auth(auth = HashAuthenticator.class)
public class HashAuthMessage extends AuthMessage {
    private static final long serialVersionUID = -372841737163141211L;
    private String hash;

    public HashAuthMessage(String userName, String hash) {
        super(userName);
        this.hash = hash;
    }

    public String getHash() {
        return this.hash;
    }
}
