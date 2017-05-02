package org.jsbeans.worker;

import java.util.Iterator;
import java.util.ServiceLoader;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class WorkerManager {
    public static void startWorkers() {
        workers().forEach(Worker::start);
    }

    public static void stopWorkers() {
        workers().forEach(Worker::stop);
    }

    public static Stream<Worker> workers() {
        ServiceLoader<Worker> workers = ServiceLoader.load(Worker.class);
        return StreamSupport.stream(workers.spliterator(), false);
    }

    public static <T> T getInstance(Class<? extends Worker> worker) {
        ServiceLoader<Worker> workers = ServiceLoader.load(Worker.class);
        for(Iterator<Worker> it = workers.iterator(); it.hasNext();) {
            Worker w = it.next();
            if (w.getClass().isAssignableFrom(worker)) {
                return (T) w;
            }
        }
        throw new IllegalArgumentException("Unloaded worker " + worker.getName());
    }
}
