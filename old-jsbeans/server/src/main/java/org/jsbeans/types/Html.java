package org.jsbeans.types;

import java.io.Serializable;

public class Html implements Serializable {
    private static final long serialVersionUID = 7411372000377585048L;
    private String value;

    public Html() {
    }

    public Html(String value) {
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
