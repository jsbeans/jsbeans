package org.jsbeans.security;

import org.jsbeans.messages.AbstractMessage;

public class GetTokenMessage extends AbstractMessage<Token> {
    private static final long serialVersionUID = 4855250223152311634L;

    private String token;

    public GetTokenMessage(String token) {
        this.token = token;
    }

    public String getToken() {
        return this.token;
    }

}
