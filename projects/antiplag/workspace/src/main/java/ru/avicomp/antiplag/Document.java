package ru.avicomp.antiplag;

import ru.avicomp.ontoed.ws.PropertyAccessor;
import ru.avicomp.ontoed.ws.json.SimpleEntry;

import java.util.Map;

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

    public String plaintextFile() {
        return get("plaintextFile");
    }
    public void plaintextFile(String plaintextFile) {
        set("plaintextFile", plaintextFile);
    }

    public Map<String, String> plaintextAttributes() {
        return get("plaintext");
    }

    public DocumentType type() {
        String value = get("type");
        if (value != null) {
            return DocumentType.valueOf(value);
        }
        return null;
    }
    public void type(DocumentType type) {
        set("type", type.name());
    }

    public String uri() {
        return get("uri");
    }
    public void uri(String uri) {
        set("uri", uri);
    }

}
