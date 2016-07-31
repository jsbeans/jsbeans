package org.jsbeans.serialization;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import org.jsbeans.types.JsObject;

import java.lang.reflect.Type;

public class JsObjectSerializer implements JsonSerializer<JsObject> {
    JsonParser jsonParser = new JsonParser();

    @Override
    public JsonElement serialize(JsObject src, Type typeOfSrc, JsonSerializationContext context) {
        try {
            String sss = src.toJS(false);
            return jsonParser.parse(sss);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
