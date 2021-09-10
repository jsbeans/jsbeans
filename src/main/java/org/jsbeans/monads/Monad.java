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

import javax.security.auth.Subject;
import java.security.AccessControlContext;
import java.security.AccessController;

public abstract class Monad<T> {
    private Object[] args;
    private Chain<?, ?> chain = null;

    private Subject accessControlSubject = Subject.getSubject(AccessController.getContext());
    private transient AccessControlContext accessControlContext =  AccessController.getContext();

    public Monad() {
    }

    public Monad(Object... args) {
        this.args = args;
    }

    @SuppressWarnings("unchecked")
    protected <X> X getArgument(int idx) {
        return (X) this.args[idx];
    }

    protected int getArgumentCount() {
        return this.args.length;
    }

    public void setChain(Chain<?, ?> task) {
        this.chain = task;
    }

    protected void put(String key, Object value) {
        this.chain.put(key, value);
    }

    protected <X> X get(String key) {
        return this.chain.get(key);
    }

    protected Subject getAccessControlSubject() {
        return accessControlSubject;
    }
    protected AccessControlContext getAccessControlContext() {
        return accessControlContext;
    }

}
