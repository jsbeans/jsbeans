package ru.avicomp.ontoed.ws.json;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.avicomp.ontoed.json.JsonJava;
import ru.avicomp.ontoed.json.JsonPathAccessor;
import ru.avicomp.ontoed.ws.Entry;
import ru.avicomp.ontoed.ws.PropertyAccessor;
import ru.avicomp.ontoed.ws.Reactor;
import ru.avicomp.ontoed.ws.Workspace;

import java.io.*;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Stream;

public class FileJsonWorkspace implements Workspace {
    public static final Logger Logger = LoggerFactory.getLogger(Workspace.class);

    public static final String WOKRSPACE_ARTIFACT_NAME = "workspace.json";

    private final Object ioLock = new Object();

    private final FileJsonWorkspaceManager workspaceManager;
    private final String id;
    private final File baseDirectory;

    private Map<String, Object> descriptorJson = JsonJava.buildJsonObject("entries", JsonJava.emptyJsonObject()).get();

    private final Map<Class<? extends Entry>, Reactor<? extends Entry>> reactors = new ConcurrentHashMap<>();

    FileJsonWorkspace(FileJsonWorkspaceManager workspaceManager, String id) {
        this.workspaceManager = workspaceManager;
        this.id = id;
        this.baseDirectory = new File(workspaceManager.getBaseDirectory(), id);
    }

    public File baseDirectory() {
        return baseDirectory;
    }

    @Override
    public <T> T self() {
        return (T) descriptorJson;
    }

    @Override
    public synchronized<T> T get(String path) {
        return JsonPathAccessor.get(descriptorJson, path);
    }

    @Override
    public synchronized <T> void set(String path, T value) {
        JsonPathAccessor.set(descriptorJson, path, value);
    }

    @Override
    public String id() {
        return id;
    }

    @Override
    public InputStream artifactInputStream(String name) throws FileNotFoundException {
        File file = new File(baseDirectory, name);
        Logger.debug("Reading workspace artifact: " + file);
        return new FileInputStream(file);
    }

    @Override
    public OutputStream artifactOutputStream(String name) throws IOException {
        File file = new File(baseDirectory, name);
        new File(file.getParent()).mkdirs();
        Logger.debug("Writing workspace artifact: " + file);
        return new FileOutputStream(file);
    }

    @Override
    public boolean artifactRemove(String name) {
        File file = new File(baseDirectory, name);
        if (file.exists()) {
            Logger.debug("Removing workspace artifact: " + file);
            return file.delete();
        }
        return false;
    }

    @Override
    public void load() throws IOException {
        Logger.debug("Loading workspace: " + id());
        synchronized (ioLock) {
            try (InputStream inputStream = artifactInputStream(WOKRSPACE_ARTIFACT_NAME)) {
                descriptorJson = JsonJava.parse(inputStream);
            } catch (FileNotFoundException e) {
                Logger.debug("Loading empty descriptor");
                descriptorJson = JsonJava.emptyJsonObject();
            }
        }
    }

    @Override
    public void store() throws IOException {
        Logger.debug("Storing workspace: " + id());
        synchronized (ioLock) {
            for (Reactor<? extends Entry> reactor : reactors.values()) {
                reactor.store();
            }

            try (OutputStream outputStream = artifactOutputStream(WOKRSPACE_ARTIFACT_NAME)) {
                JsonJava.write(outputStream, descriptorJson);
                outputStream.flush();
            }
        }
    }

    @Override
    public void remove() {
        Logger.debug("Removing workspace: " + id());
        synchronized (ioLock) {
            close();
            descriptorJson = JsonJava.emptyJsonObject();
            if (baseDirectory.exists()) {
                if (baseDirectory.delete()) {
                    Logger.debug("Workspace removed: " + id());
                }
            }
        }
    }

    @Override @SuppressWarnings("unchecked")
    public void remove(Entry entry) {
        Logger.debug("Removing workspace entry: " + entry.id());
        for (Reactor reactor : reactors.values()) {
            reactor.remove(entry);
        }
        set(entry.id(), null);
    }

    @Override
    public void close() {
        Logger.debug("Closing workspace: " + id());
        for (Reactor<? extends Entry> reactor : reactors.values()) {
            try {
                reactor.close();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        reactors.clear();
    }

    @Override
    public Stream<Class<? extends Entry>> entryTypes() {
        return Reactor.factories().keySet().stream();
    }

    @Override @SuppressWarnings("unchecked")
    public <EntryType extends Entry> Reactor<EntryType> reactor(Class<EntryType> type) {
        Reactor<EntryType> reactor = (Reactor<EntryType>) reactors.get(type);
        if (reactor != null) {
            return reactor;
        } else {
            synchronized (reactors) {
                reactor = (Reactor<EntryType>) reactors.get(type);
                if (reactor == null) {
                    Reactor.ReactorFactory<EntryType> factory = (Reactor.ReactorFactory<EntryType>) Reactor.factories().get(type);
                    if (factory == null) {
                        throw new IllegalArgumentException("Unsupported workspace entry type: " + type.getName());
                    }

                    Logger.debug("Creating entry reactor: " + type);
                    reactor = factory.newInstance(this, reactorPropertyAccessor(id));
                    reactors.put(type, reactor);
                }
                return reactor;
            }
        }
    }

    private PropertyAccessor reactorPropertyAccessor(String name) {
        String prefix = "entries.";
        FileJsonWorkspace ws = FileJsonWorkspace.this;
        return new PropertyAccessor() {
            @Override
            public <T> T self() {
                return ws.get(prefix.substring(0, prefix.length() - 1));
            }

            @Override
            public <T> T get(String path) {
                return ws.get(prefix + path);
            }

            @Override
            public <T> void set(String path, T value) {
                ws.set(prefix + path, value);
            }
        };
    }
}
