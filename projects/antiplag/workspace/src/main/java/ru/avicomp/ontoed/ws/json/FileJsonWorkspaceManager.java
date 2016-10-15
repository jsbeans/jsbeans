package ru.avicomp.ontoed.ws.json;

import ru.avicomp.ontoed.ws.Workspace;
import ru.avicomp.ontoed.ws.Logs;
import ru.avicomp.ontoed.ws.WorkspaceManager;

import java.io.File;
import java.util.Arrays;
import java.util.stream.Stream;

public class FileJsonWorkspaceManager implements WorkspaceManager {

    private final File baseDirectory;
    private final Logs logs = new LogsImpl();

    public FileJsonWorkspaceManager(File baseDirectory) {
        this.baseDirectory = baseDirectory;
        checkBaseDirectory();
    }

    private void checkBaseDirectory() {
        if (!baseDirectory.exists()) {
            baseDirectory.mkdirs();
        }
        if (!baseDirectory.isDirectory()) {
            throw new IllegalArgumentException("Invalid workspace base directory: " + baseDirectory);
        }
    }

    @Override
    public Logs logs() {
        return logs;
    }

    @Override
    public Stream<Workspace> workspaces() {
        checkBaseDirectory();
        File[] files = baseDirectory.listFiles();
        return files == null
                ? Stream.empty()
                : Arrays.stream(files)
                    .filter(file -> {
                        File artifact = new File(file, FileJsonWorkspace.WOKRSPACE_ARTIFACT_NAME);
                        return file.isDirectory() && artifact.exists();
                    }).map(ws -> new FileJsonWorkspace(this, ws.getName()));
    }

    @Override
    public Workspace workspace(String name) {
        if (name == null || name.length() == 0) {
            throw new IllegalArgumentException("Workspace name is not defined");
        }

        return new FileJsonWorkspace(this, name);
    }

    public File getBaseDirectory() {
        return baseDirectory;
    }
}
