package org.jsbeans.servicemanager;

import org.jsbeans.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public abstract class BaseService implements Service {
    protected static final Logger L = LoggerFactory.getLogger(BaseService.class);

    protected final ServiceManager serviceManager;

    Object startedThread;
    private ThreadLocal<Object> thread = new ThreadLocal<>();

    public BaseService(ServiceManager serviceManager) {
        this.serviceManager = serviceManager;
    }

    @Override
    public void start() {
        startedThread = new Object();
        thread.set(startedThread);
    }

    @Override
    public void stop() {
        checkThread();
    }

    @Override
    public void accept(Message msg) {
        checkThread();

        if (L.isTraceEnabled()) {
            L.trace("Proceed message or command {}: {}",
                    msg == null ? null : msg.getClass().getName(),
                    msg == null ? null : msg.toString());
        }
    }

    protected void checkThread() {
        if (startedThread != thread.get()) {
            throw new IllegalStateException("Invalid service thread");
        }
    }

    public <T> T conf(String localPath) {
        return (T) Config.gett(this.getClass(), localPath).get();
    }

    public <T> T conf(String localPath, T defaultValue) {
        return (T) Config.gett(this.getClass(), localPath).orElse(defaultValue);
    }
}
