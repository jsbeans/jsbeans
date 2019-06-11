/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.helpers;

import org.jsbeans.types.JsonArray;
import org.jsbeans.types.JsonObject;
import org.mozilla.javascript.ConsString;
import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.NativeObject;

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
