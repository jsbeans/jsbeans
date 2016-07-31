package org.jsbeans.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5 {
    private static final ThreadLocal<MessageDigest> md5 = new ThreadLocal<>();

    public static String md5(String value) {
        if (md5.get() == null) {
            try {
                md5.set(MessageDigest.getInstance("MD5"));
            } catch (NoSuchAlgorithmException e) {
                e.printStackTrace();
            }
        }

        byte[] digest = md5.get().digest(value != null ? value.getBytes() : new byte[]{0});
        StringBuffer sb = new StringBuffer();
        for (byte b : digest) {
            sb.append(String.format("%02x", b & 0xff));
        }
        return sb.toString();
    }
}
