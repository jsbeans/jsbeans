package ru.avicomp.antiplag;

public enum DocumentType{
    PDF,
    DOCX;

    public static DocumentType valueForFile(String fileName) {
        // TODO: поддержать выбор по одному из расширений из множества для каждого типа
        return valueOf(
            fileName.substring(fileName.lastIndexOf(".") + 1).toUpperCase());
    }
}
