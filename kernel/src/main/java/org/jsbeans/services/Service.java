package org.jsbeans.services;

import akka.actor.UntypedActor;
import akka.event.Logging;
import akka.event.LoggingAdapter;
import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.messages.Message;
import org.jsbeans.monads.Chain;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import scala.Option;
import scala.concurrent.ExecutionContext;

public abstract class Service extends UntypedActor {
    private final Logger traceLogger = LoggerFactory.getLogger(this.getClass()); // trace logger
    private final LoggingAdapter logger = Logging.getLogger(getContext().system(), this);

    private final String serviceName = this.self().path().name();
    private boolean isInitializing = false;
    private boolean isInitialized = false;
    private long startedTime;
    private long intitializedTime;

    protected LoggingAdapter getLog() {
        return this.logger;
    }

    protected Logger getTraceLog() {
        return this.traceLogger;
    }

    @Override
    public void postRestart(Throwable reason) throws PlatformException {
        try {
            super.postRestart(reason);
            if (getLog().isDebugEnabled()) {
                getLog().debug("postRestart executed, reason '{}'", reason.getMessage());
            }
        } catch (Exception e) {
            throw new PlatformException("Service postRestart error", e);
        }
    }

    @Override
    public void postStop() throws PlatformException {
        try {
            super.postStop();
            if (getLog().isDebugEnabled()) {
                getLog().debug("postStop executed");
            }
        } catch (Exception e) {
            throw new PlatformException("Service postStop error", e);
        }
    }

    @Override
    public void preRestart(Throwable reason, Option<Object> message) throws PlatformException {
        try {
            super.preRestart(reason, message);
            if (getLog().isDebugEnabled()) {
                getLog().debug("preRestart executed, reason '{}'", reason.getMessage());
            }
        } catch (Exception e) {
            throw new PlatformException("Service preRestart error", e);
        }
    }

    @Override
    public void preStart() throws PlatformException {
        try {
            super.preStart();
            if (!this.getClass().equals(ServiceManagerService.class)) {
                ActorHelper.getActorSelection(ServiceManagerService.class).tell(Message.SVC_LOADED, this.getSelf());
            }
            if (getLog().isDebugEnabled()) {
                getLog().debug("Service {} started", this.serviceName);
            }
        } catch (Exception e) {
            throw new PlatformException("Service postStop error", e);
        }
    }

    @Override
    public void onReceive(Object msg) throws PlatformException {
        if (getTraceLog().isTraceEnabled()) {
            getTraceLog().trace("Recieved message {} from {}", msg.toString(), getSender());
        }
        if (msg instanceof String && msg.equals(Message.SVC_INIT)) {
//			if(this.sender().path().equals(ActorHelper.getActorFor(ServiceManagerService.class).path()) || this.getClass().equals(ServiceManagerService.class)) {
            this.initialize();
//			} else {
//				getLog().warning(String.format("Initialization message can only be send by ServiceManager. Ignoring message from '%s'", this.sender().path().toString()));
//			}
        } else {
            try {
                this.onMessage(msg);
            } catch (PlatformException ex) {
                getLog().error(ex, ex.getMessage());
            }
        }
    }

    protected abstract void onMessage(Object msg) throws PlatformException;

    private void initialize() throws PlatformException {
        this.startedTime = System.currentTimeMillis();
        this.isInitializing = true;
        try {
            this.onInit();
        } catch (Throwable e) {
            getLog().error(e, "Initialization fatal error");
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e1) {
            }
            System.exit(-1);
        }
    }

    protected void onInit() throws PlatformException {
        this.completeInitialization();
    }

    public boolean isInitializing() {
        return this.isInitializing;
    }

    public boolean isInitialized() {
        return this.isInitialized;
    }

    protected <X, T> Chain<X, T> createChain(Class<X> c1, Class<T> x2) {
        return new Chain<X, T>(this.getContext().dispatcher());
    }

    protected <X, T> Chain<X, T> createChain(ExecutionContext ec, Class<X> c1, Class<T> x2) {
        return new Chain<X, T>(ec);
    }

    protected <X, T> Chain<X, T> createChain(Class<X> c1, Class<T> x2, X arg) throws PlatformException {
        return new Chain<X, T>(this.getContext().dispatcher(), arg);
    }

    protected <X, T> Chain<X, T> createChain(ExecutionContext ec, Class<X> c1, Class<T> x2, X arg) throws PlatformException {
        return new Chain<X, T>(ec, arg);
    }

    protected void completeInitialization() {
        if (!this.isInitializing) {
            return;
        }
        this.intitializedTime = System.currentTimeMillis();
        this.isInitializing = false;
        this.isInitialized = true;
        //getLog().debug(String.format("%s - initialized", this.serviceName));
        getLog().info("Service {} initialized - {} s", this.serviceName, (intitializedTime - startedTime) / 1000.0);
        if (!this.getClass().equals(ServiceManagerService.class)) {
            ActorHelper.getActorSelection(ServiceManagerService.class).tell(Message.SVC_INIT_COMPLETE, this.getSelf());
        }

    }

    @Override
    public void unhandled(Object msg) {
        if (!(msg instanceof UnsupportedOperationException)) {
            getSender().tell(new UnsupportedOperationException(
                    String.format("Unsupported message type '%s' in service '%s'", msg.getClass().getName(), this.getClass().getName())), getSelf());
            getLog().error("Unsupported message type '{}' from '{}': {}", msg.getClass().getName(), getSender(), msg.toString());
        }
    }
}
