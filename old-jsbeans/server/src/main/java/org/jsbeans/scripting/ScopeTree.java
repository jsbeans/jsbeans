package org.jsbeans.scripting;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map.Entry;

public class ScopeTree {
    private Logger L = LoggerFactory.getLogger(ScopeTree.class.getName());
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

    public Scriptable touch(String scopePath) {
        if (scopePath == null || scopePath.length() == 0) {
            return this.getRoot().scope();
        }
        Context ctx = Context.enter();
        String[] parts = scopePath.split("/");
        Node curNode = this.getRoot();
        for (String key : parts) {
            if (!curNode.has(key)) {
                Scriptable newScope = ctx.newObject(curNode.scope());
                newScope.setPrototype(curNode.scope());
                newScope.setParentScope(null);
                curNode.put(key, newScope);
            }

            curNode = curNode.get(key);
        }

        Context.exit();
        return curNode.scope();
    }

    // nested
    public class Node {
        private Scriptable scope = null;
        private Map<String, Node> children = Collections.synchronizedMap(new LinkedHashMap<String, Node>(16, 0.75F, true));
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

        public void updateEldest(long expireDelta) {
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
            if (keysToRemove != null) {
                for (String s : keysToRemove) {
                    this.children.remove(s);
                }
            }

        }

    }
}
