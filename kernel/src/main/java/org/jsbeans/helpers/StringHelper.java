package org.jsbeans.helpers;

import java.io.UnsupportedEncodingException;
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
    
    private static ThreadLocal<MessageDigest> digesters = new ThreadLocal<MessageDigest>() {
    	@Override
    	protected MessageDigest initialValue() {
	    	try { 
	    		return MessageDigest.getInstance("MD5"); 
	    	}
	    	catch (NoSuchAlgorithmException e) { 
	    		throw new RuntimeException(e); 
	    	}
    	}
    };
    
    public static String MD5(String st) throws UnsupportedEncodingException {
    	MessageDigest md = digesters.get();
    	md.reset();
    	byte[] digest = md.digest(st.getBytes("UTF-8"));
    	BigInteger bigInt = new BigInteger(1, digest);
        String md5Hex = bigInt.toString(16);

        while( md5Hex.length() < 32 ){
            md5Hex = "0" + md5Hex;
        }
        
        return md5Hex;
    }

}
