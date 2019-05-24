/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

package org.jsbeans.datacube;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.DependsOn;
import org.jsbeans.plugin.KernelPluginActivator;
import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.store.mongodb.MongodbStorePluginActivator;

@DependsOn({KernelPluginActivator.class, DataCubePluginActivator.class, MongodbStorePluginActivator.class})
public class DataCubeMongodbPluginActivator implements PluginActivator {
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
        return "datacube-mongodb";
    }
}
