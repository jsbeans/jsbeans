package org.jsbeans;

public class PlatformException extends RuntimeException {
    private static final long serialVersionUID = 5680001986990225304L;

    public PlatformException() {
        super();
    }

    public PlatformException(String msg) {
        super(msg);
    }

    public PlatformException(Throwable t) {
        super(t);
    }

    public PlatformException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
