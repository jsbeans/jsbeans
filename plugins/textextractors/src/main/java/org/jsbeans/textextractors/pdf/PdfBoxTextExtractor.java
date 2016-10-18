package org.jsbeans.textextractors.pdf;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.text.PDFTextStripper;
import org.jsbeans.textextractors.ExtractableAttribute;
import org.jsbeans.textextractors.ExtractorConfig;
import org.jsbeans.textextractors.TextExtractor;

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
public class PdfBoxTextExtractor implements TextExtractor<PdfBoxTextExtractor.PdfBoxConfig, PdfBoxTextExtractor.PdfBoxAttribute> {

    public enum PdfBoxAttribute implements ExtractableAttribute<PDDocumentInformation> {
        Title(String.class, PDDocumentInformation::getTitle),
        Subject(String.class, PDDocumentInformation::getSubject),
        Author(String.class, PDDocumentInformation::getAuthor),
        Keywords(String.class, PDDocumentInformation::getKeywords),
        Creator(String.class, PDDocumentInformation::getCreator),
        Producer(String.class, PDDocumentInformation::getProducer),
        CreationDate(Calendar.class, PDDocumentInformation::getCreationDate),
        ModificationDate(Calendar.class, PDDocumentInformation::getModificationDate),
        Trapped(String.class, PDDocumentInformation::getTrapped);

        private final Class<?> type;
        private Function<PDDocumentInformation, ?> func;

        PdfBoxAttribute(Class<?> type, Function<PDDocumentInformation, ?> func) {
            this.type = type;
            this.func = func;
        }

        @Override
        public Class<?> getType() {
            return type;
        }

        @Override
        public <ValueType> ValueType get(PDDocumentInformation info) {
            return (ValueType) func.apply(info);
        }
    }

    public static class PdfBoxConfig implements ExtractorConfig {

        private String password;

        public PdfBoxConfig() {
            this("");
        }

        public PdfBoxConfig(String password) {
            this.password = password;
        }

        public String getPassword() {
            return password;
        }
    }


    private PDDocument pdfDocument;
    private PDDocumentInformation info;

    @Override
    public void load(InputStream inputStream, PdfBoxConfig pdfConfig) throws IOException {
        if (pdfConfig == null) {
            pdfConfig = new PdfBoxConfig();
        }
        pdfDocument = PDDocument.load(inputStream, pdfConfig.getPassword());
        info = pdfDocument.getDocumentInformation();
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
        PDFTextStripper stripper = new PDFTextStripper();
        stripper.writeText(pdfDocument, writer);
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
        pdfDocument.close();
        pdfDocument = null;
        info = null;
    }
}
