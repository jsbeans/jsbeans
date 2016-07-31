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
