package org.jsbeans.security.otp;

import org.jsbeans.security.Auth;
import org.jsbeans.security.AuthMessage;

@Auth(auth = OtpAuthenticator.class)
public class OtpAuthMessage extends AuthMessage {
    private static final long serialVersionUID = 4464489967494236556L;
    private String otp;

    public OtpAuthMessage(String userName, String otp) {
        super(userName);
        this.otp = otp;
    }

    public String getOtp() {
        return this.otp;
    }
}
