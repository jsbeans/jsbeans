/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

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
