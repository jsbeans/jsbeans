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
