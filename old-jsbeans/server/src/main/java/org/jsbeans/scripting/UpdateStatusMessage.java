package org.jsbeans.scripting;

import org.jsbeans.servicemanager.Message;
import org.jsbeans.types.JsObject;

import java.util.List;

public class UpdateStatusMessage implements Message {
    private static final long serialVersionUID = -6675337814825208234L;

    public ExecutionStatus status;
    public String token;
    public JsObject result;
    public String error;
    public List<String> subTokens = null;

    public UpdateStatusMessage(String t) {
        this.token = t;
    }
}
