package org.jsbeans.servicemanager;

public class ErrorMessage implements Message {

    private final Throwable error;

    public ErrorMessage(Throwable error) {
        this.error = error;
    }

//    @Override
//    public Collection<Class<?>> argumentsTypes() {
//        return Arrays.asList(Throwable.class);
//    }

    public Throwable getError() {
        return error;
    }
}
