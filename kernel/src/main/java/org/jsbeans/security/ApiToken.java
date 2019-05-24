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

import org.jsbeans.helpers.ConfigHelper;

public class ApiToken extends Token {

    private long ttl;

    public ApiToken(String userName) {
        super(userName);
        this.ttl = ConfigHelper.getConfigInt("kernel.security.apiToken.ttl");
    }

    public ApiToken(String userName, long ttl) {
        super(userName);
        this.ttl = ttl;
    }

    @Override
    public boolean isExpired() {
        return System.currentTimeMillis() - this.getCreated() > this.ttl;
    }

}
