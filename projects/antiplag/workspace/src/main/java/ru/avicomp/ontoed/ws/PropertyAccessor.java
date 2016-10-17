package ru.avicomp.ontoed.ws;

import java.util.function.Supplier;

public interface PropertyAccessor {
    <T> T self();
    <T> T get(String path);
    <T> void set(String path, T value);

    default boolean remove(String path) {
        Object val = get(path);
        if (val != null) {
            set(path, null);
        }
        return val != null;
    }

    default <T> T getOrSet(String path, Supplier<T> supplier) {
        T value = (T) get(path);
        if (value == null) {
            value = supplier.get();
            set(path, value);
        }
        return value;
    }
}
