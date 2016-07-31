package org.jsbeans.utils;

import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.jsbeans.Config;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Helper for Nashorn JSON and serializations/deserializations
 */
public class JsonUtils {


    //    private static ThreadLocal<Gson> _gson = new ThreadLocal<>();
    private static Map<String, Object> json;
    private static Function<String, Map<String, Object>> resolver;

//    public static Gson gson() {
//        if (_gson.get() == null) {
//            Gson g = new Gson();
//            // TODO configure or patch Gson
//            _gson.set(g);
//        }
//        return _gson.get();
//    }

    /**
     * First if exists read file by relative or absolute path else try read resource
     */
    public static Map<String, Object> readJson(String resourceOrAbsoluteOrRelativeFile) {
        try {
            Path path = Config.absolutePath(resourceOrAbsoluteOrRelativeFile);
            if (path.toFile().exists() && path.toFile().isFile()) {
                // read file
                String json = new String(Files.readAllBytes(path));
                return parseJson(json);
            } else {
                // read resource
                InputStream is = resourceOrAbsoluteOrRelativeFile.startsWith("/")
                        ? Config.resourceHostClass.getResourceAsStream(resourceOrAbsoluteOrRelativeFile)
                        : Config.resourceHostClass.getResourceAsStream("/" + resourceOrAbsoluteOrRelativeFile);
                if (is == null) {
                    throw new FileNotFoundException("Resource not found");
                }
                Scanner s = new Scanner(is).useDelimiter("\\A");
                return parseJson(s.next());
            }
        } catch (IOException e) {
            throw ExceptionUtils.runtime("Read resource or file failed", e);
        }
    }

    public static Map<String, Object> emptyJson() {
        return new LinkedHashMap<>();
    }

    /**
     * Parse JSON string (object, array, or value) to ScriptObjectMirror
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> parseJson(String json) {
//        return gson().fromJson(json, jsonClass());
        return parseScriptObjectJson(json);
    }

    public static ScriptObjectMirror parseScriptObjectJson(String json) {
        return ScriptUtils.evalJson(json);
    }

    /**
     * Unwrap path kys with separators ".". Adds path objects and remove old path key value. Ignore "__*__" keys.
     */
    @SuppressWarnings("unchecked")
    public static void unwrapKeys(Map<String, Object> json) {
        json.keySet().stream()
                .filter(k -> k.contains(".") && !(k.startsWith("__") && k.endsWith("__")))
                .collect(Collectors.toList()).forEach(path -> {
            String[] keys = path.split("\\.");
            Object current = null;
            for (int i = 0; i < keys.length; i++) {
                if (i == 0) current = json;
                Map<String, Object> prev = (Map<String, Object>) current;
                current = prev.get(keys[i]);

                if (i < keys.length - 1) {
                    if (current == null) {
                        current = emptyJson();
                        prev.put(keys[i], current);
                    }
                } else {
                    prev.put(keys[i], json.get(path));
                    json.remove(path);
                }
            }
        });
        json.keySet().forEach(k -> {
            Object v = json.get(k);
            if (v != null) {
                if (v instanceof Map) {
                    unwrapKeys((Map<String, Object>) v);
                }
            }
        });
    }

    /**
     * Get __imports__ key values and merge
     */
    public static void resolveImports(Map<String, Object> json, Function<String, Map<String, Object>> resolver) {
        Optional.ofNullable(json.get("__imports__")).ifPresent(value -> {
            Collection<String> names = (Collection<String>) value;
            names.forEach(name -> {
                Map<String, Object> imp = resolver.apply(name);
                resolveImports(imp, resolver);
                JsonUtils.merge(json, imp);
            });
        });
        json.remove("__imports__");
    }

    /**
     * Simple merge some JSONs to mainJson
     */
    public static void merge(Map<String, Object> mainJson, Map<String, Object>... nextJsons) {
        for (Map<String, Object> nextJson : nextJsons) {
            merge(mainJson, nextJson);
        }
    }

    /**
     * Simple merge two JSONs to mainJson
     */
    public static void merge(Map<String, Object> mainJson, Map<String, Object> nextJson) {
        nextJson.entrySet().forEach(e -> {
            if (!mainJson.containsKey(e.getKey())) {
                mainJson.put(e.getKey(), e.getValue());
            } else {
                Object left = mainJson.get(e.getKey());
                Object right = nextJson.get(e.getKey());
                if (left instanceof Map && right instanceof Map) {
                    Map leftMap = (Map) left;
                    Map rightMap = (Map) right;
                    merge(leftMap, rightMap);
                } else if (left instanceof Collection && right instanceof Collection) {
                    List<Object> list = new ArrayList<>();
                    list.addAll((Collection) left);
                    list.addAll((Collection) right);
                }
            }
        });
    }

    @SuppressWarnings("unchecked")
    public static Object getByPath(Map<String, Object> json, String path) {
        String[] keys = path.split("\\.");
        Object cur = json;
        for (String k : keys) {
            if (cur instanceof Map) {
                Map<String, Object> valmap = (Map<String, Object>) cur;
                cur = valmap.get(k);
            } else if (cur == null) {
                return null;
            } else {
                throw new IllegalArgumentException("Key '" + k + "' is not Map in path '" + path + "'");
            }
        }
        return cur;
    }

    @SuppressWarnings("unchecked")
    public static void setByPath(Map<String, Object> json, String path, Object value) {
        String[] props = path.split("\\.");
        Map<String, Object> cur = json;
        for (int i = 0; i < props.length - 1; i++) {
            Object next = cur.get(props[i]);
            if (next == null) {
                next = Collections.singletonMap(props[i], next);
                cur = (Map<String, Object>) next;
            } else if (next instanceof Map) {
                cur = (Map<String, Object>) next;
            } else {
                throw new IllegalArgumentException("Key '" + props[i] + "' is not Map");
            }
        }
        cur.put(props[props.length - 1], value);
    }

    /**
     * Read "__class__" fields and replace to new instances of java Objects
     */
    public static <T> T jsonToJavaObjects(Map<String, Object> json) {
        class JsonToJavaConvertor {
            Object convert(Map<String, Object> map) {
                if (map.containsKey("__class__")) {
                    String className = map.get("__class__").toString();
                    try {
                        Class<?> clazz = Class.forName(className);
                        Object obj = clazz.newInstance();

                        map.forEach((k, v) -> {
                            try {
                                Field field = clazz.getField(k);
                                field.setAccessible(true);
                                Object value = convert(v);
                                field.set(obj, value);
                            } catch (NoSuchFieldException | IllegalAccessException e) {
                                // TODO log ignored java field
                            }
                        });
                    } catch (ClassNotFoundException | InstantiationException | IllegalAccessException e) {
                        // TODO log ignored java object
                    }
                }
                return map;
            }

            Object convert(Collection<Object> col) {
                return col.stream().map(this::convert).collect(Collectors.toList());
            }

            @SuppressWarnings("unchecked")
            Object convert(Object obj) {
                if (obj instanceof Map) {
                    return convert((Map<String, Object>) obj);
                } else if (obj instanceof Collection) {
                    return convert((Collection<Object>) obj);
                }
                return obj;
            }
        }
        return (T) new JsonToJavaConvertor().convert(json);
    }

    /**
     * Convert java Objects to Json map with serializable fields and class name in "__class__". Super classes to "__super__, interfaces to "__interfaces": {name:map}"
     */
    public static Object javaObjectsToJson(Object obj) {
//        class JavaToJson {
//            Object convert(Object obj) {
//                if (obj instanceof Map) {
//
//                } else if (obj instanceof Collection) {
////                    ((Collection) obj).stream().ma
//                } else if (obj.getClass().isPrimitive()) {
//                    return obj;
//                } else {
//                    Class<? extends Object> clazz = obj.getClass();
//                    Map<String, Object> map = emptyJson();
//                    Arrays.asList(obj.getClass().getFields()).forEach(field -> {
//                        field.setAccessible(true);
//                        Object v = null;
//                        try {
//                            v = field.get(obj);
//                            Object value = convertTo(v, field.getType());
//                            map.put(field.getName(), value);
//                        } catch (IllegalAccessException e) {
//                            // TODO log ignored field
//                        }
//                    });
//                    map.put("__class__", obj.getClass().getName());
//                    return map;
//                }
//            }
//
//            private Object convertTo(Object obj, Class<?> type) {
//                type.isArray();
//                // TODO
//                return null;
//            }
//        }
//        return new JavaToJson().convert(obj);
        return null;
    }
}
