package org.jsbeans.sharedresource.local;

import java.util.Collection;
import java.util.Collections;

public class LockedResource {
    final Collection<ConcurrentSharedResourceManager.Slot> slots;

    LockedResource(ConcurrentSharedResourceManager.Slot slot) {
        this.slots = Collections.singleton(slot);
    }

    LockedResource(Collection<ConcurrentSharedResourceManager.Slot> slots) {
        this.slots = slots;
    }
}
