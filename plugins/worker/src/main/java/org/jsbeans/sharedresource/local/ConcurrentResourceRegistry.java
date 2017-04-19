package org.jsbeans.sharedresource.local;

import org.jsbeans.sharedresource.SharedResource;
import org.jsbeans.sharedresource.ResourceRegistry;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Stream;

import static org.jsbeans.sharedresource.SharedResource.checkMatched;

public class ConcurrentResourceRegistry implements ResourceRegistry {

    private Map<String, SharedResource> resources = new ConcurrentHashMap<>();

    @Override
    public void register(SharedResource resource) {
        resources.put(resource.getId(), resource);
    }

    @Override
    public void unregister(SharedResource template) {
        resources.remove(template.getId());
    }

    @Override
    public void clear() {
        resources.clear();
    }

    @Override
    public SharedResource lookup(String id) {
        return resources.remove(id);
    }

    @Override
    public Stream<SharedResource> lookup(SharedResource template) {
        return resources.values().stream().filter(resource -> checkMatched(resource, template) >= 0);
    }
}
