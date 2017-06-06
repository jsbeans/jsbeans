/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.types;

import com.google.gson.Gson;
import org.jsbeans.helpers.ExceptionHelper;

import java.io.*;
import java.net.URLEncoder;
import java.util.*;

public class JsObject implements Serializable {
    private static final long serialVersionUID = 4595774280676767552L;
    private JsObjectType objType;
    private String dataStr;
    private long dataInt;
    private double dataDouble;
    private Map<String, JsObject> dataJsonObject = null;
    private List<JsObject> dataJsonArray = null;
    private byte[] bytes;
    
    public JsObject(JsObjectType type) {
        this.objType = type;
    }

    public static String toJS(JsObject value, boolean urlEncode, boolean serializeFunctionAsString) {
        try (StringWriter swriter = new StringWriter();
             JsObjectWriter writer = new JsObjectWriter(swriter, urlEncode, serializeFunctionAsString)) {
            writer.write(value);
            return swriter.toString();
        } catch (IOException e) {
            throw ExceptionHelper.runtime(e);
        }
    }

    public void setFunction(String func) {
        this.objType = JsObjectType.FUNCTION;
        this.dataStr = func;
    }
    
    public void setBytes(byte[] bytes){
    	this.bytes = bytes;
    }

    public void addToObject(String attrName, JsObject jsObj) {
        this.objType = JsObjectType.JSONOBJECT;
        if (this.dataJsonObject == null) {
            this.dataJsonObject = new HashMap<String, JsObject>();
        }
        this.dataJsonObject.put(attrName, jsObj);
    }

    public void addToObject(String attrName, long val) {
        JsObject valObj = new JsObject(JsObjectType.INTEGER);
        valObj.setInt(val);
        this.addToObject(attrName, valObj);
    }

    public void addToObject(String attrName, String val) {
        JsObject valObj = new JsObject(JsObjectType.STRING);
        valObj.setString(val);
        this.addToObject(attrName, valObj);
    }

    public void addToObject(String attrName, double val) {
        JsObject valObj = new JsObject(JsObjectType.DOUBLE);
        valObj.setDouble(val);
        this.addToObject(attrName, valObj);
    }

    public void addToObject(String attrName, boolean val) {
        JsObject valObj = new JsObject(JsObjectType.BOOLEAN);
        valObj.setBoolean(val);
        this.addToObject(attrName, valObj);
    }

    public void addToArray(JsObject jsObj) {
        this.objType = JsObjectType.JSONARRAY;
        if (this.dataJsonArray == null) {
            this.dataJsonArray = new ArrayList<JsObject>();
        }
        this.dataJsonArray.add(jsObj);
    }

    public void removeFromObject(String attrName) {
        if (this.objType != JsObjectType.JSONOBJECT) {
            return;
        }
        if (this.dataJsonObject.containsKey(attrName)) {
            this.dataJsonObject.remove(attrName);
        }
    }

    public JsObjectType getResultType() {
        return this.objType;
    }

    public String getString() {
        return this.dataStr;
    }

    public void setString(String str) {
        this.objType = JsObjectType.STRING;
        this.dataStr = str;
    }

    public long getInt() {
        return this.dataInt;
    }

    public void setInt(long val) {
        this.objType = JsObjectType.INTEGER;
        this.dataInt = val;
    }

    public double getDouble() {
        return this.dataDouble;
    }

    public void setDouble(double val) {
        this.objType = JsObjectType.DOUBLE;
        this.dataDouble = val;
    }

    public boolean getBoolean() {
        return this.dataInt != 0;
    }

    public void setBoolean(boolean b) {
        this.objType = JsObjectType.BOOLEAN;
        this.dataInt = b ? 1 : 0;
    }

    public byte[] toByteArray() throws UnsupportedEncodingException {
        byte[] bArr = null;
        if (this.getResultType() == JsObjectType.JSONARRAY) {
            bArr = new byte[this.dataJsonArray.size()];
            for (int i = 0; i < this.dataJsonArray.size(); i++) {
                bArr[i] = (byte) this.dataJsonArray.get(i).getInt();
            }
        } else if (this.getResultType() == JsObjectType.STRING) {
            bArr = this.dataStr.getBytes();
        } else if(this.getResultType() == JsObjectType.ARRAYBUFFER){
        	bArr = this.bytes;
        } else {
        	String str = this.toJS(false, true);
        	bArr = str.getBytes();
        }
        return bArr;
    }

    public JsObject getAttribute(String name) {
        if (this.dataJsonObject == null || !this.dataJsonObject.containsKey(name))
            return null;
        return this.dataJsonObject.get(name);
    }

    public JsObject getArrayItem(int idx) {
        if (this.dataJsonArray == null || this.dataJsonArray.size() <= idx)
            return null;
        return this.dataJsonArray.get(idx);
    }

    public int getArraySize() {
        if (this.dataJsonArray == null)
            return 0;
        return this.dataJsonArray.size();
    }

    public String toJS() throws UnsupportedEncodingException {
        return this.toJS(true);
    }

    public String toJS(boolean urlEncode) throws UnsupportedEncodingException {
        return this.toJS(urlEncode, false);
    }

    public String toJSOld(boolean urlEncode, boolean serializeFunctionAsString) throws UnsupportedEncodingException {
        String result = "";
        switch (this.objType) {
            case NULL:
                result = "null";
                break;
            case STRING:
                if (urlEncode) {
                    if (this.getString() == null) {
                        result = "\"\"";
                    } else {
                        result = "\"" + URLEncoder.encode(this.getString(), "UTF-8").replaceAll("\\+", "%20") + "\"";
                    }
                } else {
                    result = new Gson().toJson(this.getString());
//				result = "\"" + this.getString() + "\"";
                }
                break;
            case INTEGER:
                result = String.format("%d", this.getInt());
                break;
            case DOUBLE:
                result = String.format("%f", this.getDouble()).replaceAll(",", ".");
                break;
            case FUNCTION:
                if (serializeFunctionAsString) {
                    String procStr = this.getString().replace("\"", "'");
                    if (procStr.startsWith("(")) {
                        procStr = procStr.substring(1);
                    }
                    if (procStr.endsWith(")")) {
                        procStr = procStr.substring(0, procStr.length() - 1);
                    }
                    result = "\"" + procStr + "\"";
                } else {
                    result = this.getString();
                }
                break;
            case BOOLEAN:
                result = this.getBoolean() ? "true" : "false";
                break;
            case JSONOBJECT:
                result += "{";
                if (this.dataJsonObject != null && this.dataJsonObject.keySet() != null && this.dataJsonObject.keySet().size() > 0) {
                    String[] keys = this.dataJsonObject.keySet().toArray(new String[this.dataJsonObject.keySet().size()]);
                    for (int i = 0; i < keys.length; i++) {
                        String key = keys[i];
                        JsObject val = this.dataJsonObject.get(key);
                        String encodedKey = key;
                        if (urlEncode) {
                            encodedKey = URLEncoder.encode(key, "UTF-8").replaceAll("\\+", "%20");
                        }
                        result += String.format("\"%s\":%s", encodedKey, val != null ? val.toJSOld(urlEncode, serializeFunctionAsString) : "null");
                        if (i < keys.length - 1) {
                            result += ",";
                        }
                    }
                }
                result += "}";
                break;
            case JSONARRAY:
                result += "[";
                int i = 0;
                if (this.dataJsonArray != null && this.dataJsonArray.size() > 0) {
                    for (JsObject jObj : this.dataJsonArray) {
                        result += jObj.toJSOld(urlEncode, serializeFunctionAsString);
                        if (i < this.dataJsonArray.size() - 1) {
                            result += ",";
                        }
                        i++;
                    }
                }
                result += "]";
                break;
            default:
                break;
        }
        return result;
    }


    public String toJS(boolean urlEncode, boolean serializeFunctionAsString) throws UnsupportedEncodingException {
        String newJson = toJS(this, urlEncode, serializeFunctionAsString);
////		String oldJson = toJSOld(urlEncode, serializeFunctionAsString);
//		if (!oldJson.equals(newJson)) {
//			"".toString();
//		}
        return newJson;
    }

    public enum JsObjectType implements Serializable {
        JSONOBJECT,
        JSONARRAY,
        ARRAYBUFFER,
        FUNCTION,
        INTEGER,
        STRING,
        DOUBLE,
        BOOLEAN,
        NULL
    }

    /**
     * Patched version of {@link com.google.gson.stream.JsonWriter}
     */
    private static class JsObjectWriter implements Closeable, Flushable {
        /*
         * From RFC 4627, "All Unicode characters may be placed within the
         * quotation marks except for the characters that must be escaped:
         * quotation mark, reverse solidus, and the control characters
         * (U+0000 through U+001F)."
         *
         * We also escape '\u2028' and '\u2029', which JavaScript interprets as
         * newline characters. This prevents eval() from failing with a syntax
         * error. http://code.google.com/p/google-gson/issues/detail?id=341
         */
        static final String[] REPLACEMENT_CHARS;
        static final String[] HTML_SAFE_REPLACEMENT_CHARS;

        static {
            REPLACEMENT_CHARS = new String[128];
            for (int i = 0; i <= 0x1f; i++) {
                REPLACEMENT_CHARS[i] = String.format("\\u%04x", (int) i);
            }
            REPLACEMENT_CHARS['"'] = "\\\"";
            REPLACEMENT_CHARS['\\'] = "\\\\";
            REPLACEMENT_CHARS['\t'] = "\\t";
            REPLACEMENT_CHARS['\b'] = "\\b";
            REPLACEMENT_CHARS['\n'] = "\\n";
            REPLACEMENT_CHARS['\r'] = "\\r";
            REPLACEMENT_CHARS['\f'] = "\\f";
            HTML_SAFE_REPLACEMENT_CHARS = REPLACEMENT_CHARS.clone();
            HTML_SAFE_REPLACEMENT_CHARS['<'] = "\\u003c";
            HTML_SAFE_REPLACEMENT_CHARS['>'] = "\\u003e";
            HTML_SAFE_REPLACEMENT_CHARS['&'] = "\\u0026";
            HTML_SAFE_REPLACEMENT_CHARS['='] = "\\u003d";
            HTML_SAFE_REPLACEMENT_CHARS['\''] = "\\u0027";
        }

        private final List<JsonScope> stack = new ArrayList<JsonScope>();
        Writer writer;
        boolean urlEncode;
        boolean serializeFunctionAsString;
        private String indent;
        private String separator = ":";
        private boolean lenient;
        private boolean htmlSafe;
        private String deferredName;
        private boolean serializeNulls = true;

        {
            stack.add(JsonScope.EMPTY_DOCUMENT);
        }
        public JsObjectWriter(Writer writer, boolean urlEncode, boolean serializeFunctionAsString) {
            this.writer = writer;
            this.urlEncode = urlEncode;
            this.serializeFunctionAsString = serializeFunctionAsString;
            setLenient(true);
            setHtmlSafe(true);
        }

        public void write(JsObject jsObject) throws IOException {
            if (jsObject == null) {
                this.nullValue();
                return;
            }
            switch (jsObject.getResultType()) {
                case NULL:
                    this.nullValue();
                    break;
                case STRING:
                    if (urlEncode) {
                        this.value(jsObject.getString() == null
                                ? ""
                                : URLEncoder.encode(jsObject.getString(), "UTF-8").replaceAll("\\+", "%20"));

                    } else {
                        this.value(jsObject.getString());
                    }
                    break;
                case INTEGER:
                    this.value(jsObject.getInt());
                    break;
                case DOUBLE:
                    this.value(jsObject.getDouble());
                    break;
                case BOOLEAN:
                    this.value(jsObject.getBoolean());
                    break;
                case FUNCTION:
                    if (serializeFunctionAsString) {
                        String procStr = jsObject.getString();
                        if (procStr.startsWith("(") && procStr.endsWith(")")) {
                            this.value(
                                    procStr.substring(1, procStr.length() - 1));
                        } else {
                            this.value(procStr);
                        }
                    } else {
                        // write native string
                        this.valueNative(jsObject.getString());
                    }
                    break;
                case JSONOBJECT:
                    this.beginObject();
                    if (jsObject.dataJsonObject != null) {
                        Set<String> keys = jsObject.dataJsonObject.keySet();
                        if (keys != null) {
                            for (String key : keys) {
                                this.name(!urlEncode ? key : URLEncoder.encode(key, "UTF-8").replaceAll("\\+", "%20"));
                                this.write(jsObject.dataJsonObject.get(key));
//								try(JsObjectWriter w = new JsObjectWriter(writer,urlEncode, serializeFunctionAsString)) {
//									w.write(jsObject.dataJsonObject.get(key));
//								}
                            }
                        }
                    }
                    this.endObject();
                    break;
                case JSONARRAY:
                    this.beginArray();
                    if (jsObject.dataJsonArray != null) {
                        for (JsObject obj : jsObject.dataJsonArray) {
                            this.write(obj);
//							try(JsObjectWriter w = new JsObjectWriter(writer,urlEncode, serializeFunctionAsString)) {
//								w.write(obj);
//							}
                        }
                    }
                    this.endArray();
                    break;
            }
        }

        public final void setIndent(String indent) {
            if (indent.length() == 0) {
                this.indent = null;
                this.separator = ":";
            } else {
                this.indent = indent;
                this.separator = ": ";
            }
        }

        public boolean isLenient() {
            return lenient;
        }

        public final void setLenient(boolean lenient) {
            this.lenient = lenient;
        }

        public final boolean isHtmlSafe() {
            return htmlSafe;
        }

        public final void setHtmlSafe(boolean htmlSafe) {
            this.htmlSafe = htmlSafe;
        }

        public final boolean getSerializeNulls() {
            return serializeNulls;
        }

        public final void setSerializeNulls(boolean serializeNulls) {
            this.serializeNulls = serializeNulls;
        }

        public JsObjectWriter beginArray() throws IOException {
            writeDeferredName();
            return open(JsonScope.EMPTY_ARRAY, "[");
        }

        public JsObjectWriter endArray() throws IOException {
            return close(JsonScope.EMPTY_ARRAY, JsonScope.NONEMPTY_ARRAY, "]");
        }

        public JsObjectWriter beginObject() throws IOException {
            writeDeferredName();
            return open(JsonScope.EMPTY_OBJECT, "{");
        }

        public JsObjectWriter endObject() throws IOException {
            return close(JsonScope.EMPTY_OBJECT, JsonScope.NONEMPTY_OBJECT, "}");
        }

        private JsObjectWriter open(JsonScope empty, String openBracket) throws IOException {
            beforeValue(true);
            stack.add(empty);
            writer.write(openBracket);
            return this;
        }

        private JsObjectWriter close(JsonScope empty, JsonScope nonempty, String closeBracket)
                throws IOException {
            JsonScope context = peek();
            if (context != nonempty && context != empty) {
                throw new IllegalStateException("Nesting problem: " + stack);
            }
            if (deferredName != null) {
                throw new IllegalStateException("Dangling name: " + deferredName);
            }

            stack.remove(stack.size() - 1);
            if (context == nonempty) {
                newline();
            }
            writer.write(closeBracket);
            return this;
        }

        private JsonScope peek() {
            int size = stack.size();
            if (size == 0) {
                throw new IllegalStateException("JsonWriter is closed.");
            }
            return stack.get(size - 1);
        }

        private void replaceTop(JsonScope topOfStack) {
            stack.set(stack.size() - 1, topOfStack);
        }

        public JsObjectWriter name(String name) throws IOException {
            if (name == null) {
                throw new NullPointerException("name == null");
            }
            if (deferredName != null) {
                throw new IllegalStateException();
            }
            if (stack.isEmpty()) {
                throw new IllegalStateException("JsonWriter is closed.");
            }
            deferredName = name;
            return this;
        }

        private void writeDeferredName() throws IOException {
            if (deferredName != null) {
                beforeName();
                string(deferredName);
                deferredName = null;
            }
        }

        public JsObjectWriter value(String value) throws IOException {
            if (value == null) {
                return nullValue();
            }
            writeDeferredName();
            beforeValue(false);
            string(value);
            return this;
        }

        public JsObjectWriter nullValue() throws IOException {
            if (deferredName != null) {
                if (serializeNulls) {
                    writeDeferredName();
                } else {
                    deferredName = null;
                    return this; // skip the name and the value
                }
            }
            beforeValue(false);
            writer.write("null");
            return this;
        }

        public JsObjectWriter value(boolean value) throws IOException {
            writeDeferredName();
            beforeValue(false);
            writer.write(value ? "true" : "false");
            return this;
        }

        public JsObjectWriter valueNative(String value) throws IOException {
            writeDeferredName();
            beforeValue(false);
            writer.write(value);
            return this;
        }

        public JsObjectWriter value(double value) throws IOException {
            if (Double.isNaN(value) || Double.isInfinite(value)) {
                throw new IllegalArgumentException("Numeric values must be finite, but was " + value);
            }
            writeDeferredName();
            beforeValue(false);
            writer.append(Double.toString(value));
            return this;
        }

        public JsObjectWriter value(long value) throws IOException {
            valueNative(Long.toString(value));
            return this;
        }

        public JsObjectWriter value(Number value) throws IOException {
            if (value == null) {
                return nullValue();
            }

            writeDeferredName();
            String string = value.toString();
            if (!lenient
                    && (string.equals("-Infinity") || string.equals("Infinity") || string.equals("NaN"))) {
                throw new IllegalArgumentException("Numeric values must be finite, but was " + value);
            }
            beforeValue(false);
            writer.append(string);
            return this;
        }

        @Override
        public void flush() throws IOException {
            if (stack.isEmpty()) {
                throw new IllegalStateException("JsonWriter is closed.");
            }
            writer.flush();
        }

        @Override
        public void close() throws IOException {
            writer.close();

            int size = stack.size();
            if (size > 1 || size == 1 && stack.get(size - 1) != JsonScope.NONEMPTY_DOCUMENT) {
                throw new IOException("Incomplete document");
            }
            stack.clear();
        }

        private void string(String value) throws IOException {
            String[] replacements = htmlSafe ? HTML_SAFE_REPLACEMENT_CHARS : REPLACEMENT_CHARS;
            writer.write("\"");
            int last = 0;
            int length = value.length();
            for (int i = 0; i < length; i++) {
                char c = value.charAt(i);
                String replacement;
                if (c < 128) {
                    replacement = replacements[c];
                    if (replacement == null) {
                        continue;
                    }
                } else if (c == '\u2028') {
                    replacement = "\\u2028";
                } else if (c == '\u2029') {
                    replacement = "\\u2029";
                } else {
                    continue;
                }
                if (last < i) {
                    writer.write(value, last, i - last);
                }
                writer.write(replacement);
                last = i + 1;
            }
            if (last < length) {
                writer.write(value, last, length - last);
            }
            writer.write("\"");
        }

        private void newline() throws IOException {
            if (indent == null) {
                return;
            }

            writer.write("\n");
            for (int i = 1; i < stack.size(); i++) {
                writer.write(indent);
            }
        }

        private void beforeName() throws IOException {
            JsonScope context = peek();
            if (context == JsonScope.NONEMPTY_OBJECT) { // first in object
                writer.write(',');
            } else if (context != JsonScope.EMPTY_OBJECT) { // not in an object!
                throw new IllegalStateException("Nesting problem: " + stack);
            }
            newline();
            replaceTop(JsonScope.DANGLING_NAME);
        }

        @SuppressWarnings("fallthrough")
        private void beforeValue(boolean root) throws IOException {
            switch (peek()) {
                case NONEMPTY_DOCUMENT:
                    if (!lenient) {
                        throw new IllegalStateException(
                                "JSON must have only one top-level value.");
                    }
                    // fall-through
                case EMPTY_DOCUMENT: // first in document
                    if (!lenient && !root) {
                        throw new IllegalStateException(
                                "JSON must start with an array or an object.");
                    }
                    replaceTop(JsonScope.NONEMPTY_DOCUMENT);
                    break;

                case EMPTY_ARRAY: // first in array
                    replaceTop(JsonScope.NONEMPTY_ARRAY);
                    newline();
                    break;

                case NONEMPTY_ARRAY: // another in array
                    writer.append(',');
                    newline();
                    break;

                case DANGLING_NAME: // value for name
                    writer.append(separator);
                    replaceTop(JsonScope.NONEMPTY_OBJECT);
                    break;

                default:
                    throw new IllegalStateException("Nesting problem: " + stack);
            }
        }

        enum JsonScope {
            EMPTY_ARRAY,
            NONEMPTY_ARRAY,
            EMPTY_OBJECT,
            DANGLING_NAME,
            NONEMPTY_OBJECT,
            EMPTY_DOCUMENT,
            NONEMPTY_DOCUMENT,
            CLOSED,
        }
    }

}
