package org.jsbeans.scripting.jsb;

import java.util.HashMap;
import java.util.Map;

public class SessionEntry {
    private Map<String, RpcEntry> idMap = new HashMap<String, RpcEntry>();
    private Long lastUpdated = System.currentTimeMillis();

    public Map<String, RpcEntry> getMap() {
        return this.idMap;
    }

    public void update() {
        this.lastUpdated = System.currentTimeMillis();
    }

    public long getLastUpdated() {
        return this.lastUpdated;
    }
};
