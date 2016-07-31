/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.messages;

public class AbstractMessage<T> implements ResponsibleMessage<T>, ReponseMessage<T>, Cloneable {
    private static final long serialVersionUID = -1L;

    private T response;
//	private Throwable error;

    @Override
    public T getResponse() {
        return response;
    }

//	@Override
//	public Throwable getError() {
//		return error;
//	}

    @Override
    public ReponseMessage<T> createResponse(T response) {
        AbstractMessage<T> resp = clone(this);
        resp.response = response;
        return resp;
    }

    @Override
    public ResponseError createError(Throwable error) {
        return new ResponseError(this, error);
    }

    @SuppressWarnings("unchecked")
    private AbstractMessage<T> clone(AbstractMessage<T> resp) {
        try {
            resp = (AbstractMessage<T>) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Can`t clone " + this.getClass().getName());
        }
        return resp;
    }

}
