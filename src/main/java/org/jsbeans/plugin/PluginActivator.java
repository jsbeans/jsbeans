/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.plugin;


import org.jsbeans.helpers.ConfigHelper;

public interface PluginActivator {
    default void init() {
        String folder = ConfigHelper.getConfigString("web.folder");
        if (folder == null) {
            folder = "web";
        }
        String ff = ConfigHelper.getPluginHomeFolder(this) + "/" + folder;

        ConfigHelper.addJssFolder(ff);
        ConfigHelper.addWebFolder(ff);
    }

    default String getName() {
        String name = this.getClass().getSimpleName();
        if (!name.endsWith(PluginActivator.class.getSimpleName())) {
            throw new IllegalArgumentException("Default plugin name is not extracted: override getName");
        }
        return name.substring(0, name.length() - PluginActivator.class.getSimpleName().length());
    }

    default String getConfigurationName() {
        return getName().toLowerCase();
    }
}
