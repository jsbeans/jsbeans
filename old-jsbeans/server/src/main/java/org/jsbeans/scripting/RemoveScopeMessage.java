package org.jsbeans.scripting;

import org.jsbeans.servicemanager.Message;

public class RemoveScopeMessage implements Message {

    private String scopePath = null;

    public RemoveScopeMessage(String scopePath) {
        this.scopePath = scopePath;
    }

    public String getScopePath() {
        return this.scopePath;
    }

}
