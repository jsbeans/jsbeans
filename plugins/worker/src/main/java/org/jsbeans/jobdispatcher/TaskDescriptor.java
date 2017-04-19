package org.jsbeans.jobdispatcher;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.*;
import java.util.function.BiFunction;
import java.util.function.Consumer;

public class TaskDescriptor {

    public static String PROP_ID = "id";
    public static String PROP_PRIORITY = "priority";
    public static String PROP_STATE = "state";
    public static String PROP_START_TIMESTAMP = "startTimestamp";
    public static String PROP_SHARED_RESOURCE = "sharedResource";

    private final Map<String, String> values;

    public TaskDescriptor(Consumer<BiFunction<String,String,String>> update) {
        this(Collections.emptyMap(), update);
    }

    public TaskDescriptor(Map<String, String> values) {
        this(values, null);
    }

    public TaskDescriptor(Map<String, String> values, Consumer<BiFunction<String,String,String>> update) {
        this.values = new HashMap<>(values.size());
        values.forEach(this.values::put);
        if (update != null)  {
            update.accept(this.values::put);
        }
    }

    public String getId() {
        if (!values.containsKey(PROP_ID)) {
            throw new IllegalArgumentException("Task id is not defined");
        }
        return values.get(PROP_ID);
    }

    public String getState() {
        return values.get(PROP_STATE);
    }

    public String getSharedResource() {
        return values.get(PROP_SHARED_RESOURCE);
    }

    public String get(String prop) {
        return getMap().get(prop);
    }

    public TaskDescriptor updated(Consumer<BiFunction<String,String,String>> update) {
        return new TaskDescriptor(this.getMap(), update);
    }

    public String set(String prop, Object val) {
        if (val == null) {
            return values.remove(prop);
        }
        return values.put(prop, val.toString());
    }

    public int getPriority() {
        return Integer.parseInt(
                Optional.ofNullable(values.get(PROP_PRIORITY))
                        .orElse("0"));
    }

    public long getStartTimestamp() {
        return Long.parseLong(
                Optional.ofNullable(values.get(PROP_START_TIMESTAMP))
                        .orElse("0"));
    }

    public Map<String, String> getMap() {
        return values;
    }

    @SuppressWarnings("unchecked")
    public static TaskDescriptor load(InputStream is) throws IOException {
        Properties properties = new Properties();
        properties.load(is);
        return new TaskDescriptor((Map<String, String>)(Map)properties);
    }

    public static void write(TaskDescriptor descriptor, OutputStream out) throws IOException {
        Properties properties = new Properties();
        descriptor.values.forEach(properties::put);
        properties.store(out, null);
    }

    @Override
    public String toString() {
        return "[" + values.size() + "]" +
                "{" + (get(PROP_ID) != null ? PROP_ID + "=" + get(PROP_ID) : values.keySet().stream().reduce("", (x,k)->x + "," + "=" + values.get(k))) + "}";
    }

    public static int checkTemplateMatched(TaskDescriptor resouce, TaskDescriptor template) {
        for (Map.Entry<String, String> e: template.values.entrySet()) {
            Object value = resouce.values.get(e.getKey());
            if (e.getValue() != value && !e.getValue().equals(value)) {
                return -1;
            }
        }
        if (resouce.values.size() > template.values.size()) {
            return 1;
        }
        return 0;
    }

    public static boolean checkStartTimestampExpired(TaskDescriptor task) {
        long startTimestamp = task.getStartTimestamp();
        return System.currentTimeMillis() >= startTimestamp;
    }
}
