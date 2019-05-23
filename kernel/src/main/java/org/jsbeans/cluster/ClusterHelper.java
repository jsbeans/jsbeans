/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.cluster;

import akka.actor.Address;
import akka.cluster.Cluster;
import akka.cluster.ClusterEvent.CurrentClusterState;
import akka.cluster.Member;

import org.jsbeans.Core;

public class ClusterHelper {
    public static String getNodeAddress() {
        return Cluster.get(Core.getActorSystem()).selfAddress().toString();
    }

    public static void exit() {
        Cluster.get(Core.getActorSystem()).down(Cluster.get(Core.getActorSystem()).selfAddress());
    }

    public static void join(String addr) {
        Cluster.get(Core.getActorSystem()).join(new Address("akka.tcp", addr));
    }

    public static CurrentClusterState state() {
        CurrentClusterState st = Cluster.get(Core.getActorSystem()).state();
    	
        return st;
        
        
    }
    
    
}
