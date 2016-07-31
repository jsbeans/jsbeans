package org.jsbeans.scripting.jso;

import org.jsbeans.messages.Message;
import org.jsbeans.scripting.UpdateStatusMessage;

public class UpdateRpcMessage implements Message {
    private static final long serialVersionUID = 6285278111095296262L;
    public UpdateStatusMessage jsStatusMessage;
    private String sessionId;
    private String entryId;

    public UpdateRpcMessage(String session, String entry, UpdateStatusMessage status) {
        this.sessionId = session;
        this.entryId = entry;
        this.jsStatusMessage = status;
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
}
