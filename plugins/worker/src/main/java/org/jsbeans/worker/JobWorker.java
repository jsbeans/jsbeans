package org.jsbeans.worker;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import org.jsbeans.jobdispatcher.DispatchedJob;
import org.jsbeans.jobdispatcher.JobDispatcher;
import org.jsbeans.jobdispatcher.TaskDescriptor;
import org.jsbeans.jobdispatcher.TaskRequest;
import org.slf4j.LoggerFactory;

import java.util.concurrent.*;

public abstract class JobWorker implements Worker {

    public interface Config {
        default int getLockedCapacity() {
            return 1;
        }

        default int getMaxWorkingThreads() {
            return Integer.MAX_VALUE;
        }

        default long threadKeepAliveIntervalSeconds() {
            return 60L;
        }

        default long dispatcherSleepIntervalMillis() {
            return 1000L;
        }
    }

    private final org.slf4j.Logger logger = LoggerFactory.getLogger(this.getClass());

    private final BlockingQueue<Runnable> dispatchedTasksQueue;
    private final ExecutorService jobsExecutor;
    private final Thread dispatchTasksThread;
    private volatile JobDispatcher jobDispatcher;

    public JobWorker(){
        this.dispatchedTasksQueue = new ArrayBlockingQueue<>(getConfig().getLockedCapacity());
        this.jobsExecutor = new JobExecutorService(
                new ThreadPoolExecutor(0, getConfig().getMaxWorkingThreads(),
                        getConfig().threadKeepAliveIntervalSeconds(), TimeUnit.SECONDS,
                        dispatchedTasksQueue,
                        new ThreadFactoryBuilder()
                                .setNameFormat("JobWorker-worker-%d")
                                .setDaemon(true)
                                .build()
                        ));

        this.dispatchTasksThread = new Thread(this::disptachTaskThread);
    }

    public JobDispatcher getJobDispatcher() {
        if (jobDispatcher == null) {
            synchronized (this) {
                if (jobDispatcher == null) {
                    jobDispatcher = this.createJobDispatcher();
                }
            }
        }
        return jobDispatcher;
    }

    private void disptachTaskThread() {
        for (;;) {
            int dispatched = getJobDispatcher().dispatchBatch(getTaskRequest(), getConfig().getLockedCapacity(), this::startJob);
            logger.debug("Job dispatched: " + dispatched);
            try {
                Thread.sleep(getConfig().dispatcherSleepIntervalMillis());
            } catch (InterruptedException e) {
                logger.debug("Task dispatcher thread interrupted");
                return;
            }
        }
    }

    protected abstract Config getConfig();
    protected abstract JobDispatcher createJobDispatcher();
    protected abstract TaskRequest getTaskRequest();
    protected abstract TaskDescriptor executeJob(TaskDescriptor startedJob);

    @Override
    public void start() {
        dispatchTasksThread.start();

    }

    private CompletableFuture<TaskDescriptor> startJob(DispatchedJob job) {
        CompletableFuture<TaskDescriptor> future = CompletableFuture.supplyAsync(() -> {
            TaskDescriptor startedJob = job.getStartCallback().apply(job.getTask());
            TaskDescriptor completedJob = this.executeJob(startedJob);
            return completedJob;
        }, jobsExecutor);
        return future;
    }

    @Override
    public void stop() {
        dispatchTasksThread.interrupt();
        jobsExecutor.shutdown();
    }
}
