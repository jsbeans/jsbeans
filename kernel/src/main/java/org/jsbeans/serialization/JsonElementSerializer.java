package org.jsbeans.serialization;

import com.google.gson.*;
import org.jsbeans.types.JsonArray;
import org.jsbeans.types.JsonElement;
import org.jsbeans.types.JsonObject;
import org.jsbeans.types.JsonPrimitive;

import java.lang.reflect.Type;

public class JsonElementSerializer implements JsonSerializer<JsonElement>, JsonDeserializer<JsonElement> {

    private Gson gson;

    {
        GsonBuilder gb = new GsonBuilder();
        gb.serializeNulls();
        gson = gb.create();
    }

    @SuppressWarnings("unchecked")
    @Override
    public JsonElement deserialize(com.google.gson.JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        Class<? extends JsonElement> cls = (Class<? extends JsonElement>) typeOfT;
        if (json.isJsonObject() && (JsonObject.class.isAssignableFrom(cls) || cls.isAssignableFrom(JsonObject.class))) {
            if (cls.equals(JsonElement.class)) {
                return gson.fromJson(json, JsonObject.class);
            }
            return gson.fromJson(json, cls);
        } else if (json.isJsonArray() && (JsonArray.class.isAssignableFrom(cls) || cls.isAssignableFrom(JsonArray.class))) {
            if (cls.equals(JsonElement.class)) {
                return gson.fromJson(json, JsonArray.class);
            }
            return gson.fromJson(json, cls);
        } else if (json.isJsonPrimitive()) {
            com.google.gson.JsonPrimitive p = json.getAsJsonPrimitive();
            if (p.isBoolean()) {
                return new JsonPrimitive(p.getAsBoolean());
            } else if (p.isNumber()) {
                return new JsonPrimitive(p.getAsNumber());
            } else if (p.isString()) {
                return new JsonPrimitive(p.getAsString());
            } else {
                throw new IllegalArgumentException("Unknown primitive type");
            }
        } else {
            throw new IllegalArgumentException("Unexpected JSON: " + json.toString());
        }
    }

    @Override
    public com.google.gson.JsonElement serialize(JsonElement src, Type typeOfSrc, JsonSerializationContext context) {
        if (src instanceof JsonPrimitive) {
            return GsonWrapper.toGsonJsonElement(src.getAsJsonPrimitive().getValue());
        }
        return gson.toJsonTree(src, typeOfSrc);
    }

}
