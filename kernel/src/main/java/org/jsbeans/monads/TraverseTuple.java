package org.jsbeans.monads;

public class TraverseTuple<X, T> {
    private X first;
    private T second;
    private Throwable th = null;

    public TraverseTuple(X x, T t) {
        this.first = x;
        this.second = t;
    }

    public TraverseTuple(X x, Throwable th) {
        this.first = x;
        this.th = th;
    }

    public X getFirst() {
        return first;
    }

    public T getSecond() {
        return second;
    }

    public boolean isSuccess() {
        return this.th == null;
    }

    public Throwable getException() {
        return this.th;
    }
}
