package org.jsbeans.sharedresource;

import java.util.HashMap;
import java.util.Map;

public class SharedResource {

    public static String PROP_ID = "id";
    public static String PROP_SLOTS = "slots";

    private final Map<String, Object> values;

    public SharedResource(Map<String, Object> values) {
        if (values.containsKey(PROP_ID)) {
            this.values = new HashMap<>(values.size());
        } else {
            this.values = new HashMap<>(values.size()+1);
            this.values.put(PROP_ID, "resource-" + System.nanoTime());
        }
        values.forEach((p,v)-> {
            if (p.equals("slots")) {
                this.values.put(p, Integer.parseInt(v.toString()));
            } else {
                this.values.put(p, v);
            }
        });
    }


    public String getId() {
        return values.get(PROP_ID).toString();
    }

    public int getSlots() {
        if (isSlotsNothing()) {
            return 0;
        }
        return (Integer) values.get(PROP_SLOTS);
    }

    public boolean isSlotsNothing() {
        Integer val = (Integer) values.get(PROP_SLOTS);
        return val == null || val == 0;
    }

    public boolean isSlotsInfinite() {
        Integer val = (Integer) values.get(PROP_SLOTS);
        return val != null && val == -1;
    }

    public static SharedResource load(Map<String, Object> desc) {
        return new SharedResource(desc);
    }

    /**
     * Returns -1 if template not matched with this resource, 0 - if template equals resource, 1 - if matched
     * @param template
     * @return
     */
    public static int checkMatched(SharedResource resouce, SharedResource template) {
        for (Map.Entry<String,Object> e: template.values.entrySet()) {
            Object value = resouce.values.get(e.getKey());
            if (e.getValue() != value && !e.getValue().equals(value)) {
                return -1;
            }
        }
        if (resouce.values.size() > template.values.size()) {
            return 1;
        }
        return 0;
    }
}
