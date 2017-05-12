package org.jsbeans.jobdispatcher.fs;

import org.jsbeans.jobdispatcher.base.BaseTaskRegistry;

import java.nio.file.Path;

public class FileTaskRegistry extends BaseTaskRegistry<FileTaskCollection> {

    private final Path tasksPath;

    public FileTaskRegistry(Path tasksPath){
        this.tasksPath = tasksPath;
        this.tasksPath.toFile().mkdirs();
        init();
    }

    @Override
    protected FileTaskCollection createFileTaskCollection(State state) {
        return new FileTaskCollection(tasksPath.resolve(state.name()));
    }
}
