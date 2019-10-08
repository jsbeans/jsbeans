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
	$name:'JSB.System.Kernel',
	$server: {
		$singleton: true,
		$globalize: 'Kernel',
		$require: [
		    'java:org.jsbeans.serialization.JsObjectSerializerHelper',
		    'java:org.jsbeans.helpers.NetworkHelper',
		    'java:java.net.InetAddress',
		    'java:org.jsbeans.web.HttpService',
		],

		$constructor: function(){
			JSB().setLocker(this);

			var Exception = JSB().getGlobe().Exception = function(message,data) {
            	this.message = message;
            	this.stack = JSB().stackTrace();
            	this.data = data;
            }

            Exception.prototype = Error.prototype;
            
            JSB.getRepository().ensureSystemLoaded(function(){
            	Kernel.tell('JsbRegistryService', 'LoadAdditionalObjectsMessage', {});
            });
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
		
		waitJavaObject: function(javaObj){
			Bridge.waitJavaObject(javaObj);
		},
		
		tell: function(svcName, msgType, msgBody, node){
			Bridge.tell({
				serviceName: svcName,
				messageType: msgType,
				messageBody: msgBody,
				node: node
			});
		},
		
		ask: function(svcName, msgType, arg1, arg2, arg3){
			var callback = null;
			var msgBody = null;
			var timeout = null;
			var node = null;
			var async = false;
			if(JSB().isPlainObject(svcName)){
				var aDesc = svcName;
				svcName = aDesc.service;
				msgType = aDesc.messageType;
				callback = aDesc.callback;
				msgBody = aDesc.messageBody || {};
				timeout = aDesc.timeout;
				node = aDesc.node;
				async = aDesc.async || false;
			} else {
				if(JSB().isFunction(arg1)){
					callback = arg1;
					msgBody = arg2;
					node = arg3;
				} else if(JSB().isFunction(arg2)){
					msgBody = arg1;
					callback = arg2;
					node = arg3;
				} else {
					msgBody = arg1;
					node = arg2;
					callback = arg3;
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
				async: callback ? true: async,
				timeout: timeout,
				node: node,
				callback: callback
			});
		},
/*		
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
*/
/*		
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
*/		
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
		
		sessions: function(){
			return JsObjectSerializerHelper.getInstance().getScopeTree().getRoot().getChildrenIds().toArray();
		},
		
		killSession: function(sessionId){
			this.checkAdminOnly();
			return Kernel.ask('JsHub', 'RemoveScopeMessage', {scopePath: sessionId});
		},
		
		clientAddr: function(){
			var ip = '' + Bridge.getClientAddress(); 
			if(!JSB().isNull(ip) && ip.length > 0){
				return ip;
			}
			return "";
		},

		serverPort: function(){
            return Config.get('web.http.port') || HttpService.DEFAULT_PORT;
		},

		serverAddr: function(withPort){
            var ip = NetworkHelper.detectSelfAddress();
            if (withPort) {
                return ip + ':' + $this.serverPort();
            }
            return ip;
		},

		serverUrl: function(){
		    var url = ''+Config.get('web.http.url');
		    if (url && url.length > 0) {
		        return url;
		    }
		    return 'http://' + $this.serverAddr(true);
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
				return Config.get('kernel.security.admin.user');
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
		
		lockStats: function(){
			var stats = [];
			var lockStats = Bridge.lockStats();
			for(var i = 0; i < lockStats.size(); i++){
				var lockStatsEntry = lockStats.get(i);
				stats.push({
					lock: '' + lockStatsEntry.getLockName(),
					locked: lockStatsEntry.isLocked(),
					queueLength: lockStatsEntry.getQueueLength()
				});
			}
			return stats;
		},

		hostName: function() {
		    return '' + InetAddress.getLocalHost().getHostName();
		},
		
	}
}