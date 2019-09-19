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
import java.util.List;

public class UpdateStatusMessage implements Message {
    private static final long serialVersionUID = -6675337814825208234L;

    public ExecutionStatus status;
    public String token;
    public Object result;
    public String error;
    public List<String> subTokens = null;

    public UpdateStatusMessage(String t) {
        this.token = t;
    }
}
