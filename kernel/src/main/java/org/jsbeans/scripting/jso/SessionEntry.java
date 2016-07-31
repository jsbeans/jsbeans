/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.scripting.jso;

import java.util.HashMap;
import java.util.Map;

public class SessionEntry {
    private Map<String, RpcEntry> idMap = new HashMap<String, RpcEntry>();
    private Long lastUpdated = System.currentTimeMillis();

    public Map<String, RpcEntry> getMap() {
        return this.idMap;
    }

    public void update() {
        this.lastUpdated = System.currentTimeMillis();
    }

    public long getLastUpdated() {
        return this.lastUpdated;
    }
};
