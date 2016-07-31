package org.jsbeans.security.basic;

import org.jsbeans.helpers.AuthHelper;
import org.jsbeans.security.AuthMessage;
import org.jsbeans.security.Authenticator;
import org.jsbeans.security.UserCredentialsRepository;

public class BasicAuthenticator extends Authenticator {

    public BasicAuthenticator(UserCredentialsRepository repo) {
        super(repo);
    }

    @Override
    public boolean checkAuth(AuthMessage msg) {
        BasicAuthMessage basicMsg = (BasicAuthMessage) msg;
        String pHash = this.getUserCredentialsRepository().getHash(basicMsg.getUserName());

        // generate MD5-based password hash from the source
        String md5hash = AuthHelper.md5(basicMsg.getUserName() + '@' + basicMsg.getPassword());
        if (md5hash == null) {
            return false;
        }
        return md5hash.equalsIgnoreCase(pHash);
    }

}
