JSB({
	name:'Kernel',
	server: {
		singleton: true,
		
		constructor: function(){
			JSB().setLocker(this);
			JSB().setThreadLocal(this.tls);

			var Exception = JSB().getGlobe().Exception = function(message,data) {
            	this.message = message;
            	this.stack = JSB().stackTrace();
            	this.data = data;
            }

            Exception.prototype = Error.prototype;
            
            function _checkServerScripts(){
            	// check server-side required scripts are loaded before keep loading other JSO
            	if(!this.Template || !this.Template.doT){
            		return false;
            	}
            	
            	return true;
            }
            
            JSB().deferUntil(function(){
            	// proceed to load other objects
            	Kernel.tell('JsoRegistryService', 'LoadAdditionalObjectsMessage', {});
            }, function(){
            	return _checkServerScripts.call(null);
            });
		},

		tls: {
			get: function(key){
				return Bridge.getThreadLocal(key);
			},
			put: function(key, val){
				Bridge.putThreadLocal(key, val);
			},
			clear: function(key){
				Bridge.removeThreadLocal(key);
			}
		},
		scope: function(scope, callback){
			if(!scope){
				return [];
			}
			var names = [];
			for( var n in scope ) {
			    var name = n;
			    if (typeof scope[n] == 'function') name += ' : ' + scope[n].toString().match(/^[^\{]*\{/);
			    names[names.length] = name;
				if(callback){
					callback(n, scope[n])
				}
			}
			
			return names;
		},
		
		sleep: function(msec){
			Bridge.sleep(msec);
		},
		
		tell: function(svcName, msgType, msgBody){
			Bridge.tell({
				serviceName: svcName,
				messageType: msgType,
				messageBody: msgBody
			});
		},
		
		ask: function(svcName, msgType, arg1, arg2){
			var callback = null;
			var msgBody = null;
			var timeout = null;
			if(JSB().isPlainObject(svcName)){
				var aDesc = svcName;
				svcName = aDesc.service;
				msgType = aDesc.messageType;
				callback = aDesc.callback;
				msgBody = aDesc.messageBody || {};
				timeout = aDesc.timeout;
			} else {
				if(JSB().isFunction(arg1)){
					callback = arg1;
					msgBody = arg2;
				} else {
					msgBody = arg1;
					callback = arg2;
				}
				if(msgBody == undefined){
					msgBody = null;
				}
				if(callback == undefined){
					callback = null;
				}
				timeout = msgBody&&msgBody.timeout||null;
			}
			
			return Bridge.ask({
				serviceName: svcName,
				messageType: msgType,
				messageBody: msgBody,
				async: callback ? true: false,
				timeout: timeout,
				callback: callback
			});
		},
		
		rpc: function(widget, proc, params){
			if(Widgets[widget] == null || Widgets[widget] == undefined ){
				throw "RPC failed: Unable to locate widget: '" + widget + "'";
			}
			if(Widgets[widget][proc] == null || Widgets[widget][proc] == undefined){
				throw "RPC failed: Unable to locate function: '"+proc+"' in widget: '"+widget+"'";
			}
			if(Object.prototype.toString.call( params ) === '[object Array]') {
				return Widgets[widget][proc].apply(Widgets[widget], params);
			}
			return Widgets[widget][proc].call(Widgets[widget], params);
		},
		
		updateWidgetState: function(widgetPath, imgArr){
			scope(Widgets, function(name, s){ 
				if(s['basePath'] == undefined) {
					s['basePath'] = widgetPath;
					if(imgArr.length > 0){
						s['images'] = imgArr;
					}
				}
				if(s['serverBootstrap']) { 
					s['serverBootstrap'].call(s); 
					delete s['serverBootstrap']; 
				} 
			});
		},
		
		getJSO: function(name){
			var jso = JSB().get(name);
			if(JSB().isNull(jso)){
				Log.error('Unable to find JSB: ' + name);
				return null;
			}
			return jso;
//				return jso.group ? jso.getGroup() : jso; 
		},
		
		restart: function(){
			return this.ask('RestartService', 'RestartMessage', {});
		},
		
		session: function(){
			var session = '' + Bridge.getCurrentSession(); 
			if(!JSB().isNull(session) && session.length > 0){
				return session;
			}
			return "";
		},
		
		clientAddr: function(){
			var ip = '' + Bridge.getClientAddress(); 
			if(!JSB().isNull(ip) && ip.length > 0){
				return ip;
			}
			return "";
		},

		clientRequestId: function(){
			var rid = '' + Bridge.getClientRequestId(); 
			if(!JSB().isNull(rid) && rid.length > 0){
				return rid;
			}
			return "";
		},

		user: function(){
			var user = Bridge.getCurrentUser();
			if(!user){
				return null;
			}
			return '' + user;
		},

		userToken: function(){
			var userToken = Bridge.getUserToken();
			if(!userToken){
				return null;
			}
			return '' + userToken;
		},
		
		isAdmin: function(){
			return Kernel.user() === Config.get('kernel.security.admin.user');
		},

		checkAdminOnly: function(){
			if(!this.isAdmin()){
				throw 'Administrator privileges required';
			}
		},

		sessionScope: function(){
			var s = this.session();
			if(!s || s.length === 0){
				throw 'Unable to get session scope due to the current session identifier not specified';
			}
			var scopeName = '__sessionScope__' + s;
			if(JSB().isNull(JSB().getGlobe()[scopeName])){
				Kernel.lock('sessionScope');
				if(JSB().isNull(JSB().getGlobe()[scopeName])){
					JSB().getGlobe()[scopeName] = {};
				}
				Kernel.unlock('sessionScope');
			}
			
			return JSB().getGlobe()[scopeName];
		},
		
		lock: function(mtxName){
			if(JSB().isNull(mtxName)){
				throw 'ERROR: Kernel.lock should only be used with named mutex';
			}
			Bridge.lock(mtxName);
		},
		
		unlock: function(mtxName){
			if(JSB().isNull(mtxName)){
				throw 'ERROR: Kernel.unlock should only be used with named mutex';
			}
			Bridge.unlock(mtxName);
		},
		
		clearLock: function(mtxName){
			if(JSB().isNull(mtxName)){
				throw 'ERROR: Kernel.unlock should only be used with named mutex';
			}
			Bridge.clearLock(mtxName);
		},

		hostName: function() {
		    return ''+Packages.java.net.InetAddress.getLocalHost().getHostName();
		},
		
		fork: function(proc, param){
			var self = this;
			var count = 1;
			if(param){
				if(JSB().isArray(param)){
					count = param.length;
				} else if(JSB().isPlainObject(param)){
					param = [param];
				} else if(JSB().isNumber(param)){
					count = param;
					param = null;
				}
			}
			if(JSB().isNull(this.forkJoinHandles)){
				this.forkJoinHandles = {};
			}
			// create handle
			var h = JSB().generateUid();
			this.forkJoinHandles[h] = {
				count: count,
				ready: 0,
				items: [],
				callback: null
			};
			
			for(var i = 0; i < count; i++ ){
				(function(idx){
					JSB().defer(function(){
						var res = null;
						try {
							var p = null; 
							if(param){
								p = param[idx];
							}
							res = proc.call(self, p, function(res){
								self.lock('fork_' + h);
								self.forkJoinHandles[h].items[idx] = res;
								self.forkJoinHandles[h].ready++;
								self.unlock('fork_' + h);
								self.checkJoinCallback(h);
							});

						} catch(e){
							res = e;
						}
						if(res !== undefined){
							self.lock('fork_' + h);
							self.forkJoinHandles[h].items[idx] = res;
							self.forkJoinHandles[h].ready++;
							self.unlock('fork_' + h);
							self.checkJoinCallback(h);
						}
					}, 0);
				})(i);
			}
			
			return h;
		},
		
		join: function(forkHandle, callback){
			if(callback){
				this.forkJoinHandles[forkHandle].callback = callback;
				this.checkJoinCallback(forkHandle);
			} else {
				while(this.forkJoinHandles[forkHandle].ready < this.forkJoinHandles[forkHandle].count){
					Kernel.sleep(10);
				}
				var res = this.forkJoinHandles[forkHandle].items;
				delete this.forkJoinHandles[forkHandle];
				this.clearLock('fork_' + forkHandle);
				return res;
			}
		},
		
		checkJoinCallback: function(forkHandle){
			if(this.forkJoinHandles[forkHandle] && this.forkJoinHandles[forkHandle].callback){
				if(this.forkJoinHandles[forkHandle].ready == this.forkJoinHandles[forkHandle].count){
					this.forkJoinHandles[forkHandle].callback.call(this, this.forkJoinHandles[forkHandle].items);
					// remove handle
					this.clearLock('fork_' + forkHandle);
					delete this.forkJoinHandles[forkHandle];
				}
			}
		}
	}
});
