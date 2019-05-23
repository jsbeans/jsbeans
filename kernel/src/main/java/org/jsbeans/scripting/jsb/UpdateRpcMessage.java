/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.scripting.jsb;

import org.jsbeans.messages.Message;
import org.jsbeans.scripting.UpdateStatusMessage;

public class UpdateRpcMessage implements Message {
    private static final long serialVersionUID = 6285278111095296262L;
    public UpdateStatusMessage jsStatusMessage;
    private String sessionId;
    private String entryId;
    private boolean invokeClient;

    public UpdateRpcMessage(String session, String entry, UpdateStatusMessage status, boolean invokeClient) {
        this.sessionId = session;
        this.entryId = entry;
        this.jsStatusMessage = status;
        this.invokeClient = invokeClient;
    }

    public String getSessionId() {
        return this.sessionId;
    }

    public String getEntryId() {
        return this.entryId;
    }

    public UpdateStatusMessage getStatus() {
        return this.jsStatusMessage;
    }
    
    public boolean needInvokeClient(){
    	return this.invokeClient;
    }
}
