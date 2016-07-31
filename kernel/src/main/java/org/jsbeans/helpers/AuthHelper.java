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