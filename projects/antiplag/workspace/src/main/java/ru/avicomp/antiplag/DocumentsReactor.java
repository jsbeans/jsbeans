package ru.avicomp.antiplag;

import ru.avicomp.ontoed.ws.EntriesReactor;
import ru.avicomp.ontoed.ws.PropertyAccessor;
import ru.avicomp.ontoed.ws.Workspace;

import java.io.IOException;

public class DocumentsReactor extends EntriesReactor<Document> {

    protected DocumentsReactor(Workspace workspace, PropertyAccessor propertyAccessor) {
        super(workspace, propertyAccessor);
    }

    public static Class<Document> getType() {
        return Document.class;
    }

    @Override
    protected Document newEntry(String id) {
        return new Document(this, id, entryPropertyAccessor(id));

    }

    public void loadArtifactResource(Document document, Class<?> hostClass, String resourcePath) throws IOException {

    }

    @Override
    public void store() throws IOException {

    }

    public void store(Document document) throws IOException {

    }
}
