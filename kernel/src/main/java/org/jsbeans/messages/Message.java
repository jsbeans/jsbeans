package org.jsbeans.messages;

import java.io.Serializable;

public interface Message extends Serializable {
    public static final String OK = "ok";
    public static final String SVC_INIT = "svcInit";
    public static final String SVC_LOADED = "svcLoaded";
    public static final String SVC_INIT_COMPLETE = "svcInitComplete";
    public static final String SVC_LIST = "svcList";
    public static final String TICK = "Tick";
}
