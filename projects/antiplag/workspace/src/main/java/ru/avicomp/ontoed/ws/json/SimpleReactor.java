package ru.avicomp.ontoed.ws.json;

import ru.avicomp.ontoed.ws.EntriesReactor;
import ru.avicomp.ontoed.ws.PropertyAccessor;
import ru.avicomp.ontoed.ws.Workspace;

import java.io.IOException;
import java.util.stream.Stream;

public class SimpleReactor extends EntriesReactor<SimpleEntry> {
    public SimpleReactor(Workspace workspace, PropertyAccessor propertyAccessor) {
        super(workspace, propertyAccessor);
    }

    @Override
    public Stream<SimpleEntry> entries() {
        // you can filter entries here
        return super.entries();
    }

    public static Class<SimpleEntry> getType() {
        return SimpleEntry.class;
    }

    @Override
    protected SimpleEntry newEntry(String id) {
        return new SimpleEntry(this, id, entryPropertyAccessor(id));
    }

    @Override
    public void store() throws IOException {
        entries().forEach(this::updated);
    }
}
