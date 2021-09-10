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

public class LookupJsoMessage extends SubjectMessage {
    private static final long serialVersionUID = -8044548925080524415L;

    private String name;
    private boolean success;
    private JsObject result;
    private String error = "";
    private String sessionId;
    private String user;
    private String userToken;
    private String clientAddr;
    private String clientRequestId;

    public LookupJsoMessage(String name, String sessionId, String clientAddr, String user, String requestId, String userToken) {
        this.setName(name);
        this.sessionId = sessionId;
        this.clientAddr = clientAddr;
        this.user = user;
        this.userToken = userToken;
        this.clientRequestId = requestId;
    }

    public LookupJsoMessage(Throwable t) {
        this.error = t.getMessage();
        this.success = false;
    }

    public LookupJsoMessage(JsObject res) {
        this.result = res;
        this.success = true;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String n) {
        this.name = n;
    }

    public boolean isSuccess() {
        return this.success;
    }

    public JsObject getResult() {
        return this.result;
    }

    public String getError() {
        return this.error;
    }

    public String getSession() {
        return this.sessionId;
    }

    public String getUser() {
        return this.user;
    }

    public String getUserToken() {
        return this.userToken;
    }

    public String getClientAddr() {
        return this.clientAddr;
    }

    public String getClientRequestId() {
        return this.clientRequestId;
    }
}
