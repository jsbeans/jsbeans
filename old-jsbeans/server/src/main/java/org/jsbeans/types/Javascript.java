package org.jsbeans.types;

import java.io.Serializable;

public class Javascript implements Serializable {
    private static final long serialVersionUID = -906390842185350467L;

    private String value;

    public Javascript() {
    }

    public Javascript(String value) {
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
