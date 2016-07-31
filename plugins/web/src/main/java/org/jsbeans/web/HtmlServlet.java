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

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.helpers.FileHelper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.NoSuchFileException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class HtmlServlet extends HttpServlet {
    private static final long serialVersionUID = -8296915688181389972L;
    static Map<String, String> cacheMap = new ConcurrentHashMap<String, String>();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            resp.getOutputStream().write(this.processHtml(req.getRequestURI()).getBytes("UTF-8"));
        } catch (NoSuchFileException e) {
            resp.sendError(404);
        } catch (Exception e) {
            resp.sendError(500, e.getMessage());
        }
    }

    private String processHtml(String requestURI) throws IOException {
        if (cacheMap.containsKey(requestURI)) {
            return cacheMap.get(requestURI);
        }
        String htmlText = null;
        for (String fld : ConfigHelper.getWebFolders()) {
            List<String> paths = FileHelper.searchFiles(fld, requestURI);
            if (paths.size() == 0) {
                continue;

            }
            try {
                htmlText = FileHelper.readStringFromFile(paths.get(0));
                break;
            } catch (NoSuchFileException e) {
                htmlText = null;
            }
        }
        if (htmlText == null) {
            throw new NoSuchFileException(requestURI);
        }

        // replace server version
        htmlText = htmlText.replaceAll("\\{\\{VERSION\\}\\}", ConfigHelper.getConfigString("build.version"));

        cacheMap.put(requestURI, htmlText);
        return htmlText;
    }


}
