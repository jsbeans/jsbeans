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

import org.jsbeans.serialization.GsonWrapper;
import org.jsbeans.serialization.JsObjectSerializerHelper;
import org.jsbeans.types.JsonObject;
import org.mozilla.javascript.NativeObject;

import javax.xml.bind.DatatypeConverter;
import java.io.*;
import java.net.*;
import java.nio.charset.Charset;
import java.util.Base64;
import java.util.Map;

public class HttpHelper {

    public static enum ResultType {
        string,
        bytes,
        base64,
        json
    }

    public static Object requestJS(String url, Object data, NativeObject options) {
        JsonObject opts = null;
        try {
            String json = JsObjectSerializerHelper.getInstance().serializeNative(options).toJS(false);
            opts = GsonWrapper.fromJson(json, JsonObject.class);
        }catch(Exception e) {
            throw new RuntimeException("Convert NativeObject arguments error", e);
        }
        JsonObject result = request(url, data, opts);
        try {
            return JsObjectSerializerHelper.getInstance().convertToNativeObject(result, options);
        }catch(Exception e) {
            throw new RuntimeException("Convert NativeObject result error", e);
        }
    }

    public static JsonObject request(String url, Object data, final JsonObject options) {
        prepareDefaultOptions(options);
        HttpURLConnection con = null;
        try {
            URL obj = new URL(url);
            if (options.containsKey("proxy_host")) {
                Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(options.getAsString("proxy_host"), options.getAsInteger("proxy_port")));
                con = (HttpURLConnection) obj.openConnection(proxy);

                if (options.containsKey("proxy_password")) {
                    Authenticator authenticator = new Authenticator() {
                        public PasswordAuthentication getPasswordAuthentication() {
                            return (new PasswordAuthentication(options.getAsString("proxy_user"), options.getAsString("proxy_password").toCharArray()));
                        }
                    };
                    Authenticator.setDefault(authenticator);
                }
            } else {
                con = (HttpURLConnection) obj.openConnection();
            }
            con.setConnectTimeout(options.getAsInteger("connectTimeout"));
            con.setReadTimeout(options.getAsInteger("socketTimeout"));
            con.setRequestProperty("charset", options.getAsString("charset"));
            con.setRequestMethod(options.getAsString("method"));
            con.setRequestProperty("Connection", "Close");
            System.setProperty("http.keepAlive", "false");

            if (options.containsKey("requestProperties")) {
                for(Map.Entry<String,Object> e : options.getAsJson("requestProperties").entrySet()) {
                    con.setRequestProperty(e.getKey(), e.getValue().toString());
                }
            }

            if(options.containsKey("user") && options.containsKey("password")) {
                String userPassword = options.getAsString("user") + ":" + options.getAsString("password");
                @SuppressWarnings("restriction")
                String encoding = Base64.getEncoder().encodeToString(userPassword.getBytes());
                con.addRequestProperty("Authorization", "Basic " + encoding);
            }
//            if (options.getAsString("method").equalsIgnoreCase("post")) {
//                con.setDoOutput(true);
//            }
            con.setUseCaches(options.getAsBoolean("useCaches"));
            if (data != null) {
                con.setDoOutput(true);
                writeDataIntoStream(data, con.getOutputStream());
                con.getOutputStream().close();
            }

            int responseCode = con.getResponseCode();

            JsonObject result = new JsonObject();
            result.put("responseCode", responseCode);
            result.put("responseMesasge", con.getResponseMessage());

            Object res = null;
            if (responseCode >= HttpURLConnection.HTTP_OK && responseCode < HttpURLConnection.HTTP_BAD_REQUEST) {
                res = getResponse(con, ResultType.valueOf(options.get("resultType").toString()), false);
                result.put("body", res);
            }
            if (res == null) {
                res = getResponse(con, ResultType.valueOf(options.get("resultType").toString()), true);
                result.put("error", res);
            }
            return result;
        } catch(IOException e) {
            JsonObject result = new JsonObject();
            result.put("error", e.toString());
            return result;
        } finally {
            if (con != null) {
                con.disconnect();
            }
        }
    }

    public static Object getResponse(HttpURLConnection con, ResultType type, boolean error) throws IOException {
        try {
            InputStream is = error ? con.getErrorStream() : con.getInputStream();
            try {
                if (type == ResultType.bytes) {
                    return readBytes(is);
                } else if (type == ResultType.base64) {
                    byte[] bytes = readBytes(is);
                    return DatatypeConverter.printBase64Binary(bytes);
                } else if (type == ResultType.json) {
                    String json = readString(is);
                    return GsonWrapper.fromJson(json, JsonObject.class);
                } else {
                    return readString(is);
                }
            } finally {
                if (error) con.getErrorStream().close();
                if (!error) con.getInputStream().close();
            }
        } catch(IOException e) {
            return null;
        }
    }

    private static byte[] readBytes(InputStream inputStream) {
        try(ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            int n;
            byte[] buffer = new byte[1024];
            while((n = inputStream.read(buffer)) > -1) {
                outputStream.write(buffer, 0, n);
            }
            return outputStream.toByteArray();
        } catch (IOException e) {
            throw ExceptionHelper.runtime(e);
        }
    }

    private static String readString(InputStream is) {
        return new String(readBytes(is));
    }

    private static void prepareDefaultOptions(JsonObject options) {
        if(!options.containsKey("connectTimeout")) {
            options.put("connectTimeout", 15000);
        }
        if(!options.containsKey("socketTimeout")) {
            options.put("socketTimeout", 15000);
        }
        if(!options.containsKey("method")) {
            options.put("method", "GET");
        }
        if(!options.containsKey("charset")) {
            options.put("charset", "utf-8");
        }
        if(!options.containsKey("resultType")) {
            options.put("resultType", ResultType.string.toString());
        }
        if (!options.containsKey("useCaches")) {
            options.put("useCaches", false);
        }
        if (!options.containsKey("requestProperties")) {
            options.put("requestProperties", new JsonObject());
        }
        JsonObject props = options.getAsJson("requestProperties");
        if (!props.containsKey("Accept")) props.put("Accept", "*/*");
        if (!props.containsKey("Connection")) props.put("Connection", "Keep-Alive");
        if (!props.containsKey("User-Agent")) props.put("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:31.0) Gecko/20100101 Firefox/31.0"/*"Wget/1.12"*/);
    }

    private static void writeDataIntoStream(Object data, OutputStream stream) throws IOException {
        String postDataStr = data instanceof String ? (String) data : null;
        Byte[] postDataBytes = data instanceof Byte[] ? (Byte[]) data : null;
        if (postDataStr == null && postDataBytes == null) {
            postDataStr = data instanceof JsonObject ? ((JsonObject)data).toJson() : GsonWrapper.toJson(data);
        }

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(stream, "UTF-8"));
        try {
            if (postDataStr != null) {
                writer.write(postDataStr);
            } else {
                for (int i = 0; i < postDataBytes.length; i++) {
                    writer.write(postDataBytes[i]);
                }
            }
        }finally {
            writer.flush();
            writer.close();
        }
    }


    public static Object streamRead(InputStream is, String type, int size) {
        if (is == null) return null;

        ResultType rtype = ResultType.valueOf(type);
        try {
            if (rtype == ResultType.bytes) {
                if (size > 0) {
                    byte[] bytes = new byte[size];
                    is.read(bytes);
                    return bytes;
                } else {
                    byte[] bytes = new byte[is.available()];
                    is.read(bytes);
                    is.close();
                    return bytes;
                }
            } else if (rtype == ResultType.base64) {
                byte[] bytes = (byte[]) HttpHelper.streamRead(is, ResultType.bytes.name(), -1);
                Object value = DatatypeConverter.printBase64Binary(bytes);
                is.close();
                return value;
            } else if (rtype == ResultType.json) {
                String json = readString(is);
                //Object value = GsonWrapper.fromJson(json, JsonObject.class);
                is.close();
                return json;
            } else {
                Object value = readString(is);
                is.close();
                return value;
            }
        } catch(IOException e) {
            try {
                if (is != null) is.close();
            } finally {
                return null;
            }
        }
    }

    public static Object streamReadLine(InputStream is) {
        if (is == null) return null;

        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(is, Charset.defaultCharset()));
            String line = reader.readLine();
            return line;
        } catch(IOException e) {
            try {
                if (is != null) is.close();
            } finally {
                return null;
            }
        }

    }

    public static void streamWriteString(OutputStream outputStream, String data, String encoding) throws IOException {
    	OutputStreamWriter writer = new OutputStreamWriter(outputStream, encoding);
    	try {
    		writer.write(data);
    		writer.flush();
    	} finally {
    		 //writer.close();
    	}
/*    	
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream, encoding));
        
        try {
            writer.write(data);
            writer.flush();
            outputStream.flush();
        }finally {
            //writer.close();
        }*/
    }

    public static void streamWriteBytes(OutputStream outputStream, byte[] data) throws IOException {
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream));
        try {
            for (int i = 0; i < data.length; i++) {
                writer.write(data[i]);
            }
            writer.flush();
            outputStream.flush();
        } finally {
            //writer.close();
        }

    }

    public static String toBase64(String data) {
        return Base64.getEncoder().encodeToString(data.getBytes());
    }
}
