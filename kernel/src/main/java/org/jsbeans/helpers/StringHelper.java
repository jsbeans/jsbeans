package org.jsbeans.helpers;

import java.nio.CharBuffer;

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

}
