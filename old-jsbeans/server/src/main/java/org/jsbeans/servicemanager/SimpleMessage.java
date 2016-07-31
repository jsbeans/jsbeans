package org.jsbeans.servicemanager;

public class SimpleMessage<T> implements Message {

    private final T value;

    public SimpleMessage(T value) {
        this.value = value;
    }

//    @Override
//    public Collection<Class<?>> argumentsTypes() {
//        return Arrays.asList(value != null ? value.getClass() : Object.class);
//    }

    public T getValue() {
        return value;
    }
}
