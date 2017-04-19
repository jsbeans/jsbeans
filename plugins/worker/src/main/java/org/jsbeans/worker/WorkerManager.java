package org.jsbeans.worker;

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
}
