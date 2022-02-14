/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.System.Cluster',
	$server: {
		$singleton: true,
		$globalize: 'Cluster',
		$require: ['JSB.System.Kernel', 
		           'JSB.System.Config', 
		           'java:akka.cluster.Cluster',
		           'java:org.jsbeans.Core'],
		
		active: false,
		cluster: null,
		selfAddr: null,
		rpcMap: {},
		
		$constructor: function(){
			var actorProvider = Config.get('akka.actor.provider');
			if(actorProvider == 'akka.cluster.ClusterActorRefProvider'){
				this.active = true;
				this.cluster = Cluster.get(Core.getActorSystem());
				this.selfAddr = '' + this.cluster.selfAddress().toString();
				
				// rpcMap garbage collector
				var garbageCollectionInterval = Config.has('kernel.cluster.rpcGarbageCollectionInterval') ? Config.get('kernel.cluster.rpcGarbageCollectionInterval'): 300000;
				var rpcTimeout = Config.has('kernel.cluster.rpcTimeout') ? Config.get('kernel.cluster.rpcTimeout'): 3600000;
				function clearRpcMap(){
					var idsToRemove = [];
					// collect garbage
					var now = Date.now();
					for(var rpcId in $this.rpcMap){
						if(now - $this.rpcMap[rpcId].timestamp > rpcTimeout){
							idsToRemove.push(rpcId);
						}
					}
					JSB.getLocker().lock('Cluster.rpcMap');
					for(var i = 0; i < idsToRemove.length; i++){
						delete $this.rpcMap[idsToRemove[i]];
					}
					JSB.getLocker().unlock('Cluster.rpcMap');
					JSB.defer(clearRpcMap, garbageCollectionInterval);
				}
				clearRpcMap();
			}
			JSB.setClusterProvider(this);
		},
		
		isActive: function(){
			return this.active;
		},
		
		ensureActive: function(){
			if(!this.active){
				throw new Error('Cluster mode is not active');
			}
		},
		
		getNodeAddress: function(){
			return this.selfAddr;
		},
		
		getState: function(){
			this.ensureActive();
			return this.cluster.state();
		},
		
		getLeader: function(){
			this.ensureActive();
			return '' + this.cluster.state().getLeader().toString();
		},

		isLeader: function(){
			return $this.getLeader() == $this.getNodeAddress();
		},
		
		getMembers: function(selfExclude){
			this.ensureActive();
			var members = this.cluster.state().getMembers();
			var it = members.iterator();
			var mMap = {};
			while(it.hasNext()){
				var m = it.next();
				var mAddr = '' + m.address().toString();
				var mStatus = '' + m.status().toString();
				if(selfExclude && mAddr == this.getNodeAddress()){
					continue;
				}
				mMap[mAddr] = mStatus;
			}
			return mMap;
		},
		
		sendRpc: function(node, execCmd){
			this.ensureActive();
			var rpcId = JSB.generateUid();
			var session = execCmd.session || JSB.getCurrentSession();
			var packet = {
				rpcId: rpcId,
				session: session,
				sender: this.getNodeAddress(),
				instanceId: execCmd.instance.getId(),
				instanceJsb: execCmd.instance.getJsb().$name,
				proc: execCmd.proc,
				params: execCmd.params,
			};
			var encodedPacket = encodeURIComponent(JSON.stringify(packet));
			
			var msgBody = {
				scriptBody: 'Cluster._receiveRpc("' + encodedPacket + '")',
				clientAddr: Kernel.clientAddr(),
				scopePath: session,
				preserveScope: true,
				userToken: Kernel.userToken(),
				user: Kernel.user(),
				clientRequestId: Kernel.clientRequestId()
			};
/*			
			function unwrapCallback(askResult){
				if(!execCmd.callback){
					return;
				}
				var res = null;
				var fail = null;
				if(askResult.success){
					if(askResult.result.status == 'SUCCESS'){
						res = askResult.result.result;
					} else {
						fail = new Error(askResult.result.error);
					}
				} else {
					fail = new Error(askResult.errorMsg);
				}
				execCmd.callback.call(execCmd.instance, res, fail);
			}
*/			
/*			
			var askDesc = {
				service: 'JsHub',
				messageType: 'ExecuteScriptMessage',
				callback: unwrapCallback,
				node: node,
				async: true,
				messageBody: msgBody
			};
*/			
			JSB.getLocker().lock('Cluster.rpcMap');
			this.rpcMap[rpcId] = {
				instance: execCmd.instance,
				timestamp: Date.now(),
				callback: execCmd.callback
			}
			JSB.getLocker().unlock('Cluster.rpcMap');
			Kernel.tell('JsHub', 'ExecuteScriptMessage', msgBody, node);
			
			//Kernel.ask(askDesc);
		},
		
		_receiveRpc: function(encodedPacket){
			this.ensureActive();
			var packet = JSON.parse(decodeURIComponent(encodedPacket));
			var res = null, fail = null;
			try {
				res = JSB.getProvider().executeServerRpc(packet.instanceJsb, packet.instanceId, packet.proc, packet.params);
				if(JSB.isFuture(res)){
					res.wait(function(res, fail){
						if(fail){
							$this.respondRpc(packet, undefined, JSB().unwindComplexObjects(fail));	
						} else {
							$this.respondRpc(packet, JSB().unwindComplexObjects(res));
						}
					});
					return;
				}
				$this.respondRpc(packet, JSB().unwindComplexObjects(res));

			} catch(e){
				fail = e;
				$this.respondRpc(packet, undefined, JSB().unwindComplexObjects(fail));
			}
		},
		
		respondRpc: function(packet, res, fail){
			this.ensureActive();
			var respPacket = {
				rpcId: packet.rpcId,
				result: res,
				error: fail
			};
			var encodedPacket = encodeURIComponent(JSON.stringify(respPacket));
			var session = packet.session || JSB.getCurrentSession();
			
			var msgBody = {
				scriptBody: 'Cluster._receiveResponse("' + encodedPacket + '")',
				clientAddr: Kernel.clientAddr(),
				scopePath: session,
				preserveScope: true,
				userToken: Kernel.userToken(),
				user: Kernel.user(),
				clientRequestId: Kernel.clientRequestId()
			};
			
			Kernel.tell('JsHub', 'ExecuteScriptMessage', msgBody, packet.sender);
		},
		
		_receiveResponse: function(encodedPacket){
			this.ensureActive();
			var packet = JSON.parse(decodeURIComponent(encodedPacket));
			var rpcDesc = this.rpcMap[packet.rpcId];
			if(!rpcDesc){
				JSB.getLogger().warn('Rpc response is too late. Increase "kernel.cluster.rpcTimeout" config option value');
				return;
			}
			var callback = rpcDesc.callback;
			var instance = rpcDesc.instance;
			
			JSB.getLocker().lock('Cluster.rpcMap');
			delete this.rpcMap[packet.rpcId];
			JSB.getLocker().unlock('Cluster.rpcMap');
			
			if(callback){
				callback.call(instance, packet.result, packet.error);
			}
			
		}
	}
}