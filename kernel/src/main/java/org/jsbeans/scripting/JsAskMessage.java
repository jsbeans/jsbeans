/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.scripting;

import akka.util.Timeout;
import org.jsbeans.messages.Message;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.ScriptableObject;

public class JsAskMessage implements Message {
    private static final long serialVersionUID = -3148776997600008010L;

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
    private Timeout timeout = null;

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

    public JsAskMessage(String token, String scopePath, String svcName, String msgType, NativeObject msgData, ScriptableObject callback, Timeout timeout) {
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

    public Timeout getTimeout() {
        return this.timeout;
    }
}
