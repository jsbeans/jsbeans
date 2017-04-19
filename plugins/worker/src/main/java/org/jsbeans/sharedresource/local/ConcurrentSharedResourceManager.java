package org.jsbeans.sharedresource.local;

import org.jsbeans.sharedresource.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Closeable;
import java.io.IOException;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

public class ConcurrentSharedResourceManager implements SharedResourceManager, Closeable {


    static class Slot {
        private long startTimestamp;
        private long timeout;
        private final SharedResource resource;

        Slot(SharedResource resource, long timeout) {
            this.resource = resource;
            this.timeout = timeout;
            this.startTimestamp = System.currentTimeMillis();
        }
    }


    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final ScheduledExecutorService autoCloseScheduler = Executors.newSingleThreadScheduledExecutor();
    private final long autoCloseScheduleInterval = 1000*5;

    private final ResourceRegistry resourceRegistry = new ConcurrentResourceRegistry();
    private final Map<SharedResource, Collection<Slot>> resourceSlots = new ConcurrentHashMap<>();


    public ConcurrentSharedResourceManager() {
        autoCloseScheduler.scheduleWithFixedDelay(this::releaseExpiredSlots,
                autoCloseScheduleInterval, autoCloseScheduleInterval, TimeUnit.MILLISECONDS);
    }


    @Override
    public void close() throws IOException {
        try {
            autoCloseScheduler.shutdown();
            autoCloseScheduler.awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            logger.warn("Shutdown interrupted");
        } finally {
            if (!autoCloseScheduler.isTerminated()) {
                logger.warn("Cancel non-finished tasks");
            }
            autoCloseScheduler.shutdownNow();
        }
    }

    @Override
    public void lock(LockRequest lockRequest, BiConsumer<LockedResource, Throwable> completed){
        List<LockedResource> lockedResources;
        try {
            Collection<SharedResource> templates = lockRequest.getTemplates();
            lockedResources = new ArrayList<>(templates.size());
            for (SharedResource template : templates) {
                LockedResource lockedResource;
                try {
                    lockedResource = lockSingleNow(template, lockRequest.getReserveDurationTimeout());
                    if (lockedResource != null) {
                        lockedResources.add(lockedResource);
                    }
                } catch (HasNoFreeSlotsException e) {
                    for (LockedResource locked : lockedResources) {
                        this.releaseNow(locked);
                    }
                    throw e;
                }
            }
        } catch (Throwable e) {
            completed.accept(null, e);
            return;
        }

        List<Slot> slots = lockedResources.stream().flatMap(r -> r.slots.stream()).collect(Collectors.toList());
        completed.accept(new LockedResource(slots), null);
    }

    @Override
    public void release(LockedResource lockedResource) {
        this.releaseNow(lockedResource);
    }

    @Override
    public void register(SharedResource descriptor){
        resourceRegistry.register(descriptor);
    }

    @Override
    public void unregister(SharedResource descriptor){
        resourceRegistry.unregister(descriptor);
    }

    @Override
    public void clear() {
        resourceRegistry.clear();
    }

    private LockedResource lockSingleNow(SharedResource template, Duration reserveDurationTimeout) throws HasNoFreeSlotsException {
        List<SharedResource> resources = this.resourceRegistry.lookup(template).collect(Collectors.toList());
        for(SharedResource resource: resources) {
            if (hasFreeSlot(resource)) {
                LockedResource lockedResource = lockSlot(resource, reserveDurationTimeout);
                if (lockedResource != null) {
                    logger.debug("Resource locked " + template);
                    return lockedResource;
                }
            }
        }
        logger.debug("Has not free slots of resource " + template);
        throw new HasNoFreeSlotsException("Has not free slots of resource " + template);

    }

    private LockedResource lockSlot(SharedResource resource, Duration reserveDurationTimeout) {
        synchronized (resource) {
            Collection<Slot> slots = resourceSlots.computeIfAbsent(resource, (key) -> new ConcurrentLinkedQueue<>());
            if (slots.size() < resource.getSlots()) {
                Slot slot = new Slot(resource, reserveDurationTimeout.toMillis());
                slots.add(slot);
                LockedResource lock = new LockedResource(slot);
                return lock;
            }
            return null;
        }
    }

    private boolean hasFreeSlot(SharedResource resource) {
        if (resource.isSlotsInfinite()) {
            return true;
        } else if (!resourceSlots.containsKey(resource)) {
            return !resource.isSlotsNothing();
        } else {
            Collection<Slot> slots = resourceSlots.get(resource);
            return slots.size() < resource.getSlots();
        }
    }

    private void releaseNow(LockedResource locked) {
        for (Slot slot : locked.slots) {
            releaseNow(slot);
        }
    }

    private void releaseNow(Slot slot) {
        synchronized (slot.resource) {
            Collection<Slot> slots = resourceSlots.get(slot.resource);
            if (slots != null) {
                if (slots.remove(slot)) {
                    logger.debug("Release resource slot " + slot);
                }
                if (slots.size() == 0) {
                    resourceSlots.remove(slot.resource);
                }
            }
        }
    }

    private void releaseExpiredSlots(){
        resourceSlots.values().stream()
                .flatMap(Collection::stream)
                .filter(slot -> System.currentTimeMillis() > slot.startTimestamp + slot.timeout)
                .forEach(slot -> {
                    try {
                        logger.info("Resource lock timeout expired " + slot.resource);
                        releaseNow(slot);
                    } catch (Throwable e) {
                        logger.error("Auto release resource failed " + slot.resource, e);
                    }
                });
        try {
            Thread.sleep(autoCloseScheduleInterval);
        } catch (InterruptedException e) {
            return;
        }
    }
}
