/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.types;

import com.google.gson.Gson;
import org.jsbeans.serialization.GsonWrapper;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.util.*;

public class JsonObject extends LinkedHashMap<String, Object> implements JsonElement {
    private static final long serialVersionUID = 569641121458363583L;

    private static transient Set<Class<?>> acceptedTypes = new HashSet<Class<?>>();

    static {
        acceptedTypes.add(JsonObject.class);
        acceptedTypes.add(Map.class);
    }

    public static boolean isAccepted(Object value) {
        for (Class<?> cl : acceptedTypes) {
            if (cl.isAssignableFrom(value.getClass())) {
                return true;
            }
        }

        return false;
    }

    public static JsonObject parse(String json) {
        JsonObject rdf = new Gson().fromJson(json, JsonObject.class);
        return rdf;
    }

    public static JsonObject parse(InputStream json) {
        try {
            try(InputStreamReader reader = new InputStreamReader(json)) {
                JsonObject rdf = new Gson().fromJson(reader, JsonObject.class);
                return rdf;
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static JsonObject create(String key, Object value) {
        JsonObject json = new JsonObject();
        json.put(key, value);
        return json;
    }

    public static JsonObject create(@SuppressWarnings("unchecked") Tuple<String, Object>... tuples) {
        JsonObject json = new JsonObject();
        for (Tuple<String, Object> t : tuples) {
            json.put(t.getFirst(), t.getSecond());
        }
        return json;
    }

    public static <T extends JsonElement> T toJsonElement(Object val) {
        return (T) parse(GsonWrapper.toJson(val));
    }

    public static Object getPathValue(Object object, String keyName) {
        if (keyName == null) return null;
        Object keyValue = null;
        if (object instanceof JsonObject) {
            JsonObject json = (JsonObject) object;
            keyValue = json.getPathValue(keyName);
        } else {
            String[] fields = keyName.split("\\.");
            Object cur = object;
            for (String f : fields) {
                try {
                    Field field = cur.getClass().getField(f);
                    cur = field.get(cur);
                } catch (NoSuchFieldException | SecurityException | IllegalArgumentException | IllegalAccessException e) {
                    throw new IllegalArgumentException("Field '" + f + "' in key path '" + keyName + "' not exist");
                }
            }
            keyValue = cur;
        }
        return keyValue;
    }


    public static void setPathValue(JsonObject obj, String path, Object val) {
        setPathValue(obj, path, val, false);
    }

    public static void setPathValue(JsonObject obj, String path, Object value, boolean removeNull) {
        String[] props = path.split("\\.");
        JsonObject cur = obj;
        for (int i = 0; i < props.length - 1; i++) {
            Object next = cur.get(props[i]);
            if (next == null) {
                if (value == null && removeNull) {
                    // skip set null
                    return;
                }
                next = new JsonObject();
                cur.put(props[i], next);
                cur = (JsonObject) next;
            } else if (next instanceof JsonObject) {
                cur = (JsonObject) next;
            } else {
                throw new IllegalArgumentException("Property '" + props[i] + "' is not JsonObject");
            }
        }
        String lastKey = props[props.length - 1];
        if (value == null && removeNull) {
            cur.remove(lastKey);
        } else {
            cur.put(lastKey, value);
        }
    }

    @Override
    public int size() {
        return super.size();
    }

    @Override
    public boolean isEmpty() {
        return super.isEmpty();
    }

    @Override
    public boolean containsKey(Object key) {
        return super.containsKey(key);
    }

    public boolean containsProperty(Object key) {
        return containsKey(key);
    }

    @Override
    public boolean containsValue(Object value) {
        JsonElement.Helper.checkAccepted(value);
        return super.containsValue(value);
    }

    @Override
    public Object get(Object prop) {
        Object obj = super.get(prop.toString());
        return obj;
    }

    @SuppressWarnings("unchecked")
    public <T> T get(String prop) {
        return (T) get((Object) prop);
    }

    public JsonElement getElement(String prop) {
        Object obj = get((Object) prop);
        return JsonElement.Helper.getElement(obj);
    }

    public Integer getAsInteger(String prop) {
        Object v = get(prop);
        if (v == null || v instanceof Integer) return (Integer) v;
        Double d = this.getAsDouble(prop);
        return d.intValue();
    }

    public Integer getSafeInteger(String prop) {
        Object value = get(prop);
        if (value instanceof Integer) {
            return (Integer) value;
        }

        if (value instanceof Long) {
            Long lValue = (Long) value;
            return lValue.intValue();
        }

        if (value instanceof Float) {
            Float fValue = (Float) value;
            return fValue.intValue();
        }

        if (value instanceof Double) {
            Double dValue = (Double) value;
            return dValue.intValue();
        }

        return null;
    }

    public Byte getAsByte(String prop) {
        return (Byte) get(prop);
    }

    public Long getAsLong(String prop) {
        return (Long) get(prop);
    }

    public Short getAsShort(String prop) {
        return (Short) get(prop);
    }

    public Character getAsCharacter(String prop) {
        return (Character) get(prop);
    }

    public Float getAsFloat(String prop) {
        return (Float) get(prop);
    }

    public Double getAsDouble(String prop) {
        return (Double) get(prop);
    }

    public String getAsString(String prop) {
        return (String) get(prop);
    }

    public Boolean getAsBoolean(String prop) {
        return (Boolean) get(prop);
    }

    public JsonArray getAsArray(String prop) {
        return get(prop);
    }

    public JsonObject getAsJson(String prop) {
        return (JsonObject) get(prop);
    }

    public Map<String, Object> getAsMap(String prop) {
        return getAsJson(prop);
    }

    @Override
    public Object put(String key, Object value) {
        Object obj = JsonElement.Helper.prepareToAdd(value);
        return super.put(key, obj);
    }

    public Object put(Tuple<String, Object> tuple) {
        return put(tuple.getFirst(), JsonElement.Helper.prepareToAdd(tuple.getSecond()));
    }

    @Override
    public Object remove(Object key) {
        return super.remove(key);
    }

    @Override
    public void putAll(Map<? extends String, ? extends Object> m) {
        for (java.util.Map.Entry<? extends String, ? extends Object> e : m.entrySet()) {
            this.put(e.getKey(), e.getValue());
        }
    }

    public void putAll_(Map<String, Object> m) {
        for (java.util.Map.Entry<? extends String, ? extends Object> e : m.entrySet()) {
            this.put(e.getKey(), e.getValue());
        }
    }

    @Override
    public void clear() {
        super.clear();
    }

    @Override
    public Set<String> keySet() {
        return super.keySet();
    }

    public Set<String> getProperties() {
        return keySet();
    }

    @Override
    public Collection<Object> values() {
        return super.values();
    }

    @Override
    public Set<java.util.Map.Entry<String, Object>> entrySet() {
        return super.entrySet();
    }

    @Override
    public String toString() {
        return GsonWrapper.toJson(this, true);
    }

    public String toJson() {
        return GsonWrapper.toJson(this);
    }

    public JsonObject clone() {
        return parse(toString());
    }

    @Override
    public boolean isJsonArray() {
        return false;
    }

    @Override
    public boolean isJsonObject() {
        return true;
    }

    @Override
    public boolean isJsonPrimitive() {
        return false;
    }

    @Override
    public boolean isJsonNull() {
        return false;
    }

    @Override
    public JsonObject getAsJsonObject() {
        return this;
    }

    @Override
    public JsonArray getAsJsonArray() {
        throw new UnsupportedOperationException(getClass().getSimpleName());
    }

    @Override
    public JsonPrimitive getAsJsonPrimitive() {
        throw new UnsupportedOperationException(getClass().getSimpleName());
    }

    public Object getPathValue(String path) {
        String[] props = path.split("\\.");
        Object cur = this;
        for (String p : props) {
            if (cur instanceof JsonObject) {
                JsonObject json = (JsonObject) cur;
                cur = json.get(p);
            } else if (cur == null) {
                return null;
            } else {
                throw new IllegalArgumentException("Property '" + p + "' is not JsonObject in path '" + path + "'");
            }
        }
        return cur;
    }

    public void setPathValue(String path, Object value) {
        setPathValue(this, path, value);
    }

}
