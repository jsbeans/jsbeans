/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.scripting.jso;

public class JsoLoadCompleteMessage extends JsoRegistryMessage {
    private static final long serialVersionUID = -7294933314755693494L;

    private boolean success;
    private String widgetPath;
    private String error;

    public JsoLoadCompleteMessage(String path) {
        this.success = true;
        this.widgetPath = path;
    }

    public JsoLoadCompleteMessage(String path, Throwable err) {
        this.error = err.getMessage();
        this.success = false;
        this.widgetPath = path;
    }

    public boolean getSuccess() {
        return this.success;
    }

    public String getPath() {
        return this.widgetPath;
    }

    public String getError() {
        return this.error;
    }

}
