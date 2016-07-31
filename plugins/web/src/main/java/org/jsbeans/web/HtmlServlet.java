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
