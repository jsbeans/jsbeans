package org.jsbeans.textextractors;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.Map;

public interface TextExtractor<Config extends ExtractorConfig, Attribute extends ExtractableAttribute> {
    void load(InputStream inputStream, Config extractorConfig) throws IOException;

    String getText();
    void writeText(Writer writer) throws IOException;

    <T> T getAttribute(Attribute attribute);

    Map<String, ?> getAllAttributes();

}
