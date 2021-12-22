/*! jsBeans v2.6.13 | jsbeans.org | MIT Licence | (c) 2011-2020 Special Information Systems, LLC */
if(!(function(){return this;}).call(null).JSB){
(function(){
	
	function JSB(cfg){
		if(cfg == null || cfg == undefined){
			return JSB.fn;
		}

		if(JSB().isArray(cfg)){
			var arr = [];
			for(var i = 0; i < cfg.length; i++){
				arr.push(JSB(cfg[i]));
			}
			return arr;
		}
		
		if(!(this instanceof JSB)){
		     return new JSB(cfg);
		}
		
		if(this.isFunction(cfg)){
			// TODO: perform ready callback
		}
		
		var self = this;
		
		// enable JSB mode
		if(!cfg.$format){
			cfg.$format = 'jsb';
		}

		if(cfg.$parent == null || cfg.$parent == undefined){
			cfg.$parent = 'JSB.Object';
		}
		
		// store in objects
		if(!this.isString(cfg.$name)){
			throw new Error("Class name required to create managed object");
		}

		if(this.objects[cfg.$name]){
			return;	// already created or in progress
		} else {
			// add to objects
			this.objects[cfg.$name] = this;
		}
		
		// insert into repo
		var repo = this.getRepository();
		if(repo){
			repo.registerLoaded(cfg, this);
		}
		
		if(cfg.$name != 'JSB.Object'){
			var parentExisted = this.get(cfg.$parent);
			this.lookup(cfg.$parent, function(par){
				if(!par || !par.jsb || par.jsb.$name != cfg.$parent){
					throw new Error('Unable to create bean "' + cfg.$name + '" due to wrong parent specified: "' + cfg.$parent + '"' + (par && par.jsb ? '; found: '+par.jsb.$name: ''));
				}
				self._create(cfg, par.jsb);
			});
		} else {
			this._create(cfg);
		}
		
		return this;
	}
	
	function checkOwnLast(){
		// check own prop position
		var tf = function(){this.own = true;}
		tf.prototype = {inherit:true};
		var instF = new tf();
		var lastOwn = false;
		for(var ki in instF){
			if(!instF.hasOwnProperty(ki)){
				lastOwn = true;
			}
			break;
		}
		
		return lastOwn;
	}
	
	JSB.fn = JSB.prototype = 
	{
		looking:{},
		requestedPackages:{},
		objects : {},
		groups: {},
		waiters: {},
		provider: null,
		clusterProvider: null,
		repository: null,
		messageBus: null,
		objectsToLoad: [],
		resourceLoaded: {},
		resourceScheduled: {},
		deferTimeoutMap: {},
		intervalMap: {},
		globalInstances: {},
		libraryScopes: {},
		threadLocal: null,
/*		fieldMaps: {},*/
		fieldArrs: {},
		syncScopes: {},
		_session: null,
		_sessionIdParameterName: null,
		
		support: {
			ownLast: checkOwnLast()
		},

		RpcResponse: function(val, opts){
			this.value = val;
			this.options = opts || {};

			this.setPlain = function(){
				this.options.plain = true;
			}

			this.setComplex = function(){
				this.options.plain = false;
			}

			this.isPlain = function(){
				return this.options.plain || false;
			}

			this.isComplex = function(){
				return !this.isPlain();
			}

			this.getValue = function(){
				return this.value;
			}
		},

		isClient: function(){
			if(this.isNull(this._isClient)){
				// check for window object existed
				this._isClient = (typeof(window) !== 'undefined');
			}
			return this._isClient;
		},

		isServer: function(){
			return !this.isClient();
		},
		
		isIframe: function(){
			if(this.isServer()){
				throw new Error('This function should not be called on server side');
			}
			try {
		        return window.self !== window.top;
		    } catch (e) {
		        return true;
		    }
		    return false;
		},

		eval: function(script, scopeVars, opts){
			if(this.isClient() || (opts && opts.native)){
				// generate scope vars
				for(var varName in scopeVars){
					eval('var ' + varName + ' = scopeVars["' + varName + '"];');
				}
				return eval('('+script+')');
			} else {
				var ctx = Packages.org.mozilla.javascript.Context.getCurrentContext();
				var scope = ctx.newObject(ctx.getThreadLocal('scope'));
				for(var varName in scopeVars){
					Bridge.putPropertyInScope(ctx, scope, varName, scopeVars[varName]);
				}
				var scopeName = '';
				if(opts && opts.contextName && scopeVars && scopeVars['$jsb'] && scopeVars['$jsb'].$name){
					scopeName = '' + scopeVars['$jsb'].$name + '.' + opts.contextName;
				}
				
				var wf = ctx.getWrapFactory();
				wf.setJavaPrimitiveWrap(false);
				
				var res = ctx.evaluateString(scope, '('+script+')', scopeName, 1, null);
				return res;
			}
		},

		wrap: function(method, opts){
			if(!this.isServer() || !opts || Object.keys(opts).length == 0){
				return method;
			}
			var self = this;
			var tlVars = null;
			var preserveContext = opts && opts.preserveContext;

			if(preserveContext){
				var tls = this.getThreadLocal();
				tlVars = {
					'token': tls.get('token'),
					'session': tls.get('session'),
					'user': tls.get('user'),
					'userToken': tls.get('userToken'),
					'clientAddr': tls.get('clientAddr'),
					'clientRequestId': tls.get('clientRequestId'),
					'scope': tls.get('scope'),
					'_jsbCallingContext': tls.get('_jsbCallingContext'),
				};
			}

			return function(){
				if(preserveContext && tlVars){
					var tls = self.getThreadLocal();
					for(var key in tlVars){
						tls.put(key, tlVars[key]);
					}
				}
				return method.apply(this, arguments);
			};
		},

		getCurrentSession: function(){
			if(!this.isServer()){
				return this._session;
			}
			var session = Bridge.getCurrentSession();
			if(session){
				return '' + session;
			}
			return '';
		},
		
		setCurrentSession: function(s){
			this._session = s;
		},

		getSync: function(){
			var s = false;
			if(this.getDescriptor().$sync){
				s = this.getDescriptor().$sync;
			} else {
				var e = this.currentSection();
				if(e.$sync){
					s = e.$sync;
				}
			}
			return s;
		},

		hasKeywordOption: function(opt){
			if(!this.isNull(this[opt])){
				return true;
			} else {
				var e = this.currentSection();
				if(!this.isNull(e[opt])){
					return true;
				}
			}
			return false;
		},

		getKeywordOption: function(opt){
			if(this[opt]){
				return this[opt];
			} else {
				var e = this.currentSection();
				if(e[opt]){
					return e[opt];
				}
			}
			return false;
		},

		isSingleton: function(){
			return this.getKeywordOption('$singleton');
		},

		isFixedId: function(){
			return this.getKeywordOption('$fixedId');
		},

		isSession: function(){
			if(this.hasKeywordOption('$session')){
				return this.getKeywordOption('$session');
			}
			return !this.isSingleton() && !this.isFixedId();
		},

		isSystem: function(name){
			if(!name){
				name = this.$name;
			}
			var sysMap = {
				'JSB.Object': true,
				'JSB.Locker': true,
				'JSB.Logger': true,
				'JSB.AjaxProvider': true,
				'JSB.Repository': true,
				'JSB.Profiler': true,
				'JSB.Future': true,
				'JSB.Base64': true,
				'JSB.MessageBus': true
			};
			return sysMap[name] ? true: false;
		},

		register: function(obj, id){
			var scope, jsb;
			jsb = obj.getJsb();
			var isSingleton = jsb.isSingleton();
			var isFixedId = jsb.isFixedId();
			var isSession = jsb.isSession();
			var curSession = jsb.getCurrentSession();

			if(isSession && curSession && curSession.length > 0){
				scope = this.getSessionInstancesScope();
			} else {
				scope = this.getGlobalInstancesScope();
			}

			if(isSingleton){
				obj.id = jsb.$name;
			} else {
				if(id){
					obj.id = id;
				} else if(!obj.id){
					obj.id = this.generateUid();
				}
			}
			obj.$_session = curSession;
			// repeating registration - wrong
			if(scope[obj.id] && (isSingleton || isFixedId)){
				debugger;
				var n = jsb.$name;
				if(isSingleton){
					this.getLogger().warn('Duplicate singleton instantiation: ' + n);
				} else {
					this.getLogger().warn('Duplicate fixedId bean instantiation: ' + obj.id);
				}
			}
			var tl = this.getThreadLocal();
			if(tl){
				var tc = tl.get('_jsbRegisterCallback');
				if(tc){
					tc.call(obj);
				}
			}
			scope[obj.id] = obj;
		},

		getGlobe: function(){
			return (function(){return this;}).call(null);
		},

		getSessionInstancesScope: function(){
			var scopeConst = '_jsb_sessionInstances';
			if(this.isServer()){
				scopeConst += '_' + this.getCurrentSession();
			}
			var globe = this.getGlobe();
			if(globe[scopeConst] == null || globe[scopeConst] == undefined){
				globe[scopeConst] = {};
			}

			return globe[scopeConst];
		},

		getGlobalInstancesScope: function(){
			return JSB().globalInstances;
		},

		addLibraryScope: function(name, scope){
			if(this.isNull(this.libraryScopes[name])){
				this.libraryScopes[name] = scope;
			} else {
				this.libraryScopes[name] = this.merge(this.libraryScopes[name], scope);
			}
			JSB()[name] = this.libraryScopes[name];
			JSB[name] = JSB()[name];
		},

		isLibraryScope: function(scope){
			for(var s in this.libraryScopes){
				if(this.libraryScopes[s] == scope){
					return true;
				}
			}
			return false;
		},

		isLibraryScopeName: function(n){
			if(this.libraryScopes[n]){
				return true;
			}
			return false;
		},

		setServerVersion: function(v){
			this.serverVersion = v;
		},

		getServerVersion: function(){
			return this.serverVersion;
		},
		
		setSessionIdParameterName: function(pName){
			this._sessionIdParameterName = pName;
		},
		
		getSessionIdParameterName: function(){
			return this._sessionIdParameterName;
		},

		getBasePath: function(){
			if(this.$_path == null || this.$_path == undefined){
				return '';
			}
			if(this.$_path.length > 0
					&& this.$_path[this.$_path.length - 1] != '\\'
					&& this.$_path[this.$_path.length - 1] != '/' ){
				return this.$_path + '/';
			}
			return this.$_path;
		},

		getBasePathFile: function(){
			if(this.$_pathFile == null || this.$_pathFile == undefined){
				return '';
			}
			return this.$_pathFile;
		},

		getFullPath: function(){
			return this.getRepository().get(this.$name).cfg.$_fullPath;
		},

		getFullPathFile: function(){
			return this.getRepository().get(this.$name).cfg.$_fullPathFile;
		},

		constructClientJSB: function(name){
			var jsb = this.get(name);
			if(this.isClient()){
				return jsb;
			}
			var clientFieldBlacklist = {
				'$server': true,
				'_descriptor': true,
				'$_clientProcs': true,
				'_ready': true,
				'_readyState': true,
				'_reqState': true,
				'_requireCnt': true,
				'_requireMap': true,
				'_cls': true,
				'_ctor': true,
				'_entryBootstrap': true,
				'_commonBootstrap': true
			};
			if(JSB().isNull(jsb)){
				Log.error('Unable to find JSB: ' + name);
				return null;
			}

			var cJsb = {};
			for(var f in jsb){
				if(jsb.hasOwnProperty(f) && !clientFieldBlacklist[f]){
					cJsb[f] = this.clone(jsb[f]);
				}
			}

			// filter out java requires
			var self = this;
			function filterJavaRequires(req){
				if(self.isArray(req)){
					for(var i = req.length - 1; i >= 0; i--){
						if(self.isString(req[i])){
							if(req[i].toLowerCase().indexOf('java:') == 0){
								req.splice(i, 1);
							}
						} else {
							filterJavaRequires(req[i]);
						}
					}
				} else if(self.isObject(req)){
					var alToRemove = [];
					for(var alias in req){
						if(self.isString(req[alias]) && req[alias].toLowerCase().indexOf('java:') == 0){
							alToRemove.push(alias);
						}
					}
					for(var i = 0; i < alToRemove.length; i++){
						delete req[alToRemove[i]];
					}
				} else {
					throw new Error('Invalid $require format in bean "'+name+'"');
				}
			}

			if(cJsb.$require){
				if(this.isString(cJsb.$require)){
					if(cJsb.$require.toLowerCase().indexOf('java:') == 0){
						delete cJsb.$require;
					}
				} else {
					filterJavaRequires(cJsb.$require);
				}
			}
			if(cJsb.$client && cJsb.$client.$require){
				if(this.isString(cJsb.$client.$require)){
					if(cJsb.$client.$require.toLowerCase().indexOf('java:') == 0){
						delete cJsb.$client.$require;
					}
				} else {
					filterJavaRequires(cJsb.$client.$require);
				}
			}


			return cJsb;
		},


		unregister: function(obj){
			if(!obj || !obj.getId || !obj.getJsb){
				throw new Error('Wrong object to unregister');
			}
			var id = obj.getId();
			if(!id){
				return null;
			}
			var scope = this.getGlobalInstancesScope();
			if(obj.getJsb().isSession() && obj.$_session && obj.$_session.length > 0){
				scope = this.getSessionInstancesScope();
			}

			if(scope[id]){
				delete scope[id];
			}

			// remove from callbackAttrs
			if(JSB().callbackAttrs && JSB().callbackAttrs.bindMap[id]){
				var lst = JSB().callbackAttrs.bindMap[id];
				for(var i in lst){
					var procId = lst[i];
					delete JSB().callbackAttrs.idMap[procId];
				}
				delete JSB().callbackAttrs.bindMap[id];
			}
		},

		_create: function(cfg, parent){
			if(cfg.$format == 'jso'){
				throw new Error('Unable to create bean "' + cfg.$name + '" due to JSO format is no longer supported');
			}
			

			var _kfs = ['$constructor', '$bootstrap', '$singleton', '$globalize', '$fixedId', '$disableRpcInstance', '$require', '$sync', '$client', '$server', '$name', '$parent', '$require', '$format', '$common'];
			var self = this;
			var logger = this.getLogger();

			// copy all current system fields into this
			for(var f in cfg){
				if(f && f.length > 0 && f[0] == '$'){
					this[f] = cfg[f];
				}
			}

			this._descriptor = cfg;
			this._ready = false;
			this._readyState = 0;
			this._reqState = 0;


			// build common section
			var commonSection = this.$common;
			if(!commonSection){
				commonSection = this.$common = {};
				for(var f in cfg){
					if(f && f.length > 0 && f[0] != '$' && cfg.hasOwnProperty(f)){
						commonSection[f] = cfg[f];
					}
				}
			}

			this._prepareSections(parent);

			// inherit parent's jsb options
			var entry = this.currentSection();
			if(parent){
				var pe = parent.currentSection();
				var kfs = ['$singleton', '$globalize', '$fixedId', '$disableRpcInstance', '$sync', '$session'];
				for(var i = 0; i < kfs.length; i++){
					var key = kfs[i];
					if(parent.hasKeywordOption(key)){
						entry[key] = parent.getKeywordOption(key);
					}
				}
			}

			function _waitRequiresBeforeBootstrap(){
				var reqBeans = {};

				// collect all requires with smaller readyState
				var skipPrefixes = ['java:', 'css:', 'script:', 'module:'];
				for(var req in self._requireMap){
					var needSkip = false;
					for(var i = 0; i < skipPrefixes.length; i++){
						if(req.toLowerCase().indexOf(skipPrefixes[i]) == 0){
							needSkip = true;
							break;
						}
					}
					if(needSkip){
						continue;
					}
					var jsb = self.objects[req];
					if(jsb._readyState < 2){
						reqBeans[req] = jsb
					}
				}

				var reqContainer = {
					curReqBeans: reqBeans
				};

				function _matchReqSynchronized(state){
					if(JSB.isNull(state)){
						self._reqSynchronized = true;
						self._reqState = null;
						state = null;
					} else {
						self._reqState = state;
					}
					if(!self._reqCallbacks){
						return;
					}
					for(var i = self._reqCallbacks.length - 1; i>= 0; i--){
						var reqDesc = self._reqCallbacks[i];
						if(self._reqSynchronized || (!JSB.isNull(reqDesc.reqState) && state >= reqDesc.reqState)){
							// execute and remove
							var cb = reqDesc.callback;
							self._reqCallbacks.splice(i, 1);
							cb.call(self);
						}
					}
				}

				function _ensureReqSynchronized(jsb, callback, state){
					if(JSB.isNull(state)){
						state = null;
					}

					if(jsb._reqSynchronized || (!JSB.isNull(state) && jsb._reqState >= state)){
						callback.call(self);
						return;
					}
					if(!jsb._reqCallbacks){
						jsb._reqCallbacks = [];
					}
					jsb._reqCallbacks.push({callback: callback, reqState: state});
				}


				function _reqIteration(s){
					if(Object.keys(reqContainer.curReqBeans).length === 0){
						self._readyState = 2;
						_matchReqSynchronized();
						self._proceedBootstrapStage();
					} else {
						_matchReqSynchronized(s);

						var sCnt = Object.keys(reqContainer.curReqBeans).length;
						var cCnt = {
							ready: 0
						};
						for(var sid in reqContainer.curReqBeans){
							(function(sid){
								var reqJsb = reqContainer.curReqBeans[sid];

								_ensureReqSynchronized(reqJsb, function(){
									cCnt.ready++;
									if(cCnt.ready >= sCnt){
										var sbMap = {};

										for(var ssid in reqContainer.curReqBeans){
											var rJsb = reqContainer.curReqBeans[ssid];

											if(!rJsb._reqSynchronized && rJsb._reqState <= self._reqState){
												sbMap[ssid] = rJsb;
											}
										}

										reqContainer.curReqBeans = sbMap;
										_reqIteration(s + 1);
									}
								}, s);
							})(sid);
						}
					}

				}

				_reqIteration(1);
			}

			if(this.isPlainObject(entry) || this.isPlainObject(commonSection)){
				var body = {};

				// construct class stub
				if(parent == null || parent == undefined || parent.currentSection() == null){
					self._cls = self._simpleClass();
				} else {
					self._cls = self._inheritedClass(parent._cls);
				}
				self._cls['jsb'] = self;
				self._readyState = 1;
				self._matchWaiters(1);

				// merge common and entry sections
				if(commonSection && Object.keys(commonSection).length > 0){
					this.merge(true, body, commonSection);
				}
				if(entry && Object.keys(entry).length > 0){
					this.merge(true, body, entry);
				}

				// clear JSB keyword fields
				for(var i = 0; i < _kfs.length; i++ ){
					if(body[_kfs[i]]){
						delete body[_kfs[i]];
					}
				}
/*
				// substitute body methods via checking proxy
				function checkPrivate(curDesc, ctxStack){
					if(ctxStack.length == 0){
						throw 'Private method ' + curDesc.jsb.$name + '.' + curDesc.methodName + ' can\'t be called from anywhere';
					}
					var prevDesc = ctxStack[ctxStack.length - 1];
					if(prevDesc.jsb != curDesc.jsb){
						throw 'Private method ' + curDesc.jsb.$name + '.' + curDesc.methodName + ' is not accessible from ' + prevDesc.jsb.$name + '.' + prevDesc.methodName;
					}
				}

				function checkProtected(curDesc, ctxStack){
					if(ctxStack.length == 0){
						throw 'Protected method ' + curDesc.jsb.$name + '.' + curDesc.methodName + ' can\'t be called from anywhere';
					}
					var prevDesc = ctxStack[ctxStack.length - 1];
					if(!prevDesc.jsb.isSubclassOf(curDesc.jsb)){
						throw 'Protected method ' + curDesc.jsb.$name + '.' + curDesc.methodName + ' is not accessible from ' + prevDesc.jsb.$name + '.' + prevDesc.methodName;
					}
				}
*/

				// combine requires
				var requireMap = self._requireMap = {};
				var reverseRequireMap = {};
				var requireVals = {};
				var requireArr = [];

				if(this.$require || (entry && entry.$require)){
					var parseReqEntry = function(e){
						if(JSB().isArray(e)){
							for(var i = 0; i < e.length; i++){
								parseReqEntry(e[i]);
							}
							return;
						} else if(JSB().isString(e)){
							var rObj = {};
							// generate alias
							var alias = e;
							if(alias.indexOf('script:') != 0 && alias.indexOf('module:') != 0 && alias.indexOf('css:') != 0 && alias.lastIndexOf('.') >= 0){
								alias = alias.substr(alias.lastIndexOf('.') + 1);
							}
							rObj[alias] = e;
							parseReqEntry(rObj);
						} else {
							// plain object
							for(var alias in e){
								var requiredJsb = e[alias];
								if(!self.isString(requiredJsb)){
									throw new Error('Invalid required entity declaration "' + JSON.stringify(requiredJsb) + '" in bean ' + self.$name);
								}
								if(requireMap[requiredJsb]){
									throw new Error('Duplicate require "' + requiredJsb + '" in bean ' + self.$name);
								} else {
									if(!self.isString(alias)){
										throw new Error('Invalid alias "' + JSON.stringify(alias) + '" in bean "'+self.$name+'" requirement');
									}
									if(alias.indexOf('script:') != 0 && alias.indexOf('module:') != 0 && alias.indexOf('css:') != 0 && !/^[A-Za-z_][A-Za-z_\d]*$/.test(alias)){
										throw new Error('Invalid alias "' + alias + '" in bean "'+self.$name+'" requirement');
									}
									if(reverseRequireMap[alias]){
										throw new Error('Duplicate require alias "' + alias + '" in bean ' + self.$name + '. Please choose another alias name');
									}
									requireMap[requiredJsb] = alias;
									reverseRequireMap[alias] = requiredJsb;
									if(alias.indexOf('script:') == 0 || alias.indexOf('module:') == 0 || alias.indexOf('css:') == 0){
										requireArr.push(alias);
									}

								}
							}
						}
					}

					if(this.$require){
						parseReqEntry(this.$require);
					}
					if(entry && entry.$require){
						parseReqEntry(entry.$require);
					}
				}

				function loadRequires(callback){
					if(Object.keys(requireMap).length === 0){
						callback.call(self);
					} else {
						var locker = self.getLocker();
						var rcWrap = {
							_requireCnt: Object.keys(requireMap).length
						};

						function _loadReq(req, cb){
							var alias = requireMap[req];
							self._lookupRequire(req, function(cls){
								if(locker)locker.lock('_jsb_lookupRequires_' + self.$name);
								rcWrap._requireCnt--;
								if(locker)locker.unlock('_jsb_lookupRequires_' + self.$name);

								if(alias.indexOf('script:') != 0 && alias.indexOf('module:') != 0 && alias.indexOf('css:') != 0){
									requireVals[alias] = cls;
								}

								if(rcWrap._requireCnt === 0){
									callback.call(self);
								} else {
									if(cb){
										cb.call(self);
									}
								}
							});
						}

						var lMap = {};

						function _loadLeftReqs(){
							for(var req in requireMap){
								if(lMap[req]){
									continue;
								}
								_loadReq(req);
							}
						}

						function _loadOrderedNextReq(){
							if(requireArr.length > 0){
								var req = requireArr[0];
								lMap[req] = true;
								_loadReq(req, function(){
									requireArr.splice(0, 1);
									_loadOrderedNextReq();
								});
							} else {
								_loadLeftReqs();
							}
						}

						_loadOrderedNextReq();
					}
				}

				loadRequires(function(){

					var $jsb = self;
					var $parent = null;

					// propagate $super variable
					var $superFunc = null;
					if(parent){
						$parent = parent.getClass();
						$superFunc = function(inst){this.__instance = inst;};
						var parScope = parent.getClass().prototype;
						for(var mtdName in parScope){
							if(!self.isFunction(parScope[mtdName]) || self.isJavaObject(parScope[mtdName])){
								continue;
							}
							(function(mtdName){
								$superFunc.prototype[mtdName] = function(){
									return parScope[mtdName].apply(this.__instance, arguments);
								}
							})(mtdName);
						}
					}

					// propagate $current
					$curFunc = function(inst){this.__instance = inst;};
					for(var mtdName in body){
						if(!self.isFunction(body[mtdName]) || self.isJavaObject(body[mtdName])){
							continue;
						}
						(function(mtdName){
							$curFunc.prototype[mtdName] = function(){
								return self.getClass().prototype[mtdName].apply(this.__instance, arguments);
							}
						})(mtdName);
					}

					// setup rootFunc
					$rootFunc = function(inst, callback, chRoot){
						if(!callback){
							return;
						}
						var curSession = self.getCurrentSession();
						if(!curSession || curSession.length == 0){
							return callback();
						}
						if(self.isSession()){
							throw new Error('Use of $root is restricted for session bean "' + self.getDescriptor().$name+ '"');
						}
						return Bridge.executeRoot(callback, chRoot ? true : false);
					}
/*
					// propagate $server and $client
					var $serverFunc = function(inst){var f = function(){this.__instance = inst;}; f.prototype = inst.jsb.$_serverProcs; return new f();}
					var $clientFunc = function(inst){var f = function(){this.__instance = inst;}; f.prototype = inst.jsb.$_clientProcs; return new f();}
*/

					var scopeVars = self.merge({
						'$jsb': $jsb,
						'$class': self._cls,
						'$parent': $parent,
						'$superFunc': $superFunc,
						'$curFunc': $curFunc,
						'$rootFunc': $rootFunc
					}, requireVals);

/*
					// add self class
					if(self.$name != 'JSB.Object'){
						var selfAlias = self.$name;
						if(selfAlias.lastIndexOf('.') >= 0){
							selfAlias = selfAlias.substr(selfAlias.lastIndexOf('.') + 1);
						}
						if(selfAlias != 'Object'){
							scopeVars[selfAlias] = self.getClass();
						}
					}

					// add parent class
					if(parent){
						var parentAlias = parent.$name;
						if(parentAlias.lastIndexOf('.') >= 0){
							parentAlias = parentAlias.substr(parentAlias.lastIndexOf('.') + 1);
						}
						if(parentAlias != 'Object'){
							scopeVars[parentAlias] = $parent;
						}
					}
*/
					var funcRx = /^\s*function\s*([^\(\s]*)\s*\(([^\)]*)\)\s*\{/;
					var superRx = /\$super/;
					var baseRx = /\$base/;
					var currentRx = /\$current/;
					var thisRx = /\$this/;
					var rootRx = /\$root/;
					function _enrichFunction(mtdName, proc, isCtor, isBootstrap){
						var procStr = proc.toString();
						// extract proc declaration
						var declM = procStr.match(funcRx);
						if(!declM){
							throw new Error('Internal error: wrong procStr: ' + procStr);
						}
						var fName = declM[1];
						if(fName.length === 0){
							fName = mtdName;
						}

						var hasSuper = superRx.test(procStr);
						var hasBase = baseRx.test(procStr);
						var hasCurrent = currentRx.test(procStr);
						var hasRoot = rootRx.test(procStr);
						var hasThis = hasRoot || thisRx.test(procStr);

						var procDecl = 'function __' + fName + '(' + declM[2] + '){ ';
						if(hasThis || (hasBase && isCtor)){
							procDecl += 'var $this=this; ';
						}
						if(!isBootstrap){
							if(parent){
								if(hasSuper || (hasBase && !isCtor)){
									procDecl += 'var $super = new $superFunc(this); ';
								}
								if(hasBase){
									if(isCtor){
										procDecl += 'var $base = function(){ $parent.apply($this, arguments); $this.$_superCalled = true; }; ';
									} else {
										procDecl += 'var $base = function(){return $super.'+mtdName+'.apply($super, arguments);}; ';
									}
								}
							}
							if(hasCurrent){
								procDecl += 'var $current = new $curFunc(this); ';
							}
							if(hasRoot && self.isServer()){
								procDecl += 'var $root = function(callback){return $rootFunc($this, callback);}; ';
							}
						}
/*						if(self.isClient()){
							procDecl += 'var $server = $serverFunc(this); ';
						} else {
							procDecl += 'var $client = $clientFunc(this); ';
						}
*/
						// extract proc body
						procStr = procDecl + procStr.substr(declM[0].length);

						try {
							return self.eval(procStr,scopeVars, {contextName: fName});
						} catch(e){
							debugger;
							if(self.isClient()){
								console.log('Error: ' + e + ' due to parsing function: ' + procStr);
							} else {
								Log.error('Error: ' + e + ' due to parsing function: ' + procStr);
							}
							throw e;
						}
					}


					for(var mtdName in body){
						if(!self.isFunction(body[mtdName]) || self.isJavaObject(body[mtdName])){
							continue;
						}
						(function(mtdName){
							var proc = _enrichFunction(mtdName, body[mtdName])
							var privateMethod = false;
							var protectedMethod = false;
							if(mtdName[0] == '_'){
								if(mtdName.length < 2){
									throw new Error('Invalid method name "' + mtdName + '" in bean ' + self.$name);
								}
								// private or protected method
								protectedMethod = true;

								if(mtdName[1] == '_'){
									if(mtdName.length < 3){
										throw new Error('Invalid method name "' + mtdName + '" in bean ' + self.$name);
									}

									// private method
									privateMethod = true;
								}
							}
							body[mtdName] = proc;
/*							body[mtdName] = function(){
								var ctxStack = self.getCallingContext();
								ctxStack.push({
									jsb: self,
									methodName: mtdName,
									inst: this
								});

								var res;
								try {
									// call original function
									res = proc.apply(this, arguments);
								} finally {
									// restore prev context
									ctxStack.pop();
								}

								return res;
							}*/

							body[mtdName].jsb = self;
						})(mtdName);
					}

					// perform constructor
					var ctor = null;
					if(entry && entry.hasOwnProperty('$constructor')){
						ctor = entry.$constructor;
					} else if(!ctor && self.hasOwnProperty('$constructor')){
						ctor = self.$constructor;
					} else if(!ctor){
						ctor = function(){};
					}
					self._ctor = _enrichFunction('$constructor', ctor, true);

					// perform bootstrap
					if(entry && entry.$bootstrap){
						self._entryBootstrap = _enrichFunction('$bootstrap', entry.$bootstrap, false, true);
					}
					if(self.$bootstrap){
						self._commonBootstrap = _enrichFunction('$bootstrap', self.$bootstrap, false, true);
					}


					if(parent == null || parent == undefined || parent.currentSection() == null){
						self._enhanceSimple(self._cls, body);
					} else {
						self._enhanceInherited(self._cls, parent._cls, body);
					}
					self._cls.prototype.jsb = self;

					// prepare field map
					self._prepareFieldMap();
					self._setupLibraries(self._cls.prototype);

					_waitRequiresBeforeBootstrap();
				});

			} else {
				_waitRequiresBeforeBootstrap();
			}
		},

		_waitRequires: function(readyState, callback){
			var self = this;
			if(Object.keys(this._requireMap).length === 0){
				callback.call(this);
				return;
			}
			var wMap = {};
			// collect all requires with smaller readyState
			var skipPrefixes = ['java:', 'css:', 'script:', 'module:'];
			for(var req in this._requireMap){
				var needSkip = false;
				for(var i = 0; i < skipPrefixes.length; i++){
					if(req.toLowerCase().indexOf(skipPrefixes[i]) == 0){
						needSkip = true;
						break;
					}
				}
				if(needSkip){
					continue;
				}
				var jsb = this.objects[req];
				if(jsb._readyState < readyState){
					wMap[req] = true;
				}
			}
			var rcWrap = {
				_requireCnt: Object.keys(wMap).length
			};

			if(rcWrap._requireCnt === 0){
				callback.call(this);
				return;
			}
			var locker = this.getLocker();
			for(var req in wMap){
				this._pushWaiter(req, function(){
					if(locker)locker.lock('_jsb_lookupRequires_' + self.$name);
					rcWrap._requireCnt--;
					if(locker)locker.unlock('_jsb_lookupRequires_' + self.$name);
					if(rcWrap._requireCnt === 0){
						callback.call(self);
					}
				}, readyState);
			}
		},

		_setupLibraries: function(proto){
			for(var name in this.libraryScopes){
				proto[name] = this.libraryScopes[name];
			}
		},

		_prepareSections: function(parent){
			var self = this;
			var blackProcs = {
				'import': true,
				'export': true,
				'rpc': true,
				'$constructor': true,
				'$bootstrap': true
			};

			function fillProcs(scope, sec1, sec2){
				var curJsb = self;
				while(curJsb) {
					var bodies = [];
					if(curJsb[sec1]){
						bodies.push(curJsb[sec1]);
					}
					if(curJsb[sec2]){
						bodies.push(curJsb[sec2]);
					}
					for(var b in bodies){
						var curBody = bodies[b];
						if(!curBody){
							continue;
						}
						for(var procName in curBody){
							if(!JSB().isFunction(curBody[procName])){
								continue;
							}
							if(scope[procName] || blackProcs[procName]){
								continue;
							}
							scope[procName] = eval('(function(){JSB().proxyRpcCall.call(this.__instance, this.__node, "'+procName+'", arguments, this.__opts);})');
						}
					}

					if(curJsb.getClass()){
						var s = curJsb.getClass().$superclass;
						if(!s){
							break;
						}
						curJsb = s.jsb;
					} else {
						curJsb = parent;
					}
				}
			}

			if(this.isClient()){
				if(this.isNull(this.$client)){
					this.$client = {};
				}

				if(this.isNull(this.$_serverProcs)){
					var scope = this.$_serverProcs = this.$_serverProcs || {};
					fillProcs(scope, '$common', '$server');
				}

			} else {
				if(this.isNull(this.$server)){
					this.$server = {};
				}

				// resolve server-side push-proxies
				var scope = this.$_clientProcs = this.$_clientProcs || {};
				fillProcs(scope, '$common', '$client');

				// resolve client-side rpc proxies
				var scope = this.$_serverProcs = this.$_serverProcs || {};
				fillProcs(scope, '$common', '$server');

			}

			var entry = this.currentSection();
			// copy global jsb settings into current entry
			if(this.isNull(entry.$fixedId) && !this.isNull(this.$fixedId)){
				entry.$fixedId = this.$fixedId;
			}

			if(this.isNull(entry.$singleton) && !this.isNull(this.$singleton)){
				entry.$singleton = this.$singleton;
			}
		},

		proxyRpcCall: function(node, name, argsO, opts){
			var callback = null;
			var args = [];
			for(var i in argsO){
				args.push(argsO[i]);
			}
			for(var i = args.length - 1; i >= 0; i--){
				if(JSB().isFunction(args[i])){
					if(!callback){
						callback = args[i];
					}
					args.splice(i, 1);
				}
			}
			opts = opts || {};
			JSB.merge(opts, {node: node});
			this.rpc(name, args, callback, opts);
		},

		getDescriptor: function(){
			return this._descriptor;
		},

		getName: function(){
			return this.getDescriptor().$name;
		},

		getParent: function(){
			if(this.$parent){
				return JSB.get(this.$parent);
			}
			return null;
		},

		currentSection: function(){
			if(this.isClient() ){
				return this.$client;
			} else {
				return this.$server;
			}

			return null;
		},

		isNumber: function(obj){
			return typeof(obj) === 'number' && !isNaN(obj);
		},

		isNaN: function(obj){
			return isNaN(obj);
		},

		isFloat: function(n){
			return Number(n) === n && n % 1 !== 0;
		},

		isDouble: function(n){
			return Number(n) === n && n % 1 !== 0;
		},

		isInteger: function(n){
			return Number(n) === n && n % 1 === 0;
		},

		isBoolean: function(obj){
			return typeof(obj) === 'boolean';
		},

		isDate: function(obj){
			return Object.prototype.toString.call(obj) === '[object Date]';
		},

		isFunction: function(obj){
			return typeof(obj) === 'function';
		},

		isWindow: function( obj ) {
			/* jshint eqeqeq: false */
			return obj != null && obj == obj.window;
		},

		isJavaObject: function(obj){
			if(!this.isClient()){
				return obj instanceof java.lang.Object || Bridge.isJavaObject(obj);
			} else {
				return false;
			}
		},

		isDomNode: function(o){
			if(this.isServer()){
				return false;
			}
			return ( typeof Node === "object" ? o instanceof Node : o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string" );
		},

		isDomElement: function(o){
			if(this.isServer()){
				return false;
			}
			return ( typeof HTMLElement === "object" ? o instanceof HTMLElement : o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string" );
		},

		isPlainObject: function(obj, checkPojo){
			var key;
			var class2type = {};
			var hasOwn = class2type.hasOwnProperty;

			try {
				if ( !obj || typeof(obj) !== "object" || this.isDomNode(obj) || this.isWindow( obj ) || this.isArray(obj) || this.isString(obj) ) {
					return false;
				}
			} catch(e){
				return false;
			}

			if(this.isJavaObject(obj)){
				return false;
			}

			if(checkPojo){
				try {
					// Not own constructor property must be Object
					if ( obj.$constructor &&
						!hasOwn.call(obj, '$constructor') &&
						!hasOwn.call(obj.$constructor.prototype,'isPrototypeOf')) {
						return false;
					}
				} catch ( e ) {
					// IE8,9 Will throw exceptions on certain host objects #9897
					return false;
				}

				if(this.support.ownLast){
					for ( key in obj ) {
						return hasOwn.call(obj, key);
					}
				}

				// Own properties are enumerated firstly, so to speed up,
				// if last one is own, then all properties are own.
				for ( key in obj ) {}

				return key === undefined || hasOwn.call(obj,key);
			} else {
				return true;
			}

		},

		isError: function(obj){
			return Object.prototype.toString.call(obj) === "[object Error]";
		},

		isArray: function(obj){
			return Object.prototype.toString.call(obj) === "[object Array]";
		},

		isArrayBuffer: function(obj){
			return Object.prototype.toString.call(obj) === "[object ArrayBuffer]";
		},

		isArrayBufferView: function(obj){
			return this.isInt8Array(obj)
			|| this.isUint8Array(obj)
			|| this.isUint8ClampedArray(obj)
			|| this.isInt16Array(obj)
			|| this.isUint16Array(obj)
			|| this.isInt32Array(obj)
			|| this.isUint32Array(obj)
			|| this.isFloat32Array(obj)
			|| this.isFloat64Array(obj);
		},

		isInt8Array: function(obj){
			return Object.prototype.toString.call(obj) === "[object Int8Array]";
		},

		isUint8Array: function(obj){
			return Object.prototype.toString.call(obj) === "[object Uint8Array]";
		},

		isUint8ClampedArray: function(obj){
			return Object.prototype.toString.call(obj) === "[object Uint8ClampedArray]";
		},

		isInt16Array: function(obj){
			return Object.prototype.toString.call(obj) === "[object Int16Array]";
		},

		isUint16Array: function(obj){
			return Object.prototype.toString.call(obj) === "[object Uint16Array]";
		},

		isInt32Array: function(obj){
			return Object.prototype.toString.call(obj) === "[object Int32Array]";
		},

		isUint32Array: function(obj){
			return Object.prototype.toString.call(obj) === "[object Uint32Array]";
		},

		isFloat32Array: function(obj){
			return Object.prototype.toString.call(obj) === "[object Float32Array]";
		},

		isFloat64Array: function(obj){
			return Object.prototype.toString.call(obj) === "[object Float64Array]";
		},

		isString: function(obj){
			return Object.prototype.toString.call(obj) === "[object String]";
		},

		isObject: function(obj){
			return Object.prototype.toString.call(obj) === "[object Object]";
		},

		isRegExp: function(obj){
			return Object.prototype.toString.call(obj) === "[object RegExp]";
		},

		isNull: function(obj){
			return obj == null || obj == undefined;
		},

		isDefined: function(obj){
			return obj !== undefined;
		},

		isInstanceOf: function(obj, cls){
			if(!obj){
				return false;
			}
			if(obj.jsb && obj.jsb.getClass && obj instanceof obj.jsb.getClass()){
				return obj.jsb.isSubclassOf(cls);
			}
/*
			if(JSB().isString(obj)){
				var jso = this.get(obj);
				if(jso){
					return jso.isSubclassOf(cls);
				}
			}
*/
			return false;
		},

		isFuture: function(obj){
			return this.isInstanceOf(obj, 'JSB.Future');
		},

		isRpcResponse: function(obj){
			return obj instanceof JSB().RpcResponse;
		},

		isBean: function(obj, skipCheckPlain){
			if(!skipCheckPlain && !this.isPlainObject(obj)){
				return false;
			}
			try {
				if(obj && obj.id && obj.jsb && obj.jsb.getClass /*&& obj instanceof obj.jsb.getClass()*/){
					return true;
				}
			} catch(e) {}
			return false;
		},

		isSubclassOf: function(str){
			if(this.isString(str)){
				// do nothing
			} else if(str instanceof JSB){
				str = str.$name;
			} else if(this.isFunction(str) && str.jsb){
				str = str.jsb.$name;
			} else if(this.isBean(str, true)){
				str = str.getJsb().$name;
			}
			if(this.$name == str){
				return true;
			}
			if(this.$parent == null
				|| this.$parent == undefined
				|| this.$parent.length == 0
				|| this.$parent == 'JSB.Object'){
				if(str == 'JSB.Object'){
					return true;
				}
				return false;
			}
			var parentJso = this.get(this.$parent);
			return parentJso.isSubclassOf(str);
		},

		getSubclassOfDistance: function(str, deep){
			if(!deep){
				deep = 0;
			}
			if(this.isString(str)){
				// do nothing
			} else if(str instanceof JSB){
				str = str.$name;
			} else if(this.isFunction(str) && str.jsb){
				str = str.jsb.$name;
			} else if(this.isBean(str, true)){
				str = str.getJsb().$name;
			}

			if(this.$name == str){
				return deep;
			}
			if(this.$parent == null
				|| this.$parent == undefined
				|| this.$parent.length == 0
				|| this.$parent == 'JSB.Object'){
				if(str == 'JSB.Object'){
					return deep;
				}
				return null;
			}
			var parentJso = this.get(this.$parent);
			return parentJso.getSubclassOfDistance(str, deep + 1);
		},

		isEqual: function(b1, b2, options){
			if(b1 == b2){
				return true;
			}
			if(b1 === undefined && b2 === undefined){
				return true;
			}
			if(b1 === undefined || b2 === undefined){
				return false;
			}
			if(b1 === null && b2 === null){
				return true;
			}
			if(b1 === null || b2 === null){
				return false;
			}
			if(Object.prototype.toString.call(b1) != Object.prototype.toString.call(b2)){
				return false;
			}
			if(this.isString(b1) || this.isNumber(b1) || this.isBoolean(b1)){
				return b1 == b2;
			} else if(this.isArrayBuffer(b1) || this.isArrayBufferView(b1)){
				if(true/*this.isClient()*/){
					if(this.isArrayBufferView(b1)){
						b1 = b1.buffer;
					}
					if(this.isArrayBufferView(b2)){
						b2 = b2.buffer;
					}
					if(b1.byteLength != b2.byteLength){
						return false;
					}
					var arr1 = new Uint8Array(b1);
					var arr2 = new Uint8Array(b2);
					for(var i = 0; i < arr1.length; i++){
						if(arr1[i] != arr2[i]){
							return false;
						}
					}
					return true;
				} else {
					// TODO: call server-side routine to increase performance
				}
			} else if(this.isArray(b1)){
				if(b1.length != b2.length){
					return false;
				}
				if(true/*this.isClient()*/){
					for(var i = 0; i < b1.length; i++){
						if(!this.isEqual(b1[i], b2[i], options)){
							return false;
						}
					}
					return true;
				} else {
					// TODO: call server-side routine to increase performance
				}
			} else if(this.isBean(b1) || this.isBean(b2)){
				return b1 == b2;
			} else if(this.isObject(b1)){
				if((!options || options && !options.checkObjectProperties) && Object.keys(b1).length != Object.keys(b2).length){
					return false;
				}
				for(var key in b1){
					if(b2[key] === undefined){
						if(b1[key] === undefined){
							continue;
						}
						return false;
					}
					if(!this.isEqual(b1[key], b2[key], options)){
						return false;
					}
				}
				return true;
			} else {
				return b1 == b2;
			}
		},

		locked: function(){
	        var id;
	        var func;
		    if (arguments.length == 3) {
		        // locked(this, 'local_name', func) // bean instance with local mutex name
		        // locked($jsb, 'local_name', func) // bean type with local mutex name
		        if (JSB.isBean(arguments[0])) {
		            id = arguments[0].getId() + '.' + arguments[1];
		        } else if (arguments[0] instanceof JSB) {
		            id = arguments[0].$name + '.' + arguments[1];
		        }
		        func = arguments[2];
		    } else if (arguments.length == 2){
		        // locked(this, func) // bean instance
                // locked($jsb, func) // bean type
                // locked('global_name', func) // global mutex name
                if (JSB.isBean(arguments[0])) {
                    id = arguments[0].getId();
                } else if (arguments[0] instanceof JSB) {
                    id = arguments[0].$name;
                } else {
                    id = arguments[0];
                }
                func = arguments[1];
		    } else if(arguments.length == 1) {
		        // locked(func) // global
                id = 'GLOBAL';
                func = arguments[0];
		    }

            var locker = JSB().getLocker();
            try {
                locker.lock(id);
                return func.call(this);
            } finally {
                locker.unlock(id);
            }
		},



		stringify: function(obj, callback, name, pretty){
			// TODO: replace implementation to avoid cyclic references
            var offsetStep = '  ';
            var offset = '\n';

			function stringify(obj, callback, name){
                var str = '';

                function offsetBegin() {
                    if (pretty) { offset += offsetStep; str += offset; }
                }
                function offsetNext() {
                    if (pretty) { str += offset; }
                }
                function offsetEnd() {
                    if (pretty) { offset = offset.substring(0, offset.length - offsetStep.length); str += offset; }
                }

                if(callback){
                    var res = callback(obj, name);
                    if(res !== undefined){
                        return res;
                    }
                }

                if(JSB().isPlainObject(obj)){
                    // collect names and sort
                    var names = [];
                    for(var fName in obj){
                        if(!obj.hasOwnProperty(fName)){
                            continue;
                        }
                        names.push(fName);
                    }
                    names.sort();
                    str += '{';
                    offsetBegin();
                    var len = str.length;
                    for(var i = 0; i < names.length; i++ ){
                        if(str.length > len){
                            str += ',';
                            offsetNext();
                        }
                        var fName = names[i];
                        var fRes = stringify(obj[fName], callback, fName);
                        if(fRes === null){
                            continue;
                        }
                        str += '"' + fName + '":';
                        if (pretty) str += ' ';
                        str += fRes;
                    }
//                    offsetNext();
                    offsetEnd();
                    str += '}';

                    return str;
                } else if(JSB().isArray(obj)){
                    str += '[';
                    offsetBegin();
                    var len = str.length;
                    for(var i = 0; i < obj.length; i++){
                        if(str.length > len){
                            str += ',';
                            offsetNext();
                        }
                        var fRes = stringify(obj[i], callback, i);
                        if(fRes === null){
                            continue;
                        }
                        str += fRes;
                    }
                    offsetEnd();
                    str += ']';
                    return str;
                } else if(JSB().isString(obj)){
                    return '' + JSON.stringify(obj) + '';
                } else {
                    return '' + obj;
                }
			}

			return stringify(obj, callback, name);
		},

		get: function(name){
			if(this.objects[name] != null && this.objects[name] != undefined){
				return this.objects[name];
			}

			return null;
		},

/*		getCallingContext: function(){
			var tls = this.getThreadLocal();
			var ctx = tls.get('_jsbCallingContext');
			if(!ctx){
				ctx = [];
				tls.put('_jsbCallingContext', ctx);
			}

			return ctx;
		},*/

/*		saveCallingContext: function(){
			var saveCtx = [];
			var ctx = this.getCallingContext();
			for(var i = 0; i < ctx.length; i++){
				if(!ctx[i]){
					continue;
				}
				saveCtx.push({
					jsb: ctx[i].jsb,
					methodName: ctx[i].methodName,
					inst: ctx[i].inst
				});
			}

			return saveCtx;
		},*/

/*		putCallingContext: function(ctx){
			var tls = this.getThreadLocal();
			tls.put('_jsbCallingContext', ctx);
		}, */

		getGroup: function(){
			if(this.group){
				if(this.isArray(this.group)){
					var retArr = [];
					for(var i in this.group){
						var gName = this.group[i];
						retArr = retArr.concat(this.groups[gName]);
					}
					return retArr;
				}
				return this.groups[this.group];
			}
			return null;
		},

		getDescendants: function(p){
			var jsbMap = {};
			if(!p){
				p = this;
			} else if(JSB.isString(p)){
				p = JSB.get(p);
			} else {
				throw new Error('Invalid arg');
			}
			var objArr = JSB().objects;
			for(var i in objArr){
				var o = objArr[i];
				if(o.isSubclassOf(p) && o !== p){
					jsbMap[o.$name] = o;
				}
			}
			return jsbMap;
		},

		getAscendants: function(p){
			var jsbMap = {};
			if(!p){
				p = this;
			} else if(JSB.isString(p)){
				p = JSB.get(p);
			} else {
				throw new Error('Invalid arg');
			}
			var objArr = JSB().objects;
			for(var i in objArr){
				var o = objArr[i];
				if(p.isSubclassOf(o) && o !== p){
					jsbMap[o.$name] = o;
				}
			}
			return jsbMap;
		},

		clone: function(obj, bAssign){
			if(this.isArray(obj)){
				if(bAssign){
					return Object.assign([],obj);
				}
				return this.merge(true, [], obj);
			} else if(this.isPlainObject(obj)){
				if(bAssign){
					return Object.assign({},obj);	
				}
				return this.merge(true, {}, obj);
			}
			return obj;
		},

		merge: function() {
			var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

			// Handle a deep copy situation
			if (typeof target === "boolean") {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			}

			// Handle case when target is a string or something (possible in
			// deep copy)
			if (typeof target !== "object" && !this.isFunction(target)) {
				target = {};
			}

			// extend jQuery itself if only one argument is passed
			if (length === i) {
				target = this;
				--i;
			}

			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if ((options = arguments[i]) != null) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep &&
							copy &&
							(this.isPlainObject(copy, true) || (copyIsArray = this.isArray(copy))) &&
							!this.isJavaObject(copy) &&
							!(copy instanceof JSB) &&
							!this.isDate(copy) &&
							!this.isArrayBuffer(copy) &&
							!this.isArrayBufferView(copy) &&
							!this.isInstanceOf(copy, 'JSB.Object') &&
							(!JSB().isClient() || (!(copy instanceof HTMLElement))&&(!(copy == document)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && this.isArray(src) ? src : [];
							} else {
								clone = src && this.isPlainObject(src) ? src : {};
							}

							try {
								// Never move original objects, clone them
								target[name] = this.merge(deep, clone, copy);
							} catch(e){
								// Copy reference to java scope
								target[name] = copy;
								if(!target[name].toString){
									target[name].toString = function(){return '{}'};
								}
							}

							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		},

		_checkBeanReady: function(){
			if(this._ready || this._readyState >= 2){
				return;
			}
			if(this._readyState == 0){
				// class function is not created yet - internal error
				throw new Error('FATAL: Failed to create instance of bean: "'+this.$name+'" due to class function is not created yet');
			} else if(this._readyState == 1){
				var msg = 'ERROR: Failed to create instance of bean: "'+this.$name+'" due to some of its requires has not been initialized:';
				for(var rName in this._requireMap){
					// skip java requires
					var skipPrefixes = ['java:', 'css:', 'script:', 'module:'];
					var needSkip = false;
					for(var i = 0; i < skipPrefixes.length; i++){
						if(rName.toLowerCase().indexOf(skipPrefixes[i]) == 0){
							needSkip = true;
							break;
						}
					}
					if(needSkip){
						continue;
					}
					var rjsb = this.get(rName);
					if(rjsb && rjsb._ready){
						continue;
					}
					if(!rjsb){
						msg += '\r\n\tBean "' + rName + '" is missing';
					} else if(rjsb._readyState == 0){
						msg += '\r\n\tBean "' + rName + '" is incomplete';
					} else if(rjsb._readyState == 1){
						msg += '\r\n\tBean "' + rName + '" is waiting for its requires to be completed';
					} else if(rjsb._readyState == 2){
						msg += '\r\n\tBean "' + rName + '" is waiting for its $bootstrap to be correctly completed';
					} else if(rjsb._readyState == 3){
						msg += '\r\n\tBean "' + rName + '" is waiting for its $constructor to be correctly completed';
					} else {
						msg += '\r\n\tBean "' + rName + '" is incompleted for unknown reqson';
					}
				}
				throw new Error(msg);
			}
		},

		_inheritedClass: function(parent) {
			var ss = this;
			return function() {
				ss._checkBeanReady();
				var self = this;
				var storeSuperCalled = this.$_superCalled;
				// copy all fields into current scope
				if(!this.$_fieldsCopied){
					function _copyFields(targetScope, fieldArr){
						for(var i = 0; i < fieldArr.length; i++){
							var fDesc = fieldArr[i];
							var fName = fDesc.field;
							if(fDesc.type == 'val'){
								targetScope[fName] = fDesc.value;
							} else if(fDesc.type == 'scope'){
								targetScope[fName] = {};
								_copyFields(targetScope[fName], fDesc.scope);
							} else if(fDesc.type == 'array'){
								targetScope[fName] = [];
								_copyFields(targetScope[fName], fDesc.scope);
							}
						}
					}
					if(!this.jsb){
						debugger;
					}
					_copyFields(this, /*this.jsb._fieldsArr*/JSB().fieldArrs[this.jsb.$name]);

					// place sync scopes
					var syncScopes = JSB().syncScopes[this.jsb.$name];
					if(syncScopes){
						this.$_syncScopes = {};
						for(var fName in syncScopes){
							this.$_syncScopes[fName] = {};
						}
					} else {
						this.$_syncScopes = null;
					}

					this.$_fieldsCopied = true;
				}


				// call ctor
				this.$_superCalled = false;

				// call original function
				if(ss._ctor){
					ss._ctor.apply(this, arguments);
				}
				if (!this.$_superCalled) {
					parent.apply(this, arguments);
					this.$_superCalled = true;
				}

				this.$_superCalled = storeSuperCalled;

			};
		},

		_enhanceInherited: function(cls, parent, body) {
			var F = function() {};
			F.prototype = parent.prototype;
			cls.prototype = new F();
			if(body) {
				this.merge(cls.prototype, body);
			}

			cls.prototype.$constructor = cls;
			cls.prototype.$parent = function() {
				return parent;
			};
			cls.$superclass = parent.prototype;
		},


		_simpleClass: function() {
			var ss = this;
			return function() {
				ss._checkBeanReady();
				if (ss._ctor != null && ss._ctor != undefined) {
					ss._ctor.apply(this, arguments);
				}
			};
		},

		_enhanceSimple: function(cls, body){
			var F = function() {};
			F.prototype = body;
			cls.prototype = new F();
			cls.prototype.$constructor = cls;
		},

		create: function(wName, opts, callback){
			var self = this;
			this.lookup(wName, function(f){
				var w = f;
				if(self.isFunction(f)){
					w = new f(opts);
				}
				if(!self.isNull(callback)){
					callback(w);
				}
			});
		},

		createFuture: function(opts){
			return new (this.getClass('JSB.Future'))(opts);
		},

		createRpcResponse: function(val, opts){
			return new (JSB().RpcResponse)(val, opts);
		},

		classTree: function(qName){
			var curGlobe = JSB().getGlobe();
			var path = qName.split('.');
			for(var i = 0; i < path.length; i++ ){
				var part = path[i];
				curGlobe = curGlobe[part];
				if(!curGlobe){
					return null;
				}
			}

			return curGlobe;
		},

		_pushWaiter: function(name, callback, readyState){
			if(!callback){
				return;
			}
			if(this.isNull(readyState)){
				readyState = 4;	// maximal readiness
			}
			// push callback to waiters list
			var locker = this.getLocker();
			if(locker){ locker.lock('JSB_lookup_waiters'); }

			if(this.isNull(this.waiters[name])){
				this.waiters[name] = [];
			}
			var wList = this.waiters[name];
			wList.push({
				waiter: this.$name,
				callback: callback,
				readyState: readyState
			});

			if(locker){ locker.unlock('JSB_lookup_waiters'); }

			return wList.length;
		},

		_matchWaiters: function(readyState){
			if(this.isNull(readyState)){
				readyState = 4;	// maximum readiness
			}
			var execArr = [];

			var locker = this.getLocker();
			if(locker){ locker.lock('JSB_lookup_waiters'); }
			var wList = this.waiters[this.$name];
			if(wList && wList.length > 0){
				var delArr = [];

				for(var c = 0; c < wList.length; c++){
					var wObj = wList[c];
					if(wObj.readyState <= readyState){
						execArr.push(wObj);
						delArr.push(c);
					}
				}

				if(delArr.length > 0){
					for(var i = delArr.length - 1; i >= 0; i--){
						var idx = delArr[i];
						wList.splice(idx, 1);
					}
					if(wList.length === 0){
						delete this.waiters[this.$name];
					}
				}
			}

			if(locker){ locker.unlock('JSB_lookup_waiters'); }

			if(execArr.length === 0){
				return;
			}

			var cls = this.getClass();

			if(this._ready && this.isSingleton()){
				cls = this.getInstance();
			}

			for(var i = 0; i < execArr.length; i++){
				var wObj = execArr[i];
				wObj.callback.call(this, cls);
			}
		},

		_lookupRequire: function(name, callback){
			var self = this;
			if(name.toLowerCase().indexOf('java:') == 0){
				if(this.isClient()){
					throw new Error('Failed to load java require "'+name+'" on client side in bean "'+this.$name+'"');
				}
				var qualifiedName = name.substr(5).trim();
				var scopeStr = 'Packages.' + qualifiedName;
				var curJavaScope = eval(scopeStr);
				if(!curJavaScope){
					throw new Error('Failed to load java require due to missing java object "'+qualifiedName+'"');
				}
/*
				var qNameParts = qualifiedName.split('.');
				var curJavaScope = Packages;
				for(var i = 0; i < qNameParts.length; i++){
					var part = qNameParts[i];
					curJavaScope = curJavaScope[part];
					if(!curJavaScope){
						throw 'Failed to load java require due to missing java object "'+qualifiedName+'"';
					}
				}
*/
				callback.call(self, curJavaScope);
			} else if(name.toLowerCase().indexOf('css:') == 0){
				if(this.isServer()){
					// do nothing with load
					callback.call(self, null);
				} else {
					var fileName = name.substr(4).trim();
					this.loadCss(fileName, function(){
						callback.call(self, null);
					})
				}
			} else if(name.toLowerCase().indexOf('script:') == 0){
				if(this.isServer()){
					// do nothing with load
					callback.call(self, null);
				} else {
					var fileName = name.substr(7).trim();
					this.loadScript(fileName, function(){
						callback.call(self, null);
					});
				}
			} else if(name.toLowerCase().indexOf('module:') == 0){
				if(this.isServer()){
					// do nothing with load
					callback.call(self, null);
				} else {
					var fileName = name.substr(7).trim();
					this.loadScript(fileName, function(){
						callback.call(self, null);
					}, {module:true});
				}
			} else {
				this.lookup(name, function(cls){
					if(self.isNull(cls)){
						throw new Error('Failed to lookup require: "' + name + '", expecting for object but nothing returned');
					}
					var jsb = cls.jsb;
					if(self.isNull(jsb)){
						throw new Error('Failed to lookup require: "' + name + '", jsb is null');
					}
					if(!jsb._ready && jsb.isSingleton()){
						self.lookup(name, callback);
					} else {
						callback.call(self, cls);
					}
				}, {readyState: 1});
			}
		},


		lookup: function(name, callback, opts){
			var self = this;
			var forceUpdate = opts && opts.forceUpdate || false;
			var readyState = opts && opts.readyState || 4;

			if(this.objects[name] && this.objects[name]._readyState >= readyState && !forceUpdate){
				var ctObj = this.objects[name].getClass();
				if(this.objects[name]._ready && this.objects[name].isSingleton()){
					ctObj = this.objects[name].getInstance();
				}

				if(callback){
					callback.call(this, ctObj);
				}
				return;
			} else {
				var queueLength = this._pushWaiter(name, callback, readyState);

				// load object from the server
				if(this.isClient() && (!this.objects[name] || forceUpdate) && queueLength == 1){
					if(!this.initQueue || !this.initQueue[name]){
						if(this.provider){
							if(!this.isNull(this.loadQueue) && !this.isNull(this.loadQueue[name]) && !forceUpdate){
								return;
							}
							this.defer(function(){
								if(self.objects[name] || (self.initQueue && self.initQueue[name]) || (self.loadQueue && self.loadQueue[name])){
									return;
								}
								self.provider.loadObject(name);
								if(!self.loadQueue){
									self.loadQueue = {}
								}
								self.loadQueue[name] = true;
							}, 0);
						} else {
							this.objectsToLoad.push(name);
						}
					}
				}
				if(this.isServer()){
					// check bean is existed
					var repoEntry = this.getRepository().get(name);
					if(!repoEntry){
						throw new Error('Bean "'+name+'" is missing in repository' + (this.$name ? '; required by "' + this.$name + '"' : ''));
					}
				}
			}
		},

		getInstance: function(key){
			if(!key && this.isSingleton()){
				key = this.$name;
			}
			var obj = this.getSessionInstancesScope()[key];
			if(this.isNull(obj)){
				obj = this.getGlobalInstancesScope()[key];
			}
			return obj;
		},

		getInstanceInfo: function(){
			function _buildInstanceMap(scope){
				var typeMap = {};
				for(var i in scope){
				    var jsbName = scope[i].jsb.$name;
				    if(!typeMap[jsbName]){
				        typeMap[jsbName] = 1;
				    } else {
				        typeMap[jsbName]++;
				    }
				}
				var typeArr = [];
				for(var n in typeMap){
					typeArr.push({jsb: n, count: typeMap[n]});
				}
				typeArr.sort(function(a, b){
					return b.count - a.count;
				});

				return typeArr;
			}

			function _count(arr){
				var cnt = 0;
				for(var i = 0; i < arr.length; i++){
					cnt += arr[i].count;
				}

				return cnt;
			}

			var sArr = _buildInstanceMap(this.getSessionInstancesScope());
			var gArr = _buildInstanceMap(this.getGlobalInstancesScope());
			var sCount = _count(sArr);
			var gCount = _count(gArr);
			return {
				total: sCount + gCount,
				session: sCount,
				global: gCount,
				sessionInstances: sArr,
				globalInstances: gArr
			};
		},

		searchInstances: function(patternObj){
			var arr = [];
			// look in singleton scope
			var scopes = [JSB().getGlobalInstancesScope(), JSB().getSessionInstancesScope()];
			for(var s in scopes){
				var scope = scopes[s];
				for(var i in scope){
					var obj = scope[i];
					var fit = true;
					for(var pat in patternObj){
						var patParts = pat.split('.');
						var navigateSuccess = true;
						var curObj = obj;
						for(var k in patParts){
							var part = patParts[k];
							curObj = curObj[part];
							if(JSB().isNull(curObj)){
								navigateSuccess = false;
								break;
							}
						}
						if(patternObj[pat] != curObj){
							fit = false;
							break;
						}
					}
					if(fit){
						arr.push(obj);
					}
				}
			}

			return arr;
		},

		lookupSingleton: function(key, callback){
			var self = this;
			var obj = JSB().getInstance(key);
			if(!JSB().isNull(obj)){
				callback.call(this, obj);
				return;
			}
			// if not loaded yet - try to lookup
			this.lookup(key, function(obj){
				obj = JSB().getInstance(key);
				if(!JSB().isNull(obj)){
					callback.call(self, obj);
				} else {
					JSB().deferUntil(function(){
						callback.call(self, JSB().getInstance(key));
					},function(){
						return !JSB().isNull(JSB().getInstance(key));
					});
				}
			});
		},

		_prepareFieldMap: function(){
			var self = this;
			var curProto = this.getClass().prototype;
			var fieldMap = /*this.fieldMaps[this.$name] = */{};
			var syncScopes = this.syncScopes[this.$name] = {};
			var protoStack = [];

			while(curProto){
				// add to proto stack
				protoStack.push(curProto);
				if(curProto.$constructor && curProto.$constructor.$superclass){
					curProto = curProto.$constructor.$superclass;
				} else {
					break;
				}
			}

			function _translateFields(fromScope, toScope, deep){

				for(var fName in fromScope){
					if(deep === 0 && (fName == 'jso' || fName == 'jsb' || fName == 'client' || fName == 'server')){
						continue;
					}
					// check for exclude
					if(self.isLibraryScopeName(fName)){
						continue;
					}

					if(self.isFunction(fromScope[fName])){
						if(deep == 0){
							continue;
						} else {
							toScope[fName] = {type: 'val', value: fromScope[fName], field: fName};
						}
					} else if(self.isPlainObject(fromScope[fName]) && !self.isJavaObject(fromScope[fName]) && !self.isBean(fromScope[fName], true)){
						if(!toScope[fName]){
							toScope[fName] = {
								type: 'scope',
								field: fName,
								scope: {}
							};
						}
						_translateFields(fromScope[fName], toScope[fName].scope, deep + 1);
					} else if(self.isArray(fromScope[fName])){
						if(!toScope[fName]){
							toScope[fName] = {
								type: 'array',
								field: fName,
								scope: []
							};
						}
						_translateFields(fromScope[fName], toScope[fName].scope, deep + 1);
					} else {
						toScope[fName] = {type: 'val', value: fromScope[fName], field: fName};
					}
				}
			}

			function _collectSyncScopes(curJsb, scope){
				// collect sync scopes
				var commonScope = curJsb.$common;
				if(!commonScope){
					return;
				}
				var kfs = {
					'$constructor': true,
					'$bootstrap': true,
					'$singleton': true,
					'$globalize': true,
					'$fixedId': true,
					'$disableRpcInstance': true,
					'$sync': true
				};

				for(var fieldName in commonScope){
					// check fieldName is non-function
					if(kfs[fieldName]){
						continue;
					}
					if(JSB().isFunction(commonScope[fieldName])){
						continue;
					}
					if(!scope[fieldName]){
						scope[fieldName] = {};
					}
				}
			}

			// prepare field map
			var acceptSync = this.getSync();
			while(protoStack.length > 0){
				curProto = protoStack.pop();
				_translateFields(curProto, fieldMap, 0);
				if(acceptSync){
					_collectSyncScopes(curProto.jsb, syncScopes);
				}
			}

			if(Object.keys(syncScopes).length === 0){
				this.syncScopes[this.$name] = null;
			}

			// prepare field arr
			var fieldArr = this.fieldArrs[this.$name] = [];

			function _convertMapsToArrs(fieldMap, arrMap){
				for(var fName in fieldMap){
					var fDesc = fieldMap[fName];
					if(fDesc.type == 'val'){
						arrMap.push(fDesc);
					} else if(fDesc.type == 'scope' || fDesc.type == 'array'){
						var arrScope = {
							type: fDesc.type,
							field: fDesc.field,
							scope: []
						};
						_convertMapsToArrs(fDesc.scope, arrScope.scope);
						arrMap.push(arrScope);
					}
				}
			}

			_convertMapsToArrs(fieldMap, fieldArr);
		},

		deploy: function(qname, obj, overwrite, scope){
			if(!qname || qname.trim().length == 0){
				return;
			}

			var locker = this.getLocker();
			if(locker){ locker.lock('JSB_deploy'); }

			// expose to class tree
			var path = qname.split('.');
			var curScope = scope || this.getGlobe();
			var name = path[path.length - 1];
			for(var i = 0; i < path.length - 1; i++){
				var part = path[i];
				if(!curScope[part]){
					curScope[part] = {};
				}
				curScope = curScope[part];
			}

			if(curScope[name]){
				// update and copy old fields
				var oldObj = curScope[name];
				curScope[name] = obj;
				if(!overwrite){
					for(var f in oldObj){
						curScope[name][f] = oldObj[f];
					}
				}

			} else {
				curScope[name] = obj;
			}

			if(locker){ locker.unlock('JSB_deploy'); }
		},


		_proceedBootstrapStage: function(){
			var self = this;
			// execute bootstrap and keep initialization
			function afterBoostrap1(){
				if(self.isFunction(self._entryBootstrap)){
					function afterBoostrap2(){
						self._proceedSingletonStage();
					}
					function ebcall(){
						var bWait = self._entryBootstrap.call(self, afterBoostrap2);
						if(!bWait){
							afterBoostrap2();
						}
					}
					if(self.isSystem()){
						ebcall();
					} else {
						JSB().defer(function(){
							ebcall();
						});
					}

				} else {
					self._proceedSingletonStage();
				}
			}

			if(this._commonBootstrap){
				function bcall(){
					var bWait = self._commonBootstrap.call(self, afterBoostrap1);
					if(!bWait){
						afterBoostrap1();
					}
				}
				if(self.isSystem()){
					bcall();
				} else {
					JSB().defer(function(){
						bcall();
					});
				}
			} else {
				afterBoostrap1();
			}
		},


		_proceedSingletonStage: function(){
			var self = this;
			self._readyState = 3;
			self._matchWaiters(3);

			function keepFinalize(){
				self._readyState = 4;
				self._ready = true;

				self._runOnLoadCallbacks();
				self._matchWaiters();
			}

			self._waitRequires(3, function(){
				var entry = self.currentSection();
				if(entry && self.isSingleton()){
					function ccall(){
						var f = self._cls;
						var o = new f();

						var globalize = entry.$globalize || self.$globalize;
						if(globalize){
							if(self.isString(globalize)){
								self.deploy(globalize, o, true);
							} else {
								self.deploy(self.$name, o);
							}
						}
	/*
						// run sync if syncScopes
						if(o.syncScopes){
							o.doSync();
						}
	*/
/*
						if(self.isClient() && !self.isNull(o.$_syncScopes) && self.getSync()){
							if(o.isSynchronized()){
								keepFinalize();
							} else {
								// wait until object is synchronized
								o.ensureSynchronized(function(){
									keepFinalize();
								});
							}
						} else {
							keepFinalize();
						}
*/
						keepFinalize();
					}
					ccall();
/*
					if(self.isSystem()){
						ccall();
					} else {
						JSB().defer(function(){
							ccall();
						});
					}
*/
				} else {
					keepFinalize();
				}

			});

		},

		_runOnLoadCallbacks: function(){
			if(this.isNull(this.onLoadCallbacks)){
				return;
			}
			for(var i in this.onLoadCallbacks){
				this.onLoadCallbacks[i].call(this);
			}
		},

		onLoad: function(callback){
			if(this.isNull(this.onLoadCallbacks)){
				this.onLoadCallbacks = [];
			}
			this.onLoadCallbacks.push(callback);
		},

		getClass: function(jsb){
			if(!jsb){
				jsb = this;
			} else if(JSB.isString(jsb)){
				jsb = JSB.get(jsb);
			}
			return jsb._cls;
		},

		setProvider: function(p){
			if(!p){
				return;
			}
			this.provider = p;
			if(this.objectsToLoad.length > 0){
				for(var i in this.objectsToLoad){
					var objName = this.objectsToLoad[i];
					this.provider.loadObject(objName);
				}
				this.objectsToLoad = [];
			}
		},

		getProvider: function(){
			return this.provider;
		},

		setClusterProvider: function(cp){
			if(!JSB.isServer()){
				throw new Error('Failed to set cluster provider in client side');
			}
			if(!cp){
				return;
			}
			this.clusterProvider = cp;
		},

		getClusterProvider: function(){
			if(!JSB.isServer()){
				throw new Error('Failed to use cluster provider in client side');
			}
			return this.clusterProvider;
		},

		setRepository: function(repo){
			this.repository = repo;
		},

		getRepository: function(){
			return this.repository;
		},

		setMessageBus: function(bus){
			this.messageBus = bus;
		},

		getMessageBus: function(){
			return this.messageBus;
		},

		setLogger: function(l){
			this.logger = l;
		},

		getLogger: function(){
			return this.logger;
		},

		setLocker: function(l){
			this.locker = l;
		},

		getLocker: function(){
			return this.locker;
		},

		setThreadLocal: function(tls){
			this.threadLocal = tls;
		},

		getThreadLocal: function(){
			return this.threadLocal;
		},

		getSystemProfiler: function(){
			var self = this;
			if(this.systemProfiler){
				return this.systemProfiler;
			}
			return null;
		},

		setSystemProfiler: function(prof){
			this.systemProfiler = prof;
		},

		injectServerVersion: function(url){
			if(!this.getServerVersion()){
				return url;
			}
			if(url.indexOf('?') == -1){
				url += '?';
			} else {
				url += '&';
			}
			url += 'v=' + this.getServerVersion();

			return url;
		},

		loadScript: function(curl, callback, opts){
			var self = this;

			var scriptArr = [];
			if(JSB().isArray(curl)){
				scriptArr = curl;
			} else {
				scriptArr.push(curl);
			}
			for(var i = 0; i < scriptArr.length; i++){
				if(this instanceof JSB && scriptArr[i] && scriptArr[i][0] != '/' && scriptArr[i][0] != '\\'){
					scriptArr[i] = this.getBasePath() + scriptArr[i];
				} else if(scriptArr[i] && (scriptArr[i][0] == '/' || scriptArr[i][0] == '\\')){
					scriptArr[i] = scriptArr[i].substr(1);
				}
				scriptArr[i] = self.injectServerVersion(scriptArr[i]);
			}


			function loadOneScript(url, callback){
				if(self.resourceLoaded[url]){
					if(callback && JSB().isFunction(callback)){
						callback.call(self);
					}
					return;
				}

				if(self.resourceScheduled[url]){
					if(callback && JSB().isFunction(callback)){
						self.resourceScheduled[url].push(callback);
					}
					return;
				} else {
					self.resourceScheduled[url] = self.resourceScheduled[url] || [];
					self.resourceScheduled[url].push(callback);
				}

				var _s = document.createElement("script");
				if(opts && opts.module){
					_s.type = "module";
				} else {
					_s.type = "text/javascript";
				}
			    if(url.indexOf('http') == -1){
			        var serverBase = self.getProvider().getServerBase();
                    if(serverBase
                        && serverBase.length > 0
                        && (serverBase[serverBase.length - 1] == '/' || serverBase[serverBase.length - 1] == '\\')
                        && url
                        && url.length > 0
                        && (url[0] == '/' || url[0] == '\\')){

                        url = url.substr(1);
                    }
			    	_s.src = serverBase + url;
			    } else {
			    	_s.src = url;
			    }
			    var _oHead = document.getElementsByTagName('HEAD').item(0);

				// append scriptlet code that calls after main script complete its execution
				_s.onload = function(){
					self.resourceLoaded[url] = true;
					if(!self.resourceScheduled[url] || self.resourceScheduled[url].length == 0){
						return;
					}

					var syncId = JSB().generateUid();
					if(self.isNull(JSB().loadScriptScope)){
						JSB().loadScriptScope = {};
					}

					JSB().loadScriptScope[syncId] = function(){
						delete JSB().loadScriptScope[syncId];
						_oHead.removeChild( _ss);

						for(var cit in self.resourceScheduled[url]){
							var c = self.resourceScheduled[url][cit];
							if(!c || !JSB().isFunction(c)){
								continue;
							}
							c.call(self);
						}
						delete self.resourceScheduled[url];
					}
					var _ss = document.createElement("script");
				    _ss.type = 'text/javascript';
				    _ss.text = 'JSB().loadScriptScope["' + syncId + '"]();';
				    _oHead.appendChild( _ss);

				};
			    _oHead.appendChild( _s);
			}


			var checkArr = JSB().clone(scriptArr);

			if(opts && opts.chain){
				function loadNext(){
					if(checkArr.length > 0){
						loadOneScript(checkArr[0], function(){
							checkArr.splice(0, 1);
							loadNext();
						});
					} else {
						if(callback){
							callback.call(self);
						}
					}
				}
				loadNext();
			} else {
				for(var i in scriptArr){
					(function(url){
						loadOneScript(url, function(){
							for(var j = 0; j < checkArr.length; j++ ){
								if(checkArr[j] == url){
									checkArr.splice(j, 1);
									break;
								}
							}
							if(checkArr.length == 0){
								if(callback){
									callback.call(self);
								}
							}
						});
					})(scriptArr[i]);
				}
			}

		},

		loadCss: function(url, callback){
			if(this instanceof JSB){
				url = this.getBasePath() + url;
			}
			url = this.injectServerVersion(url);
			var oUrl = url;

			if(this.resourceLoaded[oUrl]){
				if(callback && JSB().isFunction(callback)){
					callback.call(this);
				}
				return;
			}

			if(this.resourceScheduled[oUrl]){
				if(callback && JSB().isFunction(callback)){
					this.resourceScheduled[oUrl].push(callback);
				}
				return;
			} else {
				this.resourceScheduled[oUrl] = this.resourceScheduled[oUrl] || [];
				if(callback && JSB().isFunction(callback)){
					this.resourceScheduled[oUrl].push(callback);
				}
			}

			var self = this;

			var _l = document.createElement("link");
			_l.rel = "stylesheet";
		    if(url.indexOf('http') == -1){
		        var serverBase = this.getProvider().getServerBase();
		        if(serverBase
		            && serverBase.length > 0
		            && (serverBase[serverBase.length - 1] == '/' || serverBase[serverBase.length - 1] == '\\')
		            && url
		            && url.length > 0
		            && (url[0] == '/' || url[0] == '\\')){

                    url = url.substr(1);
                }
		    	_l.href = serverBase + url;
		    } else {
		    	_l.href = url;
		    }
			_l.type = "text/css";

			_l.onload = function(){
				self.resourceLoaded[oUrl] = true;
				if(self.resourceScheduled[oUrl]){
					var shArr = self.resourceScheduled[oUrl];
					delete self.resourceScheduled[oUrl];
					for(var i = 0; i < shArr.length; i++){
						shArr[i].call(self);
					}
				}
			}

		    var _oHead = document.getElementsByTagName('HEAD').item(0);
		    _oHead.appendChild( _l);

		},

		waitForObjectExist: function(funcName, callback){
			var obj = undefined;
			try {
				obj = typeof(eval(funcName));
			} catch(err) {
				obj = undefined;
			}
			if(obj === 'object' || obj === 'function' ){
				callback();
			} else {
				JSB().Window.setTimeout(function(){
					JSB().waitForObjectExist(funcName, callback);
				}, 50);
			}
		},

		generateUid: function(bytes) {
		    function S4() {
		        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		    }

		    var res = '';
		    if(bytes == null || bytes == undefined){
		    	bytes = 16;
		    }
		    bytes /= 2;
		    for(var i = 0; i < bytes; i++ ){
		    	res += S4();
		    }

		    return res;
		},

		stringifyOrdered: function(obj){
		    var orderedStringify = function(o, fn) {
                var props = [];
                var res = '{';
                for(var i in o) {
                    props.push(i);
                }
                props = props.sort(fn);

                for(var i = 0; i < props.length; i++) {
                    var val = o[props[i]];
                    if(JSB().isPlainObject(val)) {
                        val = orderedStringify(val, fn);
                    } else if(JSB().isArray(val)) {
                        val = arrayStringify(val, fn);
            		} else {
            			val = JSON.stringify(val);
            		}
                    res += '"'+props[i]+'":'+ val +',';
                }

                return res.substring(res, res.lastIndexOf(','))+'}';
            };

            //orderedStringify for array containing objects
            var arrayStringify = function(a, fn) {
                var res = '[';
                for(var i = 0; i < a.length; i++) {
                    var val = a[i];
                    if(JSB().isPlainObject(val)) {
                        val = orderedStringify(val, fn);
                    } else if(JSB().isArray(val)) {
                        val = arrayStringify(val, fn);
                    } else {
            			val = JSON.stringify(val);
            		}

                    res += ''+ val + ',';
                }

                return res.substring(res, res.lastIndexOf(','))+']';
            };

            return orderedStringify(obj);
		},

		stringifyError: function(error, message) {
		   	if (this.isNull(error) && this.isNull(message)) return null;
           	if (this.isNull(error)) return message;

           	try {
           		var body;
           		if (this.isString(error)) body = error;
           		if (!body) body = error.message && (error.message + '\r\n' + (error.stackTrace||error.stacktrace||error.stack||'NO STACK')) || error;
           		if (message) {
           			return message + '\r\n' + body;
           		}
           		return body;
           	} catch(e){
           		Log.error('Error stringify error ', e);
           	}
		},

		stackTrace: function(){
			try {___JSdhaKJH.toString()} catch(e) {
				return  e.stack;
			}
		},

		functionName: function(offset){
			var offset = offset||0;
			var op = '<anonymous>';
			try {___JSdhaKJH.toString()} catch(e) {
				//Log.debug(e.stack);
				var line = e.stack.split('\n')[1+offset];
				var m = line.match(/\((.*)\)/);
				if (m && m.length>1 && m[1]) {
					op = m[1]
				}
			}
			return op;
		},

		defer: function( deferProc, timeout, key, noProlong ){
			var self = this;
			var toProc = function(){
				if(key && self.deferTimeoutMap[key]){
					var locker = self.getLocker();
					if(locker){
						locker.lock('__deferTimeoutMap');
					}
					try {
						if(self.deferTimeoutMap[key]){
							delete self.deferTimeoutMap[key];
						}
					} finally {					
						if(locker){
							locker.unlock('__deferTimeoutMap');
						}
					}
				}
				deferProc.call(self);
			}
			
			if(!this.isNumber(timeout)){
				timeout = 100;
			}
			if(key){
				var locker = self.getLocker();
				if(locker){
					locker.lock('__deferTimeoutMap');
				}
				try {
					if(noProlong){
						if(!this.deferTimeoutMap[key]){
							this.deferTimeoutMap[key] = JSB().Window.setTimeout(toProc, timeout);
						}
					} else {
						if(this.deferTimeoutMap[key]){
							JSB().Window.clearTimeout(this.deferTimeoutMap[key]);
						}
						this.deferTimeoutMap[key] = JSB().Window.setTimeout(toProc, timeout);
					}
				} finally {
					if(locker){
						locker.unlock('__deferTimeoutMap');
					}
				}
			}else {
				JSB().Window.setTimeout(toProc, timeout);
			}
		},

		interval: function(proc, interval, key){
			var self = this;
			if(!this.isNumber(interval)){
				throw new Error('Missing interval argument in JSB.interval');
			}
			var toProc = function(){
				if(key && self.intervalMap[key]){
					var locker = self.getLocker();
					if(locker){
						locker.lock('__intervalMap');
					}
					if(self.intervalMap[key]){
						delete self.intervalMap[key];
					}
					if(locker){
						locker.unlock('__intervalMap');
					}
				}
				proc.call(self);
			};
			if(key){
				var locker = self.getLocker();
				if(locker){
					locker.lock('__intervalMap');
				}
				if(this.intervalMap[key]){
					JSB().Window.clearInterval(this.intervalMap[key]);
				}
				this.intervalMap[key] = JSB().Window.setInterval(toProc, interval);
				if(locker){
					locker.unlock('__intervalMap');
				}
			} else {
				JSB().Window.setInterval(toProc, interval);
			}
		},

		deferUntil: function(deferProc, untilProc, interval, silent, key){
			var self = this;
			if(!this.isNumber(interval)){
				interval = 100;
			}
			var toProc = function(){
				var untilRes = false;
				
				if(key && self.deferTimeoutMap[key]){
					var locker = self.getLocker();
					if(locker){
						locker.lock('__deferTimeoutMap');
					}
					try {
						if(self.deferTimeoutMap[key]){
							delete self.deferTimeoutMap[key];
						}
					} finally {
						if(locker){
							locker.unlock('__deferTimeoutMap');
						}
					}
				}
				try {
					untilRes = untilProc();
				} catch(e){
					untilRes = false;
					if (!silent) throw e;
				} finally {
					if(untilRes){
						deferProc();
					} else {
						if(key){
							var locker = self.getLocker();
							if(locker){
								locker.lock('__deferTimeoutMap');
							}
							try {
								self.deferTimeoutMap[key] = JSB().Window.setTimeout(toProc, interval);
							} finally {
								if(locker){
									locker.unlock('__deferTimeoutMap');
								}
							}
						} else {
							JSB().Window.setTimeout(toProc, interval);
						}
					}
				}
			}
			
			if(key){
				var locker = self.getLocker();
				if(locker){
					locker.lock('__deferTimeoutMap');
				}
				try {
					if(self.deferTimeoutMap[key]){
						JSB().Window.clearTimeout(self.deferTimeoutMap[key]);
					}
					self.deferTimeoutMap[key] = JSB().Window.setTimeout(toProc, interval);
				} finally {
					if(locker){
						locker.unlock('__deferTimeoutMap');
					}
				}
			} else {
				JSB().Window.setTimeout(toProc, interval);
			}
		},

		cancelDefer: function(key){
			if(key && this.deferTimeoutMap[key]){
				var locker = this.getLocker();
				if(locker){
					locker.lock('__deferTimeoutMap');
				}
				try {
					if(this.deferTimeoutMap[key]){
						JSB().Window.clearTimeout(this.deferTimeoutMap[key]);
						delete this.deferTimeoutMap[key];
					}
				} finally {
					if(locker){
						locker.unlock('__deferTimeoutMap');
					}
				}
			}
		},

		cancelInterval: function(key){
			if(key && this.intervalMap[key]){
				var locker = this.getLocker();
				if(locker){
					locker.lock('__intervalMap');
				}
				if(this.intervalMap[key]){
					JSB().Window.clearInterval(this.intervalMap[key]);
					delete this.intervalMap[key];
				}
				if(locker){
					locker.unlock('__intervalMap');
				}
			}
		},

		fork: function(param, proc, opts){
			var self = this;
			var count = 1;
			var locker = this.getLocker();
			if(param){
				if(this.isArray(param)){
					count = param.length;
				} else if(this.isPlainObject(param)){
					param = [param];
				} else if(this.isNumber(param)){
					count = param;
					param = null;
				}
			}
			if(this.isNull(this.forkJoinHandles)){
				locker.lock('_jsb_fork_allocHandles');
				if(this.isNull(this.forkJoinHandles)){
					this.forkJoinHandles = {};
				}
				locker.unlock('_jsb_fork_allocHandles');
			}
			// create handle
			var h = this.generateUid();
			
			var forkFunc = function(idx){
				var res = null;
				try {
					var p = null;
					if(param){
						p = param[idx];
					}
					res = proc.call(self, p, function(res){
						locker.lock('_jsb_fork_' + h);
						self.forkJoinHandles[h].items[idx] = res;
						self.forkJoinHandles[h].ready++;
						self.forkJoinHandles[h].lastForkIdx = idx;
						locker.unlock('_jsb_fork_' + h);
						self._checkJoinCallback(h);
					});

				} catch(e){
					res = e;
					JSB.getLogger().error(e);
				}
				if(res !== undefined){
					locker.lock('_jsb_fork_' + h);
					self.forkJoinHandles[h].items[idx] = res;
					self.forkJoinHandles[h].ready++;
					self.forkJoinHandles[h].lastForkIdx = idx;
					locker.unlock('_jsb_fork_' + h);
					self._checkJoinCallback(h);
				}
			}
			
			this.forkJoinHandles[h] = {
				count: count,
				ready: 0,
				items: [],
				callback: null,
				forkFunc: forkFunc,
				opts:opts,
				lastForkIdx:null
			};
			
			if(opts && opts.consistently){
				if(count > 0){
					forkFunc(0);	
				}
			} else {
				for(var i = 0; i < count; i++ ){
					(function(idx){
						if(opts && opts.singleThreaded){
							forkFunc(idx);
						} else {
							JSB().defer(function(){
								forkFunc(idx);	
							}, 0);
						}
					})(i);
				}
			}

			return h;
		},

		join: function(forkHandle, callback, opts){
			if(callback){
				this.forkJoinHandles[forkHandle].callback = callback;
				this._checkJoinCallback(forkHandle);
			} else {
				throw new Error('JSB.join: missing callback argument');
			}
		},

		_checkJoinCallback: function(forkHandle){
			var locker = this.getLocker();
			if(this.forkJoinHandles[forkHandle] && this.forkJoinHandles[forkHandle].callback){
				if(this.forkJoinHandles[forkHandle].ready == this.forkJoinHandles[forkHandle].count){
					this.forkJoinHandles[forkHandle].callback.call(this, this.forkJoinHandles[forkHandle].items);
					// remove handle
					locker.clearLock('_jsb_fork_' + forkHandle);
					delete this.forkJoinHandles[forkHandle];
				} else if(this.forkJoinHandles[forkHandle].opts && this.forkJoinHandles[forkHandle].opts.consistently){
					this.forkJoinHandles[forkHandle].forkFunc(this.forkJoinHandles[forkHandle].lastForkIdx+1);
				}
			}
		},

		chain: function(){
			var self = this;
			var procArr = [];
			var opts = null;
			var params = null;
			if(arguments.length < 3){
				throw new Error('JSB.chain: wrong argument passed');
			}
			for(var i = 0; i < arguments.length; i++){
				if(JSB.isFunction(arguments[i])){
					procArr.push(arguments[i]);
				} else if(JSB.isObject(arguments[i])){
					opts = arguments[i];
				} else if(JSB.isArray(arguments[i])){
					params = arguments[i];
				}
			}
			if(procArr.length < 2){
				throw new Error('JSB.chain: no chain callbacks passed');
			}
			var scope = {curIdx: 0};

			function generateForkJoinTask(pObj){
				if(scope.curIdx == procArr.length){
					return;
				}
				var forkProc = procArr[scope.curIdx++];
				if((scope.curIdx & 1) === 0){
					var nObj = forkProc.call(self, pObj, function(nObj){
						generateForkJoinTask(nObj);
					});
					if(nObj !== undefined){
						generateForkJoinTask(nObj);
					}
				} else {
					self.join(self.fork(pObj, forkProc, opts), generateForkJoinTask, opts);
				}
			}

			generateForkJoinTask(params);
		},

		unwindComplexObjects: function(res, bSkip){
			var self = this;
			var reverseBindMap = this.getReverseBindMap();
			var isServer = this.isServer();
			var dict = {};
			var path = [];
			function _unwindComplexObjects(res){
				if(res == null || res == undefined){
					return res;
				}
				var tof = typeof(res);
				if(tof === 'number' || tof === 'boolean'){
					return res;
				}
				var rType = Object.prototype.toString.call(res);
				if(rType === '[object String]'){
					return res;
				}
				if(rType === "[object ArrayBuffer]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'ArrayBuffer',
							__data: JSB().Base64.encode(res)
						}
					};
					return {};
				}
				if(rType === "[object Int8Array]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Int8Array',
							__data: JSB().Base64.encode(res.buffer)
						}
					};
					return {};
				}
				if(rType === "[object Uint8Array]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Uint8Array',
							__data: JSB().Base64.encode(res.buffer)
						}
					};
					return {};
				}
				if(rType === "[object Uint8ClampedArray]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Uint8ClampedArray',
							__data: JSB().Base64.encode(res.buffer)
						}
					};
					return {};
				}
				if(rType === "[object Int16Array]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Int16Array',
							__data: JSB().Base64.encode(res.buffer)
						}
					};
					return {};
				}
				if(rType === "[object Uint16Array]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Uint16Array',
							__data: JSB().Base64.encode(res.buffer)
						}
					};
					return {};
				}
				if(rType === "[object Int32Array]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Int32Array',
							__data: JSB().Base64.encode(res.buffer)
						}
					};
					return {};
				}
				if(rType === "[object Uint32Array]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Uint32Array',
							__data: JSB().Base64.encode(res.buffer)
						}
					};
					return {};
				}
				if(rType === "[object Float32Array]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Float32Array',
							__data: JSB().Base64.encode(res.buffer)
						}
					};
					return {};
				}
				if(rType === "[object Float64Array]"){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Float64Array',
							__data: JSB().Base64.encode(res.buffer)
						}
					};
					return {};
				}
				if(rType === '[object Date]'){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Date',
							__data: res.getTime()
						}
					};
					return {};
				}
				if(rType === '[object Function]'){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Function',
							__data: res.toString()
						}
					};
					return {};
				}
				if(rType === '[object Error]'){
					dict[JSB.generateUid()] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'Error',
							__data: {
								message: res.message,
								fileName: res.fileName,
								lineNumber: res.lineNumber
							}
						}
					};
					return {};
				}
				if(rType === "[object Array]"){
					// parse array
					var nobj = [];
					for(var f = 0; f < res.length; f++){
						path.push(f);
						nobj[f] = _unwindComplexObjects(res[f]);
						path.pop();
					}
					return nobj;
				}
				if(rType === "[object File]"){
					var fid = JSB.generateUid();
					dict[fid] = {
						p: [JSB.clone(path)],
						d: {
							__type: 'File',
							__data: res,
							__id: fid
						}
					};
					return {};
				}
				if(JSB().isBean(res)){
					// encode jsb object
					var bId = res.getId();
					if(isServer){
						bId = !self.isNull(reverseBindMap) && !self.isNull(reverseBindMap[res.getId()]) && Object.keys(reverseBindMap[res.getId()]).length > 0 ? Object.keys(reverseBindMap[res.getId()])[0] : res.getId();
					}
					var dEntry = dict[bId];
					if(!dEntry){
						dEntry = dict[bId] = {
							p: [],
							d: {
								__type: 'Bean',
								__jsb: res.getJsb().$name,
								__id: bId
							}
						}
					}
					dEntry.p.push(JSB.clone(path));
					return {};
				}
				if(JSB.isObject(res)){
					// parse json object
					var nobj = {};
					for(var f in res){
						path.push(f);
						nobj[f] = _unwindComplexObjects(res[f]);
						path.pop();
					}
					return nobj;
				}
				return {};
			}

			// prepare response
			var dt = bSkip ? res:_unwindComplexObjects(res);
			var dictVals = [];
			if(!bSkip){
				for(var dk in dict){
					dictVals.push(dict[dk]);
				}
			}

			return {__dt:dt, __di:dictVals};
		},

		injectComplexObjects: function(res, callback, opts){
			var self = this;
			if(!res || !JSB.isArray(res.__di)){
				// didn't use unwind before
				if(callback){
					callback(res);
				}
				return res;
			}
			var obj = res.__dt;

			if(res.__di.length == 0){
				if(callback){
					callback(obj);
				}
				return obj;
			} else {
				JSB.chain(res.__di, function(complexDesc, callback){
					var res = complexDesc.d;
					if(res.__type && res.__type == 'Bean' && self.isString(res.__jsb) && self.isString(res.__id)){
						// this is a server object reference
						self.constructInstanceFromRemote(res.__jsb, res.__id, function(fObj){
							if(callback){
								callback(fObj);
							}
						}, opts);
					} else if(res.__type && res.__type == 'File') {
						if(callback && JSB().isServer()){
							JSB().getProvider().ensureUpload(res.__id, function(stream){
/*
								var StreamClass = JSB().get('JSB.IO.Stream').getClass();
								callback(new StreamClass(javaStream));
*/
								callback(stream);
							})
						}
					} else if(res.__type && res.__type == 'ArrayBuffer'){
						if(callback){
							callback(JSB().Base64.decode(res.__data));
						}
					} else if(res.__type && res.__type == 'Int8Array'){
						if(callback){
							callback(new Int8Array(JSB().Base64.decode(res.__data)));
						}
					} else if(res.__type && res.__type == 'Uint8Array'){
						if(callback){
							callback(new Uint8Array(JSB().Base64.decode(res.__data)));
						}
					} else if(res.__type && res.__type == 'Uint8ClampedArray'){
						if(callback){
							callback(new Uint8ClampedArray(JSB().Base64.decode(res.__data)));
						}
					} else if(res.__type && res.__type == 'Int16Array'){
						if(callback){
							callback(new Int16Array(JSB().Base64.decode(res.__data)));
						}
					} else if(res.__type && res.__type == 'Uint16Array'){
						if(callback){
							callback(new Uint16Array(JSB().Base64.decode(res.__data)));
						}
					} else if(res.__type && res.__type == 'Int32Array'){
						if(callback){
							callback(new Int32Array(JSB().Base64.decode(res.__data)));
						}
					} else if(res.__type && res.__type == 'Uint32Array'){
						if(callback){
							callback(new Uint32Array(JSB().Base64.decode(res.__data)));
						}
					} else if(res.__type && res.__type == 'Float32Array'){
						if(callback){
							callback(new Float32Array(JSB().Base64.decode(res.__data)));
						}
					} else if(res.__type && res.__type == 'Float64Array'){
						if(callback){
							callback(new Float64Array(JSB().Base64.decode(res.__data)));
						}
					} else if(res.__type && res.__type == 'Date'){
						if(callback){
							callback(new Date(res.__data));
						}
					} else if(res.__type && res.__type == 'Function'){
						if(callback){
							callback(eval('(' + res.__data + ')'));
						}
					} else if(res.__type && res.__type == 'Error'){
						if(callback){
							callback(new Error(res.__data.message, res.__data.fileName, res.__data.lineNumber));
						}
					} else {
						throw new Error('Unknown ComplexObject type');
					}
				}, function(objectArr){
					for(var i = 0; i < res.__di.length; i++){
						var cDescPathArr = res.__di[i].p;
						var iObj = objectArr[i];
						for(var k = 0; k < cDescPathArr.length; k++){
							// inject by path
							var cDescPath = cDescPathArr[k];
							if(cDescPath.length == 0){
								if(callback){
									callback(iObj);
									return;
								}
							} else {
								var curObj = obj;
								for(var j = 0; j < cDescPath.length - 1; j++){
									curObj = curObj[cDescPath[j]];
								}
								curObj[cDescPath[cDescPath.length - 1]] = iObj;
							}
						}
					}
					if(callback){
						callback(obj);
					}
				}, {
					singleThreaded: true
				});
			}
			return obj;
		},

		getBindMap: function(){
			if(this.isClient()){
				return;
			}
			var c = '_jsb_clientServerBindMap_' + this.getCurrentSession();
			var globe = this.getGlobe();
			if(this.isNull(globe[c])){
				globe[c] = {};
			}
			return globe[c];
		},

		getReverseBindMap: function(){
			if(this.isClient()){
				return;
			}
			var c = '_jsb_clientServerReverseBindMap_' + this.getCurrentSession();
			var globe = this.getGlobe();
			if(this.isNull(globe[c])){
				globe[c] = {};
			}
			return globe[c];
		},

		constructServerInstanceFromClientId: function(jsoName, instanceId){
			if(JSB().isClient()){
				return;
			}
			var locker = null;
			// lookup for associations
			var serverInstanceId = null;

			var bindMapScope = JSB().getBindMap();
			var reverseBindMapScope = JSB().getReverseBindMap();

			var serverInstance = null;
			if(!JSB().isNull(bindMapScope[instanceId])){
				serverInstanceId = bindMapScope[instanceId];
				serverInstance = JSB().getInstance(serverInstanceId);
/*				if(JSB().isNull(serverInstance)) {
					delete bindMapScope[instanceId];
				}*/
			}
			if(JSB().isNull(serverInstance)){
				try {
					locker = JSB().getLocker();
					locker.lock('rpcLock');
					if(!JSB().isNull(bindMapScope[instanceId])){
						serverInstanceId = bindMapScope[instanceId];
						serverInstance = JSB().getInstance(serverInstanceId);
						if(JSB().isNull(serverInstance)) {
							delete bindMapScope[instanceId];
						}
					}

					if(JSB().isNull(serverInstance)){
						var bNeedSync = false;
						var jso = JSB().get(jsoName);
						if(!jso){
							throw new Error('Unable to find bean: "' + jsoName + '". It probably not registered yet');
						}
						if(jso.isSingleton()){
							serverInstance = JSB().getInstance(jsoName);
						} else {
							serverInstance = JSB().getInstance(instanceId);
						}

						function updateBindMaps(id, sid){
							bindMapScope[id] = sid;
							if(!reverseBindMapScope[sid]){
								reverseBindMapScope[sid] = {};
							}
							reverseBindMapScope[sid][id] = true;
						}

						if(JSB().isNull(serverInstance)){

							// check for rpc instance creation permission
							if(jso.getKeywordOption('$disableRpcInstance')){
								JSB().getLogger().warn('Unable to create new instance from RPC call for jsb: "' + jsoName + '('+instanceId+')" due option "disableRpcInstance" set')
								return null;
							}

							var f = jso.getClass();
							// create server-side instance with client-side id

							if(jso.getKeywordOption('$fixedId')){
								JSB().getThreadLocal().put('_jsbRegisterCallback', function(){
									// use this to access current object
									this.id = instanceId;
									updateBindMaps(instanceId, instanceId);
								});
								serverInstance = new f();
								JSB().getThreadLocal().clear('_jsbRegisterCallback');
							} else {
								JSB().getThreadLocal().put('_jsbRegisterCallback', function(){
									updateBindMaps(instanceId, this.id);
								});
								serverInstance = new f();
								JSB().getThreadLocal().clear('_jsbRegisterCallback');
							}
							bNeedSync = true;
						} else {
							updateBindMaps(instanceId, serverInstance.getId());
						}

						if(bNeedSync){
							serverInstance.doSync();
						}
					}
				} finally {
					if(locker){
						locker.unlock('rpcLock');
					}
				}
			}
			return serverInstance;

		},

		constructServerInstanceFromServerId: function(jsbName, instanceId){
			if(JSB().isClient()){
				return;
			}
			var locker = null;
			serverInstance = JSB().getInstance(instanceId);

			if(JSB().isNull(serverInstance)){
				try {
					locker = JSB().getLocker();
					locker.lock('rpcServerLock');
					serverInstance = JSB().getInstance(instanceId);

					if(JSB().isNull(serverInstance)){
						var bNeedSync = false;
						var jsb = JSB().get(jsbName);
						if(!jsb){
							throw new Error('Unable to find bean: "' + jsbName + '". It probably not registered yet');
						}
						if(jsb.isSingleton()){
							serverInstance = JSB().getInstance(jsbName);
						} else {
							serverInstance = JSB().getInstance(instanceId);
						}

						if(JSB().isNull(serverInstance)){
/*
							// check for rpc instance creation permission
							if(jsb.getKeywordOption('$disableRpcInstance')){
								JSB().getLogger().warn('Unable to create new instance from RPC call for jsb: "' + jsbName + '('+instanceId+')" due option "disableRpcInstance" set')
								return null;
							}
*/
							var f = jsb.getClass();
							// create server-side instance with client-side id

							JSB().getThreadLocal().put('_jsbRegisterCallback', function(){
								// use this to access current object
								this.id = instanceId;
							});
							serverInstance = new f();
							JSB().getThreadLocal().clear('_jsbRegisterCallback');
							bNeedSync = true;
						}

						if(bNeedSync){
							serverInstance.doSync();
						}
					}
				} finally {
					if(locker){
						locker.unlock('rpcServerLock');
					}
				}
			}

			return serverInstance;

		},

		constructInstanceFromRemote: function(jsoName, id, callback, opts){
			var self = this;
			var dontSync = (opts && opts.dontSync) || false;
			var serverRemote = (opts && opts.serverRemote) || false;
			if(this.isClient()){
				this.lookup(jsoName, function(cls){
					var obj = null;
					if(JSB().isBean(cls)){
						obj = cls;
						if(obj.$_bindKey != id && obj.getId() != id){
							throw new Error('constructInstanceFromRemote: Wrong singleton ID retrieved');
						}
					} else {
						// check for fixedId
//						if(cls.jsb.getKeywordOption('$fixedId')){
							obj = self.getInstance(id);
//						}
					}

					if(!obj){
						JSB().getThreadLocal().put('_jsbRegisterCallback', function(){
							// use this to access current object
							if(cls.jsb.getKeywordOption('$fixedId')){
								this.id = id;
							}
							this.$_bindKey = id;
						});
						obj = new cls();
						JSB().getThreadLocal().clear('_jsbRegisterCallback');
						obj.doSync();
					}
					if(dontSync){
						if(callback){ callback(obj); }
					} else {
						obj.ensureSynchronized(function(){
							if(callback){ callback(obj); }
						});
					}
				});
			} else {
				var obj = null;
				if(serverRemote){
					obj = this.constructServerInstanceFromServerId(jsoName, id);
				} else {
					obj = this.constructServerInstanceFromClientId(jsoName, id);
				}

				if(callback){ callback(obj); }
			}
		},

		callbackAttr: function(proc, bindTo){
			if(!this.callbackAttrs){
				this.callbackAttrs = {
					bindMap: {},
					idMap: {}
				};
			}

			// generate uniqueId for proc
			var id = JSB().generateUid();
			if(bindTo){
				if(!this.callbackAttrs.bindMap[bindTo.getId()]){
					this.callbackAttrs.bindMap[bindTo.getId()] = [];
				}
				this.callbackAttrs.bindMap[bindTo.getId()].push(id);
			}
			this.callbackAttrs.idMap[id] = proc;

			return "(function(){ var procToCall = JSB().callbackAttrs.idMap[&#39;"+id+"&#39;]; if(procToCall){ return procToCall.apply(this, arguments); } })";
		},

		/* JSB reflection methods */

		getMethods: function(own){
			var names = [];
			var cls = this.getClass();
			var scope = cls.prototype;
			for(var n in scope){
				if(own && !scope.hasOwnProperty(n)){
					continue;
				}
				if(JSB.isFunction(scope[n])){
					names.push(n);
				}
			}

			return names;
		},
		
		hasMethod: function(mtdName){
			var cls = this.getClass();
			var scope = cls.prototype;
			return JSB.isFunction(scope[mtdName])
		},

		createMethodInterceptor: function(mtdName, inetrceptorCallback){
			var cls = this.getClass();
			var scope = cls.prototype;

			var originalMethod = scope[mtdName];

			var mtdWrapper = function(){
				return inetrceptorCallback.call(this, originalMethod, arguments);
			}
			mtdWrapper.jsb = originalMethod.jsb;

			scope[mtdName] = mtdWrapper;

			return mtdWrapper;
		}

	};

	// expose JSB
	(function(){return this;}).call(null).JSB = JSB;

	// deploy JSB.fn methods into JSB scope
	var jsbScope = (function(){return this;}).call(null).JSB;
	for(var f in JSB.fn){
		if(JSB().isFunction(JSB.fn[f])){
			(function(f){
				jsbScope[f] = function(){
					return JSB.fn[f].apply(JSB.fn, arguments);
				}
			})(f);
		}
	}


    // setup JSB.Error
    jsbScope.Error = function (message){
        this.message = message;
        Error.apply(this, arguments);
        Error.captureStackTrace(this);
    };
    jsbScope.Error.prototype = Object.create(Error.prototype);

	// setup window
	if(JSB().isClient()){
		JSB().addLibraryScope('Window', window);
		JSB().setThreadLocal({
			put: function(key, val){
				if(!this.tlsMap){
					this.tlsMap = {};
				}
				this.tlsMap[key] = val;
			},
			get: function(key){
				if(!this.tlsMap){
					this.tlsMap = {};
				}

				return this.tlsMap[key];
			},
			clear: function(key){
				if(!this.tlsMap){
					this.tlsMap = {};
				}

				delete this.tlsMap[key];
			}
		});

	} else {
		JSB().addLibraryScope('Window', {
			setTimeout: function(proc, timeout){
				return Bridge.setTimeout(proc, timeout);
			},
			clearTimeout: function(key){
				Bridge.clearTimeout(key);
			},

			setInterval: function(proc, timeout){
				return Bridge.setInterval(proc, timeout);
			},
			clearInterval: function(key){
				if(!key){
					return;
				}
				Bridge.clearInterval(key);
			}
		});

		JSB().setThreadLocal({
			get: function(key){
				return Bridge.getThreadLocal(key);
			},
			put: function(key, val){
				Bridge.putThreadLocal(key, val);
			},
			clear: function(key){
				Bridge.removeThreadLocal(key);
			}
		});

	}
})();




/********************************************************************************
 * JSB System beans
 ********************************************************************************/


JSB({
	$name: 'JSB.Object',
	$parent: null,
/*
//	Synchronization options:
	$sync: {
		updateClient: true,
		updateServer: false,
		updateCheckInterval: 1000,
		include: [],
		exclude: []
	},
*/
	_destroyLocal: function(){
		this.$_destroyLocal = true;
		this.destroy();
	},

	destroy: function(){
		if(this.isDestroyed()){
			return;
		}
		this.$_destroyed = true;
		this.unsubscribe();
		if(this.$_locks){
			var locker = $jsb.getLocker();
			if(locker){
				for(var lName in this.$_locks){
					locker.clearLock(lName);
				}
			}
		}
		$jsb.unregister(this);

		if(!this.$_destroyLocal && (this.jsb.isServer() || (this.jsb.isSession() && this.$_bindKey))){
			if(this.remote()._destroyLocal){
				this.remote()._destroyLocal();
			}
		}
/*
		if($jsb.getLogger()){
			$jsb.getLogger().info(this.jsb.$name + ' destroyed');
		}
*/
	},

	isDestroyed: function(){
		return this.$_destroyed;
	},

	getClass: function(){
		return this.getJsb().getClass();
	},

	getSession: function(){
		return this.$_session;
	},

	getJsb: function(){
		return this.jsb;
	},

	subscribe: function(msg, arg1, arg2){
		if(!$jsb.getMessageBus()){
			return;
		}
		$jsb.getMessageBus().subscribe(this, msg, arg1, arg2);
	},

	unsubscribe: function(msg){
		if(!$jsb.getMessageBus()){
			return;
		}
		$jsb.getMessageBus().unsubscribe(this, msg);
	},

	publish: function(msg, params, arg1, arg2){
		if(!$jsb.getMessageBus()){
			return;
		}
		return $jsb.getMessageBus().publish(this, msg, params, arg1, arg2);
	},

	lock: function(lName){
		var locker = $jsb.getLocker();
		if(locker){
			var mtxName = this.getId();
			if(lName){
				mtxName += ':' + lName;
			}
			if(!this.$_locks){
				this.$_locks = {};
			}
			this.$_locks[mtxName] = true;
			locker.lock(mtxName);
		}
	},

	unlock: function(lName){
		var locker = $jsb.getLocker();
		if(locker){
			var mtxName = this.getId();
			if(lName){
				mtxName += ':' + lName;
			}

			locker.unlock(mtxName);
		}
	},

	setupSync: function(){
		if(!this.getJsb().getSync() || !this.$_syncScopes){
			return;
		}

		var defaultVal = 1000;
		if(JSB().isObject(this.getJsb().getSync()) && !JSB().isNull(this.getJsb().getSync().updateCheckInterval)){
			defaultVal = this.getJsb().getSync().updateCheckInterval;
		}

		this.setSyncCheckInterval(defaultVal);
	},

	setSyncCheckInterval: function(to){
		var self = this;
		var bUpdateServer = false;
		var bUpdateClient = true;
		if(JSB.isObject(this.getJsb().getSync()) && this.getJsb().getSync().updateServer){
			bUpdateServer = true;
		}
		if(JSB.isObject(this.getJsb().getSync()) && !JSB.isNull(this.getJsb().getSync().updateClient)){
			bUpdateClient = this.getJsb().getSync().updateClient;
		}
		if(!this.getJsb().getSync()
			|| (JSB.isClient() && !bUpdateServer)
			|| (!JSB.isClient() && !bUpdateClient) ){
			return;
		}
		this.syncCheckInterval = to;
		function _sync(){
			if(self.syncCheckInterval && !JSB().isNull(self.$_syncScopes) && !self.isDestroyed()){
				self.doSync(function(){
					JSB().defer(function(){
						_sync();
					}, self.syncCheckInterval, 'doSync_' + self.getId());
				});
			}
		}
		if(this.syncCheckInterval){
			JSB().defer(function(){
				_sync();
			}, self.syncCheckInterval, 'doSync_' + self.getId());
		}
	},

	updateSyncState: function(){
		// update local state
		var timeStamp = Date.now();
		var updated = false;
		function updateSyncScope(timeStamp, name, realScope, syncInfoScope){
			var updated = false;
			if(JSB().isBean(realScope)){
				if(realScope != syncInfoScope.value || syncInfoScope.value === undefined || syncInfoScope.type != 3){
					syncInfoScope.value = realScope;
					syncInfoScope.type = 3;
					syncInfoScope.data = undefined;
					updated = true;
				} else {
					return false;
				}
			} else if(JSB().isFunction(realScope)){
				// this case occurs when users manually fills sync scope with function object
				// TODO: subject to remove
				// now skipping
				return false;
			} else if(JSB().isPlainObject(realScope)){
				// iterate over all fields in realScope to find news and changes
				syncInfoScope.type = 1;
				syncInfoScope.value = null;
				if(JSB().isNull(syncInfoScope.data)){
					syncInfoScope.data = {};
					updated = true;
				}
				for(var realPropName in realScope){
					if(realScope[realPropName] === undefined){
						continue;
					}
					if(JSB().isNull(syncInfoScope.data[realPropName])){
						// item to add
						syncInfoScope.data[realPropName] = {};
						updated = true;
					}
					updated |= updateSyncScope(timeStamp, realPropName, realScope[realPropName], syncInfoScope.data[realPropName]);
				}
				// iterate over all fields in syncInfo to find absent entries
				for(var propName in syncInfoScope.data){
					if(realScope[propName] === undefined && syncInfoScope.data[propName].existed){
						syncInfoScope.data[propName].timeStamp = timeStamp;
						syncInfoScope.data[propName].existed = false;
						syncInfoScope.data[propName].data = null;
						syncInfoScope.data[propName].value = null;
						updated = true;
					}
				}

			} else if(JSB().isArray(realScope)){
				syncInfoScope.type = 2;
				syncInfoScope.value = null;
				if(JSB().isNull(syncInfoScope.data)){
					syncInfoScope.data = {};
					updated = true;
				}
				// new or existed
				for(var i = 0; i < realScope.length; i++ ){
					if(JSB().isNull(syncInfoScope.data[i])){
						syncInfoScope.data[i] = {};
						updated = true;
					}
					updated |= updateSyncScope(timeStamp, i, realScope[i], syncInfoScope.data[i]);
				}
				// removed
				for(var i in syncInfoScope.data){
					if(i >= realScope.length && syncInfoScope.data[i].existed){
						syncInfoScope.data[i].existed = false;
						syncInfoScope.data[i].timeStamp = timeStamp;
						syncInfoScope.data[i].data = null;
						syncInfoScope.data[i].value = null;
						updated = true;
					}
				}

			} else {
				// number, string or boolean
				if(realScope !== syncInfoScope.value || (syncInfoScope.value === undefined && realScope !== undefined)|| syncInfoScope.type != 0){
					syncInfoScope.value = realScope;
					syncInfoScope.type = 0;
					updated = true;
				} else {
					return false;
				}
			}

			if(updated){
				syncInfoScope.existed = true;
				syncInfoScope.timeStamp = timeStamp;
			}
			return updated;

		}

		for(var scopeName in this.$_syncScopes){
			updated |= updateSyncScope(timeStamp, scopeName, this[scopeName], this.$_syncScopes[scopeName]);
		}

		return updated;
	},

	getSyncSlice: function(timeStamp) {
		var slice = {}, minStamp = null, maxStamp = null;

		function getScopeSlice(timeStamp, syncScope, realScope){
			if(syncScope.timeStamp < timeStamp){
				return null;
			}
			var slice = {
				t: syncScope.type,
				ex: syncScope.existed,
			}, minStamp = syncScope.timeStamp, maxStamp = syncScope.timeStamp;
			if(syncScope.existed){
				if(syncScope.type == 0){
					// primitive
					slice.v = syncScope.value;
				} else if(syncScope.type == 1 || syncScope.type == 2){
					// object & array
					slice.d = {};
					for(var fName in syncScope.data){
						var s = getScopeSlice(timeStamp, syncScope.data[fName], realScope[fName]);
						if(JSB().isPlainObject(s)){
							slice.d[fName] = s.slice;
							if(s.minStamp <= minStamp){
								minStamp = s.minStamp;
							}
							if(s.maxStamp >= maxStamp){
								maxStamp = s.maxStamp;
							}
						}
					}
				} else if(syncScope.type == 3) {
					// bean
					slice.d = {
						jsb: syncScope.value.jsb.$name,
						id: JSB().isClient() ? (syncScope.value.$_bindKey || syncScope.value.getId()) : syncScope.value.getId()
					};
				} else {
					throw new Error('getScopeSlice: unknown syncScope.type');
				}
			}
			return {
				minStamp: minStamp,
				maxStamp: maxStamp,
				slice: slice
			};

		}

		for(var scopeName in this.$_syncScopes){
			var s = getScopeSlice(timeStamp, this.$_syncScopes[scopeName], this[scopeName]);
			if(JSB().isPlainObject(s)){
				slice[scopeName] = s.slice;
				if(JSB().isNull(minStamp) || s.minStamp <= minStamp){
					minStamp = s.minStamp;
				}
				if(JSB().isNull(maxStamp) || s.maxStamp >= maxStamp){
					maxStamp = s.maxStamp;
				}
			}
		}
		return {
			minStamp: minStamp,
			maxStamp: maxStamp,
			slice: slice
		};
	},

	applySlice: function(slice, syncBeans, callback){
		var self = this;
		var completeMap = {};
		var scope = { needWait: false, iterateComplete: false }
		function _checkComplete1(){
			if(!scope.iterateComplete){
				return;
			}
			for(var i in completeMap){
				if(!completeMap[i]) return;
			}
			if(callback){
				callback.call(self);
			}
		}

		function applyScopeSlice(name, syncSlice, parentRealScope, callback){
			if(!syncSlice.ex){
				// remove
				delete parentRealScope[name];
				return;
			}
			if( syncSlice.t == 0 ){
				parentRealScope[name] = syncSlice.v;
				return;
			} else if(syncSlice.t == 1){
				if(parentRealScope[name] === undefined || !JSB().isPlainObject(parentRealScope[name])){
					parentRealScope[name] = {};
				}
				var completeMap = {};
				var scope = {needWait: false, iterateComplete: false};
				function _checkComplete(){
					if(!scope.iterateComplete){
						return;
					}
					for(var i in completeMap){
						if(!completeMap[i]) return;
					}
					if(callback){
						callback.call(self);
					}
				}
				for(var pName in syncSlice.d){
					if(!syncSlice.d[pName].ex){
						delete parentRealScope[name][pName];
					} else {
						completeMap[pName] = false;
						(function(pn){
							if(applyScopeSlice(pn, syncSlice.d[pn], parentRealScope[name], function(){
								completeMap[pn] = true;
								_checkComplete();
							})){
								scope.needWait = true;
							} else {
								delete completeMap[pn];
							}
						})(pName);

					}
				}
				scope.iterateComplete = true;
				if(scope.needWait){
					_checkComplete();
					return true;
				}
				return;
			} else if(syncSlice.t == 2){
				if(parentRealScope[name] === undefined || !JSB().isArray(parentRealScope[name])){
					parentRealScope[name] = [];
				}
				var completeMap = {};
				var scope = {needWait: false, iterateComplete: false};
				function _checkComplete(){
					if(!scope.iterateComplete){
						return;
					}
					for(var i in completeMap){
						if(!completeMap[i]) return;
					}
					if(callback){
						callback.call(self);
					}
				}
				var toRemove = [];
				for(var pName in syncSlice.d){
					if(!syncSlice.d[pName].ex){
						toRemove.push(parseInt(pName));
					} else {
						completeMap[pName] = false;
						(function(pn){
							if(applyScopeSlice(pn, syncSlice.d[pn], parentRealScope[name], function(){
								completeMap[pn] = true;
								_checkComplete();
							})){
								scope.needWait = true;
							} else {
								delete completeMap[pn];
							}
						})(pName);

					}
				}
				scope.iterateComplete = true;
				if(toRemove.length > 0){
					toRemove.sort(function(a,b){return b - a;});
					for(var i in toRemove){
						parentRealScope[name].splice(toRemove[i], 1);
					}
				}
				if(scope.needWait){
					_checkComplete();
					return true;
				}
				return;
			} else if(syncSlice.t == 3){
				// inject bean
				$jsb.constructInstanceFromRemote(syncSlice.d.jsb, syncSlice.d.id, function(obj){
					parentRealScope[name] = obj;
					if(!obj.isSynchronized()){
						syncBeans[obj.getId()] = obj;
					}
					callback.call($this);
				}, {dontSync: true});
				return true;
			}

		}

		for(var sName in slice){
			completeMap[sName] = false;
			(function(name){
				if(applyScopeSlice(name, slice[name], self, function(){
					completeMap[name] = true;
					_checkComplete1();
				})){
					scope.needWait = true;
				} else {
					delete completeMap[name];
				}
			})(sName);
		}
		scope.iterateComplete = true;
		if(scope.needWait){
			_checkComplete1();
		} else {
			if(callback){
				callback.call(self);
			}
		}
	},

	getId: function(){
		return this.id;
	},

	setId: function(id){
		JSB().unregister(this);
		JSB().register(this, id);
	},

	getName: function(){
		return this.getJsb().$name;
	},

	_extendSyncInfo: function(syncInfo){
		syncInfo.isChanged = function(path){
			var matchedScopes = [this];
			var parts = path.split('.');
			for(var i in parts){
				var p = parts[i];

				var newScopes = [];
				for(var j in matchedScopes){
					var curPtr = matchedScopes[j];
					if(p == '*'){
						for(var k in curPtr){
							if(curPtr[k].ex){
								if(curPtr[k].d){
									newScopes.push(curPtr[k].d);
								}
							}
						}
					} else {
						if(curPtr[p]){
							if(!curPtr[p].ex){
								return true;
							}
							if(curPtr[p].d){
								newScopes.push(curPtr[p].d);
							} else {
								return true;
							}
						}
					}
				}
				if(newScopes.length == 0){
					return false;
				}
				matchedScopes = newScopes;
			}

			return true;
		}
	},

	_onBeforeSync: function(syncInfo){
		var si = JSB().clone(syncInfo);
		this._extendSyncInfo(si);
		return this.onBeforeSync(si);
	},

	_onAfterSync: function(syncInfo){
		var si = JSB().clone(syncInfo);
		this._extendSyncInfo(si);
		return this.onAfterSync(si);
	},

	onAfterSync: function(syncInfo){},

	onSyncCheck: function(){},

	remote: function(){
		if($jsb.isClient()){
			return this.server();
		} else {
			return this.client();
		}
	},

	existTrigger: function(key){
		if($this.$_ecMap && $this.$_ecMap[key]){
			return true;
		}
		return false;
	},

	_ensureTriggerMap: function(){
		if(!$this.$_ecMap){
			$this.lock('trigger.map');
			if(!$this.$_ecMap){
				$this.$_ecMap = {};
			}
			$this.unlock('trigger.map');
		}
	},

	_ensureTriggerKey: function(key){
		$this._ensureTriggerMap();
		if(!$this.$_ecMap[key]){
			$this.lock('trigger.map');
			if(!$this.$_ecMap[key]){
				$this.$_ecMap[key] = {cArr:[]};
			}
			$this.unlock('trigger.map');
		}
	},

	ensureTrigger: function(keyArr, callback, valOrCondOpt){
		$this._ensureTriggerMap();
		var bKeyArr = true;
		if(!JSB.isArray(keyArr)){
			keyArr = [keyArr];
			bKeyArr = false;
		}
		if(!JSB.isDefined(valOrCondOpt)){
			valOrCondOpt = true;	// default value expecation
		}
		if($this.matchTrigger(keyArr, valOrCondOpt)){
			var vals = [];
			for(var i = 0; i < keyArr.length; i++){
				vals.push($this.$_ecMap[keyArr[i]].val);
			}
			callback.call($this, bKeyArr ? vals : vals[0]);
		} else {
			for(var i = 0; i < keyArr.length; i++){
				var key = keyArr[i];
				$this._ensureTriggerKey(key);
				var mtx = 'trigger.key:' + key;
				$this.lock(mtx);
				$this.$_ecMap[key].cArr.push({exec:callback, cond:valOrCondOpt, keyArr: keyArr, bKeyArr: bKeyArr});
				$this.unlock(mtx);
			}
		}
	},

	matchTrigger: function(keyArr, valOrCondOpt){
		$this._ensureTriggerMap();
		if(!JSB.isArray(keyArr)){
			keyArr = [keyArr];
		}
		var bMatched = true;
		if(!JSB.isDefined(valOrCondOpt)){
			valOrCondOpt = true;	// default value expecation
		}
		for(var i = 0; i < keyArr.length; i++){
			var key = keyArr[i];
			$this._ensureTriggerKey(key);
			if(JSB.isDefined($this.$_ecMap[key].val)){
				if(JSB.isFunction(valOrCondOpt)){
					if(!valOrCondOpt.call($this, $this.$_ecMap[key].val)){
						bMatched = false;
						break;
					}
				} else {
					if($this.$_ecMap[key].val != valOrCondOpt){
						bMatched = false;
						break;
					}
				}
			} else {
				bMatched = false;
				break;
			}
		}

		return bMatched;
	},

	setTrigger: function(key, valOpt){
		$this._ensureTriggerKey(key);
		if(!JSB.isDefined(valOpt)){
			valOpt = true;	// default value
		}
		$this.$_ecMap[key].val = valOpt;

		var i = 0;
		while (i < $this.$_ecMap[key].cArr.length) {
		//for(var i = $this.$_ecMap[key].cArr.length - 1; i >= 0; i--){
			var cDesc = $this.$_ecMap[key].cArr[i];

			var bMatched = false;
			if(JSB.isFunction(cDesc.cond)){
				bMatched = cDesc.cond.call($this, $this.$_ecMap[key].val);
			} else {
				bMatched = ($this.$_ecMap[key].val == cDesc.cond);
			}
			if(bMatched){
				// check for other keys
				for(var j = 0; j < cDesc.keyArr.length; j++){
					var otherKey = cDesc.keyArr[j];
					if(otherKey == key){
						continue;
					}

					if(JSB.isFunction(cDesc.cond)){
						if(!cDesc.cond.call($this, $this.$_ecMap[otherKey].val)){
							bMatched = false;
							break;
						}
					} else {
						if($this.$_ecMap[otherKey].val != cDesc.cond){
							bMatched = false;
							break;
						}
					}
				}
				if(bMatched){
					// remove entries from others
					var vals = [];
					for(var j = 0; j < cDesc.keyArr.length; j++){
						var otherKey = cDesc.keyArr[j];
						vals.push($this.$_ecMap[otherKey].val);
						if(otherKey == key){
							continue;
						}
						var mtx = 'trigger.key:' + otherKey;
						$this.lock(mtx);
						for(var k = $this.$_ecMap[otherKey].cArr.length - 1; k >= 0; k--){
							if($this.$_ecMap[otherKey].cArr[k].keyArr == cDesc.keyArr){
								$this.$_ecMap[otherKey].cArr.splice(k, 1);
							}
						}
						$this.unlock(mtx);
					}
					// remove this
					var mtx = 'trigger.key:' + key;
					$this.lock(mtx);
					$this.$_ecMap[key].cArr.splice(i, 1);
					$this.unlock(mtx);
					
					// Executing on separate thread to avoid waiter fails
					(function(cDesc, vals){
						JSB.defer(function(){
							cDesc.exec.call($this, cDesc.bKeyArr ? vals : vals[0])
						}, 0);
					})(cDesc, vals);
				} else {
				    i++;
				}
			} else {
			    i++;
			}
		}
	},

	resetTrigger: function(keyArr){
		$this._ensureTriggerMap();
		if(!JSB.isArray(keyArr)){
			keyArr = [keyArr];
		}
		for(var i = 0; i < keyArr.length; i++){
			var key = keyArr[i];
			$this._ensureTriggerKey(key);
			if(JSB.isDefined($this.$_ecMap[key].val)){
				delete $this.$_ecMap[key].val;
			}
		}
	},

	removeTrigger: function(keyArr){
		$this._ensureTriggerMap();
		if(!JSB.isArray(keyArr)){
			keyArr = [keyArr];
		}
		for(var i = 0; i < keyArr.length; i++){
			var key = keyArr[i];
			if($this.$_ecMap[key]){
				$this.lock('trigger.map');
				delete $this.$_ecMap[key];
				$this.unlock('trigger.map');
			}
		}
	},

	$client:{
		$bootstrap: function(){
			// use 'this' to access members
		},
		$constructor: function(opts){
			JSB().register(this);
			if(opts){
				this.$_bindKey = this.$_bindKey || opts.bindKey || opts.bind;
			}
			this.$_synchronized = false;
			this.$_syncState = 0;
			this.setupSync();
		},

		server: function(){
//			return $server;
			var f = function(){
				this.__instance = $this;
			};
			f.prototype = this.jsb.$_serverProcs;
			return new f();
		},

		bind: function(key){
			this.$_bindKey = key;
		},

		isSynchronized: function(){
			return this.$_synchronized || !this.getJsb().getSync() || $jsb.isNull(this.$_syncScopes);
		},

		ensureSynchronized: function(callback, syncState){
			if($jsb.isNull(syncState)){
				syncState = null;
			}

			if(!this.getJsb().getSync() || $jsb.isNull(this.$_syncScopes) || this.$_synchronized || (!$jsb.isNull(syncState) && this.$_syncState >= syncState)){
				callback.call(this);
				return;
			}
			if(!this.$_syncCallbacks){
				this.$_syncCallbacks = [];
			}
			this.$_syncCallbacks.push({callback: callback, syncState: syncState});
		},

		matchSynchronized: function(syncState){
			if($jsb.isNull(syncState)){
				this.$_synchronized = true;
				this.$_syncState = null;
				syncState = null;
			} else {
				this.$_syncState = syncState;
			}
			if(!this.$_syncCallbacks){
				return;
			}
			for(var i = this.$_syncCallbacks.length - 1; i>= 0; i--){
				var syncDesc = this.$_syncCallbacks[i];
				if(this.$_synchronized || (!$jsb.isNull(syncDesc.syncState) && syncState >= syncDesc.syncState)){
					// execute and remove
					var cb = syncDesc.callback;
					this.$_syncCallbacks.splice(i, 1);
					cb.call(this);
				}
			}
		},

		doSync: function(){
			if(this.isDestroyed() || JSB().isNull(this.$_syncScopes)){
				return;
			}
			var self = this;
			var syncInfo = null;

			var bForceSync = false;
			var callback = null;

			// parse args
			for(var i in arguments){
				var arg = arguments[i];
				if(JSB().isBoolean(arg)){
					bForceSync = arg;
				} else if(JSB().isFunction(arg)){
					callback = arg;
				}
			}

			if(JSB().isNull(this.$_lastDownloadSyncTimeStamp)){
				this.$_lastDownloadSyncTimeStamp = 0;
			}
			if(JSB().isNull(this.$_lastUploadSyncTimeStamp)){
				this.$_lastUploadSyncTimeStamp = 0;
			}

			// build local slice
			this.onSyncCheck();
			var bNeedSync = this.updateSyncState();
			if(bNeedSync || bForceSync || this.$_lastDownloadSyncTimeStamp == 0){
				var slice = null;
				if(this.$_lastDownloadSyncTimeStamp > 0){
					slice = JSB().merge(true, JSB().isNull(this.$_oddSlice) ? {} : this.$_oddSlice, this.getSyncSlice(this.$_lastUploadSyncTimeStamp + 1));
					this.$_lastUploadSyncTimeStamp = Date.now();
				}
				var ts = this.$_lastDownloadSyncTimeStamp + 1;

				this.server().requestSyncInfo(ts, slice, function(resp, err){
					var syncBeans = {};
					var syncContainer = {
						curSyncBeans: syncBeans
					};

					function _syncIteration(s){
						if(Object.keys(syncContainer.curSyncBeans).length === 0){
							$this.matchSynchronized();
							if(callback){
								callback.call($this);
							}
						} else {
							$this.matchSynchronized(s);

							// wait all syncBeans are $_syncState == 1
							var sCnt = Object.keys(syncContainer.curSyncBeans).length;
							var cCnt = {
								ready: 0
							};
							for(var sid in syncContainer.curSyncBeans){
								(function(sid){
									var obj = syncContainer.curSyncBeans[sid];
									obj.ensureSynchronized(function(){
										cCnt.ready++;
										if(cCnt.ready >= sCnt){
											var sbMap = {};

											for(var ssid in syncContainer.curSyncBeans){
												var robj = syncContainer.curSyncBeans[ssid];

												if(!robj.isSynchronized() && robj.$_syncState <= $this.$_syncState){
													sbMap[ssid] = robj;
												}
											}

											syncContainer.curSyncBeans = sbMap;
											_syncIteration(s + 1);
										}
									}, s);
								})(sid);
							}
						}

					}

					function _syncComplete(){
						_syncIteration(1);
					}

					if(err){
						_syncComplete();
						return;
					}

					if(!JSB().isNull(resp.maxStamp)){
						self.$_lastDownloadSyncTimeStamp = parseInt(resp.maxStamp);
						if(!JSB().isNull(resp.minStamp) && self._onBeforeSync(resp.slice)){
							self.updateSyncState();
							self.$_oddSlice = self.getSyncSlice(self.$_lastUploadSyncTimeStamp + 1);
							self.applySlice(resp.slice, syncBeans, function(){
								self._onAfterSync(resp.slice);
								self.updateSyncState();
								self.$_lastUploadSyncTimeStamp = Date.now();
								_syncComplete();
							});
						} else {
							_syncComplete();
						}
					} else {
						_syncComplete();
					}

				});
			} else {
				if(callback){
					callback.call(self);
				}
			}
		},

		// on client side
		rpc: function(procName, params, callback, opts){
			var self = this;
			var sync = (opts && opts.sync) || false;
			var plain = (opts && opts.plain) || false;
			var tJsb = this.getJsb();
			/*var callCtx = tJsb.saveCallingContext();*/
			if(!this.$_bindKey){
				this.$_bindKey = this.id;
			}
			JSB().getProvider().enqueueRpc({
				jsb: tJsb.$name,
				instance: this.$_bindKey,
				proc: procName,
				params: JSB().unwindComplexObjects(params, plain),
				sync: (sync ? true: false)
			}, function(res){
				if(self.isDestroyed()){
					return;
				}
				var inst = this;
				var args = arguments;
				JSB().injectComplexObjects(res, function(r){
					args[0] = r;
					if(callback){
						/*tJsb.putCallingContext(callCtx);*/
						callback.apply(inst, args);
					}
				});
			} );
		},

		ajax: function(url, params, callback, opts){
			var pUrl = url;
			if(pUrl.indexOf(':') == -1){
				pUrl = JSB.getProvider().getServerBase() + this.getJsb().getBasePath() + pUrl;
			}
			JSB().getProvider().ajax(pUrl, params, callback, opts);
		},

		onBeforeSync: function(syncInfo){
			var bUpdateClient = true;
			if(JSB().isPlainObject(this.getJsb().getSync()) && !JSB().isNull(this.getJsb().getSync().updateClient)){
				bUpdateClient = this.getJsb().getSync().updateClient;
			}
			return bUpdateClient;
		},

		callbackAttr: function(proc){
			return JSB().callbackAttr(proc, this);
		}

	},

	$server: {
		$constructor: function(){
			JSB().register(this);
			this.setupSync();
		},

		client: function(opts){
			var f = function(){
				this.__instance = $this;
				this.__opts = opts;
			};
			f.prototype = this.jsb.$_clientProcs;
			return new f();
		},

		server: function(node, opts){
			var f = function(){
				this.__instance = $this;
				this.__node = node || null;
				this.__opts = opts;
			};
			f.prototype = this.jsb.$_serverProcs;
			return new f();
		},

		onBeforeSync: function(syncInfo){
			var bUpdateServer = false;
			if(JSB().isPlainObject(this.getJsb().getSync()) && this.getJsb().getSync().updateServer){
				bUpdateServer = true;
			}
			return bUpdateServer;
		},

		onSyncRequest: function(){},

		doSync: function(callback){
			if(this.isDestroyed() || JSB().isNull(this.$_syncScopes)){
				return;
			}
			this.onSyncCheck();
			var bNeedUpdate = this.updateSyncState();
			if(bNeedUpdate){
				this.client().doSync(true);
			}
			if(callback){
				callback.call(this);
			}
		},

		requestSyncInfo: function(timeSlice, syncInfo){
			var self = this;
			if(JSB().isNull(this.$_syncScopes)){
				return null;
			}
			// perform onSync event call
			this.onSyncRequest();
/*
			// perform updateSyncState if required
			var curTimeStamp = new Date().getTime();
			var bNeedUpdate = this.updateSyncState();
			this.lastUpdateTimeStamp = curTimeStamp;
			if(bNeedUpdate){
				this.client().doSync(true);
			}
*/
			var needUpdate = this.updateSyncState();
			var retSlice = this.getSyncSlice(timeSlice);

			// perform update local state
			if(!JSB().isNull(syncInfo) && !JSB().isNull(syncInfo.slice) && !JSB().isNull(syncInfo.maxStamp) && this._onBeforeSync(syncInfo.slice)){
				this.applySlice(syncInfo.slice);
				this._onAfterSync(syncInfo.slice);
				retSlice.maxStamp = Date.now();
				needUpdate |= this.updateSyncState();
			}

			if(needUpdate){
/*
				if(!JSB.isDefined(this.sscount)){
					this.sscount = 0;
				}
				this.sscount++;
				if(this.sscount > 300){
					debugger;
					this.updateSyncState()
				}
*/
				JSB.defer(function(){
					self.client().doSync(true);
				}, 0);
			}
			return retSlice;
		},

		// on server side
		rpc: function(procName, params, callback, opts){
			var self = this;
			var node = opts && opts.node;
			var session = opts && opts.session;

			if(JSB.isDefined(node) && (!node || node == JSB.getClusterProvider().getNodeAddress())){
				// execute on locale node (self-call)
				try {
					var res = this[procName].apply(this, params);
					if(callback){
						callback.call(this, res);
					}
				} catch(e){
					if(callback){
						callback.call(this, undefined, e);
					} else {
						JSB.getLogger().error(e);
					}
				}
				return;
			}
			var tJsb = this.getJsb();
			/*var callCtx = tJsb.saveCallingContext();*/

			var execCmd = {
				instance: this,
				proc: procName,
				params: JSB().unwindComplexObjects(params, opts.plain)
			};

			if(JSB.isDefined(node)){
				// execute on remote node
				execCmd.session = session || JSB().getCurrentSession();
				execCmd.callback = (callback ? function(res, fail){
					var inst = this;
					var args = arguments;
					if(fail){
						JSB().injectComplexObjects(fail, function(r){
							args[1] = r;
							/*tJsb.putCallingContext(callCtx);*/
							callback.apply(inst, args);
						}, {serverRemote: true});
					} else {
						JSB().injectComplexObjects(res, function(r){
							args[0] = r;
							/*tJsb.putCallingContext(callCtx);*/
							callback.apply(inst, args);
						}, {serverRemote: true});
					}
				} : null);
				JSB.getClusterProvider().sendRpc(node, execCmd);
			} else {
				// execute on client
				execCmd.session = session;
				execCmd.callback = (callback ? function(res, fail){
					var inst = this;
					var args = arguments;
					if(fail){
						JSB().injectComplexObjects(fail, function(r){
							args[1] = r;
							/*tJsb.putCallingContext(callCtx);*/
							callback.apply(inst, args);
						}, {serverRemote: false});
					} else {
						JSB().injectComplexObjects(res, function(r){
							args[0] = r;
							/*tJsb.putCallingContext(callCtx);*/
							callback.apply(inst, args);
						}, {serverRemote: false});
					}
				} : null);
				JSB.getProvider().enqueueRpc(execCmd);
			}
		}
	}
});

JSB({
	$name: 'JSB.Repository',
	$singleton: true,

	items: {},
	loadList: {},
	pathMapIndex: {},
	stages: [],

	$constructor: function(){
		JSB().setRepository(this);
		JSB().onLoad(function(){
			$this.checkCompleteStage(this);
		});
	},

	ensureLoaded: function(callback){
		this.ensureTrigger('loaded', callback, function(val){return val >= 2;});
	},

	ensureSystemLoaded: function(callback){
		this.ensureTrigger('loaded', callback, function(val){return val >= 1;});
	},

	registerPath: function(beanCfg){
		var name = beanCfg.$name;
		if(JSB.isSystem(name)){
			return;
		}
		if(!beanCfg.$_pathFile){
			if(JSB.getLogger()){
				JSB.getLogger().warn('No "$_pathFile" for bean: ' + beanCfg.$name);
			}
			return;
		}
		var pathFile = beanCfg.$_pathFile.toLowerCase();
		if(name && pathFile){
			this.pathMapIndex[pathFile] = name;
		}
	},

	register: function(beanCfg, opts){
		if(!beanCfg){
			return;
		}
		if(JSB.isArray(beanCfg)){
			for(var i = 0; i < beanCfg.length; i++){
				this.register(beanCfg[i], opts);
			}
			return;
		}
		var name = beanCfg.$name;
		if(!name || name.length == 0){
			var err = 'Bean has no name: ' + JSON.stringify(beanCfg);
			throw new Error(err);
		}
		JSB.merge(beanCfg, opts);
		this.registerPath(beanCfg);
		var locker = JSB().getLocker();
		if(locker)locker.lock('_jsb_repo');
		var entry = this.items[name];
		if(!entry){
			entry = this.items[name] = {
				cfg: beanCfg,
				jsb: null
			};
		} else {
			entry.cfg = beanCfg;
		}
		this.loadList[name] = true;
		if(locker)locker.unlock('_jsb_repo');
	},

	registerLoaded: function(beanCfg, jsb){
		var name = beanCfg.$name;
		var entry = this.items[name];
		if(!entry){
			entry = this.items[name] = {};
		}
		entry.cfg = beanCfg;
		entry.jsb = jsb;
		this.registerPath(beanCfg);
	},

	load: function(stage){
		var locker = JSB().getLocker();
		var loadArr = Object.keys(this.loadList);
		if(locker)locker.lock('_jsb_repo_stages');
		this.stages[stage] = {};
		for(var i = 0; i < loadArr.length; i++){
			this.stages[stage][loadArr[i]] = true;
		}
		if(locker)locker.unlock('_jsb_repo_stages');

		for(var i = 0; i < loadArr.length; i++){
			var name = loadArr[i];
			var entry = this.items[name];
			entry.stage = stage;
			var cfg = entry.cfg;
			// do load
			JSB(cfg);

			if(locker)locker.lock('_jsb_repo');
			delete this.loadList[name];
			if(locker)locker.unlock('_jsb_repo');
		}

	},

	checkCompleteStage: function(jsbObj){
		var name = jsbObj.getDescriptor().$name;
		var entry = this.items[name];
		if(!entry){
			return;
		}
		var stage = entry.stage;
		if(this.stages[stage] && this.stages[stage][name]){
			var locker = JSB().getLocker();
			if(locker)locker.lock('_jsb_repo_stages');
			delete this.stages[stage][name];
			if(locker)locker.unlock('_jsb_repo_stages');
			if(Object.keys(this.stages[stage]).length == 0){
				this.setTrigger('loaded', stage);
			}
		}
	},

	get: function(name){
		return this.items[name];
	},

	getByPath: function(path){
		var name = this.pathMapIndex[path];
		if(!name){
			return null;
		}
		return this.get(name);
	},
	$client: {},
	$server: {}
});


JSB({
	$name:'JSB.MessageBus',
	$singleton: true,

	msgIdx: {},
	objIdx: {},
	callIdx: {},

	$constructor: function(){
		$base();
		JSB().setMessageBus(this);
	},

	/* methods */

	_resolveMessage: function(msg, opts){
		if($jsb.isArray(msg)){
			throw new Error('Message objects can only be a string or JSON object');
		}

		if(!$jsb.isString(msg)){
			throw new Error('Expecting string message');
		}
		var msgObj = {
			message: msg
		};
		if(opts){
			$jsb.merge(msgObj, opts);
		}
/*
		if(!msgObj.session){
			msgObj.session = false;
			msgObj.local = true;
		} else {
			msgObj.session = true;
			msgObj.local = false;
		}
*/

		return msgObj;
	},

	_subscribe: function(w, msgObj, callback){
		var msg = msgObj.message;
		if(!w.getId()){
			throw new Error('Failed to subscribe uninitialized bean');
		}
		var objId = w.getSession() + '/' + w.getId();
		if(!msgObj.callId){
			msgObj.callId = $jsb.generateUid();
		}
		var msgDesc = $jsb.merge({
			c: callback,
			target: w
		}, msgObj);

		$this.lock();

		// msgIdx
		if($jsb.isNull($this.msgIdx[msg])){
			$this.msgIdx[msg] = {};
		}
		if($jsb.isNull($this.msgIdx[msg][objId])){
			$this.msgIdx[msg][objId] = [];
		}
		$this.msgIdx[msg][objId].push(msgDesc);

		// objIdx
		if($jsb.isNull($this.objIdx[objId])){
			$this.objIdx[objId] = {};
		}
		$this.objIdx[objId][msg] = true;

		// callIdx
		$this.callIdx[msgObj.callId] = msgDesc;

		$this.unlock();

		if(msgObj.session && !msgObj.sessionRemote){
			// subscribe remote
			if($this.remote()._subscribe){
				$this.remote()._subscribe(w, JSB.merge({}, msgObj, {sessionRemote: true}));
			}
		}

		if(JSB.isServer()){
			if(msgObj.cluster && !msgObj.clusterRemote){
				// subscribe remote
				$this._subscribeRemoteNodes(w, msgObj);
			}

		}
	},

	_unsubscribe: function(w, msgObj){
		var msg = msgObj.message;
		var objId = w.getSession() + '/' + w.getId();

		var remoteSessionLst = [];
		var remoteClusterLst = [];

		this.lock();

		// remove from msgIdx
		if($this.msgIdx[msg] && $this.msgIdx[msg][objId]){
			for(var i = 0; i < $this.msgIdx[msg][objId].length; i++){
				var callId = $this.msgIdx[msg][objId][i].callId;
				if(callId && $this.callIdx[callId]){
					var msgDesc = $this.callIdx[callId];
					var w = msgDesc.target;
					if(msgDesc.c){
						delete msgDesc.c;
					}
					if(msgDesc.target){
						delete msgDesc.target;
					}
					if(msgDesc.session && !msgDesc.sessionRemote){
						remoteSessionLst.push({w: w, msgObj:msgDesc});
					}
					if(msgDesc.cluster && !msgDesc.clusterRemote){
						remoteClusterLst.push({w: w, msgObj:msgDesc});
					}
					delete $this.callIdx[callId];
				}
			}
			delete $this.msgIdx[msg][objId];
			if(Object.keys($this.msgIdx[msg]).length === 0){
				delete $this.msgIdx[msg];
			}
		}

		// remove from objIdx
		if($this.objIdx[objId] && $this.objIdx[objId][msg]){
			delete $this.objIdx[objId][msg];
			if(Object.keys($this.objIdx[objId]).length === 0){
				delete $this.objIdx[objId];
			}
		}

		this.unlock();

		// remove from remote lists
		for(var i = 0; i < remoteSessionLst.length; i++){
			var msgDesc = remoteSessionLst[i];
			if($this.remote()._unsubscribe){
				$this.remote()._unsubscribe(msgDesc.w, JSB.merge({}, msgDesc.msgObj, {sessionRemote: true}));
			}
		}
		if(remoteClusterLst.length > 0 && JSB.isServer()){
			for(var i = 0; i < remoteClusterLst.length; i++){
				var msgDesc = remoteClusterLst[i];
				$this._unsubscribeRemoteNodes(msgDesc.w, msgDesc.msgObj);
			}
		}
	},

	subscribe: function(w, msgObj, arg1, arg2){
		var callback = null, opts = null;
		if($jsb.isObject(arg1)){
			opts = arg1,
			callback = arg2;
		} else {
			callback = arg1;
			opts = arg2;
		}
		if(!callback && opts && opts.onMessage && $jsb.isFunction(opts.onMessage)){
			callback = opts.onMessage;
			delete opts.onMessage;
		}
		if($jsb.isArray(msgObj)){
			for(var i = 0; i < msgObj.length; i++){
				this._subscribe(w, this._resolveMessage(msgObj[i], opts), callback);
			}
		} else {
			this._subscribe(w, this._resolveMessage(msgObj, opts), callback);
		}
	},

	unsubscribe: function(w, msgObj){
		if(!msgObj){
			// combine all messages from object
			var objId = w.getSession() + '/' + w.getId();
			msgObj = [];
			for(var m in $this.objIdx[objId]){
				msgObj.push(m);
			}
		}
		if($jsb.isArray(msgObj)){
			for(var i = 0; i < msgObj.length; i++){
				this._unsubscribe(w, this._resolveMessage(msgObj[i]));
			}
		} else {
			this._unsubscribe(w, this._resolveMessage(msgObj));
		}
	},

	dispatch: function(callId, w, msg, params){
		var ret = undefined;
		var subDesc = this.callIdx[callId];
		if(subDesc){
			if(subDesc.sessionRemote){
				// translate to client
				ret = JSB.createFuture();
				$this.remote().dispatch(callId, w, msg, params, function(res, fail){
					ret.fire(res, fail);
				});
			} else if(subDesc.clusterRemote){
				// translate to cluster
				ret = JSB.createFuture();
				$this.server(subDesc.clusterRemote, {session:w.getSession()}).dispatch(callId, w, msg, params, function(res, fail){
					ret.fire(res, fail);
				});
			} else {
				if(subDesc.c){
					try {
						ret = ret || subDesc.c.call(subDesc.target, w, msg, params, subDesc);
					} catch(e){
						$jsb.getLogger().error(e);
					}
				}
				if(subDesc.target.onMessage){
					try {
						ret = ret || subDesc.target.onMessage.call(subDesc.target, w, msg, params, subDesc);
					}catch(e){
						$jsb.getLogger().error(e);
					}
				}
			}
		}
		return ret;
	},

	publish: function(w, msgObj, params, arg1, arg2){
		if($jsb.isArray(msgObj)){
			throw new Error('Publishing array of messages is not supported');
		}
		var callback = null, opts = null;
		if($jsb.isObject(arg1)){
			opts = arg1,
			callback = arg2;
		} else {
			callback = arg1;
		}
		if(!callback && opts && opts.onComplete && $jsb.isFunction(opts.onComplete)){
			callback = opts.onComplete;
			delete opts.onComplete;
		}
		msgObj = this._resolveMessage(msgObj, opts);
		var response = {};
		var msg = msgObj.message;
		var objMap = $this.msgIdx[msg];
		var subQueue = [];
		if(objMap){
			for(var objId in objMap){
				var subsArr = objMap[objId];
				if(!subsArr || subsArr.length == 0){
					continue;
				}
				for(var i = 0; i < subsArr.length; i++){
					var subDesc = subsArr[i];
					if(subDesc.sessionRemote && !msgObj.session){
						continue;
					}
					if(subDesc.clusterRemote && !msgObj.cluster){
						continue;
					}
					if(opts && opts.target && opts.target != subDesc.target){
						continue;
					}
					subQueue.push(subDesc);
				}
			}
		}
		if(opts && opts.sort && $jsb.isFunction(opts.sort)){
			subQueue.sort(opts.sort);
		}

		var localIds = [];
		var sessionRemoteIds = [];
		var clusterRemoteIds = [];
		if(JSB.isServer()){
			for(var i = 0; i < subQueue.length; i++){
				var subDesc = subQueue[i];
				if(subDesc.clusterRemote){
					clusterRemoteIds.push(subDesc.callId);
				} else if(subDesc.sessionRemote){
					sessionRemoteIds.push(subDesc.callId);
				} else {
					localIds.push(subDesc.callId);
				}
			}
		} else {
			for(var i = 0; i < subQueue.length; i++){
				var subDesc = subQueue[i];
				if(subDesc.sessionRemote){
					sessionRemoteIds.push(subDesc.callId);
				} else if(subDesc.clusterRemote){
					clusterRemoteIds.push(subDesc.callId);
				} else  {
					localIds.push(subDesc.callId);
				}
			}
		}

		function storeDispatchResult(ret, subDesc){
			if($jsb.isDefined(ret)){
				if(!response[subDesc.target.getId()]){
					response[subDesc.target.getId()] = [];
				}
				response[subDesc.target.getId()].push(ret);
			}
		}

		var cs = {bStopFlag: false, sessionComplete: 0, clusterComplete: 0};

		function checkComplete(){
			if(cs.bStopFlag || (cs.sessionComplete == sessionRemoteIds.length && cs.clusterComplete == clusterRemoteIds.length)){
				if(callback){
					callback.call(w, response);
				}
				return true;
			}
			return false;
		}

		// dispatch local
		for(var i = 0; i < localIds.length && !cs.bStopFlag; i++){
			var subDesc = $this.callIdx[localIds[i]];
			if(opts && opts.onDispatch && $jsb.isFunction(opts.onDispatch)){
				if(opts.onDispatch.call(w, subDesc.target)){
					continue;	// skip
				}
			}
			var ret = this.dispatch(localIds[i], w, msg, params);
			storeDispatchResult(ret, subDesc);
			if(opts && opts.onRespond && $jsb.isFunction(opts.onRespond)){
				if(opts.onRespond.call(w, subDesc.target, ret)){
					cs.bStopFlag = true;
				}
			}
		}

		if(checkComplete()){
			return response;
		}

		// dispatch session remote
		if(sessionRemoteIds.length > 0){
			for(var i = 0; i < sessionRemoteIds.length && !cs.bStopFlag; i++){
				(function(i){
					var subDesc = $this.callIdx[sessionRemoteIds[i]];
					if(opts && opts.onDispatch && $jsb.isFunction(opts.onDispatch)){
						if(opts.onDispatch.call(w, subDesc.target)){
							cs.sessionComplete++;
							checkComplete();
							return;	// skip
						}
					}
					$this.remote().dispatch(sessionRemoteIds[i], w, msg, params, function(ret){
						storeDispatchResult(ret, subDesc);
						cs.sessionComplete++;
						if(opts && opts.onRespond && $jsb.isFunction(opts.onRespond)){
							if(opts.onRespond.call(w, subDesc.target, ret)){
								cs.bStopFlag = true;
							}
						}
						checkComplete();
					});
				})(i);
			}
		}

		// dispatch cluster remote
		if(clusterRemoteIds.length > 0){
			for(var i = 0; i < clusterRemoteIds.length && !cs.bStopFlag; i++){
				(function(i){
					var subDesc = $this.callIdx[clusterRemoteIds[i]];
					if(opts && opts.onDispatch && $jsb.isFunction(opts.onDispatch)){
						if(opts.onDispatch.call(w, subDesc.target)){
							cs.clusterComplete++;
							checkComplete();
							return;	// skip
						}
					}
					$this.server(subDesc.clusterRemote, {session:w.getSession()}).dispatch(clusterRemoteIds[i], w, msg, params, function(ret){
						storeDispatchResult(ret, subDesc);
						cs.clusterComplete++;
						if(opts && opts.onRespond && $jsb.isFunction(opts.onRespond)){
							if(opts.onRespond.call(w, subDesc.target, ret)){
								cs.bStopFlag = true;
							}
						}
						checkComplete();
					});
				})(i);
			}
		}
	},

	$server: {
		cluster: null,

		$constructor: function(){
			$base();
			JSB().setMessageBus(this);
			JSB.getRepository().ensureLoaded(function(){
				$this.cluster = JSB.getClusterProvider();
				if($this.cluster.isActive()){
					$this._collectClusterSubscriptionsFromNodes();
				}
			});
		},

		_collectClusterSubscriptionsFromNodes: function(){
			var otherMembers = $this.cluster.getMembers(true);
			for(var addr in otherMembers){
				$this.server(addr)._invokeClusterSubscriptions(this.cluster.getNodeAddress());
			}
		},

		_invokeClusterSubscriptions: function(addr){
			var remoteClusterLst = [];
			// combine
			for(var callId in $this.callIdx){
				var msgDesc = $this.callIdx[callId];
				if(msgDesc.cluster && !msgDesc.clusterRemote){
					var w = msgDesc.target;
					var cpMsgDesc = JSB.clone(msgDesc);
					if(cpMsgDesc.c){
						delete cpMsgDesc.c;
					}
					if(cpMsgDesc.target){
						delete cpMsgDesc.target;
					}
					cpMsgDesc.clusterRemote = this.cluster.getNodeAddress();
					this.server(addr, {session: w.getSession()})._subscribe(w, cpMsgDesc);
				}
			}
		},

		_subscribeRemoteNodes: function(w, msgObj){
			if(!this.cluster.isActive()){
				return;
			}
			var otherMembers = this.cluster.getMembers(true);
			var nMsgObj = JSB.merge({}, msgObj, {clusterRemote: this.cluster.getNodeAddress()});
			for(var mAddr in otherMembers){
				this.server(mAddr, {session: w.getSession()})._subscribe(w, nMsgObj);
			}
		},

		_unsubscribeRemoteNodes: function(w, msgObj){
			if(!this.cluster.isActive()){
				return;
			}
			var otherMembers = this.cluster.getMembers(true);
			var nMsgObj = JSB.merge({}, msgObj, {clusterRemote: this.cluster.getNodeAddress()});
			for(var mAddr in otherMembers){
				this.server(mAddr, {session: w.getSession()})._unsubscribe(w, nMsgObj);
			}
		}
	}

});

JSB({
	$name: 'JSB.Base64',
	$singleton: true,
	$constructor: function(){
		JSB().addLibraryScope('Base64', this);
	},

	$client: {
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		encode: function(bytes){

			function Uint8ArrayToBase64(bytes) {
				var base64    = '';
				var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

				var byteLength    = bytes.byteLength;
				var byteRemainder = byteLength % 3;
				var mainLength    = byteLength - byteRemainder;

				var a, b, c, d;
				var chunk;

				// Main loop deals with bytes in chunks of 3
				for (var i = 0; i < mainLength; i = i + 3) {
					// Combine the three bytes into a single integer
					chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

					// Use bitmasks to extract 6-bit segments from the triplet
					a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
					b = (chunk & 258048)   >> 12; // 258048   = (2^6 - 1) << 12
					c = (chunk & 4032)     >>  6; // 4032     = (2^6 - 1) << 6
					d = chunk & 63;               // 63       = 2^6 - 1

					// Convert the raw binary segments to the appropriate ASCII encoding
					base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
				}

				// Deal with the remaining bytes and padding
				if (byteRemainder == 1) {
					chunk = bytes[mainLength];

					a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

					// Set the 4 least significant bits to zero
					b = (chunk & 3)   << 4; // 3   = 2^2 - 1

					base64 += encodings[a] + encodings[b] + '==';
				} else if (byteRemainder == 2) {
					chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

					a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
					b = (chunk & 1008)  >>  4; // 1008  = (2^6 - 1) << 4

					// Set the 2 least significant bits to zero
					c = (chunk & 15)    <<  2; // 15    = 2^4 - 1

					base64 += encodings[a] + encodings[b] + encodings[c] + '=';
				}

				return base64;
			}

			var binary = '';
			var buffer = null;
			if($jsb.isArrayBuffer(bytes)){
				buffer = new Uint8Array(bytes);
			} else if($jsb.isUint8Array(bytes)){
				buffer = bytes;
			} else if($jsb.isArrayBufferView(bytes)){
				buffer = new Uint8Array(bytes.buffer);
			} else if($jsb.isString(bytes)){
				binary = bytes;
			} else {
				throw new Error('Error');
			}
			if(buffer){
				var base64 = Uint8ArrayToBase64(buffer);
				return base64;
			}
		    return JSB().Window.btoa( binary );
		},

		decode: function(base64){
			function removePaddingChars(input){
				var lkey = $this._keyStr.indexOf(input.charAt(input.length - 1));
				if(lkey == 64){
					return input.substring(0,input.length - 1);
				}
				return input;
			}

			base64 = removePaddingChars(base64);
			base64 = removePaddingChars(base64);

			var decodedSize = (base64.length / 4) * 3;
			var bytes = new Uint8Array(decodedSize);

			base64 = base64.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			var enc1, enc2, enc3, enc4;
			var chr1, chr2, chr3;

			for(var i = 0, j = 0; i < decodedSize; i += 3){
				//get the 3 octects in 4 ascii chars
				enc1 = this._keyStr.indexOf(base64.charAt(j++));
				enc2 = this._keyStr.indexOf(base64.charAt(j++));
				enc3 = this._keyStr.indexOf(base64.charAt(j++));
				enc4 = this._keyStr.indexOf(base64.charAt(j++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				bytes[i] = chr1;
				if (enc3 != 64) bytes[i+1] = chr2;
				if (enc4 != 64) bytes[i+2] = chr3;
			}
/*
			var binary =  JSB().Window.atob(base64);
		    var len = binary.length;
		    var bytes = new Uint8Array( len );
		    for (var i = 0; i < len; i++)        {
		        bytes[i] = binary.charCodeAt(i);
		    }
*/
		    return bytes.buffer;
		}
	},

	$server: {
		$require: ['java:org.jsbeans.helpers.BufferHelper'],
		encode: function(bytes){
			var buffer = null;
			if($jsb.isArrayBuffer(bytes)){
				buffer = bytes;
			} else if($jsb.isArrayBufferView(bytes)){
				buffer = bytes.buffer;
			} else if($jsb.isString(bytes)) {
				buffer = bytes;
			} else {
				throw new Error('Error');
			}
			return '' + BufferHelper.base64Encode(buffer);
		},

		decode: function(str){
			return BufferHelper.base64Decode(str);
		}
	}
});

JSB({
	$name: 'JSB.Locker',
	$singleton: true,
	$constructor: function(){
		JSB().setLocker(this);
	},

	lock: function(){},
	unlock: function(){},
	clearLock: function(){}
});


JSB({
	$name: 'JSB.Logger',
	$singleton: true,
	$client: {
		$constructor: function(){
			JSB().setLogger(this);
		},

		_prepareObj: function(obj){
			if($jsb.isObject(obj) || $jsb.isError(obj)){
				if(obj.message){
					// prepare message
					var msg = '';
					if(obj.name){
						msg += obj.name;
					}
					if(obj.fileName){
						msg += '(' + obj.fileName;
						if(!$jsb.isNull(obj.lineNumber)){
							msg += '#' + obj.lineNumber;
						}
						msg += ')'
					}
					if(msg.length > 0){
						msg += ': ';
					}
					msg += obj.message;
					if(obj.stack){
						msg += '\r\n' + obj.stack;
					}
					return msg;
				} else {
					return JSON.stringify(obj);
				}
			} else if($jsb.isArray(obj)){
				return JSON.stringify(obj);
			} else {
				return obj;
			}
		},

		_createTimeString: function(){
			var t = new Date();
			return '' + t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds() + ',' + t.getMilliseconds();
		},

		info: function(str){
			console.log(this._createTimeString() + ' [INFO] ' + this._prepareObj(str));
		},
		debug: function(str){
			console.log(this._createTimeString() + ' [DEBUG] ' + this._prepareObj(str));
		},
		warn: function(str){
			console.log(this._createTimeString() + ' [WARNING] ' + this._prepareObj(str));
		},
		error: function(str){
			console.log(this._createTimeString() + ' [ERROR] ' + this._prepareObj(str));
		}
	}
});

JSB({
	$name: 'JSB.AjaxProvider',
	$singleton: true,
	$client:{
		$constructor: function(){
			$base();
			this.curDeferTimeout = this.options.minDeferTimeout;
			if(JSB().getProvider()){
				JSB().getProvider().enableServerClientCallTracking(false);
			}
			JSB().setProvider(this);
			this.enableServerClientCallTracking(true);
		},

		options: {
			minDeferTimeout: 5000,	// 5 sec
			maxDeferTimeout: 60000,	// 60 sec

			minScInterval: 1,
			maxScInterval: 4096,
			defScInterval: 256
		},

		queueToSend: {},
		queueToCheck: {},
		rpcEntryMap: {},
		rpcTimeout: null,
		batchStartTime: null,
		lastTrackId: null,

		// vars
		cmdTimeoutVal: 0,
		bulkTimeoutVal: 300,
		updateRpcTimeout: 300,
		maxBatchSize: 30,
		crossDomainBatchSize: 1,
		runTag: null,

		// methods
		getServerBase: function(){
			if(!JSB().isNull(this.basePath)){
				return this.basePath;
			}
			return "";
		},

		setServerBase: function(base){
			if(!JSB().isString(base)){
				return;
			}
			this.basePath = base;
			if(JSB().isNull(this.basePath)){
				return;
			}
			if(JSB().isClient()){
				if(document.URL.indexOf(this.basePath) >= 0){
					this.crossDomain = false;
				} else {
					this.crossDomain = true;
					this.maxBatchSize = this.crossDomainBatchSize;
				}
			}
			var ch = this.basePath.charAt(this.basePath.length - 1);
			if(ch != '/' && ch != '\\'){
				this.basePath += '/';
			}
		},

		loadObject: function(className, callback){
			this.ajax(this.getServerBase() + 'jsb', {
				cmd: 'get',
				name: className
			}, function(status,obj){
				if(status == 'success'){
					if(JSB.isString(obj)){
						obj = eval('(' + obj + ')');
					}
					var jsoRes = obj.result;
					if(JSB.isArray(jsoRes)){
						for(var i in jsoRes){
							if(jsoRes[i] != null && jsoRes[i] != undefined){
								if(JSB.isNull(JSB().initQueue)){
									JSB().initQueue = {};
								}
								JSB().initQueue[jsoRes[i].$name] = true;
							}
						}
						for(var i in jsoRes){
							if(jsoRes[i] != null && jsoRes[i] != undefined){
								JSB(jsoRes[i]);
							}
						}
					} else {
						if(jsoRes != null && jsoRes != undefined){
							JSB(jsoRes);
						}
					}
				} else {
					// TODO: unable to lookup object
				}
			});
		},

		xhr: function(xhrObj){

			function setRunTag(runTag){
				if(!runTag){
					return;
				}
				if($this.runTag && runTag && $this.runTag != runTag){
					$this.publish('JSB.AjaxProvider.serverReloaded', {oldTag: $this.runTag, newTag: runTag});
				}
				$this.runTag = runTag;
			}

			function getXHR(){
				var xmlhttp;
				try {
					xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (E) {
						xmlhttp = false;
					}
				}
				if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
					xmlhttp = new XMLHttpRequest();
				}
				return xmlhttp;
			}
			var xhr = getXHR();
			var url = xhrObj.url;
			if(!xhrObj.type){
				xhrObj.type = 'GET';
			} else {
				xhrObj.type = xhrObj.type.toUpperCase();
			}
			if(!xhrObj.dataType){
				xhrObj.dataType = 'text';
			}

			// prepare params
			var params = '';
			if(JSB.isObject(xhrObj.data)){
				for(var i in xhrObj.data){
					if(params.length > 0){
						params += '&';
					}
					var pObj = xhrObj.data[i];
					if(JSB().isPlainObject(pObj) || JSB().isArray(pObj)){
						pObj = JSON.stringify(pObj);
					}
					params += i + '=' + encodeURIComponent(pObj);
				}
			} else {
				params = xhrObj.data;
			}

			// combine url and params if GET
			if(xhrObj.type == 'GET' || xhrObj.dataType == 'jsonp'){
				if(url.indexOf('?') == -1){
					url += '?';
				} else {
					url += '&';
				}
				url += params;
				params = null;
			}

/*			
			// append session id in url param in case of iframe
			if(JSB().isIframe()){
				if(url.indexOf('?') == -1){
					url += '?';
				} else {
					url += '&';
				}
				url += JSB().getSessionIdParameterName() + '=' + JSB().getCurrentSession();
			}
*/

			if(xhrObj.dataType == 'jsonp'){
				// prepare result callback
				var cName = 'c' + JSB().generateUid();
				JSB().scriptCallbacks = JSB().scriptCallbacks || {};
				JSB().scriptCallbacks[cName] = function(resdata){
					// remove callback
					delete JSB().scriptCallbacks[cName];
					_oHead.removeChild( _s);
					// parse result
					xhrObj.success(resdata, 200, null);
				}

				if(url.indexOf('?') == -1){
					url += '?';
				} else {
					url += '&';
				}
				url += 'callback=JSB().scriptCallbacks.' + cName;
				
				// append session id param
				url += '&' + JSB().getSessionIdParameterName() + '=' + JSB().getCurrentSession();

				// send via script tag
				var _s = document.createElement("script");
			    _s.type = "text/javascript";
			    if(url.indexOf('http') == -1){
			    	_s.src = self.getProvider().getServerBase() + url;
			    } else {
			    	_s.src = url;
			    }
			    var _oHead = document.getElementsByTagName('HEAD').item(0);
			    _oHead.appendChild( _s);

			} else {
				// send via xhr
				var to = null;
				xhr.open(xhrObj.type, url, true);
				if(xhrObj.type == 'POST'){
					if(params && !JSB.isObject(params) && !JSB.isString(params)){
						//xhr.setRequestHeader('Content-Type', 'application/octet-stream');
					} else {
						xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
					}
				}
				if (xhr.overrideMimeType) {
					xhr.overrideMimeType("application/json");
				}
				if(xhrObj.headerProps && Object.keys(xhrObj.headerProps).length > 0){
					for(var hp in xhrObj.headerProps){
						xhr.setRequestHeader(hp, xhrObj.headerProps[hp]);
					}
				}
				xhr.onreadystatechange = function(){
					if(xhr.readyState != 4) return;
					window.clearTimeout(to);
					$this.publish('JSB.AjaxProvider.xhrStatus', xhr.status);
					if (xhr.status == 200) {
						setRunTag(xhr.getResponseHeader('Run-Tag'));
						if(xhrObj.success){
							var resdata = xhr.responseText;
							if(xhrObj.dataType == 'json'){
								resdata = eval('('+xhr.responseText+')');
							}
							xhrObj.success(resdata, xhr.status, xhr);
						}
					} else {
						if(xhrObj.error){
							xhrObj.error(xhr, xhr.status, xhr.statusText);
						}
					}
				}

				if(JSB.isDefined(xhrObj.timeout) && xhrObj.timeout > 0){
					to = window.setTimeout(function(){
						xhr.abort();
						if(xhrObj.error){
							xhrObj.error(xhr, -1, 'XHR timeout');
						}
					}, xhrObj.timeout);
				}

				xhr.send(params);
			}
		},

		ajax: function(url, params, callback, opts){
			var self = this;
			var timeout = opts && opts.timeout;
			if(!JSB.isDefined(timeout)){
				timeout = 100000; // 100 secs
			}
			if(this.crossDomain){
				this.xhr({
					url: url,
					data: params,
					dataType: 'jsonp',
					timeout: timeout,
					headerProps: opts && opts.headerProps,
					success: function(data, status, xhr){
						self.curDeferTimeout = self.options.minDeferTimeout;
						var respObj = data;
						//self.decodeObject(respObj);
						callback('success', respObj);
					},
					error: function(xhr, status, err){
						if(xhr.status == 404 || xhr.status == 401){
							self.curDeferTimeout = self.options.minDeferTimeout;
							callback(status, xhr);
						} else {
							self.curDeferTimeout *= 2;
							if(self.curDeferTimeout > self.options.maxDeferTimeout) {
								self.curDeferTimeout = self.options.maxDeferTimeout;
							}
							JSB.defer(function(){
								self.ajax(url, params, callback, opts);
							}, self.curDeferTimeout);
						}
					}
				});
			} else {
				var method = opts && opts.method || 'post';
				var needRequest = true;
				var triggerKey = null;
				if(method.toLowerCase() == 'get'){
					triggerKey = 'ajax_get_' + url;
					if($this.existTrigger(triggerKey)){
						needRequest = false;
					}
					$this.ensureTrigger(triggerKey, function(val){
						callback(val.status, val.data);
					}, function(val){
						return JSB.isDefined(val);
					})

				}
				function doXHR(){
					$this.xhr({
						url: url,
						data: params,
						type: method,
						timeout: timeout,
						headerProps: opts && opts.headerProps,
						success: function(data, status, xhr){
							self.curDeferTimeout = self.options.minDeferTimeout;
							if(triggerKey){
								$this.setTrigger(triggerKey, {
									status: 'success',
									data: data
								})
							} else {
								callback('success', data);
							}

						},
						error: function(xhr, status, err){
							if(xhr.status == 404 || xhr.status == 401){
								self.curDeferTimeout = self.options.minDeferTimeout;
								if(triggerKey){
									$this.setTrigger(triggerKey, {
										status: 'error',
										data: xhr
									})
								} else {
									callback('error', xhr);
								}
							} else {
								self.curDeferTimeout *= 2;
								if(self.curDeferTimeout > self.options.maxDeferTimeout) {
									self.curDeferTimeout = self.options.maxDeferTimeout;
								}
								JSB.defer(function(){
									doXHR();
								}, self.curDeferTimeout);
							}
						}
					});
				}

				if(needRequest){
					doXHR();
				}
			}
		},
/*
		decodeObject: function(obj){
			if( typeof(obj) === 'object' ){
				for( var key in obj ) {
					var newKey = null;
					try {
						newKey = decodeURIComponent(key);
					}catch(e){
						debugger;
						newKey = key;
					}
					if(newKey != key){
						obj[newKey] = obj[key];
						delete obj[key];
						key = newKey;
					}
					if(typeof(obj[key]) === 'object'){
						this.decodeObject(obj[key]);
					} else if(typeof(obj[key]) === 'string'){
						try {
							obj[key] = decodeURIComponent(obj[key]);
						}catch(e){
							debugger;
						}
					}
				}
			} else if(typeof(obj) === 'array') {
				for( var i = 0; i < obj.length; i++ ) {
					if(typeof(obj[i]) === 'object'){
						this.decodeObject(obj[i]);
					} else if(typeof(obj[i]) === 'string'){
						try {
							obj[i] = decodeURIComponent(obj[i]);
						}catch(e){
							debugger;
						}
					}

				}
			}
		},
*/

		// on clinet side
		enqueueRpc: function(cmd, callback){
			var id = JSB().generateUid();
			this.queueToSend[id] = {
				cmd: JSB().merge(cmd,{id:id}),
				callback: callback
			};
			this.updateRpc();
			return id;
		},

		updateRpc: function(){
			var self = this;
			if(this.batchStartTime == null ){
				this.batchStartTime = Date.now();
			} else if(Date.now() - this.batchStartTime > this.bulkTimeoutVal){
				return;
			}
			if(this.rpcTimeout != null){
				JSB().Window.clearTimeout(this.rpcTimeout);
			}
			this.rpcTimeout = JSB().Window.setTimeout(function(){
				self.doRpc();
				self.batchStartTime = null;
				self.rpcTimeout = null;
			}, this.cmdTimeoutVal);
		},

		translateStreaming: function(entry){
			var p = entry.cmd.params;
			if(p && p.__di){
				// look for object for streamed transfer
				for(var i = 0; i < p.__di.length; i++){
					var dDesc = p.__di[i];
					if(dDesc.d.__type == 'File'){
						$this.ajax($this.getServerBase() + 'jsb?cmd=upload&id=' + dDesc.d.__id, dDesc.d.__data, function(res, obj){
						}, {timeout: 0, headerProps: {'Content-Length':dDesc.d.__data.size, 'Access-Control-Allow-Origin': '*'}});
						delete dDesc.d.__data;
					}
				}
			}
		},

		doRpc: function(){
			var self = this;
			var rpcBatch = [];

			// place new queries into batch
			for(var id in this.queueToSend){
				var entry = this.queueToSend[id];
				this.translateStreaming(entry);
				rpcBatch.push(entry.cmd);
				this.rpcEntryMap[id] = entry;
			}
			this.queueToSend = {};

			if( rpcBatch.length > 0 ){
				// split batch into several batches
				var lastOffset = 0;
				while(lastOffset < rpcBatch.length){
					var curBatch = rpcBatch.slice(lastOffset, Math.min(rpcBatch.length, lastOffset + this.maxBatchSize));
					if(curBatch.length === 0){
						break;
					}
					lastOffset += curBatch.length;

					var cmdStr = JSON.stringify(curBatch);
					this.ajax(this.getServerBase() + 'jsb', {
						cmd: 'rpc',
						data: encodeURIComponent(cmdStr)
					},function(res, obj){
						if(res == 'error'){
							// communication error - try in 5 seconds
							JSB().defer(function(){
								self.updateRpc();
							}, 5000);
						} else {
							if(JSB.isString(obj)){
								obj = eval('(' + obj + ')');
							}
							self.handleRpcResponse(obj.result);
						}
					});
				}

			}
		},

		handleRpcResponse: function(rpcResp){
			var self = this;
			var needEnforce = false;
			for(var i = 0; i < rpcResp.length; i++){
				var rpcEntry = rpcResp[i];
				if(!rpcEntry || JSB().isNull(rpcEntry.completed) || !rpcEntry.id){
					continue;
				}
				if(rpcEntry.completed){
					if(this.rpcEntryMap[rpcEntry.id] && !JSB().isNull(this.rpcEntryMap[rpcEntry.id].callback)){
						(function(success, callback, result, error){
							JSB().defer(function(){
								if(success){
									callback(result);
								} else {
									callback(undefined, error);
								}
							}, 0);
						})(rpcEntry.success, this.rpcEntryMap[rpcEntry.id].callback, rpcEntry.result, rpcEntry.error);
					}
					if(this.rpcEntryMap[rpcEntry.id]){
						delete this.rpcEntryMap[rpcEntry.id];
					}
				} else {
					needEnforce = true;
				}
			}
			if(needEnforce){
				JSB.defer(function(){
					self.enforceServerClientCallTracking(true);
				}, 0, '_jsb_enforceScc' + this.getId());
			}
			var doUpdate = false;
			if(Object.keys(this.queueToSend).length > 0){
				doUpdate = true;
			}
			if(doUpdate){
				JSB().defer(function(){
					self.updateRpc();
				}, this.updateRpcTimeout);
			}
		},

		enforceServerClientCallTracking: function(bEnable){
			if(!this.serverClientCallTrackInterval){
				return;
			}
			var newInterval = this.serverClientCallTrackInterval;
			if(newInterval > this.options.defScInterval){
				newInterval = this.options.defScInterval;
			} else {
				newInterval *= 0.5;
				if(newInterval < this.options.minScInterval){
					newInterval = this.options.minScInterval;
				}
			}
			if(this.serverClientCallTrackInterval != newInterval){
				if(bEnable){
					this.enableServerClientCallTracking(newInterval);
				} else {
					this.serverClientCallTrackInterval = newInterval;
				}
			}
		},

		slowDownServerClientCallTracking: function(){
			if(!this.serverClientCallTrackInterval){
				return;
			}
			var newInterval = this.serverClientCallTrackInterval * 1.5;
			if(newInterval > this.options.maxScInterval){
				newInterval = this.options.maxScInterval;
			}
			this.serverClientCallTrackInterval = newInterval;
		},

		enableServerClientCallTracking: function(trackInterval){
			var self = this;

			if(JSB.isNull(trackInterval)){
				trackInterval = this.options.maxScInterval;
			}

			if(trackInterval == false){
				trackInterval = 0;
			}

			if(trackInterval == true){
				trackInterval = this.options.maxScInterval;
				$this.serverClientCallTrackInterval = trackInterval;
				_doTrack();
/*				
				JSB().defer(function(){
					_doTrack();
				}, $this.serverClientCallTrackInterval, '_jsb_scct_' + $this.getId());
*/				
				return;
			}

			if(this.serverClientCallTrackInterval == trackInterval){
				return;
			}

			if(this.serverClientCallTrackInterval && trackInterval > this.serverClientCallTrackInterval){
				this.serverClientCallTrackInterval = trackInterval;
				return;
			}

			this.serverClientCallTrackInterval = trackInterval;

			function _doTrack(){
				if($this._tracking){
					return;
				}
				$this._tracking = true;
				self.rpc('getServerClientCallSlice', [self.lastTrackId], function(res){
					self.lastTrackId = res.lastId;
					var entries = res.slice;
					try {
						// do something with slice
						for(var i = 0; i < entries.length; i++){
							var entry = entries[i];
							for(var j = 0; j < entry.clientIds.length; j++){
								var clientId = entry.clientIds[j];
								var clientInstance = JSB().getInstance(clientId);
								if(clientInstance && clientInstance[entry.proc]){
									(function(cInst, proc, params, respond, id, cId){
										function doCall(p){
											JSB.defer(function(){
												var result = null;
												var fail = null;
												try {
													if(JSB().isArray(p)){
														result = cInst[proc].apply(cInst, p);
													} else {
														result = cInst[proc].call(cInst, p);
													}
												} catch(e){
													result = null;
													fail = e;
												}
												if(respond){
													self.rpc('submitServerClientCallResult', {
														id: id,
														clientId: cId,
														result: result,
														fail: fail
													}, null, {sync:true});
												}
											}, 0);
										}
										JSB().injectComplexObjects(params, doCall);
									})(clientInstance, entry.proc, entry.params, entry.respond, entry.id, clientId);
								}
							}
						}
					} finally {
						
						if(self.serverClientCallTrackInterval){
							if(entries.length === 0){
								self.slowDownServerClientCallTracking();
							} else {
								self.enforceServerClientCallTracking();
							}

							JSB().defer(function(){
								_doTrack();
							}, self.serverClientCallTrackInterval, '_jsb_scct_' + $this.getId());
						}
						$this._tracking = false;
					}
				}, {sync: true, plain:true});
			}

			if(self.serverClientCallTrackInterval){
				JSB().defer(function(){
					_doTrack();
				}, self.serverClientCallTrackInterval, '_jsb_scct_' + $this.getId());
			}
		}

	},

	$server: {
		rpcQueueFirst: null,
		rpcQueueLast: null,
		rpcMap: {},
		uploadMap: {},

		maxBatchSize: 10,

		$constructor: function(){
			$base();
			if(JSB().getProvider()){
				JSB().getProvider().enableRpcCleanup(false);
			}
			JSB().setProvider(this);
			this.enableRpcCleanup(true);
		},

		performUpload: function(streamId, javaStream){
			JSB.getLogger().debug('performUpload: ' + streamId);
			
			// create proxy file stream
			var StreamClass = JSB().get('JSB.IO.Stream').getClass();
			var ProxyStreamClass = JSB().get('JSB.IO.ProxyStream').getClass();
			var stream = new StreamClass(javaStream);
			var fs = JSB().getInstance('JSB.IO.FileSystem');
			var cfg = JSB().getInstance('JSB.System.Config');
			var uploadFileDir = fs.join(fs.getUserDirectory(), cfg.get('web.uploadCacheFolder'));
			// create directory if not existed
			if(!fs.exists(uploadFileDir)){
				fs.createDirectory(uploadFileDir, true);
			}

			var uploadFilePath = fs.join(uploadFileDir, streamId + '.upload');
			var writeStream = fs.open(uploadFilePath, {write:true, binary:true});
			var readStream = fs.open(uploadFilePath, {read:true, binary:true});
			var proxyStream = new ProxyStreamClass(writeStream, readStream, {
				onWriteComplete: function(){
					writeStream.close();
					stream.close();
				},
				onReadComplete: function(){
					readStream.close();
					proxyStream.destroy();
					// remove file
					if(fs.exists(uploadFilePath)){
						fs.remove(uploadFilePath);
					}
				}
			});

			this.lock('uploadMap');
			this.uploadMap[streamId] = proxyStream;
			this.unlock('uploadMap');

			// start reading in parallel thread
			JSB.defer(function(){
				stream.copy(proxyStream);
				proxyStream.complete();
				$this.setTrigger('uploadMap' + streamId);
			}, 0);

		},

		ensureUpload: function(streamId, callback){
			var key = 'uploadMap' + streamId;
			this.ensureTrigger(key, function(){
				$this.lock('uploadMap');
				var javaStream = $this.uploadMap[streamId];
				delete $this.uploadMap[streamId];
				$this.unlock('uploadMap');
				$this.removeTrigger(key);
				callback.call($this, javaStream);
			});
		},

		performRpc: function(jsoName, instanceId, procName, params, rpcId){
			var np = {};
			var ret = null, fail = null, plain = false;

			$jsb.injectComplexObjects(params, function(r){
				np.res = r;
				try {
					ret = $this.executeClientRpc(jsoName, instanceId, procName, np.res);
					if(JSB.isRpcResponse(ret)){
						plain = ret.isPlain();
						ret = ret.getValue();
					}
				} catch(e){
					fail = e;
					if($jsb.getLogger()){
						$jsb.getLogger().error(e);
					}
					if(!rpcId){
						throw e;
					}
				}
				if(rpcId){
					var respPacket = {
						id: rpcId,
						completed: true,
						result: null,
						error: null,
					};
					var rpcOpts = {
						session:JSB.getCurrentSession()
					};
					if(JSB.isFuture(ret)){
						ret.await(function(ret, fail){
							if(fail){
								respPacket.error = fail;
								respPacket.success = false;
							} else {
								if(JSB.isRpcResponse(ret)){
									plain = ret.isPlain();
									ret = ret.getValue();
								}
								respPacket.result = ret;
								respPacket.success = true;
							}
							rpcOpts.plain = plain;
							$this.rpc('handleRpcResponse', [[respPacket]], null, rpcOpts);
						});
					} else {
						if(fail){
							respPacket.error = fail;
							respPacket.success = false;
						} else {
							respPacket.result = ret;
							respPacket.success = true;
						}
						rpcOpts.plain = plain;
						$this.rpc('handleRpcResponse', [[respPacket]], null, rpcOpts);
					}
				}
			});

			if(!rpcId){
				if(!JSB.isDefined(np.res)){
					throw new Error("Synchronous RPC don't support streamed transfers");
				}
				if(JSB.isFuture(ret)){
					throw new Error("Synchronous RPC don't support futures");
				}
				return $jsb.unwindComplexObjects(ret, plain);
			}
		},


		executeClientRpc: function(jsbName, instanceId, procName, params){
			var serverInstance = JSB().constructServerInstanceFromClientId(jsbName, instanceId);
			if(!serverInstance){
				throw new Error('Unable to find Bean server instance: ' + jsbName + '(' + instanceId + ')');
			}

			if(!serverInstance[procName]){
				throw new Error('Failed to call method "' + procName + '" in bean "' + jsbName + '". Method not exists');
			}

			var res = null;

			if(JSB().isArray(params)){
				res = serverInstance[procName].apply(serverInstance, params);
			} else {
				res = serverInstance[procName].call(serverInstance, params);
			}
			return res;
		},

		executeServerRpc: function(jsbName, instanceId, procName, params){
			var serverInstance = JSB().constructServerInstanceFromServerId(jsbName, instanceId);
			if(!serverInstance){
				throw new Error('Unable to find Bean server instance: ' + jsbName + '(' + instanceId + ')');
			}

			if(!serverInstance[procName]){
				throw new Error('Failed to call method "' + procName + '" in bean "' + jsbName + '". Method not exists');
			}
			var np = {};
			$jsb.injectComplexObjects(params, function(r){
				np.res = r;
			},{serverRemote: true});
			params = np.res;
			if(JSB().isArray(params)){
				return serverInstance[procName].apply(serverInstance, params);
			}
			return serverInstance[procName].call(serverInstance, params);
		},

		enableRpcCleanup: function(b){
			var self = this;
			var cleanupInterval = 60000;	// 1 min
			var invalidateInterval = 300000;	// 5 min

			if(this.rpcCleanupEnabled == b){
				return;
			}

			this.rpcCleanupEnabled = b;

			function _doCleanup(){
				if(self.rpcQueueFirst){
					// perform cleanup
					var timestamp = Date.now();
					var locker = JSB().getLocker();
					locker.lock('_jsb_rpcQueue');
					var curEntry = self.rpcQueueFirst;
					while(curEntry){
						if(timestamp - curEntry.timestamp < invalidateInterval){
							break;
						}
						var nextEntry = curEntry.next;
						if(self.rpcQueueFirst == curEntry){
							self.rpcQueueFirst = nextEntry;
						}
						if(self.rpcQueueLast == curEntry){
							self.rpcQueueLast = nextEntry;
						}
						delete self.rpcMap[curEntry.id];
						curEntry = nextEntry;
					}
					locker.unlock('_jsb_rpcQueue');
				}
				if(self.rpcCleanupEnabled){
					JSB().defer(function(){
						_doCleanup();
					}, cleanupInterval, '_jsb_rpcCleanup');
				}
			}

			if(b){
				_doCleanup();
			}
		},

		// on server side
		enqueueRpc: function(cmd){
			// cmd.instance
			// cmd.proc
			// cmd.params
			var entry = {
				id: JSB.generateUid(),
				timestamp: Date.now(),
				instance: cmd.instance,
				proc: cmd.proc,
				params: cmd.params,
				callback: cmd.callback,
				session: cmd.session,
				next: null
			};

			var locker = JSB().getLocker();
			locker.lock('_jsb_rpcQueue');
			if(this.rpcQueueLast && this.rpcQueueLast.timestamp >= entry.timestamp){
				entry.timestamp = this.rpcQueueLast.timestamp + 1;
			}
			this.rpcMap[entry.id] = entry;
			if(!this.rpcQueueFirst){
				this.rpcQueueFirst = entry;
			}
			if(this.rpcQueueLast) {
				this.rpcQueueLast.next = entry;
				this.rpcQueueLast = entry;
			} else {
				this.rpcQueueLast = this.rpcQueueFirst;
			}

			locker.unlock('_jsb_rpcQueue');
		},

		getServerClientCallSlice: function(fromId){
			var slice = [];

			if(!fromId){
				if(this.rpcQueueLast){
					return {
						lastId: this.rpcQueueLast.id,
						slice: slice
					};
				} else {
					return {
						lastId: '__',
						slice: slice
					};
				}
			}

			var lastId = fromId;
			var fromEntry = this.rpcMap[fromId];
			if(fromEntry){
				fromEntry = fromEntry.next;
			} else {
				fromEntry = this.rpcQueueFirst;
			}
			var reverseBindMap = JSB().getReverseBindMap();
			while(fromEntry){
				lastId = fromEntry.id;
				var clientIdMap = reverseBindMap[fromEntry.instance.getId()];
				if(clientIdMap && (JSB().isNull(fromEntry.session) || fromEntry.session == JSB().getCurrentSession())){
					slice.push({
						id: fromEntry.id,
						clientIds: Object.keys(clientIdMap),
						proc: fromEntry.proc,
						params: fromEntry.params,
						respond: (fromEntry.callback ? true: false)
					});
					if(slice.length >= this.maxBatchSize){
						break;
					}
				}
				fromEntry = fromEntry.next;
			}

			// create response without complex objects to increase RPC result transfer speed
			return JSB.createRpcResponse({
				lastId: lastId,
				slice: slice
			},{plain:true});
		},
		
		submitServerClientCallResult: function(obj){
			var entry = this.rpcMap[obj.id];
			if(!entry){
				return;
			}
			if(entry.callback){
				JSB().defer(function(){
					entry.callback.call(entry.instance, obj.result, obj.fail, obj.clientId);
				}, 0);
			}
		}
			
	}
});

JSB({
	$name: 'JSB.Future',
	
	waiters: {},
	value: null,
	fail: null,
	fired: false,
	
	$constructor: function(opts){
		$base();
		
		this.timeout = 300000;	// 5 min by default
		if(opts && JSB.isNumber(opts.timeout)){
			this.timeout = opts.timeout;
		}
	},

	await: function(callback, opts){
		if(!callback){
			return;
		}
		if(this.fired){
			callback(this.value, this.fail);
			return;
		}
		var wId = JSB.generateUid();
		var timeout = (opts && opts.timeout) || this.timeout;
		this.waiters[wId] = {
			id: wId,
			callback: callback,
			opts: opts
		};
		JSB.defer(function(){
			if(!JSB.isDefined($this.waiters[wId]) || $this.fired){
				return;
			}
			var wDesc = $this.waiters[wId];
			delete $this.waiters[wId];
			wDesc.callback(undefined, new Error('Future timeout expire (' + (timeout / 1000).toFixed(2) + ' sec.)'));
			if(Object.keys($this.waiters).length == 0){
				$this.destroy();
			}
		}, timeout, 'JSB.Future.wait.' + wId);
	},
	
	
	fire: function(val, fail){
		this.value = val;
		this.fail = fail;
		this.fired = true;
		
		// stop all defers
		for(var wId in this.waiters){
			JSB.cancelDefer('JSB.Future.wait.' + wId);
		}
		
		// run callbacks
		for(var wId in this.waiters){
			this.waiters[wId].callback(val, fail);
		}
		
		this.waiters = {};
		this.destroy();
	}
	
});

JSB({
	$name: 'JSB.Profiler',
	$bootstrap: function(){
		var ProfileClass = this.getClass();
		JSB().setSystemProfiler(new ProfileClass());
	},
	
	$constructor: function(){},
	
	start: function(key){
		if(!key){
			return;
		}
		if(!this.profiles){
			this.profiles = {};
		}
		if(!this.profiles[key]){
			this.profiles[key] = {
				key: key,
				total: 0,
				average: 0,
				count: 0,
				last: 0
			};
		}
		this.profiles[key].last = Date.now();
	},
	stop: function(key){
		var l = Date.now();
		if(!this.profiles){
			this.profiles = {};
		}
		if(!key || !this.profiles[key]){
			return;
		}
		this.profiles[key].total += l - this.profiles[key].last;
		this.profiles[key].count++;
		this.profiles[key].average = this.profiles[key].total / this.profiles[key].count;
		this.profiles[key].last = new Date().getTime();
	},
	
	probe: function(key){
		if(this.lastProbe){
			this.stop(this.lastProbe);
		}
		this.lastProbe = key;
		if(key){
			this.start(key);
		}
	},
	
	clear: function(keys){
		this.lastProbe = null;
		if(!keys){
			this.profiles = {};
			return;
		}
		if(!JSB().isArray(keys)){
			keys = [keys];
		}
		if(!this.profiles){
			this.profiles = {};
		}
		for(var i in keys){
			if(this.profiles[keys[i]]){
				delete this.profiles[keys[i]];
			}
		}
	},
	
	dump: function(keys){
		var items = [];
		if(!this.profiles){
			this.profiles = {};
		}
		if(keys){
			if(!JSB().isArray(keys)){
				keys = [keys];
			}
			for(var i in keys){
				var key = keys[i];
				var obj = JSB().clone(this.profiles[key]);
				delete obj.last;
				items.push(obj);
			}
		} else {
			for(var i in this.profiles){
				var obj = JSB().clone(this.profiles[i]);
				delete obj.last;
				items.push(obj);
			}
		}
		// sort by total
		items.sort(function(a, b){
			return b.total - a.total;
		});
		
		return JSON.stringify(items, null, 2);
	},
	
	performInstrumentation: function(jsb, own){
		var self = this;
		var mtdNames = jsb.getMethods(own);
		var locker = JSB.getLocker();
		for(var i = 0; i < mtdNames.length; i++){
			if(mtdNames[i] == '$constructor'){
				continue;
			}
			(function(mtdName){
				var keyName = jsb.$name + '.' + mtdName;
				jsb.createMethodInterceptor(mtdName, function(originalProc, args){
					var l = Date.now();
					var res = originalProc.apply(this, args);
					var taken = Date.now() - l;

					locker.lock(keyName);
					if(!self.profiles){
						self.profiles = {};
					}
					if(!self.profiles[keyName]){
						self.profiles[keyName] = {
							key: keyName,
							total: 0,
							average: 0,
							count: 0,
							last: 0
						};
					}
					self.profiles[keyName].total += taken;
					self.profiles[keyName].count++;
					self.profiles[keyName].average = self.profiles[keyName].total / self.profiles[keyName].count;
					locker.unlock(keyName);
					
					return res; 
				});
			})(mtdNames[i]);
		}
		
	}
});
}