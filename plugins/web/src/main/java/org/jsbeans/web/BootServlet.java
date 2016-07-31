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
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BootServlet extends HttpServlet {
    private static final long serialVersionUID = -4914554821670876067L;

    private static String dwpJsFile = null;
    private static String dwpCssFile = null;
    private static String imgList = null;
    private static Pattern jsNumPat = Pattern.compile("^(\\d+)");
    private static Boolean isDebug = ConfigHelper.getConfigBoolean("web.debug");

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String respData = "";
        String resourceType = req.getParameter("type");
        if ("js".equals(resourceType)) {
            resp.setContentType("text/javascript");
            respData = this.handleDwpJs(req);
        } else if ("css".equals(resourceType)) {
            resp.setContentType("text/css");
            respData = this.handleDwpCss(req);
        }

        resp.getOutputStream().write(respData.getBytes("UTF-8"));
    }

    private String handleDwpCss(HttpServletRequest req) throws IOException {
        if (dwpCssFile == null) {
            dwpCssFile = this.combineDwp("boot/*.css");
        }
        return dwpCssFile;
    }

    private String handleDwpJs(HttpServletRequest req) throws IOException {
        if (dwpJsFile == null) {
            dwpJsFile = this.combineDwp("boot/*.js");
            if (isDebug == null || !isDebug.booleanValue()) {
                dwpJsFile = JsMinifier.minify(dwpJsFile, false);
            }
        }
        if (imgList == null) {
            imgList = this.combineImageNames("boot/images/**/*.*");
        }
        StringBuilder sb = new StringBuilder();
        sb.append(dwpJsFile);
        if (imgList != null && imgList.length() > 0) {
            sb.append(String.format("JSB().preloadImages([%s]); ", imgList));
        }
        String cName = req.getParameter("callback");
        if (cName != null) {
            sb.append(String.format("%s.call(window); ", cName));
        }
        return sb.toString();
    }

    private String combineImageNames(String pattern) {
        String retImgs = "";
        List<String> imgPaths = new ArrayList<>();
        for (String fld : ConfigHelper.getWebFolders()) {
            imgPaths.addAll(FileHelper.searchFiles(fld, pattern, true));
        }

        for (int i = 0; i < imgPaths.size(); i++) {
            String s = imgPaths.get(i).replace("\\", "/");
            retImgs += "'" + s + "'";
            if (i < imgPaths.size() - 1) {
                retImgs += ',';
            }
        }
        return retImgs;
    }

    private String combineDwp(String pattern) throws IOException {
        String retJs = "";

        List<String> jsPaths = new ArrayList<>();
        for (String fld : ConfigHelper.getWebFolders()) {
            jsPaths.addAll(FileHelper.searchFiles(fld, pattern));
        }

        Collections.sort(jsPaths, new Comparator<String>() {
            @Override
            public int compare(String arg0, String arg1) {
                String str0 = FileHelper.getFileNameByPath(arg0);
                String str1 = FileHelper.getFileNameByPath(arg1);

                String valStr0 = this.capture(str0);
                String valStr1 = this.capture(str1);

                if (valStr0 == null) {
                    return -1;
                } else if (valStr1 == null) {
                    return 1;
                }

                int val0 = Integer.parseInt(valStr0);
                int val1 = Integer.parseInt(valStr1);
                return val0 - val1;
            }

            private String capture(String str) {
                Matcher m = jsNumPat.matcher(str);
                if (m.find()) {
                    return m.group();
                }
                return null;
            }
        });
        for (String jsPath : jsPaths) {
            if (jsPath.endsWith("jsb.js")) {
                // get jsb body from
                String jsbPath = ConfigHelper.getConfigString("kernel.jsb.jsbEngineResource");
                retJs += FileHelper.readStringFromResource(jsbPath);
            } else {
                retJs += FileHelper.readStringFromFile(jsPath);
            }
        }

        // inject server version into JSB
        retJs += "; JSB().setServerVersion(\"" + ConfigHelper.getConfigString("build.version") + "\"); ";

        return retJs;
    }


}
