/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

package org.jsbeans.modules.module-template;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.DependsOn;
import org.jsbeans.plugin.KernelPluginActivator;
import org.jsbeans.web.WebPluginActivator;
import org.jsbeans.plugin.PluginActivator;

@DependsOn({KernelPluginActivator.class, WebPluginActivator.class})
public class ModuleTemplateActivator implements PluginActivator {
    public String getName() {
        return "module-template";
    }
}
