package org.jsbeans.serialization;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import org.jsbeans.types.JsObject;

import java.lang.reflect.Type;

public class JsObjectDeserializer implements JsonDeserializer<JsObject> {

    @Override
    public JsObject deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context) throws JsonParseException {
        JsObject jObj = new JsObjectSerializerHelper().jsonElementToJsObject(json);
        return jObj;
    }

}
