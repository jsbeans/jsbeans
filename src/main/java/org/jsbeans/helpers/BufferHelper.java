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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.DatatypeConverter;

import org.mozilla.javascript.NativeArray;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.typedarrays.NativeArrayBuffer;
import org.mozilla.javascript.typedarrays.NativeUint8Array;

public class BufferHelper {
	public static void copyToArrayBuffer(byte[] buffer, int srcOffs, ScriptableObject so, int dstOffs, int count){
		if(so instanceof NativeUint8Array){
			NativeUint8Array arr = (NativeUint8Array)so;
			System.arraycopy(buffer, srcOffs, arr.getBuffer().getBuffer(), dstOffs, count);
		} else if(so instanceof NativeArrayBuffer){
			NativeArrayBuffer arr = (NativeArrayBuffer)so;
			System.arraycopy(buffer, srcOffs, arr.getBuffer(), dstOffs, count);
		}
	}
	
	public static NativeArrayBuffer toArrayBuffer(Object obj) throws IllegalAccessException, InstantiationException, InvocationTargetException, IOException{
		NativeArrayBuffer nab = null;
		if(obj instanceof String){
			String str = (String)obj;
			byte[] bytes = str.getBytes("UTF-8");
			nab = new NativeArrayBuffer(bytes.length);
			copyToArrayBuffer(bytes, 0, nab, 0, bytes.length);
		} else if(obj instanceof NativeArray){
			NativeArray array = (NativeArray) obj;
			nab = new NativeArrayBuffer(array.size());
			System.arraycopy(array.toArray(), 0, nab.getBuffer(), 0, array.size());
		} else if(obj instanceof InputStream) {
			InputStream is = (InputStream)obj;
			ByteArrayOutputStream buffer = new ByteArrayOutputStream();
			byte[] buf = new byte[1024];
			int n = 0;
			while ((n = is.read(buf, 0, buf.length)) != -1) {
				buffer.write(buf, 0, n);
			}
			nab = new NativeArrayBuffer(buffer.size());
			System.arraycopy(buffer.toByteArray(), 0, nab.getBuffer(), 0, buffer.size());
		} else if(obj!=null && obj.getClass().isArray()){
			int length = ((byte [])obj).length;
			nab = new NativeArrayBuffer(length);
			System.arraycopy(obj, 0, nab.getBuffer(), 0, length);
		} 
		return nab;
	}

	public static NativeArrayBuffer requestToArrayBuffer(HttpServletRequest request) throws IllegalAccessException, InstantiationException, InvocationTargetException, IOException {
		int length = request.getContentLength();
		if(length < 0) {
			try (InputStream is = request.getInputStream()) {
				return toArrayBuffer(is);
			}
		} else {
			NativeArrayBuffer nab = new NativeArrayBuffer(length);
			try (InputStream is = request.getInputStream()) {
				byte[] buffer = new byte[1024];
				int count = 0;
				int n = 0;
				while (-1 != (n = is.read(buffer))) {
					System.arraycopy(buffer, 0, nab.getBuffer(), count, n);
					count += n;
				}
			}
			return nab;
		}
	}

	public static byte[] toByteArray(NativeArrayBuffer arr){
		return arr.getBuffer();
	}
	
	public static byte[] allocateByteArray(int size){
		return new byte[size];
	}
	
	public static String base64Encode(NativeArrayBuffer arr){
		return DatatypeConverter.printBase64Binary(arr.getBuffer());
	}

	public static String base64Encode(String str){
		return DatatypeConverter.printBase64Binary(str.getBytes());
	}

	public static NativeArrayBuffer base64Decode(String base64){
		byte[] bArr = DatatypeConverter.parseBase64Binary(base64);
		NativeArrayBuffer nab = new NativeArrayBuffer(bArr.length);
		copyToArrayBuffer(bArr, 0, nab, 0, bArr.length);
		return nab;
	}
	
	public static InputStream toStream(byte[] byteArr) {
		return new ByteArrayInputStream(byteArr);
	}
	
	public static InputStream toStream(NativeArrayBuffer arr) {
		return toStream(toByteArray(arr));
	}

	public static InputStream toStream(String str) {
		return toStream(str.getBytes());
	}
	
	public static String toString(NativeArrayBuffer arr, String charset) throws UnsupportedEncodingException {
		return new String(toByteArray(arr), charset);
	}

}
