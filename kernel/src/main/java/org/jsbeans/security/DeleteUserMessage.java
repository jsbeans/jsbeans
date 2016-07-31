package org.jsbeans.security;

public class DeleteUserMessage extends PrincipalMessage<Boolean> {
    private static final long serialVersionUID = 7757353029559522315L;

    private String userName;

    public DeleteUserMessage(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return this.userName;
    }

}
