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

import org.jsbeans.helpers.ConfigHelper;

public class WebToken extends Token {

    private long inactivityExpireTimeout;

    public WebToken(String userName) {
        this(userName, ConfigHelper.getConfigLong("kernel.security.webToken.inactivityExpireTimeout"));
    }

    public WebToken(String userName, long inactivityExpireTimeout) {
        super(userName);
        this.inactivityExpireTimeout = inactivityExpireTimeout;
    }

    @Override
    public boolean isExpired() {
        return System.currentTimeMillis() - this.getLastUpdated() > this.inactivityExpireTimeout;
    }

}
