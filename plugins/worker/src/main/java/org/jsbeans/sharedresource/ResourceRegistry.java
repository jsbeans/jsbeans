package org.jsbeans.sharedresource;

import java.util.stream.Stream;

public interface ResourceRegistry {

    void register(SharedResource resource);
    void unregister(SharedResource template);
    void clear();

    SharedResource lookup(String id);
    Stream<SharedResource> lookup(SharedResource template);
}
