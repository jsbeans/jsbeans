package org.jsbeans.sharedresource;

import org.jsbeans.sharedresource.local.ConcurrentSharedResourceManager;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

public class SharedResourceManagerFactory {
    private static SharedResourceManager instance;

    public static SharedResourceManager getInstance() {
        if (instance == null) {
            synchronized (SharedResourceManager.class) {
                if (instance == null) {
                    instance = new ConcurrentSharedResourceManager();
                }
            }
        }
        return instance;
    }

    public static SharedResourceManager load(Collection<Map<String, Object>> descriptors) {
        SharedResourceManager man = getInstance();
        for (Map<String, Object> desc : descriptors) {
            man.register(SharedResource.load(desc));
        }
        return man;
    }
    public static SharedResourceManager loadFromProperties(InputStream propertiesInputStream) throws IOException {
        Properties properties = new Properties();
        properties.load(propertiesInputStream);
        return loadFromProperties(properties);
    }

    /** Load from {@link Properties} format file. Property name must have prefix with resource number and dot. All values reads as string only.
     * <br> Example:
     * <br> 0.id=my-resource-id-1
     * <br> 0.slots=1
     * <br> 1.id=my-resource-id-infinite
     * <br> 1.slots=-1
     * */
    public static SharedResourceManager loadFromProperties(Properties properties) throws IOException {
        List<Map<String, Object>> descriptors = new ArrayList<>();
        for(Map.Entry<Object, Object> e : properties.entrySet()) {
            int num = Integer.parseInt(e.getKey().toString().substring(0, e.getKey().toString().indexOf(".")));
            for (int i = descriptors.size(); i <= num; i++ ) {
                descriptors.add(new HashMap<>());
            }

            String name = e.getKey().toString().substring(e.getKey().toString().indexOf(".") + 1);
            descriptors.get(num).put(name, e.getValue());
        }
        return load(descriptors);
    }
}
