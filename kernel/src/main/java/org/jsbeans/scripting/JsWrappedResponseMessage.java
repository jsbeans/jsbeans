package org.jsbeans.scripting;

import org.jsbeans.helpers.ExceptionHelper;
import org.jsbeans.messages.Message;

import java.io.Serializable;

public class JsWrappedResponseMessage implements Message {
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
