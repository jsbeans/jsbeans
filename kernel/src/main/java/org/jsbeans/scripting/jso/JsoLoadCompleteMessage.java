package org.jsbeans.scripting.jso;

public class JsoLoadCompleteMessage extends JsoRegistryMessage {
    private static final long serialVersionUID = -7294933314755693494L;

    private boolean success;
    private String widgetPath;
    private String error;

    public JsoLoadCompleteMessage(String path) {
        this.success = true;
        this.widgetPath = path;
    }

    public JsoLoadCompleteMessage(String path, Throwable err) {
        this.error = err.getMessage();
        this.success = false;
        this.widgetPath = path;
    }

    public boolean getSuccess() {
        return this.success;
    }

    public String getPath() {
        return this.widgetPath;
    }

    public String getError() {
        return this.error;
    }

}
