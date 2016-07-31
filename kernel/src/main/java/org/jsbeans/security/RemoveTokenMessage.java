package org.jsbeans.security;

import org.jsbeans.messages.AbstractMessage;

public class RemoveTokenMessage extends AbstractMessage<Boolean> {
    private static final long serialVersionUID = 7757353029559522315L;

    private String token;

    public RemoveTokenMessage(String token) {
        this.token = token;
    }

    public String getToken() {
        return this.token;
    }

}
