package org.jsbeans.textextractors.odf;


import org.jsbeans.textextractors.ExtractableAttribute;
import org.jsbeans.textextractors.ExtractorConfig;
import org.jsbeans.textextractors.TextExtractor;
import org.odftoolkit.odfdom.doc.OdfTextDocument;
import org.odftoolkit.odfdom.incubator.doc.text.OdfEditableTextExtractor;
import org.odftoolkit.odfdom.incubator.meta.OdfOfficeMeta;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * PdfBox implementation
 */
public class OdfTextExtractor implements TextExtractor<ExtractorConfig, OdfTextExtractor.PdfBoxAttribute> {

    public enum PdfBoxAttribute implements ExtractableAttribute<OdfOfficeMeta> {
        Title(String.class, OdfOfficeMeta::getTitle),
        Subject(String.class, OdfOfficeMeta::getSubject),
        Author(String.class, OdfOfficeMeta::getCreator),
        Keywords(String.class, OdfOfficeMeta::getKeywords),
        Creator(String.class, OdfOfficeMeta::getCreator),
        CreationDate(Calendar.class, OdfOfficeMeta::getCreationDate),
        Date(Calendar.class, OdfOfficeMeta::getDate);

        private final Class<?> type;
        private Function<OdfOfficeMeta, ?> func;

        PdfBoxAttribute(Class<?> type, Function<OdfOfficeMeta, ?> func) {
            this.type = type;
            this.func = func;
        }

        @Override
        public Class<?> getType() {
            return type;
        }

        @Override
        public <ValueType> ValueType get(OdfOfficeMeta info) {
            return (ValueType) func.apply(info);
        }
    }

    public static class OdfConfig implements ExtractorConfig {
    }

    private OdfTextDocument document;
    private OdfOfficeMeta info;

    @Override
    public void load(InputStream inputStream, ExtractorConfig config) throws IOException {
        try {
            document = OdfTextDocument.loadDocument(inputStream);
            info = document.getOfficeMetadata();
        } catch (IOException e) {
            throw e;
        } catch (Exception e) {
            throw new IOException("ODF file loading failed");
        }
    }

    @Override
    public String getText() {
        try (StringWriter writer = new StringWriter()) {
            writeText(writer);
            return writer.toString();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void writeText(Writer writer) throws IOException {
        OdfEditableTextExtractor extractor = OdfEditableTextExtractor.newOdfEditableTextExtractor(document);
        String output = extractor.getText();
        writer.append(output);
    }

    @Override
    public <T> T getAttribute(PdfBoxAttribute attribute) {
        return attribute.get(info);
    }

    @Override
    public Map<String, Object> getAllAttributes() {
        Map<String, Object> attrs = new HashMap<>(PdfBoxAttribute.values().length);
        Arrays.stream(PdfBoxAttribute.values()).forEach(a -> attrs.put(a.name(), this.getAttribute(a)));
        return attrs;
    }

    @Override
    public void close() throws IOException {
        document.close();
        document = null;
        info = null;
    }
}
