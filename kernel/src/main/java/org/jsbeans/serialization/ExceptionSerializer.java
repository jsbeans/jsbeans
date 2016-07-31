package org.jsbeans.serialization;

import com.google.gson.*;
import org.jsbeans.types.JsonObject;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.Type;

public class ExceptionSerializer implements JsonSerializer<Throwable>, JsonDeserializer<Exception> {

    @Override
    public Exception deserialize(com.google.gson.JsonElement arg0, Type arg1, JsonDeserializationContext arg2) throws JsonParseException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public com.google.gson.JsonElement serialize(Throwable ex, Type arg1, JsonSerializationContext arg2) {

        Writer result = new StringWriter();
        PrintWriter printWriter = new PrintWriter(result);
        ex.printStackTrace(printWriter);

        JsonObject json = new JsonObject();
        json.put("message", ex.getMessage());
        json.put("stackTrace", result.toString());
        json.put("stackTrace", result.toString());

        return GsonWrapper.toGsonJsonElement(json);
    }

}
