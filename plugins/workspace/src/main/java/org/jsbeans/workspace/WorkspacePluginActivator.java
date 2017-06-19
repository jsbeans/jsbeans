package org.jsbeans.workspace;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.PluginActivator;

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
