package org.jsbeans.helpers;

import org.jsbeans.types.JsonArray;
import org.jsbeans.types.JsonObject;
import org.jsbeans.types.JsonPrimitive;
import org.mozilla.javascript.ConsString;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Scriptable;

public class JsonHelper {

    public static Object nativeToJsonObject(Object obj){
        if (obj == null) {
            return null;
        } else if (obj instanceof NativeObject) {
            NativeObject nobj = (NativeObject) obj;
            JsonObject json = new JsonObject();
            for (Object propId : NativeObject.getPropertyIds(nobj)){
                String key = propId.toString();
                Object value = NativeObject.getProperty(nobj, key);
                json.put(key, nativeToJsonObject(value));
            }
            return json;
        } else if (obj instanceof NativeArray) {
            NativeArray array = (NativeArray) obj;
            JsonArray json = new JsonArray();
            for (Object element:array.getIds()){
                int index = (Integer) element;
                json.add(nativeToJsonObject(array.get(index)));

            }
            return json;
        } else if (obj instanceof String || obj instanceof ConsString) {
            return obj.toString();
        } else if (obj instanceof Boolean || obj instanceof Number) {
            return obj;
        } else {
            String strValue = obj.toString();
            return strValue;
        }
    }
}
