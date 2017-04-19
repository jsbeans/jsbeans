package org.jsbeans.jobdispatcher;

import java.util.stream.Stream;

public interface TaskCollection {

    TaskDescriptor add(TaskDescriptor task);

    Stream<TaskDescriptor> lookup(TaskRequest request);
    Stream<TaskDescriptor> remove(TaskRequest request);
}
