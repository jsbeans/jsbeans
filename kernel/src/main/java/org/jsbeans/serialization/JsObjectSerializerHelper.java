/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.serialization;

import com.google.gson.*;
import org.jsbeans.PlatformException;
import org.jsbeans.scripting.Decompiler;
import org.jsbeans.scripting.ScopeTree;
import org.jsbeans.types.JsObject;
import org.jsbeans.types.JsObject.JsObjectType;
import org.mozilla.javascript.*;
import org.mozilla.javascript.typedarrays.NativeArrayBuffer;
import org.mozilla.javascript.typedarrays.NativeArrayBufferView;
import org.mozilla.javascript.typedarrays.NativeFloat32Array;
import org.mozilla.javascript.typedarrays.NativeFloat64Array;
import org.mozilla.javascript.typedarrays.NativeInt16Array;
import org.mozilla.javascript.typedarrays.NativeInt32Array;
import org.mozilla.javascript.typedarrays.NativeInt8Array;
import org.mozilla.javascript.typedarrays.NativeUint16Array;
import org.mozilla.javascript.typedarrays.NativeUint32Array;
import org.mozilla.javascript.typedarrays.NativeUint8Array;
import org.mozilla.javascript.typedarrays.NativeUint8ClampedArray;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Map;

public class JsObjectSerializerHelper {
    private static JsObjectSerializerHelper instance = new JsObjectSerializerHelper();
    private ScopeTree scopeTree = null;

    public static JsObjectSerializerHelper getInstance() {
        return instance;
    }

    public void initScopeTree(Scriptable s) {
        scopeTree = new ScopeTree(s);
    }

    public ScopeTree getScopeTree() {
        return scopeTree;
    }

    public JsObject serializeNativeObject(NativeObject no) throws PlatformException {
        JsObject jObj = new JsObject(JsObjectType.JSONOBJECT);
        Object[] ids = no.getAllIds();
        for (Object keyObj : ids) {
            String key = keyObj.toString();
            JsObject val = this.serializeNative(no.get(keyObj));
            jObj.addToObject(key, val);
        }
        return jObj;
    }

    public JsObject serializeNativeArray(NativeArray arr) throws PlatformException {
        JsObject jObj = new JsObject(JsObjectType.JSONARRAY);
        for (int i = 0; i < arr.size(); i++) {
            jObj.addToArray(this.serializeNative(arr.get(i)));
        }

        return jObj;
    }
    
    public JsObject serializeArrayBuffer(NativeArrayBuffer arr) throws PlatformException {
    	JsObject jObj = new JsObject(JsObjectType.ARRAYBUFFER);
    	jObj.setBytes(arr.getBuffer());
    	return jObj;
    }

    public JsObject serializeArrayBufferView(NativeArrayBufferView arr) throws PlatformException {
    	JsObjectType t = JsObjectType.NULL;
    	if(arr instanceof NativeUint8Array){
    		t = JsObjectType.UINT8ARRAY;
    	} else if(arr instanceof NativeInt8Array){
    		t = JsObjectType.INT8ARRAY;
    	} else if(arr instanceof NativeUint16Array){
    		t = JsObjectType.UINT16ARRAY;
    	} else if(arr instanceof NativeInt16Array){
    		t = JsObjectType.INT16ARRAY;
    	} else if(arr instanceof NativeUint32Array){
    		t = JsObjectType.UINT32ARRAY;
    	} else if(arr instanceof NativeInt32Array){
    		t = JsObjectType.INT32ARRAY;
    	} else if(arr instanceof NativeFloat32Array){
    		t = JsObjectType.FLOAT32ARRAY;
    	} else if(arr instanceof NativeFloat64Array){
    		t = JsObjectType.FLOAT64ARRAY;
    	} else if(arr instanceof NativeUint8ClampedArray){
    		t = JsObjectType.UINT8CLAMPEDARRAY;
    	} else {
    		LoggerFactory.getLogger(this.getClass()).error(String.format("Unexpected object faced due to serialization to JsObject: '%s'", arr.getClass().getName()));
    	}
    	
    	JsObject jObj = new JsObject(t);
    	jObj.setBytes(arr.getBuffer().getBuffer());
    	return jObj;
    }

    public JsObject serializeNative(Object obj) throws PlatformException {
        JsObject retObj = null;
        if (obj == null) {
            retObj = new JsObject(JsObjectType.NULL);
        } else if (obj instanceof NativeArrayBuffer) {
            retObj = this.serializeArrayBuffer((NativeArrayBuffer) obj);
        } else if (obj instanceof NativeArrayBufferView) {
            retObj = this.serializeArrayBufferView((NativeArrayBufferView) obj);
        }else if (obj instanceof NativeJavaArray) {
            retObj = this.serializeJavaArray((NativeJavaArray) obj);
        } else if (obj instanceof NativeJavaObject) {
            retObj = this.serializeJavaObject((NativeJavaObject) obj);
        } else if (obj instanceof NativeFunction) {
            retObj = this.serializeNativeFunction((NativeFunction) obj);
        } else if (obj instanceof NativeObject) {
            retObj = this.serializeNativeObject((NativeObject) obj);
        } else if (obj instanceof NativeArray) {
            retObj = this.serializeNativeArray((NativeArray) obj);
        } else if (obj instanceof String || obj instanceof ConsString) {
            retObj = new JsObject(JsObjectType.STRING);
            retObj.setString(obj.toString());
        } else if (obj instanceof Integer) {
            retObj = new JsObject(JsObjectType.INTEGER);
            retObj.setInt((Integer) obj);
        } else if (obj instanceof Long) {
            retObj = new JsObject(JsObjectType.INTEGER);
            retObj.setInt((Long) obj);
        } else if (obj instanceof Double || obj instanceof Float) {
            Double d = (Double) obj;
            if (Math.floor(d.doubleValue()) == d.doubleValue() && ((double) (int) d.doubleValue()) == d.doubleValue()) {
                // convert to integer
                retObj = new JsObject(JsObjectType.INTEGER);
                retObj.setInt((int) d.doubleValue());
            } else {
                retObj = new JsObject(JsObjectType.DOUBLE);
                retObj.setDouble((Double) obj);
            }
        } else if (obj instanceof Boolean) {
            retObj = new JsObject(JsObjectType.BOOLEAN);
            retObj.setBoolean((Boolean) obj);
        } else if (obj instanceof Undefined) {

        } else {
            try {
                retObj = this.serializeObject(obj);
            } catch (Exception ex) {
            	retObj = null;
            	LoggerFactory.getLogger(this.getClass()).warn(String.format("Unexpected object faced due to serialization to JsObject: '%s'. Serialization failed with: %s", obj.getClass().getName(), ex.getMessage(), ex));
            }
        }

        return retObj;
    }

    public JsObject jsonElementToJsObject(JsonElement jsonElt) {
        JsObject jsObj = null;
        if (jsonElt.isJsonPrimitive()) {
            // searialize primitive
            JsonPrimitive jPrim = jsonElt.getAsJsonPrimitive();
            if (jPrim.isBoolean()) {
                jsObj = new JsObject(JsObjectType.BOOLEAN);
                jsObj.setBoolean(jPrim.getAsBoolean());
            } else if (jPrim.isNumber()) {
                Number n = jPrim.getAsNumber();
                if (n instanceof Integer || n instanceof Long || n instanceof Short || n instanceof Byte || n instanceof BigDecimal || n instanceof BigInteger) {
                    jsObj = new JsObject(JsObjectType.INTEGER);
                    jsObj.setInt(n.longValue());
                } else {
                    jsObj = new JsObject(JsObjectType.DOUBLE);
                    jsObj.setDouble(n.doubleValue());
                }
            } else if (jPrim.isString()) {
                jsObj = new JsObject(JsObjectType.STRING);
                jsObj.setString(jPrim.getAsString());
            }
        } else if (jsonElt.isJsonObject()) {
            JsonObject jsonObj = jsonElt.getAsJsonObject();
            jsObj = new JsObject(JsObjectType.JSONOBJECT);
            for (Map.Entry<String, JsonElement> e : jsonObj.entrySet()) {
                String key = e.getKey();
                JsObject val = this.jsonElementToJsObject(e.getValue());
                jsObj.addToObject(key, val);
            }
        } else if (jsonElt.isJsonArray()) {
            JsonArray jsonArr = jsonElt.getAsJsonArray();
            jsObj = new JsObject(JsObjectType.JSONARRAY);
            for (int i = 0; i < jsonArr.size(); i++) {
                jsObj.addToArray(this.jsonElementToJsObject(jsonArr.get(i)));
            }
        }
        return jsObj;
    }

    public Object jsonElementToNativeObject(JsonElement jsonElt, Context ctx, Scriptable scope) {
        Object rObj = null;
        if (jsonElt.isJsonPrimitive()) {
            // searialize primitive
            JsonPrimitive jPrim = jsonElt.getAsJsonPrimitive();
            if (jPrim.isBoolean()) {
                rObj = jPrim.getAsBoolean();
            } else if (jPrim.isNumber()) {
                rObj = jPrim.getAsDouble();
            } else if (jPrim.isString()) {
                rObj = jPrim.getAsString();
            }
        } else if (jsonElt.isJsonObject()) {

            JsonObject jsonObj = jsonElt.getAsJsonObject();
            rObj = ctx.newObject(scope);
            for (Map.Entry<String, JsonElement> e : jsonObj.entrySet()) {
                String key = e.getKey();
                Object val = this.jsonElementToNativeObject(e.getValue(), ctx, scope);
                ((Scriptable) rObj).put(key, (Scriptable) rObj, val);
            }
        } else if (jsonElt.isJsonArray()) {
            JsonArray jsonArr = jsonElt.getAsJsonArray();
            rObj = ctx.newArray(scope, jsonArr.size());
            for (int i = 0; i < jsonArr.size(); i++) {
                ((Scriptable) rObj).put(i, (Scriptable) rObj, this.jsonElementToNativeObject(jsonArr.get(i), ctx, scope));
            }
        }

        return rObj;
    }

    public JsObject serializeObject(Object obj) {
        JsonElement jsonElt = new Gson().toJsonTree(obj);
        return this.jsonElementToJsObject(jsonElt);
    }


    public JsObject serializeJavaArray(NativeJavaArray obj) {
        return serializeObject(obj.unwrap());
    }

    private JsObject serializeJavaObject(NativeJavaObject obj) {
        return serializeObject(obj.unwrap());
    }

    private JsObject serializeNativeFunction(NativeFunction so) {
//		Context ctx = Context.getCurrentContext();
        JsObject jObj = new JsObject(JsObjectType.FUNCTION);
        String dec = "";
/*		
        if(ctx != null){
			dec = ctx.decompileFunction(so, 4);
		} else {
			dec = Decompiler.decompile(so.getEncodedSource(), Decompiler.TO_SOURCE_FLAG, new UintMap());
		}
*/
        dec = Decompiler.decompile(so.getEncodedSource(), Decompiler.TO_SOURCE_FLAG/*|Decompiler.OMIT_EOLS*/, new UintMap());
        jObj.setFunction(dec);
        return jObj;
    }

    public Object convertToNativeObject(Object obj, NativeObject scopeObject) {
        Context ctx = Context.enter();
        try {
            return this.jsonElementToNativeObject(
                    GsonWrapper.toGsonJsonElement(obj),
                    ctx,
                    scopeObject.getParentScope());
        } finally {
            Context.exit();
        }
    }

}
