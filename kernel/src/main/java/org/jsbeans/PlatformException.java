/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans;

public class PlatformException extends RuntimeException {
    private static final long serialVersionUID = 5680001986990225304L;

    public PlatformException() {
        super();
    }

    public PlatformException(String msg) {
        super(msg);
    }

    public PlatformException(Throwable t) {
        super(t);
    }

    public PlatformException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
