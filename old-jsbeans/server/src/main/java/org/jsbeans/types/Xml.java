package org.jsbeans.types;

import java.io.Serializable;

public class Xml implements Serializable {
    private static final long serialVersionUID = -8927191797122577627L;
    private String value;

    public Xml() {
    }

    public Xml(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
