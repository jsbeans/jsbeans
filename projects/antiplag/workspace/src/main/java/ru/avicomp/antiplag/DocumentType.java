package ru.avicomp.antiplag;

public enum DocumentType{
    TXT("txt"),
    PDF("pdf"),
    DOC("doc"),
    RTF("rtf"),
    DOCX("docx");

    private final String[] extensions;

    DocumentType(String ... extensions) {
        this.extensions = extensions;
    }

    public static DocumentType valueForFile(String fileName) {
        // TODO: поддержать выбор по одному из расширений из множества для каждого типа
        return valueOf(
            fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase());
    }

    public String[] getExtensions() {
        return extensions;
    }
}
