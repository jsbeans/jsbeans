package org.jsbeans.textextractors;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class PlainTextExtractor implements TextExtractor<ExtractorConfig, ExtractableAttribute> {

    private String text;

    public static ExtractorConfig config() {
        return new ExtractorConfig() {};
    }

    @Override
    public void load(InputStream inputStream, ExtractorConfig extractorConfig) throws IOException {
        try(Scanner s = new Scanner(inputStream).useDelimiter("\\A")) {
            this.text = s.hasNext() ? s.next() : "";
        }
    }

    @Override
    public String getText() {
        return text;
    }

    @Override
    public void writeText(Writer writer) throws IOException {
        writer.append(getText());
        writer.flush();
    }

    @Override
    public <T> T getAttribute(ExtractableAttribute attribute) {
        return null;
    }

    @Override
    public Map<String, ?> getAllAttributes() {
        return new HashMap<>();
    }

    @Override
    public void close() throws IOException {
        text = null;
    }
}
