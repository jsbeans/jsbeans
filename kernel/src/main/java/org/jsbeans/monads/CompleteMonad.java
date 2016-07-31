package org.jsbeans.monads;

public abstract class CompleteMonad<T> extends Monad<T> {

    public CompleteMonad() {
        super();
    }

    public CompleteMonad(Object... args) {
        super(args);
    }

    public abstract void onComplete(Chain<?, T> chain, T result, Throwable fail);
}
