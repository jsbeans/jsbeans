package ru.avicomp.antiplag;

import org.jsbeans.textextractors.TextExtractor;
import org.jsbeans.textextractors.pdf.PdfBoxTextExtractor;
import org.jsbeans.textextractors.poi.PoiTextExtractor;
import ru.avicomp.ontoed.ws.EntriesReactor;
import ru.avicomp.ontoed.ws.PropertyAccessor;
import ru.avicomp.ontoed.ws.Workspace;

import java.io.*;
import java.util.Iterator;
import java.util.Scanner;

public class DocumentsReactor extends EntriesReactor<Document> {
    private static final String artifactPrefix = "document-";
    private static final String artifactDefaultExtension = ".unknown";


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

    public void loadArtifactFromResource(Document document, Class<?> hostClass, String resourcePath) throws IOException {
        try(InputStream is = hostClass.getResourceAsStream(resourcePath)) {
            loadArtifactFrom(document, is);
        }
    }

    public void loadArtifactFromText(Document document, String content) throws IOException {
        if (content == null) {
            throw new IllegalArgumentException("Document`s artifact content is null: " + document.id());
        }
        loadArtifactFromBytes(document, content.getBytes());
    }

    public void loadArtifactFromBytes(Document document, byte[] content) throws IOException {
        if (content == null) {
            throw new IllegalArgumentException("Document`s artifact bytes is null: " + document.id());
        }
        try(InputStream is = new ByteArrayInputStream(content)) {
            loadArtifactFrom(document, is);
        }
    }

    public void loadArtifactFrom(Document document, InputStream inputStream) throws IOException  {
        if (inputStream == null) {
            throw new IllegalArgumentException("Document`s artifact inputStream is null: " + document.id());
        }

        if (document.artifactFile() == null) {
            document.artifactFile(artifactName(document));
        }

        Logger.debug(String.format("Document artifact length: %s (%s)", inputStream.available(), document.id()));
        try(OutputStream outputStream = workspace().artifactOutputStream(artifactName(document))) {
            int n;
            byte[] buffer = new byte[1024];
            while((n = inputStream.read(buffer)) > -1) {
                outputStream.write(buffer, 0, n);
            }
        }
        load(document);
    }

    public void load(Document document) throws IOException  {
        String artifactFile = document.artifactFile();
        if (artifactFile == null) {
            throw new FileNotFoundException("Document artifact file name is not defiled: " +document.id());
        }

        // nothing to do
    }

    public String readPlaintextAsString(Document document) {
        if (Boolean.TRUE.equals(document.get("plaintext.extracted")) && document.plaintextFile() != null) {
            try (InputStream inputStream = workspace().artifactInputStream(document.plaintextFile())) {
                Scanner s = new java.util.Scanner(inputStream).useDelimiter("\\A");
                return s.hasNext() ? s.next() : "";
            } catch (IOException e) {
                throw new RuntimeException("Read document plaintext failed: " + document.id());
            }
        }
        return null;
    }

    public void extractTexts(Document document, boolean force) throws IOException {
        TextExtractor textExtractor = doExtractTexts(document);

        if (document.plaintextFile() == null) {
            document.plaintextFile(artifactName(document) + ".plaintext");
        }

        if (force || !Boolean.TRUE.equals(document.get("plaintext.extracted"))) {
            Logger.debug(String.format("Extract document plaintext: %s", document.id()));

            if (document.plaintextFile() != null) {
                workspace().artifactRemove(document.plaintextFile());
            }

            try (OutputStream outputStream = workspace().artifactOutputStream(document.plaintextFile())) {
                textExtractor.writeText(new OutputStreamWriter(outputStream));
            }

            textExtractor.getAllAttributes().forEach((attr, val) -> {
                document.set("plaintext." + attr, val != null ? val.toString(): null);
            });
            document.set("plaintext.extracted", true);
        }
    }

    private TextExtractor doExtractTexts(Document document) throws IOException {
        String artifactFile = document.artifactFile();
        if (artifactFile == null) {
            throw new FileNotFoundException("Document artifact file name is not defiled: " +document.id());
        }
        try (InputStream inputStream = workspace().artifactInputStream(artifactFile)) {
            if (DocumentType.PDF.equals(document.type())) {
                TextExtractor e = new PdfBoxTextExtractor();
                e.load(inputStream, new PdfBoxTextExtractor.PdfBoxConfig());
                return e;
            } else if (DocumentType.DOCX.equals(document.type())) {
                TextExtractor e = new PoiTextExtractor();
                e.load(inputStream, new PoiTextExtractor.PoiTextConfig());
                return e;
            }
        }
        throw new IllegalArgumentException("Unsupported document type: " + document.type() + "(" + document.id() + ")");
    }

    @Override
    public boolean remove(Document document) {
        if (document.artifactFile() != null) {
            workspace().artifactRemove(document.artifactFile());
            Logger.debug("Document artifact removed: " + document.artifactFile());
        }
        if (document.plaintextFile() != null) {
            workspace().artifactRemove(document.plaintextFile());
            Logger.debug("Document artifact removed: " + document.plaintextFile());
        }
        return super.remove(document);
    }

    @Override
    public void store() throws IOException {
        for(Iterator<Document> it = entries().iterator(); it.hasNext(); ) {
            store(it.next());
        }
    }

    public void store(Document document) throws IOException {
        // nothing to do
    }

    public String artifactName(Document document) {
        String extension = document.type() != null ? "."+document.type().name().toLowerCase(): artifactDefaultExtension;
        return artifactPrefix + document.id() + extension;
    }

}
