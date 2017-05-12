package org.jsbeans.jobdispatcher.base;

import org.jsbeans.jobdispatcher.TaskCollection;
import org.jsbeans.jobdispatcher.TaskDescriptor;
import org.jsbeans.jobdispatcher.TaskRegistry;
import org.jsbeans.jobdispatcher.TaskRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

public abstract class BaseTaskRegistry<TypedTaskCollection extends TaskCollection> implements TaskRegistry {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final Map<State, TypedTaskCollection> collections = new HashMap<>(State.values().length);

    protected void init() {
        Arrays.stream(State.values())
                .forEach(state -> {
                    TypedTaskCollection collection = createFileTaskCollection(state);
                    collections.put(state, collection);
                });

        repairWorkingAndLockedToQueued();
    }

    protected abstract TypedTaskCollection createFileTaskCollection(State state);

    private void repairWorkingAndLockedToQueued() {
        int repaired = Arrays.stream(State.values())
                .filter(state -> state.equals(State.Working) || state.equals(State.Locked))
                .flatMap(state -> {
                    return lookup(TaskRequest.anyTask(), state)
                            .map(task -> changeState(task, state, State.Queued));
                })
                .map(t->t != null ? 1 : 0)
                .reduce(0, Integer::sum);

        logger.debug("Repaired to Queued collection not completed tasks: " + repaired);
    }

    @Override
    public void add(TaskDescriptor task) {
        collections.get(State.Queued).add(task);
    }

    @Override
    public Stream<TaskDescriptor> remove(TaskRequest request) {
        return Arrays.stream(State.values())
                .flatMap(state -> remove(request, state));
    }

    @Override
    public Stream<TaskDescriptor> remove(TaskRequest request, State state) {
        return collections.get(state).remove(request);
    }

    @Override
    public TaskDescriptor changeState(TaskDescriptor updatedTask, State state, State targetState) {
        return collections.get(state)
                .remove(TaskRequest.byId(updatedTask))
                .map(removedTask -> {
                    return collections.get(targetState)
                            .add(updatedTask.updated((put) -> {
                                put.apply(TaskDescriptor.PROP_STATE, targetState.name());
                            }));
                })
                .findFirst().orElse(null);
    }

    @Override
    public Stream<TaskDescriptor> lookup(TaskRequest request) {
        return Arrays.stream(State.values())
                .flatMap(state -> lookup(request, state));
    }

    @Override
    public Stream<TaskDescriptor> lookup(TaskRequest request, State state) {
        return collections.get(state)
                .lookup(request)
                .map(task -> task.updated((put) -> {
                    put.apply("state", state.name());
                }));
    }
}
