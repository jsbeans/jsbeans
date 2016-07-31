/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

/**
 *
 */
package org.jsbeans.helpers;

import akka.util.Timeout;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigObject;
import com.typesafe.config.ConfigValue;
import org.jsbeans.Core;
import org.jsbeans.PlatformException;
import org.jsbeans.Starter;
import scala.concurrent.duration.Duration;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ConfigHelper {

    private static Set<String> webFolders = new HashSet<>();
    private static List<String> jssFolders;
    private static ConfigHelper instance = new ConfigHelper();

    public static ConfigHelper getInstance() {
        return instance;
    }


    public static String getRootFolder() {
//		String path = Starter.class.getProtectionDomain().getCodeSource().getLocation().getPath();
//		return path.substring(0, path.lastIndexOf("/")) + "/";

        String path;
        File f = new File(Starter.class.getProtectionDomain().getCodeSource().getLocation().getPath());
        path = f.toString();
        if (f.isFile()) {
            path = path.substring(0, path.lastIndexOf(File.separatorChar));
        }
        return path + File.separatorChar;//path.substring(0, path.lastIndexOf(File.separatorChar)) + File.separatorChar;
    }

    public static boolean isConfigExist(String path) {
        return getConfig().hasPath(path);
    }

    public static ConfigValue getConfigValue(String path) {
        if (!getConfig().hasPath(path)) {
            throw new PlatformException("Configuration path is not exist (" + path + ")");
        }

        return getConfig().getValue(path);
    }

    public static Config getConfig() {
        //return Core.getActorSystem().settings().config();
        return Core.getConfig();
    }

    public static Config getConfigConfig(String path) {
        return Core.getConfig().getConfig(path);
    }

    public static ConfigObject getConfigObject(String path) {
        return getConfig().getObject(path);
    }

    public static String getConfigString(String path) {
        String sVal = System.getenv(path);
        if (sVal != null) {
            return sVal;
        }
        ConfigValue val = getConfigValue(path);
        if (val == null) {
            return null;
        }

        return val.unwrapped().toString();
    }

    public static Integer getConfigInt(String path) {
        String sVal = System.getenv(path);
        if (sVal != null) {
            return Integer.parseInt(sVal);
        }
        ConfigValue val = getConfigValue(path);
        if (val == null) {
            return null;
        }
        return (Integer) val.unwrapped();
    }

    public static Long getConfigLong(String path) {
        String sVal = System.getenv(path);
        if (sVal != null) {
            return Long.parseLong(sVal);
        }
        ConfigValue val = getConfigValue(path);
        if (val == null) {
            return null;
        }
        return (Long) val.unwrapped();
    }

    public static Timeout getConfigTimeout(String path) {
        ConfigValue val = getConfigValue(path);
        if (val == null) {
            return null;
        }
        Duration d = Duration.create((String) val.unwrapped());
        return new Timeout(d.length(), d.unit());
    }

    public static Boolean getConfigBoolean(String path) {
        String sVal = System.getenv(path);
        if (sVal != null) {
            return Boolean.parseBoolean(sVal);
        }
        ConfigValue val = getConfigValue(path);
        if (val == null) {
            return null;
        }
        Object vo = val.unwrapped();
        if (vo instanceof String) {
            vo = Boolean.parseBoolean(vo.toString());
        }
        return (Boolean) vo;
    }

    public static void addWebFolder(String str) {
        try {
            File f = new File(str);
            webFolders.add(f.getCanonicalPath());
        } catch (IOException e) {
            ExceptionHelper.throwRuntime(e);
        }
    }

    public static Set<String> getWebFolders() {
        return webFolders;
    }

    public static void addJssFolder(String path) {
        initJssFolders();
        try {
            String canonicalPath = new File(path).getCanonicalPath();
            if (!jssFolders.contains(canonicalPath)) {
                jssFolders.add(canonicalPath);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    private static void initJssFolders() {
        if (jssFolders == null) {
            jssFolders = new ArrayList<>();
//			String[] list = ConfigHelper.getConfigString("kernel.jsb.lookupFolders").split(";");
//			for (String f : list) {
//				f = f.trim();
//				if (f.length() != 0) {
//					jssFolders.add(getPluginHomeFolder(KernelPluginActivator.getInstance()) + f);
//				}
//			}
        }
    }

    public static List<String> getJssFolders() {
        initJssFolders();
        return jssFolders;
    }


    public static String getPluginHomeFolder(Object obj) {
        if (obj.getClass().getProtectionDomain() == null) {
            return null;
        } else {
            try {
                File file = new File(obj.getClass().getProtectionDomain().getCodeSource().getLocation().toURI());
                String path = file.getCanonicalPath();
                if (file.isFile()) {
                    return getRootFolder();
                }
                return path;
            } catch (URISyntaxException | IOException e) {
                throw ExceptionHelper.runtime(e);
            }
        }
    }


    public static boolean has(String path) {
        return getConfig().hasPath(path);
    }

    public static Timeout parseTimeout(String timeout) {
        Duration d = Duration.create(timeout);
        return new Timeout(d.length(), d.unit());
    }
}
