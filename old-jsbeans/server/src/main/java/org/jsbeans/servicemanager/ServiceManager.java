package org.jsbeans.servicemanager;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;
import java.util.function.Function;

public interface ServiceManager {

    ThreadLocal<ServiceManager> local = new ThreadLocal<>();

    <TypedService extends Service>
    void startAndWait(Class<TypedService> service, Function<ServiceManager, TypedService> create);

    void stopAndWait(Class<? extends Service> service);

    void stopAndWait();

    void tell(Class<? extends Service> service, Message msg);

    <Result> CompletableFuture<Result> ask(Class<? extends Service> service, Command<Result> cmd);

    ScheduledFuture<?> schedule(Runnable handler, long intervalMills, boolean exactly);

    ScheduledFuture<?> scheduleOnce(Runnable handler, long intervalMills);

    default ScheduledFuture<?> schedule(Class<? extends Service> service, Message event, long intervalMills) {
        return schedule(() -> {
            this.tell(service, event);
        }, intervalMills, true);
    }

    default ScheduledFuture<?> scheduleOnce(Class<? extends Service> service, Message event, long intervalMills) {
        return scheduleOnce(() -> {
            this.tell(service, event);
        }, intervalMills);
    }

    void fire(Message event);

    <EventMessage extends Message, Unsubscribe extends Runnable>
    Unsubscribe subscribe(Class<EventMessage> type, Consumer<EventMessage> handler);

    default <TypedMessage extends Message>
    void subscribeOnce(Class<TypedMessage> type, Consumer<TypedMessage> handler) {
        AtomicReference<Consumer<TypedMessage>> onceHandler = new AtomicReference<>(handler);
        AtomicReference<Runnable> unsubscribe = new AtomicReference<>();
        unsubscribe.set(subscribe(type, msg -> {
            unsubscribe.get().run();
            Consumer<TypedMessage> h = onceHandler.get();
            if (h != null) {
                onceHandler.set(null);
                h.accept(msg);
            }
        }));
    }

}
