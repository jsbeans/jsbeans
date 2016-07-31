package org.jsbeans.cluster;

import akka.cluster.Cluster;
import akka.cluster.ClusterEvent.*;
import org.jsbeans.Core;
import org.jsbeans.PlatformException;
import org.jsbeans.services.Service;

public class ClusterCommunicationService extends Service {

    @Override
    protected void onInit() throws PlatformException {
        super.onInit();

        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), MemberEvent.class);
        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), MemberUp.class);
        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), MemberExited.class);
        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), MemberRemoved.class);
        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), UnreachableMember.class);
        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), ReachableMember.class);
        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), LeaderChanged.class);
    }

    @Override
    protected void onMessage(Object msg) throws PlatformException {
//		getLog().info(msg.toString());
    }

}
