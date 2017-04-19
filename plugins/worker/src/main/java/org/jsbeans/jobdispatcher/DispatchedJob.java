package org.jsbeans.jobdispatcher;

import java.util.function.Function;

public class DispatchedJob {
    private TaskDescriptor task;
    private Function<TaskDescriptor, TaskDescriptor> startCallback;

    public DispatchedJob(TaskDescriptor task, Function<TaskDescriptor, TaskDescriptor> startCallback){
        this.task = task;
        this.startCallback = startCallback;
    }

    public TaskDescriptor getTask() {
        return task;
    }

    public Function<TaskDescriptor, TaskDescriptor> getStartCallback() {
        return startCallback;
    }
}
