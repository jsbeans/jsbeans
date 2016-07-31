package org.jsbeans.web;


import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.PluginActivator;

public class WebPluginActivator implements PluginActivator {

    @Override
    public void init() {
        String folder = ConfigHelper.getConfigString("web.folder");
        if (folder == null) {
            folder = "web";
        }
        String ff = ConfigHelper.getPluginHomeFolder(this) + "/" + folder;

        ConfigHelper.addJssFolder(ff);
        ConfigHelper.addWebFolder(ff);
    }

}
