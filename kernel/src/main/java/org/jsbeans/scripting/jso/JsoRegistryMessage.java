/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.scripting.jso;

import org.jsbeans.messages.Message;

public class JsoRegistryMessage implements Message {
    public static final String LOAD_JSO = "loadJSO";
    public static final String LOAD_CORE_OBJECTS = "loadCoreObjects";
    public static final String LOAD_ADDITIONAL_OBJECTS = "loadAddObjects";
    private static final long serialVersionUID = -8734894264437432888L;
}
