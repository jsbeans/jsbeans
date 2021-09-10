/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.scripting.jsb;

import org.jsbeans.messages.SubjectMessage;
import org.jsbeans.types.JsObject;

public class RpcMessage extends SubjectMessage {
    private static final long serialVersionUID = -3210242004243442532L;

    private String sessionId;
    private String clientIP;
    private String rpcData;
    private String user;
    private String userToken;
    private String clientRequestId;
    private JsObject rpcResult;
    private String error;
    private boolean success;

    public RpcMessage(String session, String clientIP, String data, String user, String rid, String userToken) {
        this.sessionId = session;
        this.clientIP = clientIP;
        this.rpcData = data;
        this.user = user;
        this.userToken = userToken;
        this.clientRequestId = rid;
    }

    public RpcMessage(JsObject result) {
        this.rpcResult = result;
        this.success = true;
    }

    public RpcMessage(Throwable e) {
        this.error = e.getMessage();
        this.success = false;
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

    public String getRpcData() {
        return this.rpcData;
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

