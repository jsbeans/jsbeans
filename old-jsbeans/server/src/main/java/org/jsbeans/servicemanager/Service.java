package org.jsbeans.servicemanager;

import java.util.concurrent.CompletableFuture;

public interface Service {
    default void start() {
    }

    default void stop() {
    }

    void accept(Message msg);

    default CompletableFuture<?> apply(Command<?> cmd) {
        this.accept(cmd);
        return CompletableFuture.completedFuture(null);
    }

}
