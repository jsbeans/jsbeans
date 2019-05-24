/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

package org.jsbeans.datacube;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.DependsOn;
import org.jsbeans.plugin.KernelPluginActivator;
import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.store.jdbc.JdbcStorePluginActivator;
import org.jsbeans.web.WebPluginActivator;
import org.jsbeans.workspace.WorkspacePluginActivator;
import org.jsbeans.unimap.UnimapPluginActivator;

@DependsOn({KernelPluginActivator.class, DataCubePluginActivator.class, JdbcStorePluginActivator.class})
public class DataCubeJdbcPluginActivator implements PluginActivator {
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
        return "datacube-jdbc";
    }
}
