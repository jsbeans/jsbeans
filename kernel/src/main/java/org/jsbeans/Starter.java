package org.jsbeans;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.core.util.StatusPrinter;
import org.slf4j.ILoggerFactory;
import org.slf4j.LoggerFactory;

public class Starter {
    public static void main(String[] args) {
//		// set platform log level to debug
//		if (startConfiguration.debug) {
//			Logger logger = LoggerFactory.getLogger(Core.PLATFORM_PACKAGE);
//			if (logger instanceof ch.qos.logback.classic.Logger) {
//				((ch.qos.logback.classic.Logger) logger).setLevel(Level.DEBUG);
//			}
//		}

        // print Logback internal state
        ILoggerFactory iLoggerFactory = LoggerFactory.getILoggerFactory();
        if (iLoggerFactory instanceof LoggerContext) {
            LoggerContext lc = (LoggerContext) iLoggerFactory;
            StatusPrinter.printIfErrorsOccured(lc);
        }

        // start core module
        Core.start();
    }
}
