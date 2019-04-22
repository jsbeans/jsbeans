package org.jsbeans.datacube;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.DependsOn;
import org.jsbeans.plugin.KernelPluginActivator;
import org.jsbeans.plugin.PluginActivator;

@DependsOn({KernelPluginActivator.class, DataCubePluginActivator.class})
public class DataCubeHttpServicesPluginActivator implements PluginActivator {
    public void init() {
        String folder = ConfigHelper.getConfigString("datacube.folder");
        if (folder == null) {
            folder = "web";
        }
        String ff = ConfigHelper.getPluginHomeFolder(this) + "/" + folder;

        ConfigHelper.addJssFolder(ff);
        ConfigHelper.addWebFolder(ff);
    }

    @Override
    public String getName() {
        return "datacube-httpservices";
    }
}
