package org.jsbeans.jobdispatcher.local;

import org.jsbeans.jobdispatcher.*;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;

public class JobDispatcherImpl implements JobDispatcher {

    private final org.slf4j.Logger logger = LoggerFactory.getLogger(this.getClass());

    private final TaskRegistry taskRegistry;

    public JobDispatcherImpl(TaskRegistry taskRegistry){
        this.taskRegistry = taskRegistry;
    }

    @Override
    public TaskRegistry getTaskRegistry() {
        return taskRegistry;
    }

    @Override
    public int dispatchBatch(TaskRequest request, int size, Function<DispatchedJob, CompletableFuture<TaskDescriptor>> getFutureExecution) {
        return getTaskRegistry()
                .lookup(request, TaskRegistry.State.Queued)
                .map(task -> getTaskRegistry().changeState(task, TaskRegistry.State.Queued, TaskRegistry.State.Locked))
                .limit(size)
                .map((job) -> startJobAsync(job, getFutureExecution) ? 1 : 0)
                .reduce(0, Integer::sum);
    }

    @Override
    public boolean dispatchSingle(TaskRequest request, Function<DispatchedJob, CompletableFuture<TaskDescriptor>> getFutureExecution) {
        return dispatchBatch(request, 1, getFutureExecution) == 1;
    }

    private boolean startJobAsync(TaskDescriptor job, Function<DispatchedJob, CompletableFuture<TaskDescriptor>> getFutureExecution) {
        if (job != null) {
            try {
                AtomicReference<TaskDescriptor> workingTask = new AtomicReference<>();
                logger.debug("Task dsipatched: " + job);
                CompletableFuture<TaskDescriptor> future = getFutureExecution.apply(new DispatchedJob(job, (startedTask) -> {
                    logger.debug("Task started: " + startedTask);
                    workingTask.set(getTaskRegistry().changeState(
                            startedTask, TaskRegistry.State.Locked, TaskRegistry.State.Working));
                    return workingTask.get();
                }));
                future.whenComplete((completedTask, error) -> {
                    if (error != null) {
                        logger.debug("Job error: " + error.getMessage(), error);

                        completedTask = (completedTask == null ? workingTask.get() : completedTask).updated((put)-> {
                            try(ByteArrayOutputStream out = new ByteArrayOutputStream();
                                PrintStream p = new PrintStream(out)) {
                                error.printStackTrace(p);
                                put.apply("error.message", error.toString());
                                put.apply("error.stackTrace", out.toString());
                            } catch (IOException e) {
                                throw new RuntimeException(e);
                            }
                        });
                        logger.debug("Task failed: " + completedTask);
                        getTaskRegistry().changeState(
                                completedTask, TaskRegistry.State.Working, TaskRegistry.State.Failed);
                    } else {
                        logger.debug("Task completed: " + completedTask);
                        getTaskRegistry().changeState(
                                completedTask, TaskRegistry.State.Working, TaskRegistry.State.Completed);
                    }
                });
                return true;
            } catch (RejectedExecutionException rejected) {
                TaskDescriptor t = getTaskRegistry().changeState(
                        job, TaskRegistry.State.Locked, TaskRegistry.State.Queued);
            } catch (Exception ex) {
                TaskDescriptor t = getTaskRegistry().changeState(
                        job, TaskRegistry.State.Failed);
            }
        }
        return false;
    }
}
