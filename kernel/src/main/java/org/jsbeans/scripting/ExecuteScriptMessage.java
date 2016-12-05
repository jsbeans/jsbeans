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

import org.jsbeans.messages.Message;
import org.mozilla.javascript.Function;

import java.util.HashMap;
import java.util.Map;

public class ExecuteScriptMessage implements Message {
    private static final long serialVersionUID = 4816471636009002875L;

    private String scriptBody = null;
    private boolean async = false;
    private String clientAddr = "";
    private String scopePath = "";
    private Function scriptable = null;
    private String userToken = null;
    private String token = null;
    private Object[] args;
    private Map<String, Object> wrappedObjects = null;
    private boolean temporaryScope = false;
    private String dispatcher = null;
    private String user = null;
    private String clientRequestId = null;

    public ExecuteScriptMessage(String script) {
        this.scriptBody = script;
    }

    public ExecuteScriptMessage(String script, boolean async) {
        this.scriptBody = script;
        this.async = async;
    }

    public ExecuteScriptMessage(String token, Function func, Object[] args) {
        this.scriptable = func;
        this.token = token;
        this.args = args;
    }

    public String getUserToken() {
        return this.userToken;
    }

    public void setUserToken(String t) {
        this.userToken = t;
    }

    public String getToken() {
        return this.token;
    }

    public void setToken(String t) {
        this.token = t;
    }

    public Function getFunction() {
        return this.scriptable;
    }

    public Object[] getArgs() {
        return this.args;
    }

    public String getScopePath() {
        return this.scopePath;
    }

    public void setScopePath(String p) {
        this.scopePath = p;
    }

    public String getClientAddr() {
        return this.clientAddr;
    }

    public void setClientAddr(String a) {
        this.clientAddr = a;
    }

    public String getClientRequestId() {
        return this.clientRequestId;
    }

    public void setClientRequestId(String rid) {
        this.clientRequestId = rid;
    }

    public boolean isTemporaryScope() {
        return this.temporaryScope;
    }

    public void setTemporaryScope(boolean b) {
        this.temporaryScope = b;
    }

    public String getBody() {
        return this.scriptBody;
    }

    public boolean isAsync() {
        return this.async;
    }

    public String getDispatcher() {
        return this.dispatcher;
    }

    public void setDispatcher(String d) {
        this.dispatcher = d;
    }

    public void addWrapped(String key, Object obj) {
        if (this.wrappedObjects == null) {
            this.wrappedObjects = new HashMap<String, Object>();
        }

        this.wrappedObjects.put(key, obj);
    }

    public Map<String, Object> getWrapped() {
        return this.wrappedObjects;
    }

    public void clearWrapped() {
        if (this.wrappedObjects != null) {
            this.wrappedObjects.clear();
            this.wrappedObjects = null;
        }
    }

    public String getUser() {
        return this.user;
    }

    public void setUser(String user) {
        this.user = user;
    }
}
