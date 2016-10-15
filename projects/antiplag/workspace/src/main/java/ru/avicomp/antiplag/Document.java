package ru.avicomp.antiplag;

import ru.avicomp.ontoed.ws.PropertyAccessor;
import ru.avicomp.ontoed.ws.json.SimpleEntry;

public class Document extends SimpleEntry<Document> {

    DocumentsReactor reactor;

    public Document(DocumentsReactor reactor, String id, PropertyAccessor entryAccessor) {
        super(reactor, id, entryAccessor);
        this.reactor = reactor;
    }

    public DocumentsReactor getReactor() {
        return reactor;
    }

    public String artifactFile() {
        return get("artifactFile");
    }
    public void artifactFile(String artifactFile) {
        set("artifactFile", artifactFile);
    }

    public String uri() {
        return get("uri");
    }
    public void uri(String uri) {
        set("uri", uri);
    }

}
