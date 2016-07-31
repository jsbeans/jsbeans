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
