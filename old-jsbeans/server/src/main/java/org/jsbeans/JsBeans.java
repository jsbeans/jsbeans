package org.jsbeans;

import org.jsbeans.servicemanager.Initialize;
import org.jsbeans.servicemanager.Service;
import org.jsbeans.servicemanager.ServiceManager;
import org.jsbeans.servicemanager.defaultmanager.DefaultServiceManagerFactory;
import org.jsbeans.utils.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.InvocationTargetException;
import java.util.Collection;
import java.util.concurrent.CompletableFuture;


@SuppressWarnings("unused")
public class JsBeans {

    public static final ThreadLocal<ServiceManager> local = new ThreadLocal<>();

    private static final Logger L = LoggerFactory.getLogger(JsBeans.class);
    private final Config config;
    private ServiceManager serviceManager;

    public JsBeans(Config config) {
        this.config = config;
    }

    public Config getConfig() {
        return config;
    }

    public CompletableFuture<Void> start() {
        L.info("Starting node - {}", config.nodeName());

        serviceManager = DefaultServiceManagerFactory.create(config);
        serviceManager.subscribeOnce(StartedMessage.class, started -> {
            L.info("Node started - {}", config.nodeName());
        });

        @SuppressWarnings("unchecked")
        Collection<String> services = config.get(JsBeans.class, "services", Collection.class).get();
        // starting services
        return CompletableFuture.allOf(services.stream()
                        // find all services
                        .map(name -> {
                            try {
                                Class<? extends Service> service = Class.forName(name).asSubclass(Service.class);
                                return service;
                            } catch (ClassNotFoundException e) {
                                throw ExceptionUtils.runtime("Service class not found " + name, e);
                            }
                        })
                        // start all services one by one
                        .map(service -> {
                            serviceStartAndWait(service);
                            return service;
                        })
                        // fork init all services
                        .map(service -> serviceManager.ask(service, new Initialize() {
                        }))
                        .toArray(CompletableFuture[]::new)
                // join all initialized
        ).thenApply(ok -> {
            serviceManager.fire(new StartedMessage() {
            });
            return ok;
        });
    }

    private <T extends Service> void serviceStartAndWait(Class<T> service) {
        serviceManager.startAndWait(service, serviceManager -> {
            try {
                return service.cast(service.getConstructor(ServiceManager.class).newInstance(serviceManager));
            } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
                throw ExceptionUtils.runtime("Service instance creation error " + service.getClass().getName(), e);
            }
        });
    }

    public void stopAndWait() {
        serviceManager.stopAndWait();
        L.info("Node stopped - " + config.nodeName());
    }

}
