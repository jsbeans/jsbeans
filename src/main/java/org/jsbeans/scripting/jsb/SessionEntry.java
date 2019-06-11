/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.scripting.jsb;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.jsbeans.helpers.ConfigHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SessionEntry {
    private static final long rpcExpireTimeout = ConfigHelper.getConfigInt("kernel.jsb.rpcExpireTimeout");
    private static final long rpcExecTimeout = ConfigHelper.getConfigInt("kernel.jsb.rpcExecutingTimeout");

//    private Map<String, RpcEntry> idMap = Collections.synchronizedMap(new LinkedHashMap<String, RpcEntry>(16, 0.75F, true));
    private Map<String, RpcEntry> idMap = new LinkedHashMap<String, RpcEntry>(16, 0.75F, true);
    private Long lastUpdated = System.currentTimeMillis();
/*
    public Map<String, RpcEntry> getMap() {
        return this.idMap;
    }
*/
    
    public boolean containsRpc(String id){
    	return this.idMap.containsKey(id);
    }
    
    public RpcEntry getRpc(String id){
    	return this.idMap.get(id);
    }
    
    public RpcEntry newRpc(String id){
    	RpcEntry re = new RpcEntry();
    	this.idMap.put(id, re);
    	return re;
    }
    
    public void removeRpc(String id){
    	if(this.idMap.containsKey(id)){
    		this.idMap.remove(id);
    	}
    }
    
    public void update() {
        this.lastUpdated = System.currentTimeMillis();
    }

    public long getLastUpdated() {
        return this.lastUpdated;
    }
    
    public void updateRpcEntries(){
    	long curTime = System.currentTimeMillis();
        List<String> rpcToRemove = null;
        Iterator<Entry<String, RpcEntry>> itr = this.idMap.entrySet().iterator();
        while (itr.hasNext()) {
            Entry<String, RpcEntry> entry = itr.next();
            RpcEntry re = entry.getValue();
            long curExpire = re.isCompleted() ? rpcExpireTimeout : rpcExecTimeout;
            if (curTime - re.getLastUpdated() > curExpire) {
                if (rpcToRemove == null) {
                	rpcToRemove = new ArrayList<String>();
                }
                rpcToRemove.add(entry.getKey());
            } else {
            	break;
            }
        }
        if (rpcToRemove != null) {
            for (String s : rpcToRemove) {
                this.idMap.remove(s);
            }
        }
    }
};
