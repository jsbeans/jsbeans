package org.jsbeans.plugin;


public interface PluginActivator {
    void init();

    default String getName() {
        String name = this.getClass().getSimpleName();
        if (!name.endsWith(PluginActivator.class.getSimpleName())) {
            throw new IllegalArgumentException("Default plugin name is not extracted: override getName");
        }
        return name.substring(0, name.length() - PluginActivator.class.getSimpleName().length());
    }

    default String getConfigurationName() {
        return getName().toLowerCase();
    }
}
