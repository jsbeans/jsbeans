package org.jsbeans.messages;

import java.io.Serializable;

public final class OkResponse implements Serializable {
    private static final long serialVersionUID = 1L;

    public static OkResponse ok() {
        return new OkResponse();
    }

    @Override
    public int hashCode() {
        return getClass().getName().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return obj instanceof OkResponse ? true : false;
    }
}
