package org.jsbeans.cluster;

import akka.actor.Address;
import akka.cluster.Cluster;
import akka.cluster.ClusterEvent.CurrentClusterState;
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
        return Cluster.get(Core.getActorSystem()).state();
    }
}
