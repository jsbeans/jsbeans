package org.jsbeans.servicemanager;

public interface Command<ResultValue> extends Message {
    default Class<?> resultType() {
        return Object.class;
    }
}
