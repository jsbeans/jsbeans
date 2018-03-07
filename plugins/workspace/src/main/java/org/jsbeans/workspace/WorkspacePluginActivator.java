package org.jsbeans.workspace;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.plugin.DependsOn;
import org.jsbeans.plugin.KernelPluginActivator;
import org.jsbeans.web.WebPluginActivator;

@DependsOn({KernelPluginActivator.class, WebPluginActivator.class})
public class WorkspacePluginActivator implements PluginActivator {
    public void init() {
        String folder = ConfigHelper.getConfigString("workspace.folder");
        if (folder == null) {
            folder = "web";
        }
        String ff = ConfigHelper.getPluginHomeFolder(this) + "/" + folder;

        ConfigHelper.addJssFolder(ff);
        ConfigHelper.addWebFolder(ff);

    }
}
