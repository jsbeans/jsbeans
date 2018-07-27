package org.jsbeans.store.mongodb;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.DependsOn;
import org.jsbeans.plugin.KernelPluginActivator;
import org.jsbeans.plugin.PluginActivator;

@DependsOn({KernelPluginActivator.class})
public class MongodbStorePluginActivator implements PluginActivator {
    public void init() {
        String folder = ConfigHelper.getConfigString("store.folder");
        if (folder == null) {
            folder = "web";
        }
        String ff = ConfigHelper.getPluginHomeFolder(this) + "/" + folder;

        ConfigHelper.addJssFolder(ff);
        ConfigHelper.addWebFolder(ff);
    }
}
