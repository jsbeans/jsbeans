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

import java.util.UUID;

public abstract class Token {
    private String token;
    private String userName;
    private long created;
    private long lastUpdated;

    public Token(String userName) {
        this.userName = userName;
        this.lastUpdated = this.created = System.currentTimeMillis();
        this.token = UUID.randomUUID().toString();
    }

    public String getToken() {
        return this.token;
    }

    public abstract boolean isExpired();

    public String getUserName() {
        return this.userName;
    }

    public void update() {
        this.lastUpdated = System.currentTimeMillis();
    }

    public long getCreated() {
        return this.created;
    }

    public long getLastUpdated() {
        return this.lastUpdated;
    }

}
