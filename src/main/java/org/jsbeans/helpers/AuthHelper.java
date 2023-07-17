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

import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.security.MessageDigest;
import java.security.Principal;

public class AuthHelper {

    public interface ClientAuthLogin {
        void login();
        void logout();
        String getUser();
        String getToken();
        String getType();
    }

    public static volatile ClientAuthLogin clientAuthLogin;

    public static boolean checkAuthKey(String secretKey, int token) {
        return true;
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

    public static void setClientAuthLogin(ClientAuthLogin clientAuthLogin) {
        AuthHelper.clientAuthLogin = clientAuthLogin;
    }

    public static void loginClient() {
        if (clientAuthLogin != null) {
            clientAuthLogin.login();
        }
    }

    public static void logoutClient() {
        if (clientAuthLogin != null) {
            clientAuthLogin.logout();
        }
    }

    public static void authenticateHttpClient(HttpURLConnection http) {
        loginClient();
        String auth = clientAuthLogin.getType() + " " + clientAuthLogin.getToken();
        http.setRequestProperty("Authorization", auth);
    }
    
    public static String getHttpClientAuthorizationString() {
    	loginClient();
    	return clientAuthLogin.getType() + " " + clientAuthLogin.getToken();
    }

    public static Principal getClientPrincipal() {
        return () -> clientAuthLogin.getUser();
    }
}