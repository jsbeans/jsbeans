/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.scripting;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.Map.Entry;

public class ScopeTree {
    Logger la = LoggerFactory.getLogger(ScopeTree.class.getName());
    // vars
    private Node rootNode = null;

    // methods
    public ScopeTree(Scriptable s) {
        this.rootNode = new Node(s);
    }

    public Node getRoot() {
        return this.rootNode;
    }

    public boolean check(String scopePath) {
        if (scopePath == null || scopePath.length() == 0) {
            return false;
        }
        String[] parts = scopePath.split("/");
        Node curNode = this.getRoot();
        for (int i = 0; i < parts.length; i++) {
            String key = parts[i];
            curNode = curNode.get(key, false);
            if (curNode == null) {
                return false;
            }
        }

        return true;
    }

    public void remove(String scopePath) {
        if (scopePath == null || scopePath.length() == 0) {
            return;
        }
        String[] parts = scopePath.split("/");
        Node curNode = this.getRoot();
        for (int i = 0; i < parts.length; i++) {
            String key = parts[i];
            if (i == parts.length - 1) {
                if (!curNode.has(key)) {
                    break;
                }
                curNode.remove(key);
                break;
            }
            curNode = curNode.get(key);
        }
    }

    public Scriptable touch(String scopePath, boolean preserveSession) {
        if (scopePath == null || scopePath.length() == 0) {
            return this.getRoot().scope();
        }
        Context ctx = JsHub.getContextFactory().enterContext();
        String[] parts = scopePath.split("/");
        Node curNode = this.getRoot();
        for (String key : parts) {
            if (!curNode.has(key)) {
                Scriptable newScope = ctx.newObject(curNode.scope());
                newScope.setPrototype(curNode.scope());
                newScope.setParentScope(null);
                curNode.put(key, newScope);
            }

            curNode = curNode.get(key, preserveSession);
        }

        Context.exit();
        return curNode.scope();
    }

    // nested
    public class Node {
        private Scriptable scope = null;
//        private Map<String, Node> children = Collections.synchronizedMap(new LinkedHashMap<String, Node>(16, 0.75F, true));
        private Map<String, Node> children = new LinkedHashMap<String, Node>(16, 0.75F, true);
        private long lastTimeAccessed = System.currentTimeMillis();

        public Node(Scriptable s) {
            this.scope = s;
        }

        public Scriptable scope() {
            return this.scope;
        }

        public boolean has(String key) {
            return this.children.containsKey(key);
        }

        public Node get(String key) {
            return this.get(key, true);
        }

        public Node get(String key, boolean updateTime) {
            if (!this.children.containsKey(key)) {
                return null;
            }
            Node n = this.children.get(key);
            if (updateTime) {
                n.lastTimeAccessed = System.currentTimeMillis();
            }
            return n;
        }
        
        public Collection<String> getChildrenIds(){
        	return this.children.keySet();
        }

        public void put(String key, Scriptable s) {
            this.remove(key);
            this.children.put(key, new Node(s));
        }

        public void remove(String key) {
            if (this.has(key)) {
                Node n = this.children.get(key);
                this.children.remove(key);
                n.scope = null;
                Set<String> keysToDelete = new HashSet<String>();
                keysToDelete.addAll(n.children.keySet());
                for (String k : keysToDelete) {
                    n.remove(k);
                }
            }
        }

        public List<String> updateEldest(long expireDelta) {
            long curTime = System.currentTimeMillis();
            List<String> keysToRemove = null;
            
            Iterator<Entry<String, Node>> itr = this.children.entrySet().iterator();
            while (itr.hasNext()) {
                Entry<String, Node> entry = itr.next();
                String session = entry.getKey();
                if (session.length() == 0) {
                    continue;
                }
                Node n = entry.getValue();

                if (curTime - n.lastTimeAccessed > expireDelta) {
                    if (keysToRemove == null) {
                        keysToRemove = new ArrayList<String>();
                    }
                    keysToRemove.add(entry.getKey());
                } else {
                    break;
                }
            }
            
            return keysToRemove;
/*            
            if (keysToRemove != null) {
                for (String s : keysToRemove) {
                    this.children.remove(s);
                }
            }
*/            

        }

    }
}
