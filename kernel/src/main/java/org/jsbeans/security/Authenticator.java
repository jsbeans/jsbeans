package org.jsbeans.security;

public abstract class Authenticator {
    private UserCredentialsRepository repo;

    public Authenticator(UserCredentialsRepository repo) {
        this.repo = repo;
    }

    protected UserCredentialsRepository getUserCredentialsRepository() {
        return this.repo;
    }

    public abstract boolean checkAuth(AuthMessage msg);
}
