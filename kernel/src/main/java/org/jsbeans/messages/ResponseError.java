package org.jsbeans.messages;

public class ResponseError extends RuntimeException implements Message {
    private static final long serialVersionUID = -6902095337584876457L;

    private Message request;

    public ResponseError(Message request, Throwable error) {
        super(error.getMessage(), error);
        this.request = request;
    }

    public Message getRequest() {
        return request;
    }

    public Throwable getError() {
        return this.getCause();
    }

}