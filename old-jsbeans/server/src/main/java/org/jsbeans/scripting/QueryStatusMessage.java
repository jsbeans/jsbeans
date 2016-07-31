package org.jsbeans.scripting;

import org.jsbeans.servicemanager.Command;

public class QueryStatusMessage implements Command<UpdateStatusMessage> {
    private static final long serialVersionUID = -2152410407478427511L;
    public ExecutionStatus status;
    public String token;
    public String result = "";

    public QueryStatusMessage(String t) {
        this.token = t;
    }
}
