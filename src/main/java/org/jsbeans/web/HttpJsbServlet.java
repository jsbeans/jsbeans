/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.web;

import akka.util.Timeout;

import org.apache.commons.text.StringEscapeUtils;
import org.eclipse.jetty.server.Request;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.BufferHelper;
import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.scripting.*;
import org.jsbeans.serialization.GsonWrapper;
import org.jsbeans.serialization.JsObjectSerializerHelper;
import org.jsbeans.types.JsObject;
import org.jsbeans.types.JsObject.JsObjectType;
import org.jsbeans.types.JsonElement;
import org.jsbeans.types.JsonObject;
import org.jsbeans.types.JsonPrimitive;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.typedarrays.NativeArrayBuffer;

import javax.security.auth.Subject;
import javax.servlet.AsyncContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.Buffer;
import java.security.*;
import java.util.Map;
import java.util.zip.GZIPOutputStream;

@SuppressWarnings("deprecation")
public class HttpJsbServlet extends AuthenticatedHttpServlet {
	private static final long serialVersionUID = 4803233014924737807L;
	private static Boolean bCompressionEnabled = ConfigHelper.getConfigBoolean("web.http.compression.enabled");
    private static Integer compressionMinSize = ConfigHelper.getConfigInt("web.http.compression.minSize");

	public static String getFullURL(HttpServletRequest request) throws UnsupportedEncodingException {
        StringBuffer requestURL = request.getRequestURL();
		String scheme = request.getHeader("x-forwarded-proto");
		if(scheme != null && scheme.length() > 0) {
			requestURL = new StringBuffer(requestURL.toString().replaceAll("^https?", scheme));
		}
        String queryString = request.getQueryString();

        if (queryString == null) {
            return requestURL.toString();
        } else {
            return requestURL.append('?').append(queryString).toString();
        }
    }

    @Override
    protected void doService(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String rid;
        try {
            rid = WebHelper.extractHeadersFromRequest(req);
        }catch (IndexOutOfBoundsException e) {
            // workaround - java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0 - когда заголовок содержит пустой authorization
            Request base = Request.getBaseRequest(req);
            rid = WebHelper.extractHeadersFromRequest(base);
        }
        final AsyncContext ac = req.startAsync(req, resp);
        ac.setTimeout(0);	// disable async timeout - use future timeout
        try {
            final String session = req.getSession().getId();
            final Object tokenObj = req.getSession().getAttribute("token");
            final String token = tokenObj != null ? tokenObj.toString() : null;
            final Principal principal = Subject.getSubject(AccessController.getContext()).getPrincipals().iterator().next();
            final String user = principal.getName();

            // construct proc 
            final String proc = req.getMethod().toLowerCase();
            
            // construct bean path
            final String beanPath = req.getServletPath().toLowerCase();
            
            // construct params json
            JsonElement postObj = null;
            
            if(proc.equals("post")){
                // note: don`t read binary data
                if(req.getHeader("Content-Type") == null || !req.getHeader("Content-Type").contains("application/octet-stream")){
                    try {
                        StringBuffer jb = new StringBuffer();
                        String line = null;
                        BufferedReader reader = req.getReader();
                        while ((line = reader.readLine()) != null){
                            jb.append(line);
                        }

                        JsonElement jElt = GsonWrapper.fromJson(jb.toString(), JsonElement.class);
                        if(jElt instanceof JsonPrimitive){
                            String unescapedStr = StringEscapeUtils.unescapeJava(jb.toString());
                            while(unescapedStr.startsWith("\"")){
                                unescapedStr = unescapedStr.substring(1);
                            }
                            while(unescapedStr.endsWith("\"")){
                                unescapedStr = unescapedStr.substring(0, unescapedStr.length() - 1);
                            }
                            jElt = GsonWrapper.fromJson(unescapedStr, JsonElement.class);
                        }
                        postObj = jElt;

                    } catch(Exception e){}
                }
            }
            
            JsonObject pObj = new JsonObject();

            Map<String, String[]> pMap = req.getParameterMap();
            for (String pName : pMap.keySet()) {
                String value = req.getParameter(pName).trim();
                if (value.startsWith("{") || value.startsWith("[")) {
                    JsonElement jElt = GsonWrapper.fromJson(value, JsonElement.class);
                    pObj.put(pName, jElt);
                } else {
                    try {
                        JsonElement jElt = GsonWrapper.fromJson(value, JsonElement.class);
                        pObj.put(pName, jElt);
                    } catch (Throwable e) {
                        pObj.put(pName, value);
                    }
                }
            }

            final JsonObject fpObj = pObj;
            final JsonElement fPostObj = postObj;

            String params = fpObj.toJson();
            String postBody = null;
            if(fPostObj != null){
                postBody = fPostObj.toString();
            }

            String clientIp = WebHelper.extractRealIpFromRequest(req);
            HttpJsbServlet.this.execCmd(beanPath, proc, params, postBody, session, clientIp, user, rid, getFullURL(req), token, ac);

        } catch (Exception ex) {
            this.responseError(ex.getMessage(), req, resp);
            ac.complete();
        }
    }

    public void responseError(Object error, ServletRequest req, ServletResponse resp) throws UnsupportedEncodingException, IOException {
        JsObject jObj = new JsObject(JsObjectType.JSONOBJECT);
        jObj.addToObject("success", false);
        jObj.addToObject("result", "");
        if(error instanceof JsObject) {
        	jObj.addToObject("error", (JsObject)error);
        } else {
        	jObj.addToObject("error", error.toString());
        } 

        this.responseJson(jObj, req, resp, null, "");
    }

    public void responseResult(UpdateStatusMessage respObj, ServletRequest req, ServletResponse resp) throws IOException {
        String mode = req.getParameter("mode");
        String compression = "";
        String contentType = null, encoding = null, contentDisposition = null;
        if (mode == null || mode.trim().length() == 0) {
            if (respObj != null && respObj.result != null) {
                JsObject execOpts = ((JsObject)respObj.result).getAttribute("opts");
                JsObject modeObj = execOpts.getAttribute("mode");
                if (modeObj != null && modeObj.getResultType() == JsObjectType.STRING) {
                    mode = modeObj.getString();
                }
                JsObject compressionObj = execOpts.getAttribute("compression");
                if (compressionObj != null && compressionObj.getResultType() == JsObjectType.STRING) {
                	compression = compressionObj.getString();
                }
            }
        }
        

        if (respObj != null && respObj.result != null) {
            JsObject execOpts = ((JsObject)respObj.result).getAttribute("opts");

            JsObject ctObj = execOpts.getAttribute("contentType");
            if (ctObj != null && ctObj.getResultType() == JsObjectType.STRING) {
                contentType = ctObj.getString();
            }

            JsObject encObj = execOpts.getAttribute("encoding");
            if (encObj != null && encObj.getResultType() == JsObjectType.STRING) {
                encoding = encObj.getString();
            }

            JsObject dispObj = execOpts.getAttribute("contentDisposition");
            if (dispObj != null && dispObj.getResultType() == JsObjectType.STRING) {
                contentDisposition = dispObj.getString();
            }
        }

        if (mode == null || mode.trim().length() == 0) {
            mode = "text";
        }

        if (mode.equalsIgnoreCase("json")) {
        	JsObject execObj = ((JsObject)respObj.result).getAttribute("exec");
        	this.responseJson(execObj, req, resp, contentType, compression);
        } else if (mode.equalsIgnoreCase("binary") || mode.equalsIgnoreCase("bytes") || mode.equalsIgnoreCase("text") || mode.equalsIgnoreCase("html")) {
            if (respObj.status == ExecutionStatus.SUCCESS) {
                if (contentType != null) {
                    resp.setContentType(contentType);
                    ((HttpServletResponse)resp).addHeader("Content-Type", contentType);
                }
                if (encoding != null) {
                    resp.setCharacterEncoding(encoding);
                }
                if (contentDisposition != null) {
                    ((HttpServletResponse)resp).addHeader("Content-Disposition", contentDisposition);
                }
                JsObject data = ((JsObject)respObj.result).getAttribute("exec");
                if(data.getResultType() != JsObjectType.NULL){
                	resp.setCharacterEncoding("UTF-8");
                	byte[] outData = data.toByteArray();
                	if(bCompressionEnabled && outData.length > compressionMinSize && !compression.equalsIgnoreCase("none") ) {
                		((HttpServletResponse)resp).addHeader("Content-Encoding", "gzip");
                    	GZIPOutputStream gzipOutputStream = new GZIPOutputStream(resp.getOutputStream());
                    	gzipOutputStream.write(outData);
                    	gzipOutputStream.close();
                	} else {
                		resp.getOutputStream().write(outData);
                	}
                    
//                	this.responseBytes(data.toByteArray(), req, resp);
                }
            } else {
                this.responseBytes(new byte[]{}, req, resp);
                throw new PlatformException(respObj.error);
            }
        }

    }

    private void responseBytes(byte[] byteArr, ServletRequest req, ServletResponse resp) throws IOException {
        resp.setCharacterEncoding("UTF-8");
        resp.getOutputStream().write(byteArr);
    }

    private void responseJson(JsObject jObj, ServletRequest req, ServletResponse resp, String contentType, String compression) throws UnsupportedEncodingException, IOException {
        String result = jObj.toJS(false);
        if (result != null && result.length() > 0) {
            if (req.getParameterMap().containsKey("callback")) {
                result = String.format("%s(%s);", req.getParameter("callback"), result);
            }
            resp.setCharacterEncoding("UTF-8");
            if (contentType != null) {
                resp.setContentType(contentType);
                ((HttpServletResponse)resp).addHeader("Content-Type", contentType);
            } else {
	            resp.setContentType("application/json; charset=UTF-8");
	            ((HttpServletResponse)resp).addHeader("Content-Type", "application/json; charset=UTF-8");
            }
            byte[] outData = result.getBytes("UTF-8");
            if(bCompressionEnabled && outData.length > compressionMinSize && !compression.equalsIgnoreCase("none")) {
            	((HttpServletResponse)resp).addHeader("Content-Encoding", "gzip");
                GZIPOutputStream gzipOutputStream = new GZIPOutputStream(resp.getOutputStream());
                gzipOutputStream.write(outData);
                gzipOutputStream.close();
            } else {
            	resp.getOutputStream().write(outData);
            }
            
        } else {
            // respond error (404)
        	((HttpServletResponse)resp).sendError(404);
        }
    }
    
    public void processExecResultAsync(Object resultObj, Object fail, AsyncContext ac) throws UnsupportedEncodingException, IOException{
    	UpdateStatusMessage respObj = new UpdateStatusMessage("");
    	try {
	    	if(fail != null){
	    		// response error
	    		if(fail instanceof NativeObject) {
	    			this.responseError(new JsObjectSerializerHelper().serializeNative(fail), ac.getRequest(), ac.getResponse());
	    		} else {
	    			this.responseError(fail, ac.getRequest(), ac.getResponse());
	    		}
	    	} else if(resultObj != null){
	    		respObj.error = null;
    			respObj.result = new JsObjectSerializerHelper().serializeNative(resultObj);
		    	respObj.status = ExecutionStatus.SUCCESS;
		    	this.responseResult(respObj, ac.getRequest(), ac.getResponse());
    		}
    	} finally {
    		ac.complete();
    	}
    	
    	
    }

    private void execCmd(String beanPath, String proc, String params, String postBody, String session, String clientAddr, String user, String rid, String uri, String token, AsyncContext ac) throws UnsupportedEncodingException {
        Timeout timeout = ActorHelper.getInfiniteTimeout();
        ExecuteScriptMessage msg = new ExecuteScriptMessage(String.format("(function(){ return JSB.getInstance('JSB.Web.HttpJsb').exec('%s','%s', [%s, decodeURIComponent('%s'), %s]); })()", beanPath, proc, params, URLEncoder.encode(uri, "UTF-8"), postBody), false);
        msg.setUserToken(token);
        msg.setScopePath(session);
        msg.setClientAddr(clientAddr);
        msg.setUser(user);
        msg.setClientRequestId(rid);
        msg.addThreadLocal("__request", ac.getRequest());
        msg.addThreadLocal("__response", ac.getResponse());
        msg.addThreadLocal("__context", ac);
        msg.addThreadLocal("__servlet", this);
        
        ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), msg, timeout);	// HttpJsb.exec will call processExecResultAsync
    }


}

