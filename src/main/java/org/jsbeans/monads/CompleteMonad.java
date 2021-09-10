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

import scala.concurrent.Future;

import javax.security.auth.Subject;
import java.security.PrivilegedAction;

public abstract class CompleteMonad<T> extends Monad<T> {

    public CompleteMonad() {
        super();
    }

    public CompleteMonad(Object... args) {
        super(args);
    }

    public abstract void onComplete(Chain<?, T> chain, T result, Throwable fail);

    public void accOnComplete(final Chain<?, T> chain, final T result, final Throwable fail) {
        if (getAccessControlSubject() != null) {
            Subject.doAs(getAccessControlSubject(), new PrivilegedAction<Object>() {
                @Override
                public Object run() {
                    CompleteMonad.this.onComplete(chain, result, fail);
                    return null;
                }
            });
        } else {
            onComplete(chain, result, fail);
        }
    }
}
