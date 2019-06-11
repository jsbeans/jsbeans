/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.messages;

import java.io.Serializable;

public interface Message extends Serializable {
    public static final String OK = "ok";
    public static final String SVC_INIT = "svcInit";
    public static final String SVC_LOADED = "svcLoaded";
    public static final String SVC_INIT_COMPLETE = "svcInitComplete";
    public static final String SVC_LIST = "svcList";
    public static final String TICK = "Tick";
}
