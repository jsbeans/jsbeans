package org.jsbeans.unimap;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.PluginActivator;

public class UnimapPluginActivator implements PluginActivator {
    public void init() {
        String folder = ConfigHelper.getConfigString("unimap.folder");
        if (folder == null) {
            folder = "web";
        }
        String ff = ConfigHelper.getPluginHomeFolder(this) + "/" + folder;

        ConfigHelper.addJssFolder(ff);
        ConfigHelper.addWebFolder(ff);

    }
}
