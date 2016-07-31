package org.jsbeans.scripting;

public class RemoveScopeMessage {

    private String scopePath = null;

    public RemoveScopeMessage(String scopePath) {
        this.scopePath = scopePath;
    }

    public String getScopePath() {
        return this.scopePath;
    }

}
