package org.jsbeans;

import akka.actor.ActorRef;
import akka.actor.ActorSystem;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.net.SocketException;
import java.net.URL;
import java.util.*;

public class Core {
    public static final String PLATFORM_PACKAGE = "org.jsbeans";
    public static final String defaultConfigPath = "jsb-application/config/";
    public static final Optional<String> confDir = Optional.empty();

    public static final boolean DEBUG = !"false".equalsIgnoreCase(System.getProperty("jsbeans.debug", "false"));

    private static final Logger log = LoggerFactory.getLogger(Core.class);
    private static final Collection<Class<? extends PluginActivator>> pluginTypes =
            ReflectionHelper.scanSubclasses(PluginActivator.class);

    private static final List<PluginActivator> plugins = new ArrayList<>(pluginTypes.size());

    private static ActorSystem actorSystem;
    private static Config config;

    public static synchronized void start() {
        log.info("System core started at " + new Date());

        Core.loadBaseConfiguration();
        Core.collectAndConfigurePlugins();
        Core.startActorSystem();
        Core.initPlugins();
        Core.startServiceManager();
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
        if (confDir.isPresent()) {
            File file = new File(confDir.get() + "application.conf");
            config = ConfigFactory.load(ConfigFactory.parseFile(file));
            log.info("Configuration loaded from file '{}'", file);
        } else {
            config = ConfigFactory.load(defaultConfigPath + "application.conf");
            log.info("Configuration loaded from default resource (application.[conf,json,properties])");
        }
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
        Config config = null;
        if (confDir.isPresent()) {
            File file = new File(confDir.get() + name + ".conf");
            if (file.exists()) {
                config = ConfigFactory.parseFile(file);
            }
            log.debug("Configuration merged with file '{}'", file);
        } else {
            String res = "/" + defaultConfigPath + name + ".conf";
            URL is = Core.class.getResource(res);
            if (is != null) {
                config = ConfigFactory.parseResources(Core.class, res);
//						config = ConfigFactory.load(Core.class.getClassLoader(), res);
                log.debug("Configuration merged with resource '{}'", res);
            }
        }
        return config;
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
