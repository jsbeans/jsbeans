package org.jsbeans.sharedresource;

import org.jsbeans.sharedresource.local.LockedResource;

import java.util.function.BiConsumer;

public interface SharedResourceManager {
    void lock(LockRequest lockRequest, BiConsumer<LockedResource, Throwable> completed);
    void release(LockedResource lockedResource);

    void register(SharedResource descriptor);
    void unregister(SharedResource descriptor);
    void clear();
}
