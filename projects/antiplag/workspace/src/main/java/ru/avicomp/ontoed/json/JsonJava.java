package ru.avicomp.ontoed.json;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Atlas Json <-> java native Map
 * */
@SuppressWarnings("unchecked")
public class JsonJava {

    public static class JsonBuilder {
        Map<String, Object> jsonObject = emptyJsonObject();

        public JsonBuilder put(String key, Object value) {
            jsonObject.put(key, value);
            return this;
        }

        public Map<String, Object> get() {
            return jsonObject;
        }
    }

    public static Object toJava(Object json) {
        if (json instanceof JSONObject) {
            return toJava((JSONObject) json);
        }
        if (json instanceof JSONArray) {
            return toJava((JSONArray) json);
        }
        return json;
    }

    public static Map<String, Object> toJava(JSONObject jsonObject) {
        Map<String, Object> jsonMap = emptyJsonObject(jsonObject.size());
        jsonObject.entrySet().stream().forEach(x -> {
            Map.Entry e = (Map.Entry) x;
            jsonMap.put(e.getKey().toString(), toJava(e.getValue()));
        });
        return jsonMap;
    }

    public static <T> T getAny(Map<String, Object> json, String ... props) {
        for (int i = 0; i < props.length; i++) {
            if (json.containsKey(props[i])) {
                return (T) json.get(props[i]);
            }
        }
        return null;
    }

    public static String stringify(Object json) {
        return toJson(json).toString();
    }

    public static LinkedHashMap<String, Object> emptyJsonObject() {
        return emptyJsonObject(0);
    }

    public static LinkedHashMap<String, Object> emptyJsonObject(int size) {
        return new LinkedHashMap<>(size);
    }

    public static JsonBuilder buildJsonObject() {
        return new JsonBuilder();
    }

    public static JsonBuilder buildJsonObject(String prop, Object val) {
        return buildJsonObject().put(prop, val);
    }

    public static List<Object> toJava(JSONArray jsonArray) {
        return (List<Object>) jsonArray.stream()
                .map(JsonJava::toJava)
                .collect(Collectors.toList());
    }

    public static <JsonValue> JsonValue toJson(Object value) {
        if (value instanceof Map && !(value instanceof JSONObject)) {
            return (JsonValue) toJson((Map) value);
        }
        if (value instanceof Iterable && !(value instanceof JSONArray)) {
            return (JsonValue) toJson((Iterable) value);
        }
        return (JsonValue) value;
    }

    public static JSONObject toJson(Map<String, Object> jsonObject) {
        JSONObject json = new JSONObject();
        jsonObject.entrySet().forEach(e -> json.put(e.getKey(), toJson(e.getValue())));
        return json;
    }

    public static JSONArray toJson(Iterable array) {
        JSONArray jsonArray = new JSONArray();
        array.forEach(val -> jsonArray.add(toJson(val)));
        return jsonArray;
    }


    public static void write(OutputStream outputStream, Map<String, Object> javaJson) {
        try (OutputStreamWriter writer = new OutputStreamWriter(outputStream)) {
            JSONValue.writeJSONString(JsonJava.toJson(javaJson), writer);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static <T> T parse(InputStream readerInputStream) {
        try {
            return (T) toJava(
                    JSONValue.parseWithException(new InputStreamReader(readerInputStream)));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
