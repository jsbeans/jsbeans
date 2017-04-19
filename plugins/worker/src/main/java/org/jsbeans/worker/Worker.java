package org.jsbeans.worker;

public interface Worker {
    void start();
    void stop();

    default String getName() {
        return this.getClass().getSimpleName();
    }
}
