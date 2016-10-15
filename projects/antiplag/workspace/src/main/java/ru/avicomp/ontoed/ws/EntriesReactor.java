package ru.avicomp.ontoed.ws;

import org.slf4j.LoggerFactory;
import ru.avicomp.ontoed.json.JsonJava;
import ru.avicomp.ontoed.ws.json.SimpleEntry;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.stream.Stream;

public abstract class EntriesReactor<EntryType extends Entry> implements Reactor<EntryType> {
    public final org.slf4j.Logger Logger = LoggerFactory.getLogger(getClass());

    protected final Workspace workspace;

    private final PropertyAccessor propertyAccessor;
    private final Map<String, EntryType> entries = new HashMap<>();
    private final Set<String> changed = new CopyOnWriteArraySet<>();

    protected EntriesReactor(Workspace workspace, PropertyAccessor propertyAccessor) {
        this.workspace = workspace;
        this.propertyAccessor = propertyAccessor;
    }

    @Override
    public Workspace workspace() {
        return workspace;
    }

    @Override @SuppressWarnings("unchecked")
    public Stream<EntryType> entries() {
        return entriesIds().map(this::entry);
    }

    private Map<String, Object> entryJson() {
        return propertyAccessor.self();
    }

    protected PropertyAccessor entryPropertyAccessor(String id) {
        String prefix = id + ".";
        return new PropertyAccessor() {
            @Override
            public <T> T self() {
                return propertyAccessor.get(prefix.substring(0, prefix.length() - 1));
            }

            @Override
            public synchronized <T> T get(String path) {
                return propertyAccessor.get(prefix + path);
            }

            @Override
            public synchronized <T> void set(String path, T value) {
                Object oldValue = get(path);
                propertyAccessor.set(prefix + path, value);
                if (oldValue != value || oldValue != null && !oldValue.equals(value)) {
                    changed.add(id);
                }
            }
        };
    }

    @Override
    public boolean isChanged(EntryType entry) {
        return changed.contains(entry.id());
    }

    protected void updated(EntryType entry) {
        changed.remove(entry);
    }

    @Override
    public Stream<String> entriesIds() {
        return entryJson().keySet().stream();
    }

    @Override
    public EntryType entry(String id) {
        EntryType entry = entries.get(id);
        if (entry != null) {
            return entry;
        } else {
            synchronized (entries) {
                entry = entries.get(id);
                if (entry != null) {
                    return entry;
                } else {
                    boolean exists = entriesIds().filter(id::equals).findAny().isPresent();
                    if (!exists) {
                        Logger.debug(getClass().getName() + ": Loading new entry: " + id);
                        entry = newEntry(id);
                        entryJson().put(id, JsonJava.emptyJsonObject());
                    } else {
                        Logger.debug(getClass().getName() + ": Loading existed entry: " + id);
                        entry = newEntry(id);
                    }
                    entries.put(id, entry);
                    return entry;
                }
            }
        }
    }

    @Override
    public void close() throws IOException {
        entries.clear();
        Logger.debug("Reactor closed: " + getClass().getName());
    }

    @Override
    public boolean remove(EntryType entry) {
        synchronized (entries) {
            return entries.remove(entry.id()) != null;
        }
    }

    abstract protected EntryType newEntry(String id);
}
