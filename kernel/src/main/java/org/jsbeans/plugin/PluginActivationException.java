package org.jsbeans.plugin;

import org.jsbeans.PlatformException;

public class PluginActivationException extends PlatformException {
    private static final long serialVersionUID = 8574814500407628958L;

    public PluginActivationException(String name, Throwable cause) {
        super("Cannot activate plugin " + name, cause);
    }
}
