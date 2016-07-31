package org.jsbeans.types;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Widget implements Serializable {
    private static final long serialVersionUID = 4739169542827264165L;

    private String procId = null;
    private String eProcId = null;
    private String refPath = null;
    private String ctxPath = null;
    private String jsoName = null;
    private List<String> ePorts = null;

    public Widget() {
    }

    public String getProcId() {
        return this.procId;
    }

    public void setProcId(String p) {
        this.procId = p;
    }

    public String getEmbeddedProcId() {
        return this.eProcId;
    }

    public void setEmbeddedProcId(String p) {
        this.eProcId = p;
    }

    public String getRefPath() {
        return this.refPath;
    }

    public void setRefPath(String p) {
        this.refPath = p;
    }

    public String getContextPath() {
        return this.ctxPath;
    }

    public void setContextPath(String p) {
        this.ctxPath = p;
    }

    public String getJsoName() {
        return this.jsoName;
    }

    public void setJsoName(String j) {
        this.jsoName = j;
    }

    public void addPort(String p) {
        if (this.ePorts == null) {
            this.ePorts = new ArrayList<>();
        }
        this.ePorts.add(p);
    }

    public List<String> getPorts() {
        return this.ePorts;
    }
}
