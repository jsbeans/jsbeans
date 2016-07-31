/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package org.jsbeans;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.core.util.StatusPrinter;
import org.slf4j.ILoggerFactory;
import org.slf4j.LoggerFactory;

import java.util.HashMap;

public final class Starter {

    public static void main(String[] args) {

        // print Logback internal state
        ILoggerFactory iLoggerFactory = LoggerFactory.getILoggerFactory();
        if (iLoggerFactory instanceof LoggerContext) {
            LoggerContext lc = (LoggerContext) iLoggerFactory;
            StatusPrinter.printIfErrorsOccured(lc);
        }

        JsBeans jsBeans = new JsBeans(Config.load(new HashMap<String, Object>() {{
            put("org.jsbeans.JsBeans.name", "new node name");
        }}));

        jsBeans.start();

        // hook shutdown from OS and try complete stopping node
        Runtime.getRuntime().addShutdownHook(new Thread(() -> jsBeans.stopAndWait()));

        for (; ; ) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
            }
        }
    }
}
