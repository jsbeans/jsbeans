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

import java.io.UnsupportedEncodingException;

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
	
	public static NativeArrayBuffer toArrayBuffer(Object obj) throws UnsupportedEncodingException{
		NativeArrayBuffer nab = null;
		if(obj instanceof String){
			String str = (String)obj;
			byte[] bytes = str.getBytes("UTF-8");
			nab = new NativeArrayBuffer(bytes.length);
			copyToArrayBuffer(bytes, 0, nab, 0, bytes.length);
		} else if(obj instanceof NativeArray){
			NativeArray array = (NativeArray) obj;
			
		}
		return nab;
	}
	
	public static byte[] toByteArray(NativeArrayBuffer arr){
		return arr.getBuffer();
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

}
