/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.services;

import org.jsbeans.messages.Message;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class ServiceMessage implements Message {
    private static final long serialVersionUID = 3189832890701743099L;

    private List<String> services = new ArrayList<>();

    public Collection<String> getCollection() {
        return services;
    }
}
