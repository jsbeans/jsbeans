package ru.avicomp.ontoed.ws;

import java.io.*;
import java.util.stream.Stream;

public interface Workspace extends Entry, PropertyAccessor, Closeable {

    String id();

    void load() throws IOException;

    void store() throws IOException;

    void remove();

    void remove(Entry entry);

    Stream<Class<? extends Entry>> entryTypes();

    InputStream artifactInputStream(String name) throws FileNotFoundException, IOException;
    OutputStream artifactOutputStream(String name) throws IOException;
    boolean artifactRemove(String name);

    <EntryType extends Entry> Reactor<EntryType> reactor(Class<EntryType> type);
}
