package org.jsbeans.tests;

import org.jsbeans.jshub.JsHubService;
import org.jsbeans.servicemanager.ServiceManager;
import org.jsbeans.utils.ExceptionUtils;
import org.junit.After;
import org.junit.Before;

import java.lang.reflect.InvocationTargetException;

public abstract class BaseServiceTest extends BaseTest {

    protected Class<JsHubService> service;

    @Before
    public void startJsHub() {
        serviceManager.startAndWait(service, man -> {
            try {
                return service.cast(service.getConstructor(ServiceManager.class).newInstance(serviceManager));
            } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
                throw ExceptionUtils.runtime("Service instance creation error " + service.getClass().getName(), e);
            }
        });
    }

    @After
    public void stopJsHub() {
        serviceManager.stopAndWait(service);
    }
}
