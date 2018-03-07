package org.jsbeans.datacube;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.DependsOn;
import org.jsbeans.plugin.KernelPluginActivator;
import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.web.WebPluginActivator;
import org.jsbeans.workspace.WorkspacePluginActivator;
import org.jsbeans.unimap.UnimapPluginActivator;

@DependsOn({KernelPluginActivator.class, WebPluginActivator.class, WorkspacePluginActivator.class, UnimapPluginActivator.class})
public class DataCubePluginActivator implements PluginActivator {
    public void init() {
        String folder = ConfigHelper.getConfigString("datacube.folder");
        if (folder == null) {
            folder = "web";
        }
        String ff = ConfigHelper.getPluginHomeFolder(this) + "/" + folder;

        ConfigHelper.addJssFolder(ff);
        ConfigHelper.addWebFolder(ff);
    }
}
