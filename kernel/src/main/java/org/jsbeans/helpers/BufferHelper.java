package org.jsbeans.helpers;

import java.io.UnsupportedEncodingException;

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

}
