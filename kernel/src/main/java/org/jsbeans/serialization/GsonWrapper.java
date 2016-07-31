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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;
import org.jsbeans.types.JsObject;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

public class GsonWrapper {
    private static Gson gson = null;
    private static Gson prettyGson = null;
    private static List<GsonAdapterFactory> adapterFactories = new ArrayList<GsonAdapterFactory>();

    public static synchronized void registerAdapterFactory(GsonAdapterFactory gaf) {
        gson = null;
        prettyGson = null;
        adapterFactories.add(gaf);
    }

    private static GsonBuilder createBuilder() {
        GsonBuilder gb = new GsonBuilder();
        Type clsType = new TypeToken<Class<?>>() {
        }.getType();
        gb.registerTypeAdapter(clsType, new ClassDeserializer());
        gb.registerTypeAdapter(JsObject.class, new JsObjectDeserializer());
        gb.registerTypeAdapter(JsObject.class, new JsObjectSerializer());
        gb.registerTypeHierarchyAdapter(org.jsbeans.types.JsonElement.class, new JsonElementSerializer());
        gb.registerTypeHierarchyAdapter(Throwable.class, new ExceptionSerializer());
        gb.registerTypeAdapterFactory(new WrapperTypeAdapterFactory());
        for (GsonAdapterFactory gaf : adapterFactories) {
            gaf.onRegisterAdapter(gb);
        }
        gb.serializeNulls();
        return gb;
    }

    public static JsonElement toGsonJsonElement(Object obj) {
        return getGson().toJsonTree(obj);
    }

    public static <T> T fromJson(String json, Class<T> cls) {
        return getGson().fromJson(json, cls);
    }

    public static String toJson(Object val) {
        return toJson(val, false);
    }

    public static String toJson(Object val, boolean pretty) {
        return (pretty ? getPrettyGson() : getGson()).toJson(val);
    }

    public static Gson getGson() {
        if (gson == null) {
            gson = createBuilder().create();
        }
        return gson;
    }

    public static Gson getPrettyGson() {
        if (prettyGson == null) {
            prettyGson = createBuilder().setPrettyPrinting().create();
        }
        return prettyGson;
    }

    public static Gson getGson(boolean pretty) {
        return pretty ? getPrettyGson() : getGson();
    }

    public interface GsonAdapterFactory {
        public void onRegisterAdapter(GsonBuilder gb);
    }

}
