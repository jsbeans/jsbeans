/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.web;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WebCache {
    private static Map<String, String> cacheMap = new ConcurrentHashMap<String, String>();

    public static void put(String key, String val) {
        cacheMap.put(key, val);
    }

    public static String get(String key) {
        return cacheMap.get(key);
    }

    public static void remove(String key) {
        if (cacheMap.containsKey(key)) {
            cacheMap.remove(key);
        }
    }

    public static boolean contains(String key) {
        return cacheMap.containsKey(key);
    }
}
