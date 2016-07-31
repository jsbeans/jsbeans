package org.jsbeans.monads;

public abstract class TraverseMonad<X, T> extends Monad<T> {

    public TraverseMonad() {
        super();
    }

    public TraverseMonad(Object... args) {
        super(args);
    }

    public abstract void run(Chain<?, ?> ch);

}
