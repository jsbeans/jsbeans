package org.jsbeans.jobdispatcher;

import java.util.Collections;

public class TaskRequest {
    private TaskDescriptor template;
    private TaskOrder order;
    private TaskMatcher matcher;

    public TaskRequest(TaskDescriptor template) {
        this(template, TaskOrder.TopPriority, TaskMatcher.FieldsEquals);
    }

    public TaskRequest(TaskDescriptor template, TaskOrder order, TaskMatcher matcher) {
        this.template = template;
        this.order = order;
        this.matcher = matcher;
    }

    public TaskDescriptor getTemplate() {
        return template;
    }

    public TaskOrder getOrder() {
        return order;
    }

    public TaskMatcher getMatcher() {
        return matcher;
    }

    public static TaskRequest anyTask() {
        return new TaskRequest(new TaskDescriptor(Collections.emptyMap()));
    }

    public static TaskRequest byId(TaskDescriptor task) {
        return byId(task.getId());
    }

    public static TaskRequest byId(String id) {
        return new TaskRequest(new TaskDescriptor(Collections.singletonMap(TaskDescriptor.PROP_ID, id)));
    }

    public static TaskRequest byValue(String key, String value) {
        return new TaskRequest(new TaskDescriptor(Collections.singletonMap(key, value)));
    }

    public static TaskRequest byValue(String key, String value, TaskOrder order, TaskMatcher matcher) {
        return new TaskRequest(new TaskDescriptor(Collections.singletonMap(key, value)), order, matcher);
    }

    @Override
    public String toString() {
        return template + ", " + order + ", " + matcher;
    }
}
