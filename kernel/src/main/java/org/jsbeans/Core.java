/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import com.typesafe.config.ConfigValueFactory;
import org.apache.log4j.xml.DOMConfigurator;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.NetworkHelper;
import org.jsbeans.helpers.ReflectionHelper;
import org.jsbeans.messages.Message;
import org.jsbeans.plugin.PluginActivationException;
import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.services.ServiceManagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.SocketException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

//import ch.qos.logback.classic.Level;
//import ch.qos.logback.classic.LoggerContext;
//import ch.qos.logback.core.util.StatusPrinter;
//import org.slf4j.ILoggerFactory;

public class Core {

    public static final String PLATFORM_PACKAGE = "org.jsbeans";
    public static final String debugConfigPath = "jsb-application/config";
    public static final String defaultConfigPath = "";
    public static final boolean DEBUG = !"false".equalsIgnoreCase(System.getProperty("jsbeans.debug", "false"));

    public static final String configPath = System.getProperty("jsbeans.configPath", DEBUG ? debugConfigPath : defaultConfigPath);

    static {
        DOMConfigurator.configure(
                Core.class.getResource("/" + getConfigPath(configPath, "log4j.xml")));
    }

    private static final Logger log = LoggerFactory.getLogger(Core.class);
    private static final Collection<Class<? extends PluginActivator>> pluginTypes =
            ReflectionHelper.scanSubclasses(PluginActivator.class);

    private static final List<PluginActivator> plugins = new ArrayList<>(pluginTypes.size());

    private static ActorSystem actorSystem;
    private static Config config;

    public static synchronized void start() {
        log.info("System core started at " + new Date());

        Core.configureLogger();
        Core.loadBaseConfiguration();
        Core.collectAndConfigurePlugins();
        Core.startActorSystem();
        Core.initPlugins();
        Core.startServiceManager();
    }

    private static void configureLogger() {
        // set platform log level to debug
        if (DEBUG) {
//            Logger logger = LoggerFactory.getLogger(Core.PLATFORM_PACKAGE);
//            if (logger instanceof ch.qos.logback.classic.Logger) {
//                ch.qos.logback.classic.Logger logbackLogger = ((ch.qos.logback.classic.Logger) logger);
//                if (logbackLogger.getLevel() != null && logbackLogger.getLevel().toInt() > Level.DEBUG.toInt()) {
//                    logbackLogger.setLevel(Level.DEBUG);
//                }
//            }
        }

//        ILoggerFactory loggerFactory = LoggerFactory.getILoggerFactory();
//        if (loggerFactory instanceof LoggerContext) {
//            ch.qos.logback.classic.BasicConfigurator.configureDefaultContext();
//
//            // print Logback internal state
//            LoggerContext logbackLoggerContext = (LoggerContext) loggerFactory;
//            StatusPrinter.printIfErrorsOccured(logbackLoggerContext);
//        }
    }

    public static Config getConfig() {
        return config;
    }

    public static Config mergeConfigWith(Config conf, boolean skipDuplicates) {
        config = skipDuplicates ? config.withFallback(conf) : conf.withFallback(config);
        return config;
    }

    public static ActorSystem getActorSystem() {
        return actorSystem;
    }

    private static void loadBaseConfiguration() {
        String path = getConfigPath(configPath, "application.conf");
        config = ConfigFactory.load(path);
        log.info("Configuration loaded from '{}'", path);
    }

    private static String getConfigPath(String configPath, String name) {
        return configPath.endsWith("/") || configPath.length() == 0
                ? configPath + name
                : configPath + "/" + name;
    }

    private static void startActorSystem() {
        String clusterId = null;
        if (config.hasPath("kernel.cluster.id")) {
            clusterId = config.getString("kernel.cluster.id");
            if (clusterId.length() == 0) {
                clusterId = null;
            }
        }
        if (clusterId == null) {
            clusterId = "jsBeans";
        }

        String ipAddr = config.getString("akka.remote.netty.tcp.hostname");
        if (ipAddr == null || ipAddr.length() == 0) {
            try {
                ipAddr = NetworkHelper.detectSelfAddress();
            } catch (SocketException e) {
                log.error("Failed detect self ip address", e);
                System.exit(-1);
            }
        }

        try {
            config = config.withValue("akka.remote.netty.tcp.hostname", ConfigValueFactory.fromAnyRef(ipAddr));
            actorSystem = ActorSystem.create(clusterId, config);
            log.debug("ActorSystem '{}' started", actorSystem.name());
        } catch (Throwable th) {
            log.error("Actor system start error, system terminated", th);
            System.exit(-1);
        }
    }


    private static void collectAndConfigurePlugins() {
        for (Class<? extends PluginActivator> type : pluginTypes) {
            try {
                // create plugin instance
                PluginActivator plugin = type.newInstance();
                plugins.add(plugin);

                Config config = loadPluginConfig(plugin.getConfigurationName());
                // merge main and plugin config
                if (config != null) {
                    Core.mergeConfigWith(config, false);
                    log.debug("Plugin '{}' ({}) configured", plugin.getName(), type.getName());
                } else {
                    log.warn("Plugin configuration '{}' not found", plugin.getName());
                }

                if (DEBUG) {
                    Config debug = loadPluginConfig(plugin.getConfigurationName() + "-debug");
                    // merge main and plugin config
                    if (debug != null) {
                        Core.mergeConfigWith(debug, false);
                        log.debug("Plugin '{}' debug config loaded", plugin.getName());
                    }
                }
            } catch (InstantiationException | IllegalAccessException e) {
                throw new PluginActivationException(type.getName(), e);
            }
        }
    }

    private static Config loadPluginConfig(String name) {
        // load plugin config
        return ConfigFactory.parseResources(getConfigPath(configPath, name + ".conf"));
    }

    private static void initPlugins() {
        for (PluginActivator plugin : plugins) {
            plugin.init();
            log.info("Plugin '{}' ({}) initialized", plugin.getName(), plugin.getClass().getName());
        }
    }

    private static void startServiceManager() {
        ActorHelper.actorOf(ServiceManagerService.class, ActorHelper.generateName(ServiceManagerService.class))
                .tell(Message.SVC_INIT, ActorRef.noSender());
    }

    public static void exit() {
        Core.getActorSystem().shutdown();
        System.exit(0);
    }
}
