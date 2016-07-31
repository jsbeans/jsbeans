package org.jsbeans.scripting.jsb;

import org.jsbeans.servicemanager.Command;
import org.jsbeans.types.JsObject;

public class RpcMessage implements Command<RpcMessage> {
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

