package org.jsbeans.scripting.jso;

import org.jsbeans.types.JsObject;

public class RpcEntry {
    private JsObject result = null;
    private String error = "";
    private boolean completed = false;
    private boolean success = true;

    public RpcEntry() {
    }

    public RpcEntry(JsObject r) {
        this.result = r;
        this.success = true;
        this.completed = true;
    }

    public RpcEntry(Throwable e) {
        this.completed = true;
        this.success = false;
        this.error = e.getMessage();
    }

    public JsObject getResult() {
        return this.result;
    }

    public void setResult(JsObject r) {
        this.result = r;
        this.success = true;
        this.completed = true;
    }

    public String getError() {
        return this.error;
    }

    public void setError(String e) {
        this.success = false;
        this.error = e;
        this.completed = true;
    }

    public boolean isCompleted() {
        return this.completed;
    }

    public boolean isSuccess() {
        return this.success;
    }

};