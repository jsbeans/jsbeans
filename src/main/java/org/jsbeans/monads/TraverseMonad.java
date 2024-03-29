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

public abstract class TraverseMonad<X, T> extends Monad<T> {

    public TraverseMonad() {
        super();
    }

    public TraverseMonad(Object... args) {
        super(args);
    }

    public abstract void run(Chain<?, ?> ch);

    public void accRun(final Chain<?, ?> ch) {
        if (getAccessControlSubject() != null) {
            Subject.doAs(getAccessControlSubject(), new PrivilegedAction<Object>() {
                @Override
                public Object run() {
                    TraverseMonad.this.run(ch);
                    return null;
                }
            });
        } else {
            run(ch);
        }
    }

}
