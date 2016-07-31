package org.jsbeans.utils;

import java.lang.reflect.Modifier;
import java.util.stream.Collectors;

public class JsonJava {

    public static Object unwrapToJson(Object javaObject) {
        if (javaObject == null) {
            return null;
        } else if (javaObject instanceof String) {
            return javaObject.toString();
        } else if (javaObject instanceof Number) {
            return ((Number) javaObject).doubleValue();
        } else if (javaObject.getClass().isArray() ||
                javaObject instanceof Iterable ||
                javaObject instanceof Enumeration) {
            return unwrapToJson(javaObject.getClass().isArray()
                    ? Arrays.asList((Object[]) javaObject)
                    : (Collection<Object>) javaObject);
        } else if (javaObject instanceof Map) {
            Map map = (Map) javaObject;
            if (map.size() == 0) return JsonUtils.emptyJson();
            if (map.keySet().iterator().next() instanceof String) {
                return unwrapToJson((Map<String, Object>) javaObject);
            }
        }

        Class<? extends Object> clazz = javaObject.getClass();
        return unwrapToJson(javaObject, clazz);
    }

    public static Object wrapToJava(Object jsonObject) {
        if (jsonObject == null) {
            return null;
        } else if (jsonObject instanceof String) {
            return jsonObject.toString();
        } else if (jsonObject instanceof Number) {
            return ((Number) jsonObject).doubleValue();
        } else if (jsonObject.getClass().isArray() ||
                jsonObject instanceof Collection) {
            return wrapToJava(jsonObject.getClass().isArray()
                    ? Arrays.asList((Object[]) jsonObject)
                    : (Collection<Object>) jsonObject);
        } else {
            Map map = (Map) jsonObject;
            if (map.size() == 0) return jsonObject;
            return wrapToJava((Map<String, Object>) jsonObject);
        }
    }

    private static Map<String, Object> unwrapToJson(Object javaObject, Class<?> clazz) {
        Map<String, Object> map = JsonUtils.emptyJson();
        map.put("__class__", clazz.getName());

        Arrays.asList(clazz.getDeclaredFields()).stream()
                .filter(field -> !Modifier.isTransient(field.getModifiers()))
                .forEach(field -> {
                    field.setAccessible(true);
                    try {
                        map.put(field.getName(), field.get(javaObject));
                    } catch (IllegalAccessException e) {
                        // TODO log ignored field
                    }
                });

        if (clazz.getSuperclass() != null && clazz.getSuperclass().getSuperclass() != null) {
            map.put("__super__", unwrapToJson(javaObject, clazz.getSuperclass()));
        }

        // for static fields
        List<Class<?>> ifaces = Arrays.asList(clazz.getInterfaces());
        if (ifaces.size() > 0) {
            map.put("__interfaces__",
                    ifaces.stream().map(
                            (iface) -> unwrapToJson(javaObject, iface)).collect(Collectors.toList()));
        }
        return map;
    }

    private static Collection<Object> unwrapToJson(Collection<Object> javaCollection) {
        return javaCollection.stream().map(o -> unwrapToJson(o)).collect(Collectors.toList());
    }

    private static Map<String, Object> unwrapToJson(Map<String, Object> javaMap) {
        Map<String, Object> json = JsonUtils.emptyJson();
        javaMap.forEach((k, v) -> json.put(k, unwrapToJson(v)));
        return json;
    }

    private static Collection<Object> wrapToJava(Collection<Object> jsonObject) {
        return jsonObject.stream().map(o -> wrapToJava(o)).collect(Collectors.toList());
    }

    private static Object wrapToJava(Map<String, Object> jsonObject) {
        try {
            if (jsonObject.containsKey("__class__")) {
                Class<?> clazz = Class.forName(jsonObject.get("__class__").toString());
                return wrapToJava(jsonObject, clazz, null);
            } else {
                LinkedHashMap<Object, Object> map = new LinkedHashMap<>(jsonObject.size());
                Map<String, Object> json = JsonUtils.emptyJson();
                jsonObject.forEach((k, v) -> map.put(k, wrapToJava(v)));
                return map;
            }
        } catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
            return ExceptionUtils.runtime("Unwrap JSON to java Object failed", e);
        }
    }

    private static Object wrapToJava(Map<String, Object> jsonObject, Class<?> clazz, Object obj) throws IllegalAccessException, InstantiationException {
        if (obj == null) {
            obj = clazz.newInstance();
        }
        Object instance = obj;

        Arrays.asList(clazz.getDeclaredFields()).stream()
                .filter(field -> !Modifier.isTransient(field.getModifiers()))
                .forEach(field -> {
                    field.setAccessible(true);
                    try {
                        Object v = jsonObject.get(field.getName());
                        Object value = wrapToJava(v, field.getType());
                        field.set(instance, value);
                    } catch (IllegalAccessException e) {
                        // TODO log ignored field
                    }
                });

        if (clazz.getSuperclass().getSuperclass() != null && jsonObject.containsKey("__super__")) {
            Map<String, Object> superJson = (Map<String, Object>) jsonObject.get("__super__");
            wrapToJava(superJson, clazz.getSuperclass(), instance);
        }

        // for static fields
        for (Class<?> iface : Arrays.asList(clazz.getInterfaces())) {
            wrapToJava(jsonObject, iface, instance);
        }

        return instance;
    }

    private static Object wrapToJava(Object value, Class<?> type) {
        if (value == null) {
            return null;
        } else if (String.class.equals(type)) {
            return value.toString();
        } else if (Number.class.isAssignableFrom(type) || type.isPrimitive()) {
            Number number = (Number) value;
            if (type.equals(Integer.class) || type.equals(int.class)) {
                return number.intValue();
            } else if (type.equals(Short.class) || type.equals(short.class)) {
                return number.shortValue();
            } else if (type.equals(Byte.class) || type.equals(byte.class)) {
                return number.byteValue();
            } else if (type.equals(Float.class) || type.equals(float.class)) {
                return number.floatValue();
            } else {
                return number.doubleValue();
            }
        } else if (type.getClass().isArray()) {
            return wrapToJava((Collection<Object>) value).toArray();
        } else if (Collection.class.isAssignableFrom(type)) {
            return wrapToJava((Collection<Object>) value);
        }

        return wrapToJava(value);
    }
}
