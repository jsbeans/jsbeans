/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.scripting;

import org.jsbeans.messages.Message;
import org.mozilla.javascript.ScriptableObject;

public class JsTimeoutMessage implements Message {
    private static final long serialVersionUID = -3148776997600008010L;
    private long duration;
    private TimeoutType type;
    private ScriptableObject callback = null;
    private String token = null;
    private String scopePath = null;
    private String user = null;
    private String userToken = null;
    private String key = null;
    private String clientRequestId = null;
    private String clientAddr = null;
    public JsTimeoutMessage(TimeoutType type, String token, String session, ScriptableObject callback, long duration) {
        this.type = type;
        this.token = token;
        this.scopePath = session;
        this.callback = callback;
        this.duration = duration;
    }

    public JsTimeoutMessage(TimeoutType type, String key) {
        this.type = type;
        this.key = key;
    }

    public static JsTimeoutMessage createSetTimeout(String token, String session, ScriptableObject callback, long duration) {
        return new JsTimeoutMessage(TimeoutType.setTimeout, token, session, callback, duration);
    }

    public static JsTimeoutMessage createSetInterval(String token, String session, ScriptableObject callback, long duration) {
        return new JsTimeoutMessage(TimeoutType.setInterval, token, session, callback, duration);
    }

    public static JsTimeoutMessage createClearTimeout(String key) {
        return new JsTimeoutMessage(TimeoutType.clearTimeout, key);
    }

    public static JsTimeoutMessage createClearInterval(String key) {
        return new JsTimeoutMessage(TimeoutType.clearInterval, key);
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

    public long getDuration() {
        return this.duration;
    }

    public TimeoutType getType() {
        return this.type;
    }

    public String getKey() {
        return this.key;
    }

    public void setKey(String key) {
        this.key = key;
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

    public static enum TimeoutType {
        setTimeout,
        setInterval,
        clearTimeout,
        clearInterval
    }
}
