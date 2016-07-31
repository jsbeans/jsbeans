package org.jsbeans.security.basic;

import org.jsbeans.security.AuthMessage;
import org.jsbeans.security.Authenticator;
import org.jsbeans.security.UserCredentialsRepository;

public class HashAuthenticator extends Authenticator {

    public HashAuthenticator(UserCredentialsRepository repo) {
        super(repo);
    }

    @Override
    public boolean checkAuth(AuthMessage msg) {
        HashAuthMessage hashMsg = (HashAuthMessage) msg;
        String pHash = this.getUserCredentialsRepository().getHash(hashMsg.getUserName());
        String sourceHash = hashMsg.getHash();
        if (pHash == null || sourceHash == null) {
            return false;
        }
        return pHash.equalsIgnoreCase(sourceHash);
    }

}
