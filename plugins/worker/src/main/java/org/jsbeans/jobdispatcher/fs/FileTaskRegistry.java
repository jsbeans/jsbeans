package org.jsbeans.jobdispatcher.fs;

import org.jsbeans.jobdispatcher.TaskDescriptor;
import org.jsbeans.jobdispatcher.TaskRegistry;
import org.jsbeans.jobdispatcher.TaskRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

public class FileTaskRegistry implements TaskRegistry {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final Map<State, FileTaskCollection> collections;
    private final Path tasksPath;

    public FileTaskRegistry(Path tasksPath){
        this.tasksPath = tasksPath;
        this.tasksPath.toFile().mkdirs();

        this.collections = new HashMap<>(State.values().length);
        Arrays.stream(State.values())
                .forEach(state -> {
                    FileTaskCollection collection = new FileTaskCollection(tasksPath.resolve(state.name()));
                    collections.put(state, collection);
                });

        repairWorkingAndLockedToQueued();
    }

    private void repairWorkingAndLockedToQueued() {
        int repaired = Arrays.stream(State.values())
                .filter(s -> s.equals(State.Working) || s.equals(State.Locked))
                .flatMap(s -> lookup(TaskRequest.anyTask(), s).map(task -> changeState(task, s, State.Queued)))
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
    public TaskDescriptor changeState(TaskDescriptor task, State state, State targetState) {
        return collections.get(state).remove(TaskRequest.byId(task))
                .map(removedTask -> {
                    TaskDescriptor updatedTask = removedTask.updated((put) -> put.apply(TaskDescriptor.PROP_STATE, targetState.name()));
                    return collections.get(targetState).add(updatedTask);
                })
                .findFirst().orElse(null);

//        return collections.get(state).lookup(request)
//                .map(task->{
//                    File removedTaskFile = collections.get(state).getTaskFile(task);
//                    File newTaskFile = collections.get(targetState).getTaskFile(task);
//                    collections.get(state).lockIO();
//                    collections.get(targetState).lockIO();
//                    try {
//                        Files.move(removedTaskFile.toPath(), newTaskFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
//                        TaskDescriptor removedTask = collections.get(targetState).loadTask(newTaskFile);
//                        return removedTask.updated((put) -> put.apply(TaskDescriptor.PROP_STATE, targetState.name()));
//                    } catch (IOException e) {
//                        throw new RuntimeException("Move task failed: " + task)
//                    } finally {
//                        collections.get(state).unlockIO();
//                        collections.get(targetState).unlockIO();
//                    }
//                });
    }

    @Override
    public Stream<TaskDescriptor> lookup(TaskRequest request) {
        return Arrays.stream(State.values())
                .flatMap(state -> lookup(request, state));
    }

    @Override
    public Stream<TaskDescriptor> lookup(TaskRequest request, State state) {
        return collections.get(state).lookup(request)
                .map(task -> task.updated((put)->put.apply("state", state.name())));
    }
}
