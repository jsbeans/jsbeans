JSO({
	name:'Cluster',
	server: {
		singleton: true,
		globalize: true,
		body: {
			
			getNodeAddress: function(short){
				var id = ''+Packages.org.jsbeans.cluster.ClusterHelper.getNodeAddress();
				if (short) {
					var id = Cluster.getNodeAddress()
                	id = id.substring(id.indexOf('//')+2);
				}
				return id;
			},
/* EXAMPLE:
Cluster.ask({
	service: 'SignalDispatcherService',
	messageType: 'StartedContextsMessage',
	nodeId: 'akka.tcp://dWires@127.0.0.1:2552',
	args: []
});


Cluster.ask({
	service: 'MongoDbService',
	messageType: 'MongoFindMessage',
	resourceType: 'server-crawling',
	args: []
});

Cluster.ask({
	service: 'JsHub',
	messageType: 'StartedContextsMessage',
	nodeId: 'akka.tcp://dWires@127.0.0.1:2552',
	args: []
});

Cluster.exec({
	resourceType: 'server-crawling',
	script: function () {
		var self = this;
		JSO().defer(function(){Log.debug('FREEEEEEEEEEEE'); self.free(); }, 15000)
		return 'OK';
	},
	dontFree: true
});

*/
			ask: function(info) {
				var result = Kernel.ask({
					service: 'ClusteredDispatcherService',
					messageType: 'DistributedMessage',
					messageBody: {
						nodeId: info.nodeId || null,
						resourceType: info.resourceType || null,
						resourceDontFree: info.resourceDontFree || false,
						user: Kernel.user(),

						serviceName: info.service,// || throw 'Service is undefined',
						messageType: info.messageType,// || throw 'Message type is undefined',
						messageJson: this.toJsonString(info.message) || "{}",
						message : null,
						timeout: info.timeout
					},
					callback: info.callback,
					timeout: info.timeout
				});
				return result;
			},

			toJsonString: function(js) {
				return Packages.org.jsbeans.serialization.JsObjectSerializerHelper.getInstance().serializeNative(js).toJS(false);
			},
			
			exec: function(desc){
				var id = JSO().generateUid();
				
				var func = desc.proc||desc.script;
				var args = desc.args||[];
				
				var argsStr = Packages.org.jsbeans.serialization.JsObjectSerializerHelper.getInstance().serializeNative(args).toJS(false);
				var funcStr = JSO().isString(func)
						? func
						: Packages.org.jsbeans.serialization.JsObjectSerializerHelper.getInstance().serializeNative(func).toJS(false);
			    var procStr = 'var _res; try { /*Cluster._startProc("'+id+'", '+funcStr+');*/ _res = (' + funcStr + ').apply({id:"'+id+'", free: function(){ Cluster.free(this.id); }}, '+argsStr+'); }';
			    if(!desc.dontFree){
			    	procStr += ' finally { Cluster.free("'+id+'"); }';
			    } else {
			    	procStr += ' catch(err) { Cluster.free("'+id+'"); throw err; }';
			    }
			    procStr += ' _res;';

				var resultCallback = ((desc.onComplete||desc.onSuccess) && function(res){
//			       Log.debug('Remote script result: ' + JSON.stringify(res, null, 2));
					var obj = {id:"'+id+'", free: function(){ Cluster.free(this.id); }};
					if(res.success && res.result.status == 'SUCCESS'){
						if(desc.onComplete){
							desc.onComplete.call(obj, res.result.result, null);
						} else if(desc.onSuccess){
							desc.onSuccess.call(obj, res.result.result);
						}
					} else {
						Cluster.free(id);
						var err = null;
						if(res.success){
							err = res.result.error;
						} else {
							err = res.errorMsg;
						}
						if(desc.onComplete){
							desc.onComplete.call(obj, null, err);
						}
						if(desc.onError){
							desc.onError.call(obj, err);
						}
					}
				}) || null;
//				Log.debug('desc.scriptTimeout: ' + desc.scriptTimeout);
			    var result = Kernel.ask('ClusteredDispatcherService', 'ExecuteRemoteScriptMessage', {
			    	resourceType: desc.resourceType,
			    	resourceCondition: desc.resourceCondition,
			    	selectedNodeId: desc.selectedNodeId,
			    	execId: id,
			    	dontFree: !!desc.dontFree,
			    	scriptBody: procStr,
			    	async: false,
			    	temporaryScope: false,
			    	scopePath: Kernel.session(),
			    	user: Kernel.user(),
			    	timeout: desc.scriptTimeout
			    }, resultCallback);

			    if (!resultCallback) {
			    	if (!desc.dontFree) Cluster.free(id);
			    	if (result.error) throw result.error;
			    	return result.result;
			    }

			    return result;
			},
			
			free: function(id){
				if (!id) {
					Log.error('Remote script execId is null');
				}
				Kernel.tell('ClusteredDispatcherService', 'ReleaseScriptResourceMessage', {execId: id});
//				this._endProc(id);
			},
			
			// remote proc tracking functions

			_procMap: {},

			_startProc: function(id, proc){
				var procStr = Packages.org.jsbeans.serialization.JsObjectSerializerHelper.getInstance().serializeNative(proc).toJS(false);
				Kernel.lock('_clusterProcs');
				this._procMap[id] = procStr;
				Kernel.unlock('_clusterProcs');
			},
			
			_endProc: function(id){
				Kernel.lock('_clusterProcs');
				if(this._procMap[id]){
					delete this._procMap[id];
				}
				Kernel.unlock('_clusterProcs');
			},
			
			_dumpProcs: function(){
				return this._procMap;
			},
			
			/////////////////////////////////

			
			exit: function(){
                var result = Kernel.ask('ClusteredDispatcherService', 'ClusteredDispatcherService$ChangeNodeStateMessage', {
                	nodeId: this.getNodeAddress(),
                	remove: true
				});
                if(result.errorMsg) {
                    throw 'Exit node error: release resources error: ' + result.errorMsg;
                }
				Packages.org.jsbeans.cluster.ClusterHelper.exit();
			},
			
			join: function(){
				Packages.org.jsbeans.cluster.ClusterHelper.join(this.getNodeAddress());
				var result = Kernel.ask('ClusteredDispatcherService', 'ClusteredDispatcherService$ChangeNodeStateMessage', {
					nodeId: this.getNodeAddress(),
					register: true
				});
				if(result.errorMsg) {
					throw 'Enter node error: register resources error: ' + result.errorMsg;
				}
			},
			
			state: function(){
				var state = Packages.org.jsbeans.cluster.ClusterHelper.state();
				return {
					leader: state.leader(),
					members: state.members()
				};
			},

			registerLocalResource: function(json, update){
				if (!json.type) throw new Exception('SharedResource type is not specified');
				json._id = json._id || (this.getNodeAddress(true) + '/' + json.type);
				json.attrs.nodeId = this.getNodeAddress(true);
				return SharedResources.register(json, update);
			},

			removeLocalResources: function(query, update) {
				var nodeQuery = {_id:{$regex:this.getNodeAddress(true)}};
				var fullQuery = query ? {$and:[nodeQuery, query]} : nodeQuery;
				return SharedResources.remove(fullQuery, update);
			}
		}
	}
});
