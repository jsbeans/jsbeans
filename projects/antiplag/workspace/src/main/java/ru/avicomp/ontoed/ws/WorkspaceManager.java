package ru.avicomp.ontoed.ws;

import java.util.stream.Stream;

public interface WorkspaceManager {
    Logs logs();
    Stream<Workspace> workspaces();
    Workspace workspace(String name);
}
