package ru.avicomp.antiplag;

import ru.avicomp.ontoed.ws.Reactor;
import ru.avicomp.ontoed.ws.WorkspaceManagerFactory;

import java.io.File;

public class AntiplagWorkspaceManagerFactory extends WorkspaceManagerFactory {
    private static final java.lang.String HOME_PROPERTY = "antiplag.workspaces.home";

    @Override
    protected void init() {
        Reactor.register(Document.class, DocumentsReactor::new);
        super.init();
    }

    @Override
    public File getDefaultBaseDirectory() {
        if (System.getProperty(HOME_PROPERTY, "").length() > 0) {
            return new File(System.getProperty(HOME_PROPERTY));
        }
        return new File(System.getProperty("user.home"), ".antiplag");
    }
}