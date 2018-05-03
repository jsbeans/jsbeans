/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.scripting.jsb;

import java.io.InputStream;

import org.jsbeans.messages.Message;
import org.jsbeans.types.JsObject;

public class UploadMessage implements Message {
	private static final long serialVersionUID = 1125416428756281194L;
	private String sessionId;
	private String streamId;
	private InputStream stream;
    private String clientIP;
    private String user;
    private String userToken;
    private String clientRequestId;
    private JsObject rpcResult;
    private String error;
    private boolean success;

    public UploadMessage(String streamId, InputStream is, String session, String clientIP, String user, String rid, String userToken) {
        this.streamId = streamId;
        this.stream = is;
    	this.sessionId = session;
        this.clientIP = clientIP;
        this.user = user;
        this.userToken = userToken;
        this.clientRequestId = rid;
    }

    public UploadMessage(JsObject result) {
        this.rpcResult = result;
        this.success = true;
    }

    public UploadMessage(Throwable e) {
        this.error = e.getMessage();
        this.success = false;
    }
    
    public String getStreamId() {
    	return this.streamId;
    }
    
    public InputStream getStream() {
    	return this.stream;
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public String getClientAddr() {
        return this.clientIP;
    }

    public String getClientRequestId() {
        return this.clientRequestId;
    }

    public String getUser() {
        return this.user;
    }

    public String getUserToken() {
        return this.userToken;
    }

    public JsObject getResult() {
        return this.rpcResult;
    }

    public String getError() {
        return this.error;
    }

    public boolean getSuccess() {
        return this.success;
    }
}

