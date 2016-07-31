/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.serialization;

import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WrapperTypeAdapterFactory implements TypeAdapterFactory {
    private static final Map<TypeToken<?>, TypeAdapter<?>> typeTokenCache = Collections.synchronizedMap(new HashMap<TypeToken<?>, TypeAdapter<?>>());
    private static Map<String, Class<?>> builtInMap = new ConcurrentHashMap<String, Class<?>>();

    static {
        builtInMap.put("int", Integer.TYPE);
        builtInMap.put("long", Long.TYPE);
        builtInMap.put("double", Double.TYPE);
        builtInMap.put("float", Float.TYPE);
        builtInMap.put("bool", Boolean.TYPE);
        builtInMap.put("boolean", Boolean.TYPE);
        builtInMap.put("char", Character.TYPE);
        builtInMap.put("byte", Byte.TYPE);
        builtInMap.put("void", Void.TYPE);
        builtInMap.put("short", Short.TYPE);
    }

    JsonParser jsonParser = new JsonParser();

    @Override
    public <T> TypeAdapter<T> create(Gson gson, final TypeToken<T> type) {

        if (type.getRawType().isPrimitive() || type.getRawType().isArray()) {
            return null;
        }

        TypeAdapter<?> cached = typeTokenCache.get(type);
        if (cached == null) {
            cached = gson.getDelegateAdapter(this, type);
            typeTokenCache.put(type, cached);
        }
        @SuppressWarnings("unchecked")
        final TypeAdapter<T> delegate = (TypeAdapter<T>) cached;
        final Gson gs = gson;

        return new TypeAdapter<T>() {
            public void write(JsonWriter out, T value) throws IOException {
                delegate.write(out, value);
            }

            public T read(JsonReader in) throws IOException {
                JsonElement jElt = jsonParser.parse(in);
                if (jElt.isJsonObject()) {
                    JsonObject jObj = jElt.getAsJsonObject();
                    JsonElement typeElt = jObj.get("__type__");
                    JsonElement valElt = jObj.get("__value__");
                    if (typeElt != null && valElt != null) {
                        String typeName = typeElt.getAsString();
                        try {
                            @SuppressWarnings("unchecked")
                            Class<T> t = (Class<T>) (builtInMap.containsKey(typeName) ? builtInMap.get(typeName) : Class.forName(typeName));
                            return gs.fromJson(valElt, t);
                        } catch (ClassNotFoundException e) {
                            new IOException(e);
                        }
                    }
                }

                return delegate.fromJsonTree(jElt);
            }
        };
    }

}
