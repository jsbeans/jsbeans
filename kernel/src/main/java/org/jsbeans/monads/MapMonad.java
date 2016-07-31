package org.jsbeans.monads;

public abstract class MapMonad<X, T> extends Monad<T> {
    public MapMonad() {
        super();
    }

    public MapMonad(Object... args) {
        super(args);
    }

    public abstract T run(X prev);

}
