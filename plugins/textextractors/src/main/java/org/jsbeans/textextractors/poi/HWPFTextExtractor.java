package org.jsbeans.textextractors.poi;

import org.apache.poi.hpsf.SummaryInformation;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.jsbeans.textextractors.ExtractableAttribute;
import org.jsbeans.textextractors.ExtractorConfig;
import org.jsbeans.textextractors.TextExtractor;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

public class HWPFTextExtractor implements TextExtractor<HWPFTextExtractor.PoiTextConfig, HWPFTextExtractor.HWPFTextAttribute> {

    public static class PoiTextConfig implements ExtractorConfig {
        private final String name;

        public PoiTextConfig() {
            this("");
        }

        public PoiTextConfig(String name) {
            this.name = name;
        }

    }

    public enum HWPFTextAttribute implements ExtractableAttribute<SummaryInformation> {
        Title           (String.class, SummaryInformation::getTitle),
        Comments        (String.class, SummaryInformation::getComments),
        ApplicationName (String.class, SummaryInformation::getApplicationName),
        Author          (String.class, SummaryInformation::getAuthor),
        LastAuthor      (String.class, SummaryInformation::getLastAuthor),
        Template        (String.class, SummaryInformation::getTemplate),
        LastSaveDateTime(Date.class, SummaryInformation::getLastSaveDateTime),
        Created         (Date.class, SummaryInformation::getCreateDateTime),
        LastPrinted     (Date.class, SummaryInformation::getLastPrinted),
        Keywords        (String.class, SummaryInformation::getKeywords),
        Subject         (String.class, SummaryInformation::getSubject);

        private final Class<?> type;
        private Function<SummaryInformation, ?> func;

        HWPFTextAttribute(Class<?> type, Function<SummaryInformation, ?> func) {
            this.type = type;
            this.func = func;
        }

        @Override
        public Class<?> getType() {
            return type;
        }

        @Override
        public <ValueType> ValueType get(SummaryInformation info) {
            return (ValueType) func.apply(info);
        }
    }

    private HWPFDocument document;
    private WordExtractor extractor;
    private SummaryInformation summaryInfo;


    @Override
    public void load(InputStream inputStream, PoiTextConfig extractorConfig) throws IOException {
        document = new HWPFDocument(inputStream);
        extractor = new WordExtractor(document);

        summaryInfo = document.getSummaryInformation();
    }

    @Override
    public String getText() {
        return extractor.getText();
    }

    @Override
    public void writeText(Writer writer) throws IOException {
        writer.append(getText());
    }

    @Override
    public <T> T getAttribute(HWPFTextAttribute attribute) {
        return attribute.get(summaryInfo);
    }

    @Override
    public Map<String, Object> getAllAttributes() {
        Map<String, Object> attrs = new HashMap<>(HWPFTextAttribute.values().length);
        Arrays.stream(HWPFTextAttribute.values()).forEach(a -> attrs.put(a.name(), this.getAttribute(a)));
        return attrs;
    }

    @Override
    public void close() throws IOException {
        document = null;
        extractor = null;
        summaryInfo = null;
    }
}
