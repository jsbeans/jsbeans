package org.jsbeans.utils;

public class ExceptionUtils {
    public static RuntimeException runtime(String message, Throwable e) {
        if (e instanceof RuntimeException) {
            RuntimeException re = (RuntimeException) e;
            re = new RuntimeException(message + ": " + re.getMessage(), re.getCause());
            re.setStackTrace(e.getStackTrace());
            return re;
        } else {
            return new RuntimeException(message, e);
        }
    }

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
}