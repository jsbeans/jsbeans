package org.jsbeans.tests;

import org.apache.log4j.helpers.Loader;
import org.apache.log4j.xml.DOMConfigurator;
import org.jsbeans.Config;
import org.jsbeans.servicemanager.ServiceManager;
import org.jsbeans.servicemanager.defaultmanager.DefaultServiceManagerFactory;
import org.junit.Before;
import org.junit.BeforeClass;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BaseTest {

    protected static final Logger L = LoggerFactory.getLogger(DefaultServiceManagerTest.class);

    protected ServiceManager serviceManager;
    protected Config config;

    @BeforeClass
    public static void initLog() {
        // configure Log4j
        DOMConfigurator.configure(Loader.getResource("config/log4j.xml"));
    }

    @Before
    public void startTest() {
        this.config = Config.load();
        this.serviceManager = DefaultServiceManagerFactory.create(config);
        assert (serviceManager != null);
    }
}
