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

import java.math.BigInteger;
import java.security.MessageDigest;

//import com.warrenstrange.googleauth.GoogleAuthenticator;

public class AuthHelper {
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
}