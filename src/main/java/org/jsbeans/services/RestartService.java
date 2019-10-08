/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.services;

import org.jsbeans.PlatformException;

import java.io.File;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.util.ArrayList;
import java.util.List;

public class RestartService extends Service {
    public static void restartApplication(Runnable runBeforeRestart) throws IOException {
        try {
            final List<String> cmd = new ArrayList<>();
            // java binary
            String java = System.getProperty("java.home") + "/bin/java";

            // init the command to execute
            cmd.add(java);

            // vm arguments
            List<String> vmArguments = ManagementFactory.getRuntimeMXBean().getInputArguments();
            StringBuffer vmArgsOneLine = new StringBuffer();
            for (String arg : vmArguments) {
                // if it's the agent argument : we ignore it otherwise the
                // address of the old application and the new one will be in conflict
                if (!arg.contains("-agentlib")) {
                    cmd.add(arg);
                }
            }

            // program main and program arguments
            String[] mainCommand = System.getProperty("sun.java.command").split(" ");
            // program main is a jar
            if (mainCommand[0].endsWith(".jar")) {
                // if it's a jar, add -jar mainJar
                cmd.add("-jar");
                cmd.add(new File(mainCommand[0]).getPath());
            } else {
                // else it's a .class, add the classpath and mainClass
                cmd.add("-cp");
                cmd.add(System.getProperty("java.class.path"));
                cmd.add(mainCommand[0]);
            }
            // finally add program arguments
            for (int i = 1; i < mainCommand.length; i++) {
                cmd.add(mainCommand[i]);
            }
            // execute the command in a shutdown hook, to be sure that all the
            // resources have been disposed before restarting the application
            Runtime.getRuntime().addShutdownHook(new Thread() {
                @Override
                public void run() {
                    try {
                        ProcessBuilder builder = new ProcessBuilder(cmd);
                        builder.start();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            });
            // execute some custom code before restarting
            if (runBeforeRestart != null) {
                runBeforeRestart.run();
            }
            // exit
            System.exit(0);
        } catch (Exception e) {
            // something went wrong
            throw new IOException("Error while trying to restart the application", e);
        }
    }

    @Override
    protected void onMessage(Object msg) throws PlatformException {
        if (msg instanceof RestartMessage) {
            try {
                restartApplication(new Runnable() {
                    @Override
                    public void run() {
//                        Core.getActorSystem().shutdown();
//                        Core.getActorSystem().awaitTermination(ConfigHelper.getConfigTimeout("kernel.awaitTerminationTimeout").duration());
                    }
                });
            } catch (IOException e) {
                RestartMessage r = (RestartMessage) msg;
                getSender().tell(r.createError(e), getSelf());
            }
        } else {
            unhandled(msg);
        }
    }
}
