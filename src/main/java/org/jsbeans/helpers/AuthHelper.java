/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.helpers;

import org.jsbeans.PlatformException;

import java.io.IOException;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.security.MessageDigest;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

//import com.warrenstrange.googleauth.GoogleAuthenticator;

public class AuthHelper {
    private static volatile Map<String, String> cookies;

    public static boolean checkAuthKey(String secretKey, int token) {
        return true;
/*		
        GoogleAuthenticator gAuth = new GoogleAuthenticator();
		return gAuth.authorize(secretKey, token);
*/
    }

    public static String md5(String s) {
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(s.getBytes("UTF-8"));
            BigInteger bigInt = new BigInteger(1, digest);
            StringBuilder sb = new StringBuilder(bigInt.toString(16));
            int count = 32 - sb.length();
            while (count-- > 0) {
                sb.insert(0, '0');
            }
            return sb.toString().toUpperCase();
        } catch (Exception e) {
        }
        return null;
    }

    public static Map<String, String> getCookies() {
        return cookies == null ? cookies : Collections.unmodifiableMap(cookies);
    }

    public static void updateHttpClientCookie(String name, String value) {
        if(cookies == null) {
            synchronized (AuthHelper.class) {
                if(cookies == null) {
                    cookies = new ConcurrentHashMap<>();
                }
            }
        }
        cookies.put(name, value);
    }

    public static boolean httpClientAuthEnabled() {
        return ConfigHelper.has("kernel.security.httpClientCheckAuthUrl") &&
                ConfigHelper.getConfigString("kernel.security.httpClientCheckAuthUrl").length() > 5;
    }

    public static boolean checkHttpClientAuth() {
        try {
            String url = ConfigHelper.getConfigString("kernel.security.httpClientCheckAuthUrl");

            HttpURLConnection http = (HttpURLConnection) new URL(url).openConnection();
            http.setRequestMethod("GET");
            http.setConnectTimeout(15000);
            http.setReadTimeout(15000);
            http.setRequestProperty("charset", "UTF-8");

            http.setInstanceFollowRedirects(true);

            Map<String, String> cookies = AuthHelper.getCookies();
            if (cookies != null) {
                http.setRequestProperty("Cookie", cookies.entrySet()
                        .stream()
                        .map(e -> e.getKey() + "=" + e.getValue())
                        .collect(Collectors.joining("; ")));
            }

            String location = null;
            switch (http.getResponseCode())
            {
                case HttpURLConnection.HTTP_MOVED_PERM:
                case HttpURLConnection.HTTP_MOVED_TEMP:
                    location = http.getHeaderField("Location");
                    if(location != null) {
                        location = URLDecoder.decode(location, "UTF-8");
                    }
                case HttpURLConnection.HTTP_OK:
                    if(location == null) {
                        location = http.getURL().toString();
                    }
                    String targetUrl = ConfigHelper.getConfigString("kernel.security.httpClientCheckAuthTargetUrl");
                    if (targetUrl.equalsIgnoreCase(location)) {
                        return true;
                    }
                    return false;
            }
            return false;
        } catch (IOException e) {
            throw new PlatformException(e);
        }
    }
}