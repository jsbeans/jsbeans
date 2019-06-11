/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.messages;

public class ResponseError extends RuntimeException implements Message {
    private static final long serialVersionUID = -6902095337584876457L;

    private Message request;

    public ResponseError(Message request, Throwable error) {
        super(error.getMessage(), error);
        this.request = request;
    }

    public Message getRequest() {
        return request;
    }

    public Throwable getError() {
        return this.getCause();
    }

}