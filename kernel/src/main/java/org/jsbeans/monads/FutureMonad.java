package org.jsbeans.monads;

import scala.concurrent.Future;

public abstract class FutureMonad<X, T> extends Monad<T> {

    public FutureMonad() {
        super();
    }

    public FutureMonad(Object... args) {
        super(args);
    }

    public abstract Future<T> run(X prev);

}
