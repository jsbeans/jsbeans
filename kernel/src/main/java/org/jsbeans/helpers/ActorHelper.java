/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.helpers;

import akka.actor.*;
import akka.pattern.AskableActorSelection;
import akka.util.Timeout;
import org.jsbeans.Core;
import org.jsbeans.messages.Message;
import org.jsbeans.messages.ReponseMessage;
import org.jsbeans.messages.ResponseError;
import org.jsbeans.services.Service;
import scala.concurrent.Await;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;

public class ActorHelper {
    private static Timeout serviceCommTimeout = null;
    private static Timeout nodeIntercommTimeout = null;

//	public static ActorRef getActorFor(Class<? extends UntypedActor> clazz){
//		//return Core.getActorSystem().actorSelection("/user/" + generateName(clazz));
//		return Core.getActorSystem().actorFor("/user/" + generateName(clazz));
//	}

    public static ActorSelection getActorSelection(String nodeId, Class<? extends UntypedActor> clazz) {
        if (nodeId.indexOf("://") != -1) {
            return Core.getActorSystem().actorSelection(nodeId + "/user/" + generateName(clazz));
        }
        return Core.getActorSystem().actorSelection("akka.tcp://" + nodeId + "/user/" + generateName(clazz));
    }

    public static ActorSelection getActorSelection(Class<? extends UntypedActor> clazz) {
        return Core.getActorSystem().actorSelection("/user/" + generateName(clazz));
    }

    public static ActorSelection getActorSelection(ActorPath path) {
        return Core.getActorSystem().actorSelection(path);
    }

    public static ActorSelection getActorSelection(String serviceName) {
        return Core.getActorSystem().actorSelection("/user/" + serviceName);
    }

    public static ActorSelection getActorSelection(UntypedActorContext context, String name) {
        return context.actorSelection(name);
    }

//	public static ActorRef getActorFor(String serviceName ){
//		return Core.getActorSystem().actorFor("/user/" + serviceName);
//	}

//	public static ActorRef getActorFor(UntypedActorContext ctx, Class<? extends UntypedActor> clazz){
//		return getActorFor(ctx, generateName(clazz));
//	}
//
//	public static ActorRef getActorFor(UntypedActorContext ctx, String name){
//		//return Core.getActorSystem().actorSelection("/user/" + generateName(clazz));
//		return ctx.actorFor(name);
//	}

    public static ActorRef actorOf(Class<? extends UntypedActor> cl, String name) {
        // start as actor
        return Core.getActorSystem().actorOf(Props.create(cl), name);
    }

    public static ActorRef actorOf(UntypedActorContext ctx, Class<? extends UntypedActor> cl, String name, Object... args) {
        // start as actor
        return ctx.actorOf(Props.create(cl, args), name);
    }

    public static ActorRef actorOfWithDispatcher(UntypedActorContext ctx, String dispatcher, Class<? extends UntypedActor> cl, String name, Object... args) {
        // start as actor
        return ctx.actorOf(Props.create(cl, args).withDispatcher(dispatcher), name);
    }

    public static Timeout getServiceCommTimeout() {
        if (serviceCommTimeout == null) {
//			serviceCommTimeout = new Timeout(Duration.create(300, TimeUnit.SECONDS));
            serviceCommTimeout = ConfigHelper.getConfigTimeout("kernel.serviceCommTimeout");
        }

        return serviceCommTimeout;
    }

    public static Timeout getNodeIntercommTimeout() {
        if (nodeIntercommTimeout == null) {
//			nodeIntercommTimeout = new Timeout(Duration.create(1000, TimeUnit.SECONDS));
            nodeIntercommTimeout = ConfigHelper.getConfigTimeout("kernel.nodeIntercommTimeout");
        }

        return nodeIntercommTimeout;
    }


    public static String generateName(Class<?> clazz) {
        return generateName(clazz.getName());
    }

    public static String generateName(String qualifiedName) {
        String[] names = qualifiedName.split("\\.");
        return names[names.length - 1];
    }

    public static String getServiceNameForActor(ActorRef a) {
        String[] names = a.path().name().split("\\/");
        return names[names.length - 1];
    }

    public static <T> ReponseMessage<T> synchAsk(Class<? extends Service> clazz, Message request, Timeout askTimeout, Duration awaitDuration) {
        return synchAsk(getActorSelection(clazz), request, askTimeout, awaitDuration);
    }

    @SuppressWarnings("unchecked")
    public static <T> ReponseMessage<T> synchAsk(ActorSelection sel, Message request, Timeout askTimeout, Duration awaitDuration) {
        Future<Object> future = new AskableActorSelection(sel).ask(request, askTimeout);
        Object result = null;
        try {
            result = Await.result(future, awaitDuration);
        } catch (Throwable e) {
            throw new RuntimeException("Ask error ", e);
        }

        if (result instanceof ReponseMessage) {
            return (ReponseMessage<T>) result;
        } else {
            ResponseError err = (ResponseError) result;
            throw ExceptionHelper.runtime(err.getCause());
        }
    }

    public static Future<Object> futureAsk(ActorSelection sel, Object request, Timeout askTimeout) {
        Future<Object> future = new AskableActorSelection(sel).ask(request, askTimeout);
        return future;
    }

    public static boolean isDeadLetters(ActorRef ar) {
        return ar.toString().indexOf("/deadLetters") != -1;
    }
}
