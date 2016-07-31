package org.jsbeans.scripting;

import java.io.Serializable;

public enum ExecutionStatus implements Serializable {
    INIT,
    EXECUTING,
    SUCCESS,
    FAIL,
    MISSING
}
