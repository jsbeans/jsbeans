/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.monads;

import akka.dispatch.Futures;
import akka.dispatch.Mapper;
import akka.dispatch.OnComplete;
import akka.dispatch.Recover;
import akka.japi.Function;
import scala.concurrent.ExecutionContext;
import scala.concurrent.Future;

import javax.security.auth.Subject;
import java.security.AccessControlContext;
import java.security.AccessController;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;

public class Chain<F, L> {
    private ExecutionContext eCtx;
    private Future<?> lastF = null;
    private Map<String, Object> results = null;
    private Chain<?, ?> parent = null;

    public Chain(ExecutionContext executionContext) {
        this.eCtx = executionContext;
    }

    public Chain(ExecutionContext d, Future<F> prevF) {
        this.eCtx = d;
        this.lastF = prevF;
    }

    public Chain(ExecutionContext d, F prev) {
        this(d, prev, null);
    }

    public Chain(ExecutionContext d, F prev, Chain<?, ?> parent) {
        this.eCtx = d;
        this.parent = parent;
        this.add(new MapMonad<Object, F>(prev) {
            @Override
            public F run(Object o) {
                return this.getArgument(0);
            }
        });
    }

    public Chain<F, L> put(String key, Object value) {
        if (this.results == null) {
            this.results = new HashMap<String, Object>();
        }
        this.results.put(key, value);
        return this;
    }

    @SuppressWarnings("unchecked")
    public <Z> Z get(String key) {
        if (this.results.containsKey(key)) {
            return (Z) this.results.get(key);
        }
        if (this.parent != null) {
            return this.parent.get(key);
        }

        throw new RuntimeException(String.format("Unable to find key '%s' in chain local store", key));
    }

    public Future<?> getFuture() {
        return this.lastF;
    }

    @SuppressWarnings("unchecked")
    private <X, T> void addMap(final MapMonad<X, T> job) {
        if (this.lastF == null) {
            this.lastF = akka.dispatch.Futures.future(new Callable<T>() {
                private MapMonad<X, T> job;

                public Callable<T> setJob(MapMonad<X, T> j) {
                    this.job = j;
                    return this;    // required for transitive argument passing
                }

                @Override
                public T call() throws Exception {
                    return this.job.accRun(null);
                }
            }.setJob(job), eCtx);
        } else {
            this.lastF = ((Future<X>) this.lastF).map(new Mapper<X, T>() {
                private MapMonad<X, T> job;

                public Mapper<X, T> setJob(MapMonad<X, T> j) {
                    this.job = j;
                    return this;
                }

                @Override
                public T apply(X arg) {
                    return this.job.accRun(arg);
                }
            }.setJob(job), eCtx);
        }
    }

    @SuppressWarnings("unchecked")
    private <X, T> void addFuture(final FutureMonad<X, T> fJob) {
        if (this.lastF == null) {
            try {
                this.lastF = fJob.accRun(null);
            } catch (Exception e) {
                this.lastF = Futures.failed(e);
            }
        } else {
            this.lastF = ((Future<X>) this.lastF).flatMap(new Mapper<X, Future<T>>() {
                @Override
                public Future<T> apply(X arg) {
                    try {
                        return fJob.accRun(arg);
                    } catch (Exception e) {
                        return Futures.failed(e);
                    }
                }
            }, eCtx);
        }
    }

    @SuppressWarnings("unchecked")
    private <X, T> void addTraverse(final TraverseMonad<Iterable<X>, Iterable<TraverseTuple<X, T>>> tJob) {
        final Chain<?, ?> self = this;
        this.lastF = ((Future<Iterable<X>>) this.lastF).flatMap(new Mapper<Iterable<X>, Future<Iterable<TraverseTuple<X, T>>>>() {
            @Override
            public Future<Iterable<TraverseTuple<X, T>>> apply(Iterable<X> coll) {
                return Futures.traverse(coll, new Function<X, Future<TraverseTuple<X, T>>>() {
                    @Override
                    public Future<TraverseTuple<X, T>> apply(X xArg) throws Exception {
                        final X firstArg = xArg;
                        Chain<X, T> ch = new Chain<X, T>(eCtx, xArg);
                        ch.parent = self;
                        tJob.accRun(ch);

                        Future<TraverseTuple<X, T>> f = ((Future<T>) ch.getFuture()).map(new Mapper<T, TraverseTuple<X, T>>() {
                            @Override
                            public TraverseTuple<X, T> apply(T tArg) {
                                return new TraverseTuple<X, T>(firstArg, tArg);
                            }
                        }, eCtx);
                        return f.recover(new Recover<TraverseTuple<X, T>>() {

                            @Override
                            public TraverseTuple<X, T> recover(Throwable th) throws Throwable {
                                return new TraverseTuple<X, T>(firstArg, th);
                            }
                        }, eCtx);

                    }
                }, eCtx);
            }
        }, eCtx);
    }

    @SuppressWarnings("unchecked")
    private <T> void addComplete(final CompleteMonad<T> m) {
        final Chain<?, T> self = (Chain<?, T>) this;
        ((Future<T>) this.lastF).onComplete(new OnComplete<T>() {
            @Override
            public void onComplete(Throwable fail, T res) throws Throwable {
                m.accOnComplete(self, res, fail);
            }
        }, eCtx);
    }

    @SuppressWarnings("unchecked")
    public <X, T> Chain<F, L> add(Monad<T> m) {
        if (m != null) {
            m.setChain(this);
            if (m instanceof MapMonad) {
                this.addMap((MapMonad<X, T>) m);
            } else if (m instanceof FutureMonad) {
                this.addFuture((FutureMonad<X, T>) m);
            } else if (m instanceof TraverseMonad) {
                this.addTraverse((TraverseMonad<Iterable<X>, Iterable<TraverseTuple<X, T>>>) m);
            } else if (m instanceof CompleteMonad) {
                this.addComplete((CompleteMonad<T>) m);
            }
        }
        return this;
    }

//    public Subject getAccessControlSubject() {
//        return accessControlSubject;
//    }
//    public AccessControlContext getAccessControlContext() {
//        return accessControlContext;
//    }

}
