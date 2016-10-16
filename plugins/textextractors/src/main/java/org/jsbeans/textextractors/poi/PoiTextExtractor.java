package org.jsbeans.textextractors.poi;

import org.apache.poi.POIXMLProperties.CoreProperties;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
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

public class PoiTextExtractor implements TextExtractor<PoiTextExtractor.PoiTextConfig, PoiTextExtractor.PoiTextTextAttribute> {

    public static class PoiTextConfig implements ExtractorConfig {
        private final String name;

        public PoiTextConfig() {
            this("");
        }

        public PoiTextConfig(String name) {
            this.name = name;
        }

    }

    public enum PoiTextTextAttribute implements ExtractableAttribute<CoreProperties> {
        Title   (String.class, CoreProperties::getTitle),
        Description (String.class, CoreProperties::getDescription),
        Category    (String.class, CoreProperties::getCategory),
        ContentType (String.class, CoreProperties::getContentType),
        ContentStatus(String.class, CoreProperties::getContentStatus),
        Created     (Date.class, CoreProperties::getCreated),
        Modified    (Date.class, CoreProperties::getModified),
        LastPrinted (Date.class, CoreProperties::getLastPrinted),
        Creator     (String.class, CoreProperties::getCreator),
        Identifier  (String.class, CoreProperties::getIdentifier),
        Keywords    (String.class, CoreProperties::getKeywords),
        Subject     (String.class, CoreProperties::getSubject);

        private final Class<?> type;
        private Function<CoreProperties, ?> func;

        PoiTextTextAttribute(Class<?> type, Function<CoreProperties, ?> func) {
            this.type = type;
            this.func = func;
        }

        @Override
        public Class<?> getType() {
            return type;
        }

        @Override
        public <ValueType> ValueType get(CoreProperties info) {
            return (ValueType) func.apply(info);
        }
    }

    private XWPFDocument document;
    private XWPFWordExtractor extractor;
    private CoreProperties coreProperties;


    @Override
    public void load(InputStream inputStream, PoiTextConfig extractorConfig) throws IOException {
        document = new XWPFDocument(inputStream);
        extractor = new XWPFWordExtractor(document);
        coreProperties = extractor.getCoreProperties();
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
    public <T> T getAttribute(PoiTextTextAttribute attribute) {
        return attribute.get(coreProperties);
    }

    @Override
    public Map<String, Object> getAllAttributes() {
        Map<String, Object> attrs = new HashMap<>(PoiTextTextAttribute.values().length);
        Arrays.stream(PoiTextTextAttribute.values()).forEach(a -> attrs.put(a.name(), this.getAttribute(a)));
        return attrs;
    }
}
