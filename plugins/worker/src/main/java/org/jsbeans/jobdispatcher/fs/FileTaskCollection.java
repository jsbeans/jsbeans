package org.jsbeans.jobdispatcher.fs;

import org.jsbeans.jobdispatcher.TaskCollection;
import org.jsbeans.jobdispatcher.TaskDescriptor;
import org.jsbeans.jobdispatcher.TaskRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Spliterator;
import java.util.concurrent.locks.ReentrantLock;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class FileTaskCollection implements TaskCollection {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final ReentrantLock ioLock = new ReentrantLock();
    private final Path collectionPath;
    private final String TASK_EXTENSION = ".task";
    private final String TASK_PREFIX = "task-";

    public FileTaskCollection(Path collectionPath){
        this.collectionPath = collectionPath;
        this.collectionPath.toFile().mkdirs();
    }

    @Override
    public TaskDescriptor add(TaskDescriptor task) {
        try {
            ioLock.lock();
            try (OutputStream out = new FileOutputStream(getTaskFile(task))) {
                TaskDescriptor.write(task, out);
                out.flush();
            } catch (IOException e) {
                throw new RuntimeException("Write task descriptor failed", e);
            }
            return loadTask(getTaskFile(task));
        }finally {
            ioLock.unlock();
        }
    }

    @Override
    public Stream<TaskDescriptor> remove(TaskRequest request) {
        return lookup(request)
                .map(task -> {
                    File file = getTaskFile(task);
                    if(file.exists()) {
                        try {
                            ioLock.lock();
                            file.delete();
                        }finally {
                            ioLock.unlock();
                        }
                    }
                    return task;
                });
    }

    @Override
    public Stream<TaskDescriptor> lookup(TaskRequest request) {
        return files()
                .map(this::loadTask)
                .filter(task -> request.getMatcher().compare(task, request.getTemplate()) == 0)
                .sorted(request.getOrder());
    }

    TaskDescriptor loadTask(File file) {
        try {
            ioLock.lock();
            try (InputStream is = new FileInputStream(file)) {
                return TaskDescriptor.load(is);
            } catch (IOException e) {
                logger.error("Read task descriptor failed", e);
                return null;
            }
        } finally {
            ioLock.unlock();
        }
    }

    Stream<File> files() {
        try {
            Spliterator<Path> paths = Files.newDirectoryStream(collectionPath).spliterator();
            return StreamSupport.stream(paths, false)
                    .filter(p->p.toString().endsWith(TASK_EXTENSION))
                    .map(Path::toFile);
        } catch (IOException e) {
            throw new RuntimeException("List files failed", e);
        }
    }

    File getTaskFile(String taskId) {
        return collectionPath.resolve(TASK_PREFIX + taskId + TASK_EXTENSION).toFile();
    }

    File getTaskFile(TaskDescriptor task) {
        return getTaskFile(task.getId());
    }

    void lockIO(){
        ioLock.lock();
    }
    void unlockIO() {
        ioLock.unlock();
    }
}
