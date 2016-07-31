package org.jsbeans.servicemanager.defaultmanager;

import org.jsbeans.Config;
import org.jsbeans.servicemanager.ServiceManager;

public class DefaultServiceManagerFactory {
    public static ServiceManager create(Config config) {
        return new DefaultServiceManager(config);
    }
}
