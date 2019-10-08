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

import com.google.gson.internal.LazilyParsedNumber;

import java.io.Serializable;
import java.lang.reflect.Array;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface JsonElement extends Serializable {
    public boolean isJsonArray();

    public boolean isJsonObject();

    public boolean isJsonPrimitive();

    public JsonObject getAsJsonObject();

    public JsonArray getAsJsonArray();

    public JsonPrimitive getAsJsonPrimitive();

    public boolean isJsonNull();

    public static class Helper {
        public static JsonElement getElement(Object obj) {
            if (obj == null) {
                return new JsonPrimitive(JsonPrimitive.Null.get());
            } else if (obj instanceof JsonObject) {
                return (JsonObject) obj;
            } else if (obj instanceof JsonArray) {
                return (JsonArray) obj;
            } else if (obj instanceof Map) {
                return (JsonObject) obj;
            } else if (obj instanceof List) {
                return (JsonArray) obj;
            } else if (obj instanceof Object[]) {
                Object[] objArr = (Object[]) obj;
                JsonArray jArr = new JsonArray();
                for (Object v : objArr) {
                    jArr.add(v);
                }
                return jArr;
            } else {
                return new JsonPrimitive(obj);
            }
        }

        public static void checkAccepted(Object value) {
            if (!JsonObject.isAccepted(value) && !JsonArray.isAccepted(value) && !JsonPrimitive.isAccepted(value)) {
                throw new IllegalArgumentException("Unsupported value type " + value.getClass());
            }
        }

        @SuppressWarnings("unchecked")
        public static Object prepareToAdd(Object obj) {
            if (obj == null) {
                return obj;
            }
            checkAccepted(obj);
            if (JsonObject.class.isAssignableFrom(obj.getClass()) || JsonArray.class.isAssignableFrom(obj.getClass())) {
                return obj;
            } else if (JsonPrimitive.class.isAssignableFrom(obj.getClass())) {
                Object val = ((JsonPrimitive) obj).getValue();
                if (val instanceof Number) {
                    return ((Number) val).doubleValue();
                } else if (val instanceof LazilyParsedNumber) {
                    return ((LazilyParsedNumber) val).doubleValue();
                } else return val;
            } else if (Map.class.isAssignableFrom(obj.getClass())) {
                JsonObject jObj = new JsonObject();
                Map<String, ?> tgt = (Map<String, ?>) obj;
                for (Map.Entry<String, ?> e : tgt.entrySet()) {
                    jObj.put(e.getKey(), prepareToAdd(e.getValue()));
                }
                return jObj;
            } else if (List.class.isAssignableFrom(obj.getClass())) {
                JsonArray jArr = new JsonArray();
                List<?> tgt = (List<?>) obj;
                for (Object e : tgt) {
                    jArr.add(prepareToAdd(e));
                }
                return jArr;
            } else if (obj.getClass().isArray()) {
                JsonArray jArr = new JsonArray();
                int sz = Array.getLength(obj);
                for (int i = 0; i < sz; i++) {
                    Object e = Array.get(obj, i);
                    jArr.add(prepareToAdd(e));
                }
                return jArr;
            } else if (Set.class.isAssignableFrom(obj.getClass())) {
                JsonArray jArr = new JsonArray();
                Set<?> tgt = (Set<?>) obj;
                for (Object e : tgt) {
                    jArr.add(prepareToAdd(e));
                }
                return jArr;
            } else {
                return obj;
            }
        }
    }
}
