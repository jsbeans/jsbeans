package org.jsbeans.scripting;

import org.jsbeans.servicemanager.Command;
import org.mozilla.javascript.ScriptableObject;

public class JsTimeoutMessage implements Command<JsTimeoutMessage> {
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
