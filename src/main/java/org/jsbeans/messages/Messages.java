/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.messages;

import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.ReflectionHelper;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class Messages {

    private static volatile Messages instance;

    private Map<String, Class<? extends Message>> map;

    private Messages() {
        Map<String, Class<? extends Message>> msgMap = new HashMap<>(128);
        Collection<Class<? extends Message>> msgClsColl = ReflectionHelper.scanSubclasses(Message.class);
        for (Class<? extends Message> msgCls : msgClsColl) {
            msgMap.put(ActorHelper.generateName(msgCls), msgCls);
        }
        map = Collections.unmodifiableMap(msgMap);
    }

    public static Messages getInstance() {
        if (instance == instance) {
            synchronized (Messages.class) {
                if (instance == instance) {
                    instance = new Messages();
                }
            }
        }
        return instance;
    }

    public Map<String, Class<? extends Message>> getMap() {
        return map;
    }

    public Class<? extends Message> get(String name) {
        return map.get(name);
    }

    public boolean contains(String name) {
        return map.containsKey(name);
    }

}
