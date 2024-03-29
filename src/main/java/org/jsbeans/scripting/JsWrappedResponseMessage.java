/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.scripting;

import org.jsbeans.helpers.ExceptionHelper;
import org.jsbeans.messages.Message;
import org.jsbeans.messages.SubjectMessage;

import java.io.Serializable;

public class JsWrappedResponseMessage extends SubjectMessage {
    private static final long serialVersionUID = -7986381147151427157L;
    public boolean success = false;
    public Serializable result;
    public String errorMsg = "";

    public JsWrappedResponseMessage(String respStr) {
        this.success = true;
        this.result = respStr;
    }

    public JsWrappedResponseMessage(Message respMsg) {
        this.success = true;
        this.result = respMsg;
    }

    public JsWrappedResponseMessage(Throwable fail) {
        this.success = false;
        this.errorMsg = fail.getMessage() + '\n' + ExceptionHelper.getStackTraceFull(fail);
    }

    public JsWrappedResponseMessage(Serializable serializable) {
        this.success = true;
        this.result = serializable;
    }
}
