/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

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
        try {
	        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), MemberEvent.class);
	        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), MemberUp.class);
	        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), MemberExited.class);
	        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), MemberRemoved.class);
	        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), UnreachableMember.class);
	        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), ReachableMember.class);
	        Cluster.get(Core.getActorSystem()).subscribe(getSelf(), LeaderChanged.class);
        } catch(Exception ex){
        	getLog().info("Cluster mode disabled");
        }
    }

    @Override
    protected void onMessage(Object msg) throws PlatformException {
//		getLog().info(msg.toString());
    }

}
