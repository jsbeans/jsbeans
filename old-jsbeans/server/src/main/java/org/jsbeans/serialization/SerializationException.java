package org.jsbeans.serialization;

@SuppressWarnings("unused")
public class SerializationException extends RuntimeException {
    private static final long serialVersionUID = 7744293614028670884L;

    public SerializationException() {
        super();
    }

    public SerializationException(String message, Throwable ex) {
        super(message, ex);
    }

    public SerializationException(String message) {
        super(message);
    }

    public SerializationException(Throwable ex) {
        super(ex);
    }
}
