package org.jsbeans.servicemanager.defaultmanager;

import org.jsbeans.Config;
import org.jsbeans.servicemanager.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Function;

public class DefaultServiceManager implements ServiceManager {
    private static final Logger L = LoggerFactory.getLogger(DefaultServiceManager.class);

    private final Config config;
    private final Map<Class<? extends Service>, State>
            states = new ConcurrentHashMap<>();
    private final Map<Class<? extends Service>, ServiceWorker>
            workers = new ConcurrentHashMap<>();

    private final ScheduledExecutorService schedulerExecutor;
    private final ExecutorService eventsExecutor;
    private final Map<Class<? extends Message>, Collection<Consumer<? extends Message>>>
            eventHandlers = new ConcurrentHashMap<>();
    private final SynchronousQueue<Runnable> eventsQueue = new SynchronousQueue<>();

    private volatile boolean stopping;
    private List<Class<? extends Service>> order = new CopyOnWriteArrayList<>();


    DefaultServiceManager(Config config) {
        this.config = config;
        L.info("DefaultServiceManager started");

        this.eventsExecutor = new ThreadPoolExecutor(
                0, config.get(this, "eventsMaxThreads", Number.class).orElse(Integer.MAX_VALUE).intValue(),
                60L, TimeUnit.SECONDS,
                eventsQueue,
                run -> new Thread(run, "events-thread"));

        this.schedulerExecutor = Executors.newScheduledThreadPool(
                Runtime.getRuntime().availableProcessors(),
                run -> new Thread(run, "scheduler-thread"));
    }

    @Override
    public void stopAndWait() {
        if (stopping) return;
        // stop all services and self

        stopping = true;

        // reverse order: clear queues and stop services
        Collections.reverse(order);
        order.stream().map(workers::get).forEach(worker -> {
            if (worker != null) worker.queue.clear();
        });
        order.forEach(this::stopAndWait);
        order.clear();

        eventsQueue.clear();
        //fire(new StoppedMessage());
        eventHandlers.clear();
        shutdownAndAwaitTermination(eventsExecutor);
        L.info("DefaultServiceManager stopped");
    }

    /**
     * Start service and wait
     */
    @Override
    public <TypedService extends Service>
    void startAndWait(Class<TypedService> service, Function<ServiceManager, TypedService> create) {

        if (stopping) return;

        if (states.containsKey(service)) {
            throw new ServiceAlreadyExistsException(service, states.get(service));
        }

        order.add(service);
        states.put(service, State.Creating);
        // TODO: вызов конструктора сервиса из его своего потока
        TypedService instance = create.apply(this);
        if (instance == null) {
            throw new ServiceUndefinedException(service, states.get(service));
        }
        //BlockingQueue<Runnable> queue = new SynchronousQueue<Runnable>();
        BlockingQueue<Runnable> queue = new LinkedBlockingQueue<>();
        ExecutorService executor = new ThreadPoolExecutor(
                0, config.get(service, "threads", Number.class).orElse(1).intValue(),
                60L, TimeUnit.SECONDS,
                queue,
                run -> new Thread(run, "thread-service-" + service.getClass().getSimpleName()));

        try {
            ServiceWorker worker = new ServiceWorker(service, instance, executor, queue);
            long waitTimeout = config.get(this, "serviceStartTimeoutMills", Number.class).get().longValue();
            worker.executor.submit(() -> {
                try {
                    states.put(service, State.Starting);
                    configureThread();
                    // wait initial start
                    worker.instance.start();
                    // register working service instance
                    workers.put(service, worker);
                    states.put(service, State.Working);
                } catch (Throwable error) {
                    try {
                        worker.executor.shutdownNow();
                    } catch (Throwable er) {
                        L.error(er.getMessage(), er);
                    }
                    states.remove(worker.service);
                    throw error;
                }
            }).get(waitTimeout, TimeUnit.MILLISECONDS);
            L.info("Service [{}] {} started", order.indexOf(service), service.getName());
        } catch (ExecutionException error) {
            throw new StartingServiceException(service, error.getCause());
        } catch (InterruptedException | TimeoutException error) {
            throw new StartingServiceException(service, error);
        }
    }


    @Override
    public void stopAndWait(Class<? extends Service> service) {
        ServiceWorker worker = workers.remove(service);

        if (worker != null) {
            long waitTimeout = config.get(this, "serviceStopTimeoutMills", Number.class).get().longValue();
            try {
                worker.queue.clear();
                worker.executor.submit(() -> {
                    states.replace(service, State.Stopping);
                    try {
                        configureThread();
                        // wait stop
                        worker.instance.stop();
                        states.remove(service);
                    } catch (Throwable error) {
                        states.replace(service, State.Error);
                        throw error;
                    }
                }).get(waitTimeout, TimeUnit.MILLISECONDS);
                L.info("Service [{}] {} stopped", order.indexOf(service), service.getName());
                shutdownAndAwaitTermination(worker.executor);
            } catch (ExecutionException error) {
                throw new StoppingServiceException(service, error.getCause());
            } catch (InterruptedException | TimeoutException error) {
                throw new StoppingServiceException(service, error);
            }
        }
    }

    private void handleServiceError(ServiceWorker worker, ServiceException error) {
        L.error(error.getMessage(), error);
        this.fire(new ErrorMessage(error));
    }

    private void handleWorkingError(ServiceWorker worker, WorkingServiceException error) {
        L.error(error.getMessage(), error);
        this.fire(new ErrorMessage(error));

    }

    private void handleStoppingError(ServiceWorker worker, StoppingServiceException error) {
        L.error(error.getMessage(), error);
        this.fire(new ErrorMessage(error));

    }

    private void handleEventHandlerError(EventHandlerException error) {
        L.error(error.getMessage(), error);
        this.fire(new ErrorMessage(error));
    }

    private void shutdownAndAwaitTermination(ExecutorService executor) {
        executor.shutdown(); // Disable new tasks from being submitted
        try {
            // Wait a while for existing tasks to terminate
            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
                executor.shutdownNow(); // Cancel currently executing tasks
                // Wait a while for tasks to respond to being cancelled
                if (!executor.awaitTermination(60, TimeUnit.SECONDS))
                    L.error("ExecutorService {} did not terminate", executor);
            }
        } catch (InterruptedException ie) {
            // (Re-)Cancel if current thread also interrupted
            executor.shutdownNow();
            // Preserve interrupt status
            Thread.currentThread().interrupt();
        }
    }

    @Override
    public void tell(Class<? extends Service> service, Message msg) {
        if (stopping) return;
        ServiceWorker worker = workers.get(service);
        if (worker == null) {
            throw new ServiceNotFoundException(service);
        }

        worker.executor.submit(() -> {
            try {
                configureThread();
                worker.instance.accept(msg);
            } catch (Throwable error) {
                handleWorkingError(worker, new WorkingServiceException(service, error));
            }
        });
    }

    private void configureThread() {
        if (Config.localConfig.get() != config || local.get() != this) {
            Config.localConfig.set(config);
            local.set(this);
            L.info("Thread reconfigured", Thread.currentThread().getName());
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public <Result> CompletableFuture<Result> ask(Class<? extends Service> service, Command<Result> cmd) {
        if (stopping) return null;

        ServiceWorker worker = workers.get(service);
        return CompletableFuture.completedFuture(cmd).thenComposeAsync(new Function<Command<Result>, CompletableFuture<Result>>() {
            @Override
            public CompletableFuture<Result> apply(Command<Result> resultCommand) {
                try {
                    configureThread();
                    return (CompletableFuture<Result>) worker.instance.apply(resultCommand);
                } catch (Throwable error) {
                    throw new WorkingServiceException(service, error);
                }
            }
        }, worker.executor);
    }

    @Override
    @SuppressWarnings("unchecked")
    public void fire(Message msg) {
        if (stopping) return;

        eventsExecutor.submit(
                () -> eventHandlers.get(msg.getClass()).forEach(
                        handler -> {
                            configureThread();
                            try {
                                ((Consumer) handler).accept(msg);
                            } catch (Throwable error) {
                                handleEventHandlerError(new EventHandlerException(handler, msg, error));
                            }
                        }
                )
        );
    }

    @Override
    @SuppressWarnings("unchecked")
    public <TypedMessage extends Message, Cancelable extends Runnable>
    Cancelable subscribe(Class<TypedMessage> type, Consumer<TypedMessage> handler) {
        if (stopping) return null;

        Collection<Consumer<? extends Message>> handlers =
                eventHandlers.computeIfAbsent(type, ty -> new CopyOnWriteArraySet<>());
        handlers.add(handler);
        Runnable unsubscribe = () -> eventHandlers.get(type).remove(handler);

        return (Cancelable) unsubscribe;
    }

//    @Override
//    public Runnable schedule(Class<? extends Service> type, Message event, long intervalMills, boolean exactly) {

//
//
//    }


    @Override
    public ScheduledFuture<?> schedule(Runnable handler, long intervalMills, boolean exactly) {
        Runnable handlerWrapper = () -> {
            configureThread();
            handler.run();
        };
        if (exactly) {
            return schedulerExecutor.scheduleAtFixedRate(handlerWrapper, intervalMills, intervalMills, TimeUnit.MILLISECONDS);
        } else {
            return schedulerExecutor.scheduleWithFixedDelay(handlerWrapper, intervalMills, intervalMills, TimeUnit.MILLISECONDS);
        }
    }

    @Override
    public ScheduledFuture<?> scheduleOnce(Runnable handler, long intervalMills) {
        Runnable handlerWrapper = () -> {
            configureThread();
            handler.run();
        };
        return schedulerExecutor.schedule(handlerWrapper, intervalMills, TimeUnit.MILLISECONDS);
    }


    enum State {
        Creating,
        Starting,
        Working,
        Stopping,
        Error
    }

    public class ServiceException extends RuntimeException {
        Class<? extends Service> service;

        public <TypedService extends Service>
        ServiceException(Class<TypedService> service) {
            this.service = service;
        }

        public <TypedService extends Service>
        ServiceException(Class<TypedService> service, Throwable cause) {
            super(cause);
            this.service = service;
        }

        @Override
        public String getMessage() {
            return "[" + service.getName() + "] - " + super.getMessage();
        }
    }

    public class ServiceStateException extends ServiceException {
        State state;

        public <TypedService extends Service>
        ServiceStateException(Class<TypedService> service, State state) {
            super(service);
            this.state = state;
        }
    }

    public class ServiceAlreadyExistsException extends ServiceStateException {
        public <TypedService extends Service>
        ServiceAlreadyExistsException(Class<TypedService> service, State state) {
            super(service, state);
        }
    }

    public class ServiceUndefinedException extends ServiceStateException {
        public <TypedService extends Service>
        ServiceUndefinedException(Class<TypedService> service, State state) {
            super(service, state);
        }
    }

    public class WorkingServiceException extends ServiceException {
        public <TypedService extends Service>
        WorkingServiceException(Class<TypedService> service, Throwable cause) {
            super(service, cause);
        }
    }

    public class ServiceNotFoundException extends ServiceException {
        public <TypedService extends Service>
        ServiceNotFoundException(Class<TypedService> service) {
            super(service);
        }
    }

    public class StartingServiceException extends ServiceException {
        public <TypedService extends Service>
        StartingServiceException(Class<TypedService> service, Throwable cause) {
            super(service, cause);
        }
    }

    public class StoppingServiceException extends ServiceException {
        public <TypedService extends Service>
        StoppingServiceException(Class<TypedService> service, Throwable cause) {
            super(service, cause);
        }
    }

    public class EventHandlerException extends RuntimeException {
        Consumer<? extends Message> handler;
        Message msg;

        public EventHandlerException(Consumer<? extends Message> handler, Message msg, Throwable cause) {
            super(cause);
            this.handler = handler;
            this.msg = msg;
        }
    }

    private class ServiceWorker {
        Class<? extends Service> service;
        Service instance;
        ExecutorService executor;
        BlockingQueue<Runnable> queue;

        public <TypedService extends Service>
        ServiceWorker(Class<TypedService> service, TypedService instance, ExecutorService executor, BlockingQueue<Runnable> queue) {
            this.service = service;
            this.instance = instance;
            this.executor = executor;
            this.queue = queue;
        }
    }
}
