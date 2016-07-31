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
