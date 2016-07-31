package org.jsbeans.helpers;

import akka.actor.ActorRef;
import org.jsbeans.PlatformException;
import org.jsbeans.messages.ResponseError;
import org.jsbeans.messages.ResponsibleMessage;

public class ExceptionHelper {

    public static RuntimeException runtime(Throwable e) {
        if (e instanceof RuntimeException) {
            return (RuntimeException) e;
        } else {
            return new RuntimeException(e);
        }
    }

    public static RuntimeException throwRuntime(Throwable e) throws RuntimeException {
        if (e instanceof RuntimeException) {
            throw (RuntimeException) e;
        } else {
            throw new RuntimeException(e);
        }
    }

    public static void responseError(Throwable e, ActorRef sender, ActorRef self) throws PlatformException {
        if (e instanceof PlatformException) {
            throw (PlatformException) e;
        } else {
            sender.tell(e, self);
        }
    }

    public static void responseError(Object initialMessage, Throwable e, ActorRef sender, ActorRef self) throws PlatformException {
        if (e instanceof PlatformException) {
            throw (PlatformException) e;
        } else {
            if (initialMessage instanceof ResponsibleMessage) {
                ResponsibleMessage<?> rm = (ResponsibleMessage<?>) initialMessage;
                ResponseError msg = rm.createError(e);
                sender.tell(msg, self);
            } else {
                sender.tell(e, self);
            }
        }
    }

    public static WrappedException wrap(String msg, Throwable failure, ActorRef sender, ActorRef self) {
        return new WrappedException(msg, failure, sender, self);
    }

    public static String getStackTrace() {
        StringBuilder sb = new StringBuilder();
        StackTraceElement[] trace = Thread.currentThread().getStackTrace();
        for (StackTraceElement traceElement : trace) {
            sb.append("\tat " + traceElement + "\n");
        }
        return sb.toString();
    }

    public static String getStackTrace(Throwable th) {
        StringBuilder sb = new StringBuilder();
        StackTraceElement[] trace = th.getStackTrace();
        for (StackTraceElement traceElement : trace) {
            sb.append("\tat " + traceElement + "\n");
        }
        return sb.toString();
    }

    public static String getStackTraceFull(Throwable th) {
        StringBuilder sb = new StringBuilder();

        sb.append(getStackTrace(th));
        if (th.getCause() != null && th.getCause() != th) {
            sb.append(getStackTraceFull(th.getCause()));
        }
        return sb.toString();
    }

    public static class WrappedException extends PlatformException {
        ActorRef sender;
        ActorRef self;

        public WrappedException(String msg, Throwable failure, ActorRef sender, ActorRef self) {
            super(msg, failure);
            this.self = self;
            this.sender = sender;
        }

        @Override
        public String toString() {
            return String.format("from [%s] to [%s] -> %s %n %s", sender, self, getMessage(), ExceptionHelper.getStackTrace(this));
        }
    }
}