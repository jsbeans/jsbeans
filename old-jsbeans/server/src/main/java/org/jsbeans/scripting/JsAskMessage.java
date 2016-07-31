package org.jsbeans.scripting;

import org.jsbeans.servicemanager.Command;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptableObject;

public class JsAskMessage implements Command<JsWrappedResponseMessage> {

    private String targetSvcName;
    private String messageTypeName;
    private NativeObject messageData = null;
    private ScriptableObject callback = null;
    private String token = null;
    private String scopePath = null;
    private String user = null;
    private String userToken = null;
    private String clientRequestId = null;
    private String clientAddr = null;
    private boolean tell = false;
    private String dispatcher = null;
    private Long timeout = null;

    public JsAskMessage(String token, String scopePath, String svcName, String msgType) {
        this.targetSvcName = svcName;
        this.messageTypeName = msgType;
        this.scopePath = scopePath;
        this.token = token;
    }

    public JsAskMessage(String token, String scopePath, String svcName, String msgType, NativeObject msgData) {
        this(token, scopePath, svcName, msgType);
        this.messageData = msgData;
    }

    public JsAskMessage(String token, String scopePath, String svcName, String msgType, NativeObject msgData, ScriptableObject callback, Long timeout) {
        this(token, scopePath, svcName, msgType, msgData);
        this.callback = callback;
        this.timeout = timeout;
    }

    public String getTargetServiceName() {
        return this.targetSvcName;
    }

    public String getMessageTypeName() {
        return this.messageTypeName;
    }

    public NativeObject getMessageBody() {
        return this.messageData;
    }

    public ScriptableObject getCallback() {
        return this.callback;
    }

    public String getToken() {
        return this.token;
    }

    public String getScopePath() {
        return this.scopePath;
    }

    public String getUser() {
        return this.user;
    }

    public void setUser(String u) {
        this.user = u;
    }

    public String getUserToken() {
        return this.userToken;
    }

    public void setUserToken(String t) {
        this.userToken = t;
    }

    public String getClientRequestId() {
        return this.clientRequestId;
    }

    public void setClientRequestId(String rid) {
        this.clientRequestId = rid;
    }

    public String getClientAddr() {
        return this.clientAddr;
    }

    public void setClientAddr(String addr) {
        this.clientAddr = addr;
    }

    public boolean isTell() {
        return this.tell;
    }

    public void setTell(boolean b) {
        this.tell = b;
    }

    public String getDispatcher() {
        return this.dispatcher;
    }

    public void setDispatcher(String d) {
        this.dispatcher = d;
    }

    public Long getTimeout() {
        return this.timeout;
    }
}
