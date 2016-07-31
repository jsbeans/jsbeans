package org.jsbeans.security.otp;

import org.jsbeans.PlatformException;
import org.jsbeans.security.AuthMessage;
import org.jsbeans.security.Authenticator;
import org.jsbeans.security.UserCredentialsRepository;

public class OtpAuthenticator extends Authenticator {

    public OtpAuthenticator(UserCredentialsRepository repo) {
        super(repo);
    }

    @Override
    public boolean checkAuth(AuthMessage msg) {
        throw new PlatformException("Not implemented yet");
    }

}
