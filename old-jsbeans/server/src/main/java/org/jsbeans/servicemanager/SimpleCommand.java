package org.jsbeans.servicemanager;

public class SimpleCommand<A, R> extends SimpleMessage<A> implements Command<R> {

    public SimpleCommand(A value) {
        super(value);
    }

    @Override
    public Class<R> resultType() {
        return null;
    }
}
