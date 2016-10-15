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

    InputStream readArtifact(String name) throws FileNotFoundException, IOException;
    OutputStream writeArtifact(String name) throws IOException;

    <EntryType extends Entry> Reactor<EntryType> reactor(Class<EntryType> type);
}
