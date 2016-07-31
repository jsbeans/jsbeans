package org.jsbeans.messages;

public interface ResponsibleMessage<T> extends Message {
    ReponseMessage<T> createResponse(T response);

    ResponseError createError(Throwable response);
}
