package ru.avicomp.ontoed.ws;

import ru.avicomp.ontoed.ws.json.FileJsonWorkspaceManager;
import ru.avicomp.ontoed.ws.json.SimpleEntry;
import ru.avicomp.ontoed.ws.json.SimpleReactor;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class WorkspaceManagerFactory {
    private static final java.lang.String HOME_PROPERTY = "ontoed.workspaces.home";

    protected void init() {
        Reactor.register(SimpleEntry.class, SimpleReactor::new);
    }

    public WorkspaceManager create() {
        return create(getDefaultBaseDirectory(), "workspace");
    }

    public WorkspaceManager create(String userName) {
        checkDirectoryNameValidity(userName);
        return create(getDefaultBaseDirectory(), Paths.get("users", userName, "workspace").toString());

    }

    public File getDefaultBaseDirectory() {
        if (System.getProperty(HOME_PROPERTY, "").length() > 0) {
            return new File(System.getProperty(HOME_PROPERTY));
        }
        return new File(System.getProperty("user.home"), ".ontoed");
    }

    public WorkspaceManager create(File baseDirectory, String suffix) {
        init();
        if (baseDirectory == null) {
            baseDirectory = getDefaultBaseDirectory();
        }
        return new FileJsonWorkspaceManager(baseDirectory);
    }

    protected static boolean checkDirectoryNameValidity(String name) {
        try {
            Files.createTempDirectory(name).toFile().delete();
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
