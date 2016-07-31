package org.jsbeans.security;

public class CreateUserMessage extends PrincipalMessage<Boolean> {
    private static final long serialVersionUID = 7757353029559522315L;

    private String userName;
    private String password;

    public CreateUserMessage(String userName, String password) {
        this.userName = userName;
        this.password = password;
    }

    public String getUserName() {
        return this.userName;
    }

    public String getPassword() {
        return this.password;
    }

}
