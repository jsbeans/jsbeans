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

import org.jsbeans.types.JsObject;

public class RpcEntry {
    private JsObject result = null;
    private String error = "";
    private boolean completed = false;
    private boolean success = true;
    private long lastUpdated = System.currentTimeMillis();

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
        this.lastUpdated = System.currentTimeMillis();
    }

    public String getError() {
        return this.error;
    }

    public void setError(String e) {
        this.success = false;
        this.error = e;
        this.completed = true;
        this.lastUpdated = System.currentTimeMillis();
    }

    public boolean isCompleted() {
        return this.completed;
    }

    public boolean isSuccess() {
        return this.success;
    }
    
    public long getLastUpdated(){
    	return this.lastUpdated;
    }

};