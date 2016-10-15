package ru.avicomp.ontoed.json;

import java.util.Map;

public class JsonPathAccessor {
    public static String pathSplitterPrefix = "\\.|/";

    @SuppressWarnings("unchecked")
    public static <T> T get(Map<String, Object> json, String path) {
        String[] props = path.split(pathSplitterPrefix);

        Map<String, Object> current = json;
        for (int i = 0; i < props.length; i++) {
            String prop = props[i];
            Object value = current.get(prop);
            if (i == props.length - 1) {
                return (T) value;
            } else if (value instanceof Map) {
                current = (Map<String, Object>) value;
            } else {
                return null;
            }
        }
        return null;

    }

    @SuppressWarnings("unchecked")
    public static <T> void set(Map<String, Object> json, String path, T value) {
        String[] props = path.split(pathSplitterPrefix);
        Map<String, Object> current = json;
        for (int i = 0; i < props.length-1; i++) {
            String prop = props[i];
            Object v = current.get(prop);
            if (v instanceof Map) {
                current = (Map<String, Object>) v;
            } else {
                Map<String, Object> middleJson = JsonJava.emptyJsonObject();
                current.put(prop, middleJson);
                current = middleJson;
            }
        }
        String key = props[props.length - 1];
        if (value == null) {
            current.remove(key);
        } else {
            current.put(key, value);
        }
    }
}
