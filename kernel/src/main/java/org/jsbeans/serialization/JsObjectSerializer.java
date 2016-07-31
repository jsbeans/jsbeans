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
