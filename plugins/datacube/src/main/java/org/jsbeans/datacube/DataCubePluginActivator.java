package org.jsbeans.datacube;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.PluginActivator;

public class DataCubePluginActivator implements PluginActivator {
    public void init() {
        String folder = ConfigHelper.getConfigString("datacube.folder");
        if (folder == null) {
            folder = "web";
        }
        String ff = ConfigHelper.getPluginHomeFolder(this) + "/" + folder;

        ConfigHelper.addJssFolder(ff);
        ConfigHelper.addWebFolder(ff);

        try {
            Class.forName("org.postgresql.Driver");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
