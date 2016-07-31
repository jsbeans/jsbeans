/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.web;

import org.jsbeans.types.JsonObject;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;

public class WebHelper {

    public static String extractHeadersFromRequest(HttpServletRequest req) {
        JsonObject hMap = new JsonObject();
        String hName = null;
        Enumeration<String> hNames = req.getHeaderNames();
        while (hNames.hasMoreElements()) {
            hName = hNames.nextElement();
            hMap.put(hName, req.getHeader(hName));
        }

        return hMap.toJson();
    }
}
