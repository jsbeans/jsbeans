/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.scheduler;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.plugin.DependsOn;
import org.jsbeans.plugin.KernelPluginActivator;
import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.web.WebPluginActivator;

@DependsOn({KernelPluginActivator.class, WebPluginActivator.class})
public class SchedulerPluginActivator implements PluginActivator {

    @Override
    public void init() {
        String path = ConfigHelper.getPluginHomeFolder(this) + "/" + ConfigHelper.getConfigString("scheduler.folder");
        ConfigHelper.addWebFolder(path);
        ConfigHelper.addJssFolder(path);
    }

}