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
