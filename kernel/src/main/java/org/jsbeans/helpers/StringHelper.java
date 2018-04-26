package org.jsbeans.helpers;

import java.math.BigInteger;
import java.nio.CharBuffer;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class StringHelper {
    public static int searchNewline(CharBuffer buffer, int from) {
        int to = buffer.position();
        if (from >= to) {
            return -1;
        }
        char[] chars = buffer.array();
        for (int i = from; i < to; i++) {
            if (chars[i] == '\n' || (chars[i] == '\r' && i < to - 1)) {
                return i;
            }
        }
        return -1;
    }
    
    public static String MD5(String st) throws NoSuchAlgorithmException{
    	MessageDigest messageDigest = MessageDigest.getInstance("MD5");
    	messageDigest.reset();
    	messageDigest.update(st.getBytes());
    	byte[] digest = messageDigest.digest();
    	BigInteger bigInt = new BigInteger(1, digest);
        String md5Hex = bigInt.toString(16);

        while( md5Hex.length() < 32 ){
            md5Hex = "0" + md5Hex;
        }
        
        return md5Hex;
    }

}
