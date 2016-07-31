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
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.core.util.StatusPrinter;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import com.typesafe.config.ConfigValueFactory;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.NetworkHelper;
import org.jsbeans.helpers.ReflectionHelper;
import org.jsbeans.messages.Message;
import org.jsbeans.plugin.PluginActivationException;
import org.jsbeans.plugin.PluginActivator;
import org.jsbeans.services.ServiceManagerService;
import org.slf4j.ILoggerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.net.SocketException;
import java.net.URL;
import java.util.*;

public class Core {
    public static final String PLATFORM_PACKAGE = "org.jsbeans";
    public static final String defaultConfigPath = "jsb-application/config";
    public static final String configPath = System.getProperty("jsbeans.configPath", defaultConfigPath);

    public static final boolean DEBUG = !"false".equalsIgnoreCase(System.getProperty("jsbeans.debug", "false"));

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
        System.setProperty("logback.configurationFile", configPath + "/logback.xml");
		// set platform log level to debug
		if (DEBUG) {
			Logger logger = LoggerFactory.getLogger(Core.PLATFORM_PACKAGE);
			if (logger instanceof ch.qos.logback.classic.Logger) {
                ch.qos.logback.classic.Logger l = ((ch.qos.logback.classic.Logger) logger);
                if (l.getLevel() != null && l.getLevel().toInt() > Level.DEBUG.toInt()) {
                    l.setLevel(Level.DEBUG);
                }
			}
		}

        // print Logback internal state
        ILoggerFactory iLoggerFactory = LoggerFactory.getILoggerFactory();
        if (iLoggerFactory instanceof LoggerContext) {
            LoggerContext lc = (LoggerContext) iLoggerFactory;
            StatusPrinter.printIfErrorsOccured(lc);
        }
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
        String path = configPath + "/application.conf";
        config = ConfigFactory.load(path);
        log.info("Configuration loaded from '{}'", path);
    }

    private static void startActorSystem() {
        String clusterId = null;
        if (config.hasPath("kernel.clusterId")) {
            clusterId = config.getString("kernel.clusterId");
            if (clusterId.length() == 0) {
                clusterId = null;
            }
        }
        if (clusterId == null) {
            clusterId = "default";
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
                    Core.mergeConfigWith(config, true);
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
        return ConfigFactory.parseResources(configPath + "/" + name + ".conf");
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
}
