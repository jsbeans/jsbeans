package ru.avicomp.ontoed.ws.json;

import ru.avicomp.ontoed.ws.Entry;
import ru.avicomp.ontoed.ws.PropertyAccessor;
import ru.avicomp.ontoed.ws.Reactor;

/* Simple entry with named properties
* */
public class SimpleEntry<EntryType extends Entry> implements Entry {

    protected final Reactor<EntryType> reactor;
    protected final String id;

    private final PropertyAccessor entryAccessor;

    public SimpleEntry(Reactor<EntryType> reactor, String id, PropertyAccessor entryAccessor) {
        this.reactor = reactor;
        this.id = id;
        this.entryAccessor = entryAccessor;
    }

    public void remove() {
        reactor.remove((EntryType) this);
    }

    @Override
    public String id() {
        return id;
    }

    @Override
    public <T> T get(String name) {
        return entryAccessor.get(name);
    }

    @Override
    public <T> void set(String name, T value) {
        entryAccessor.set(name, value);
    }

    @Override
    public <T> T self() {
        return entryAccessor.self();
    }

    public String title() {
        return get("title");
    }
    public void title(String title) {
        set("title", title);
    }

    public String descriptor() {
        return get("description");
    }
    public void description(String description) {
        set("description", description);
    }

    public String category() {
        return get("category");
    }
    public void category(String category) {
        set("category", category);
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(" + id() + ")";
    }
}
