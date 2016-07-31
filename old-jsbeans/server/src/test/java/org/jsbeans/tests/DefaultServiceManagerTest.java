package org.jsbeans.tests;

import org.jsbeans.Config;
import org.jsbeans.servicemanager.*;
import org.jsbeans.servicemanager.defaultmanager.DefaultServiceManager;
import org.jsbeans.utils.ExceptionUtils;
import org.junit.Test;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

public class DefaultServiceManagerTest extends BaseTest {

    @Test
    public void subscribeOnceTest() throws InterruptedException {
        Message myevent = new Message() {
        };
        CountDownLatch ok = new CountDownLatch(1);
        serviceManager.subscribeOnce(myevent.getClass(), event -> {
            assert (event == myevent);
            ok.countDown();
        });

        serviceManager.fire(myevent);

        assert (ok.await(1000, TimeUnit.MILLISECONDS));
    }

    @Test
    public void subscribeTest() throws InterruptedException {
        Message myevent = new Message() {
        };
        AtomicInteger total = new AtomicInteger(0);
        CountDownLatch ok1 = new CountDownLatch(6);
        CountDownLatch ok2 = new CountDownLatch(6);
        Runnable unsubscribe1 = serviceManager.subscribe(myevent.getClass(), event -> {
            assert (event == myevent);
            L.warn("ok1");
            total.incrementAndGet();
            ok1.countDown();
        });
        Runnable unsubscribe2 = serviceManager.subscribe(myevent.getClass(), event -> {
            assert (event == myevent);
            if (total.incrementAndGet() > 6) {
                L.warn("ok2");
                ok2.countDown();
            } else {
                L.warn("ok1");
                ok1.countDown();
            }
        });

        serviceManager.fire(myevent);
        serviceManager.fire(myevent);
        serviceManager.fire(myevent);

        assert (ok1.await(1000, TimeUnit.MILLISECONDS));
        assert (total.get() == 6);

        unsubscribe1.run();
        serviceManager.subscribeOnce(myevent.getClass(), event -> {
            assert (event == myevent);
            total.incrementAndGet();
            ok2.countDown();
            L.info("ok2 - once");
        });
        serviceManager.fire(myevent);
        serviceManager.fire(myevent);
        serviceManager.fire(myevent);
        serviceManager.fire(myevent);
        serviceManager.fire(myevent);

        assert (ok2.await(1000, TimeUnit.MILLISECONDS));

        assert (total.get() == 12);
        unsubscribe2.run();
    }

    @Test
    public void startStopServiceTest() throws InterruptedException {
        CountDownLatch start = new CountDownLatch(1);
        CountDownLatch stop = new CountDownLatch(1);
        AtomicInteger total = new AtomicInteger(0);
        class Svc implements Service {
            @Override
            public void start() {
                start.countDown();
            }

            @Override
            public void stop() {
                stop.countDown();
            }

            @Override
            public void accept(Message cmd) {
                total.incrementAndGet();
            }
        }

        serviceManager.startAndWait(Svc.class, man -> new Svc());
        assert (start.await(1000, TimeUnit.MILLISECONDS));

        serviceManager.stopAndWait(Svc.class);
        assert (stop.await(1000, TimeUnit.MILLISECONDS));

        try {
            serviceManager.tell(Svc.class, new SimpleMessage<>(""));
            assert (false);
        } catch (DefaultServiceManager.ServiceNotFoundException e) {
            // ok
        }

        assert (total.get() == 0);
    }

    @Test
    public void askTest() throws InterruptedException, ExecutionException {

        //TODO send answer
        Command<Object> mycmd1 = new SimpleCommand<>("");
        Command<Object> mycmd2 = new SimpleCommand<>("");

        CountDownLatch okIn = new CountDownLatch(2);
        CountDownLatch okAfter = new CountDownLatch(2);
        AtomicInteger total = new AtomicInteger(0);
        class Svc implements Service {
            @Override
            public void accept(Message cmd) {
            }

            @Override
            public CompletableFuture<?> apply(Command<?> cmd) {
                assert (cmd == mycmd1 || cmd == mycmd2);
                L.info("ok {}", cmd == mycmd2);
                if (total.incrementAndGet() > 1) {
                    try {
                        Thread.sleep(200);
                    } catch (InterruptedException e) {
                        throw ExceptionUtils.runtime(e);
                    }
                }
                okIn.countDown();
                return CompletableFuture.completedFuture(cmd);
            }
        }

        serviceManager.startAndWait(Svc.class, man -> new Svc());

        CompletableFuture.completedFuture(mycmd1).whenCompleteAsync((result, error) -> {
            assert (result == mycmd1);
        });

        AtomicReference<Throwable> error = new AtomicReference<>();
        serviceManager.ask(Svc.class, mycmd1).whenCompleteAsync((result, e) -> {
            if (e != null) {
                error.set(e);
            } else {
                L.info("ok {}", result == mycmd2);
                assert (result == mycmd1);
            }
            total.incrementAndGet();
            okAfter.countDown();
        });
        serviceManager.ask(Svc.class, mycmd1).whenCompleteAsync((result, e) -> {
            if (e != null) {
                error.set(e);
            } else {
                L.info("ok {}", result == mycmd2);
                assert (result == mycmd1);
            }
            total.incrementAndGet();
            okAfter.countDown();
        });
        serviceManager.ask(Svc.class, mycmd2).whenCompleteAsync((result, e) -> {
            // запрос может успеть уйти в очередь и выполнится, но калбек все равно вызван не будет
            assert (false);
        }).cancel(false);

        assert (okIn.await(1000, TimeUnit.MILLISECONDS));
        assert (okAfter.await(1000, TimeUnit.MILLISECONDS));

        L.info("total " + total.get());

        // т.к. запрос может успеть уйти в очередь и обработаться сервисом
        assert (total.get() == 5 || total.get() == 4);

        serviceManager.stopAndWait(Svc.class);
    }

    @Test
    public void localConfigTest() throws InterruptedException {
        CountDownLatch ok = new CountDownLatch(3);
        class Svc implements Service {
            @Override
            public void start() {
                assert (Config.local() == config);
                ok.countDown();
                L.info("start");
            }

            @Override
            public void stop() {
                assert (Config.local() == config);
                L.info("stop");
            }

            @Override
            public CompletableFuture<?> apply(Command<?> cmd) {
                assert (Config.local() == config);
                ok.countDown();
                L.info("apply(Command)");
                return null;
            }

            @Override
            public void accept(Message cmd) {
                assert (Config.local() == config);
                ok.countDown();
                L.info("apply(Message)");
            }
        }

        serviceManager.startAndWait(Svc.class, man -> new Svc());
        serviceManager.tell(Svc.class, new SimpleMessage<>(""));
        serviceManager.ask(Svc.class, new SimpleCommand<Object, Object>("")).thenAccept((r) -> {
        });

        assert (ok.await(100000, TimeUnit.MILLISECONDS));
        serviceManager.stopAndWait(Svc.class);
    }

    @Test
    public void failServiceStartTest() throws InterruptedException {
        class MyException extends RuntimeException {
        }

        class Svc implements Service {
            @Override
            public void start() {
                throw new MyException();
            }

            @Override
            public void accept(Message cmd) {
            }
        }

        try {
            serviceManager.startAndWait(Svc.class, man -> new Svc());
            assert (false);
        } catch (DefaultServiceManager.StartingServiceException e) {
            assert (e.getCause() instanceof MyException);
        }
        serviceManager.stopAndWait(Svc.class);
    }

    @Test
    public void failServiceStopTest() throws InterruptedException {
        class MyException extends RuntimeException {
        }

        class Svc implements Service {
            @Override
            public void stop() {
                throw new MyException();
            }

            @Override
            public void accept(Message cmd) {
            }
        }

        serviceManager.startAndWait(Svc.class, man -> new Svc());
        try {
            serviceManager.stopAndWait(Svc.class);
            assert (false);
        } catch (DefaultServiceManager.StoppingServiceException e) {
            assert (e.getCause() instanceof MyException);
        }
    }
}
