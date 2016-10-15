package ru.avicomp.ontoed.ws;

import java.io.Closeable;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.stream.Stream;

/** Runtime container for operate with {@link Entry}.
 */
public interface Reactor<EntryType extends Entry> extends Closeable {

    Workspace workspace();

    void store() throws IOException;

    Stream<EntryType> entries();

    /** Return ids of all entries without their creation
     * */
    Stream<String> entriesIds();

    /** Return or create entry by id. Always returns the single instance for this is and reactor
     * */
    Entry entry(String id);

    boolean remove(EntryType entry);

    boolean isChanged(EntryType entry);


    /** Factory callback for lazy reactor creation in {@link Workspace}
     * */
    interface ReactorFactory<EntryType extends Entry> {
        Reactor<EntryType> newInstance(Workspace workspace, PropertyAccessor accessor);
    }

    ConcurrentMap<Class<? extends Entry>, ReactorFactory<? extends Entry>> factories = new ConcurrentHashMap<>();

    static String name(Class<? extends Entry> type) {
        return type.getSimpleName();
    }

    static <EntryType extends Entry> void register(Class<EntryType> type, ReactorFactory<EntryType> factory) {
        factories.putIfAbsent(type, factory);
    }

    static Map<Class<? extends Entry>, ReactorFactory<? extends Entry>> factories() {
        return Collections.unmodifiableMap(factories);
    }
}
