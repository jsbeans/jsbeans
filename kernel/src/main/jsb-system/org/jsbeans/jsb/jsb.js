/*! jsBeans v2.4.1 | jsbeans.org | (c) 2011-2017 Special Information Systems, LLC */
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
			cfg.$parent = 'JSB.Bean';
		}
		
		// insert into repo
		var repo = this.getRepository();
		if(repo){
			repo.registerLoaded(cfg, this);
		}
		
		if(cfg.$name != 'JSB.Bean'){
			var parentExisted = this.get(cfg.$parent);
			this.lookup(cfg.$parent, function(par){
				if(!par || !par.jsb || par.jsb.$name != cfg.$parent){
					throw 'Unable to create bean "' + cfg.$name + '" due to wrong parent specified: "' + cfg.$parent + '"' + (par && par.jsb ? '; found: '+par.jsb.$name: '');
				}
				self._create(cfg, par.jsb);
			});
		} else {
			this._create(cfg);
		}
		
		return this;
	}
	
	function JSO(cfg){
		if(cfg == null || cfg == undefined){
			return JSO.fn;
		}
		
		if(JSB().isArray(cfg)){
			var arr = [];
			for(var i in cfg){
				arr.push(JSO(cfg[i]));
			}
			return arr;
		}
		
		if(!cfg.$format){
			cfg.$format = 'jso';
		}
		return JSB(cfg);
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
	
	JSO.fn = JSO.prototype =
	JSB.fn = JSB.prototype = 
	{
		looking:{},
		requestedPackages:{},
		objects : {},
		groups: {},
		waiters: {},
		provider: null,
		repository: null,
		objectsToLoad: [],
		resourceLoaded: {},
		resourceScheduled: {},
		deferTimeoutMap: {},
		globalInstances: {},
		libraryScopes: {},
		threadLocal: null,
/*		fieldMaps: {},*/
		fieldArrs: {},
		syncScopes: {},
		
		support: {
			ownLast: checkOwnLast()
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
		
		eval: function(script, scopeVars, fName){
			if(this.isClient()){
				// generate scope vars
				for(var varName in scopeVars){
					eval('var ' + varName + ' = scopeVars["' + varName + '"];');
				}
				return eval('('+script+')');
			} else {
				var ctx = Packages.org.mozilla.javascript.Context.getCurrentContext();
				var scope = ctx.newObject(ctx.getThreadLocal('scope'));
				for(var varName in scopeVars){
					Packages.org.mozilla.javascript.ScriptableObject.putProperty(scope, varName, scopeVars[varName]);
				}
				var res = ctx.evaluateString(scope, '('+script+')', '' + scopeVars['$jsb'].$name + '.' + fName, 1, null);
				return res;
			}
		},
		
		getCurrentSession: function(){
			if(!this.isServer()){
				return null;
			}
			var session = Bridge.getCurrentSession();
			if(session){
				return '' + session;
			}
			return '';
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
			return this.hasKeywordOption('$singleton');
		},
		
		isFixedId: function(){
			return this.hasKeywordOption('$fixedId');
		},
		
		isSession: function(){
			/* TODO: make a valid session check*/
			return this.isSingleton() || this.isFixedId();
		},
		
		isSystem: function(name){
			if(!name){
				name = this.$name;
			}
			var sysMap = {
				'JSB.Bean': true,
				'JSB.Locker': true,
				'JSB.Logger': true,
				'JSB.AjaxProvider': true,
				'JSB.Repository': true,
				'JSB.Profiler': true
			};
			return sysMap[name] ? true: false;
		},
		
		register: function(obj, id){
			var scope, jsb;
			jsb = obj.getJsb();
			var isSingleton = jsb.isSingleton();
			var isFixedId = jsb.isFixedId();
			
			if(isSingleton || isFixedId){
				scope = this.getGlobalInstancesScope();
			} else {
				scope = this.getSessionInstancesScope();
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
			// repeating registration - wrong
			if(scope[obj.id] && (isSingleton || isFixedId)){
				var n = jsb.$name;
				if(isSingleton){
					this.getLogger().warn('Duplicate singleton instantiation: ' + n);
				} else {
					this.getLogger().warn('Duplicate fixedId bean instantiation: ' + obj.id);
				}
			}
			var tl = this.getThreadLocal();
			if(tl){
				var tc = tl.get('_jsoRegisterCallback');
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
		
		getBasePath: function(){
			if(this.$_path == null || this.$_path == undefined){
				return '';
			}
			if(this.$_path.length > 0 
					&& this.$_path[this.$_path.length] != '\\' 
					&& this.$_path[this.$_path.length] != '/' ){
				return this.$_path + '/';
			}
			return this.$_path;
		},
		
		getClientJSB: function(name){
			var clientFieldBlacklist = {
				'$server': true,
				'_descriptor': true,
				'$_clientProcs': true,
				'_ready': true,
				'_readyState': true,
				'_requireCnt': true,
				'_requireMap': true,
				'_cls': true,
				'_ctor': true,
				'_entryBootstrap': true,
				'_commonBootstrap': true
			};
			var jsb = this.get(name);
			if(JSB().isNull(jsb)){
				Log.error('Unable to find JSB: ' + name);
				return null;
			}
			
			var cJsb = {};
			for(var f in jsb){
				if(jsb.hasOwnProperty(f) && !clientFieldBlacklist[f]){
					cJsb[f] = jsb[f];
				}
			}
			return cJsb;
		},

		
		unregister: function(obj){
			var id = null;
			if(JSB().isString(obj)){
				id = obj;
			} else if(obj.getJsb() && obj.id){
				id = obj.id;
			}
			if(!id){
				return null;
			}
			if(JSB().getGlobalInstancesScope()[id]){
				var scope = JSB().getGlobalInstancesScope();
				delete scope[id];
			}
			if(this.getSessionInstancesScope()[id]){
				var scope = this.getSessionInstancesScope();
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
				throw 'Unable to create bean "' + cfg.$name + '" due to JSO format is no longer supported';
			}
			if(!this.isString(cfg.$name)){
				throw "Class name required to create managed object";
			}
			var self = this;
			var logger = this.getLogger();
			
			// copy all system fields into this
			for(var f in cfg){
				if(f && f.length > 0 && f[0] == '$'){
					this[f] = cfg[f];
				}
			}
			
			this._descriptor = cfg;
			this._ready = false;
			this._readyState = 0;
			
			// add to objects
			this.objects[this.$name] = this;
			
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
			
			// inherit parent's jso options
			var entry = this.currentSection();
			if(parent){
				var pe = parent.currentSection();
				var kfs = ['$singleton', '$globalize', '$fixedId', '$disableRpcInstance', '$sync'];
				for(var i = 0; i < kfs.length; i++){
					var key = kfs[i];
					if(parent.hasKeywordOption(key)){
						entry[key] = parent.hasKeywordOption(key);
					}
				}
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
				var kfs = ['$constructor', '$bootstrap', '$singleton', '$globalize', '$fixedId', '$disableRpcInstance', '$require', '$sync', '$client', '$server', '$name', '$parent', '$require'];
				for(var i = 0; i < kfs.length; i++ ){
					if(body[kfs[i]]){
						delete body[kfs[i]];
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
							if(alias.lastIndexOf('.') >= 0){
								alias = alias.substr(alias.lastIndexOf('.') + 1);
							}
							rObj[alias] = e;
							parseReqEntry(rObj);
						} else {
							// plain object
							for(var alias in e){
								var requiredJsb = e[alias];
								if(!self.isString(requiredJsb)){
									throw 'Invalid required entity declaration "' + JSON.stringify(requiredJsb) + '" in bean ' + self.$name;
								}
								if(requireMap[requiredJsb]){
									throw 'Duplicate require "' + requiredJsb + '" in bean ' + self.$name;
								} else {
									if(!self.isString(alias)){
										throw 'Invalid alias "' + JSON.stringify(alias) + '" in bean "'+self.$name+'" requirement';
									}
									if(!/^[A-Za-z_][A-Za-z_\d]*$/.test(alias)){
										throw 'Invalid alias "' + alias + '" in bean "'+self.$name+'" requirement';
									}
									if(reverseRequireMap[alias]){
										throw 'Duplicate require alias "' + alias + '" in bean ' + self.$name + '. Please choose another alias name';
									}
									requireMap[requiredJsb] = alias;
									reverseRequireMap[alias] = requiredJsb;
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
						
						for(var req in requireMap){
							(function(req){
								var alias = requireMap[req];
								self._lookupRequire(req, function(cls){
									
									if(locker)locker.lock('_jsb_lookupRequires_' + self.$name);
									rcWrap._requireCnt--;
									if(locker)locker.unlock('_jsb_lookupRequires_' + self.$name);
									
									requireVals[alias] = cls;
									
									if(rcWrap._requireCnt === 0){
										callback.call(self);
									}
								});
							})(req);
						}
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
/*					
					// propagate $server and $client
					var $serverFunc = function(inst){var f = function(){this.__instance = inst;}; f.prototype = inst.jsb.$_serverProcs; return new f();}
					var $clientFunc = function(inst){var f = function(){this.__instance = inst;}; f.prototype = inst.jsb.$_clientProcs; return new f();}
*/					
					
					var scopeVars = self.merge({
						'$jsb': $jsb,
						'$class': self._cls,
						'$parent': $parent,
						'$superFunc': $superFunc
					}, requireVals);
					
					// inject requires into scopeVars
					function injectRequire(reqAlias){
						var beanName = reverseRequireMap[reqAlias];
						return eval('(function '+reqAlias+'(){ var refBean = JSB.get("'+beanName+'"); var refCls = refBean.getClass(); refCls.apply(this, arguments); })');
					}
/*					
					for(var reqAlias in reverseRequireMap){
						scopeVars[reqAlias] = injectRequire(reqAlias)
					}
*/					
					function _enrichFunction(mtdName, proc, isCtor, isBootstrap){
						var procStr = proc.toString();
						// extract proc declaration
						var declM = procStr.match(/^\s*function\s*([^\(\s]*)\s*\(([^\)]*)\)\s*\{/);
						if(!declM){
							throw 'Internal error: wrong procStr: ' + procStr;
						}
						var fName = declM[1];
						if(fName.length === 0){
							fName = mtdName;
						}
						var procDecl = 'function ' + fName + '(' + declM[2] + '){ var $this=this; ';
						if(parent && !isBootstrap){ 
							procDecl += 'var $super = new $superFunc(this); ';
							if(isCtor){
								procDecl += 'var $base = function(){ $parent.apply($this, arguments); $this.$_superCalled = true; }; ';
							} else {
								procDecl += 'var $base = function(){return $super.'+mtdName+'.apply($super, arguments);}; ';
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
							return self.eval(procStr,scopeVars, fName);
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
									throw 'Invalid method name "' + mtdName + '" in bean ' + self.$name;
								}
								// private or protected method
								protectedMethod = true;
								
								if(mtdName[1] == '_'){
									if(mtdName.length < 3){
										throw 'Invalid method name "' + mtdName + '" in bean ' + self.$name;
									}
									
									// private method
									privateMethod = true;
								}
							}
							body[mtdName] = function(){
								var ctxStack = self.getCallingContext();
	/*							
								// perform access call check
								if(privateMethod){
									checkPrivate({
										jsb: self,
										methodName: mtdName
									}, ctxStack);
								} else if(protectedMethod){
									checkProtected({
										jsb: self,
										methodName: mtdName
									}, ctxStack);
								}
	*/
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
							}
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
					
					self._readyState = 2;
					self._matchWaiters(2);
					
					// wait until all requirements set ready state to 2 or greater
					self._waitRequires(2, function(){
						self._proceedBootstrapStage();
					});
				});

			} else {
				self._readyState = 2;
				self._matchWaiters(2);
				self._waitRequires(2, function(){
					self._proceedBootstrapStage();
				});
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
			for(var req in this._requireMap){
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
			
			if(this.isClient()){
				if(this.$client == null || this.$client == undefined){
					this.$client = {};
				}
			} else {
				if(this.$server == null || this.$server == undefined){
					this.$server = {};
				}
				
				var blackProcs = {
					'import': true,
					'export': true,
					'rpc': true,
					'$constructor': true,
					'$bootstrap': true
				};
				
				// resolve server-side push-proxies
				if(!JSB.isNull(this.$server) && !JSB.isNull(this.$client)){
					var serverBody = this.$server;
					var curJsb = this;
					var scope = this.$_clientProcs = this.$_clientProcs || {};
					
					while(curJsb) {
						var bodies = [];

						if(curJsb.$common){
							bodies.push(curJsb.$common);
						}
						if(curJsb.$client){
							bodies.push(curJsb.$client);
						}
						for(var b = 0; b < bodies.length; b++){
							var curBody = bodies[b];
							for(var procName in curBody){
								if(this.isJavaObject(curBody[procName])){
									throw 'Error: Java field "' + procName + '" is not permitted in client-side section of bean ' + this.$name;
								}
								if(!this.isFunction(curBody[procName])){
									continue;
								}
//								var scope = serverBody.$client = serverBody.$client || {};
								if(scope[procName] || blackProcs[procName]){
									continue;
								}
								scope[procName] = eval('function(){JSB().proxyRpcCall.call(this.__instance, "'+procName+'", arguments);}');
							}
						}
						
						if(curJsb.getClass()){
							var s = curJsb.getClass().superclass;
							if(!s){
								break;
							}
							curJsb = s.jsb;
						} else {
							curJsb = parent;
						}
					}
				}

				// resolve client-side rpc proxies
				if(!JSB().isNull(this.$client)){
					var clientBody = this.$client;
					
					var curJsb = this;
					var scope = this.$_serverProcs = this.$_serverProcs || {};
					
					while(curJsb) {
						var bodies = [];
						if(curJsb.$common){
							bodies.push(curJsb.$common);
						}
						if(curJsb.$server){
							bodies.push(curJsb.$server);
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
/*								
								var scope = clientBody;
								if(this.$format == 'jsb'){
									scope = clientBody.$server = clientBody.$server || {};
								}
*/								
								if(scope[procName] || blackProcs[procName]){
									continue;
								}
								scope[procName] = eval('function(){JSB().proxyRpcCall.call('+(this.$format == 'jso' ? 'this': 'this.__instance' )+', "'+procName+'", arguments);}');
							}
						}
						
						if(curJsb.getClass()){
							var s = curJsb.getClass().superclass;
							if(!s){
								break;
							}
							curJsb = s.jsb;
						} else {
							curJsb = parent;
						}
					}
				}
			}
			
			var entry = this.currentSection();
			if(this.isPlainObject(entry)){
				// copy global jsb settings into current entry
				if(this.$fixedId){
					entry.$fixedId = this.$fixedId;
				}
				
				if(!entry.$bootstrap && this.$bootstrap){
					entry.$bootstrap = this.$bootstrap;
				}
				
			}
		},
		
		proxyRpcCall: function(name, argsO){
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
			this.rpc(name, args, callback);
		},

		getDescriptor: function(){
			return this._descriptor;
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
			return typeof(obj) === 'number';
		},
		
		isBoolean: function(obj){
			return typeof(obj) === 'boolean';
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
		
		isPlainObject: function(obj, checkPojo){
			var key;
			var class2type = {};
			var hasOwn = class2type.hasOwnProperty;
			
			try {
				if ( !obj || typeof(obj) !== "object" || obj.nodeType || this.isWindow( obj ) || this.isArray(obj) || this.isString(obj) ) {
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
					if ( obj.constructor &&
						!hasOwn.call(obj, 'constructor') &&
						!hasOwn.call(obj.constructor.prototype,'isPrototypeOf')) {
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
		
		isArray: function(obj){
			return Object.prototype.toString.call(obj) === "[object Array]";
		},
		
		isString: function(obj){
			return Object.prototype.toString.call(obj) === "[object String]";
		},
		
		isObject: function(obj){
			return Object.prototype.toString.call(obj) === "[object Object]";
		},
		
		isNull: function(obj){
			return obj == null || obj == undefined;
		},
		
		isInstanceOf: function(obj, cls){
			if(!obj){
				return false;
			}
			if(obj.jsb && obj.jsb.getClass && obj instanceof obj.jsb.getClass()){
				return obj.jsb.isSubclassOf(cls);
			}
			if(JSB().isString(obj)){
				var jso = this.get(obj);
				if(jso){
					return jso.isSubclassOf(cls);
				}
			}
			return false;
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
			if(str instanceof JSB){
				str = str.$name;
			}
			if(this.$name == str){
				return true;
			}
			if(this.$parent == null 
				|| this.$parent == undefined 
				|| this.$parent.length == 0 
				|| this.$parent == 'JSB.Bean'){
				if(str == 'JSB.Bean'){
					return true;
				}
				return false;
			}
			var parentJso = this.get(this.$parent);
			return parentJso.isSubclassOf(str);
		},
		
		stringify: function(obj, callback, name){
			// TODO: replace implementation to avoid cyclic references
			var str = '';
			
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
				var str = '{';
				for(var i = 0; i < names.length; i++ ){
					if(str.length > 1){
						str += ',';
					}
					var fName = names[i];
					var fRes = this.stringify(obj[fName], callback, fName);
					if(fRes === null){
						continue;
					}
					str += '"' + fName + '":' + fRes;
				}
				str += '}';
				
				return str;
			} else if(JSB().isArray(obj)){
				var str = '[';
				for(var i = 0; i < obj.length; i++){
					if(str.length > 1){
						str += ',';
					}
					var fRes = this.stringify(obj[i], callback, i);
					if(fRes === null){
						continue;
					}
					str += fRes;
				}
				str += ']';
				return str;
			} else if(JSB().isString(obj)){
				return '"' + obj + '"';
			} else {
				return '' + obj;
			}
		},
		
		get: function(name){
			if(this.objects[name] != null && this.objects[name] != undefined){
				return this.objects[name];
			}
			
			return null;
		},
		
		getCallingContext: function(){
			var tls = this.getThreadLocal();
			var ctx = tls.get('_jsbCallingContext');
			if(!ctx){
				ctx = [];
				tls.put('_jsbCallingContext', ctx);
			}
			
			return ctx;
		},
		
		getLastInstance: function(){
			var ctx = this.getCallingContext();
			if(ctx.length === 0){
				return null;
			}
			return ctx[ctx.length - 1].inst;
		},
		
		getCallerJsb: function(){
			var ctx = this.getCallingContext();
			if(ctx.length < 2){
				return null;
			}
			return ctx[ctx.length - 2].jsb;
		},
		
		stringifyCallingContext: function(){
			var ctx = this.getCallingContext();
			var dumpArr = [];
			for(var i = 0; i < ctx.length; i++){
				dumpArr.push({
					jsb: (ctx[i] && ctx[i].jsb ? ctx[i].jsb.$name : null),
					methodName: (ctx[i] ? ctx[i].methodName : null),
					inst: (ctx[i] && ctx[i].inst && ctx[i].inst.jsb ? ctx[i].inst.jsb.$name : null)
				});
			}
			
			return JSON.stringify(dumpArr);
		},
		
		saveCallingContext: function(){
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
		},
		
		putCallingContext: function(ctx){
			var tls = this.getThreadLocal();
			tls.put('_jsbCallingContext', ctx);
		},
		
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
		
		clone: function(obj){
			if(this.isArray(obj)){
				return this.merge(true, [], obj);
			} else if(this.isPlainObject(obj)){
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
							!this.isInstanceOf(copy, 'JSB.Bean') &&
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

		_inheritedClass: function(parent) {
			var ss = this;
			var newFunc = function() {
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
					
				var ctxStack = ss.getCallingContext();
				ctxStack.push({
					jsb: ss,
					methodName: '$constructor',
					inst: this
				});
				// TODO: perform call check
				
				try {
					// call original function
					if(ss._ctor){
						ss._ctor.apply(this, arguments);
					}
					if (!this.$_superCalled) {
						parent.apply(this, arguments);
						this.$_superCalled = true;
					}
				} finally {
					// restore prev context
					ctxStack.pop();
				}
					
				
				this.$_superCalled = storeSuperCalled;
				
			};

			return newFunc;
		},
		
		_enhanceInherited: function(cls, parent, body) {
			var F = function() {};
			F.prototype = parent.prototype;
			cls.prototype = new F();
			if(body) {
				this.merge(cls.prototype, body);
			}

			cls.prototype.constructor = cls;
			cls.prototype.parent = function() {
				return parent;
			};
			cls.superclass = parent.prototype;
		},


		_simpleClass: function() {
			var ss = this;
			var newFunc = function() {
				if (ss._ctor != null && ss._ctor != undefined) {
					var ctxStack = ss.getCallingContext();
					ctxStack.push({
						jsb: ss,
						methodName: '$constructor',
						inst: this
					});
					// TODO: perform call check
					try {
						// call original function
						ss._ctor.apply(this, arguments);
					} finally {
						// restore prev context
						ctxStack.pop();
					}
					
				}
			}
/*
			var F = function() {};
			F.prototype = body;
			newFunc.prototype = new F();
			newFunc.prototype.constructor = newFunc;
*/
			return newFunc;
		},
		
		_enhanceSimple: function(cls, body){
			var F = function() {};
			F.prototype = body;
			cls.prototype = new F();
			cls.prototype.constructor = cls;
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
			this.lookup(name, function(cls){
				if(self.isNull(cls)){
					throw 'Failed to lookup require: "' + name + '", expecting for object but nothing returned';
				}
				var jsb = cls.jsb;
				if(self.isNull(jsb)){
					throw 'Failed to lookup require: "' + name + '", jsb is null';
				}
				if(!jsb._ready && jsb.isSingleton()){
					self.lookup(name, callback);
				} else {
					callback.call(self, cls);
				}
			}, {readyState: 1});
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
				this._pushWaiter(name, callback, readyState);
				
				// load object from the server
				if(this.isClient() && (!this.objects[name] || forceUpdate)){
					if(this.isNull(this.initQueue) || this.isNull(this.initQueue[name])){ 
						if(this.provider){
							if(!this.isNull(this.loadQueue) && !this.isNull(this.loadQueue[name]) && !forceUpdate){
								return;
							}
							this.provider.loadObject(name);
							if(this.isNull(this.loadQueue)){
								this.loadQueue = {}
							}
							this.loadQueue[name] = true;
						} else {
							this.objectsToLoad.push(name);
						}
					}
				}
				if(this.isServer()){
					// check bean is existed
					var repoEntry = this.getRepository().get(name);
					if(!repoEntry){
						throw 'Bean "'+name+'" is missing in repository' + (this.$name ? '; required by "' + this.$name + '"' : '');
					}
				}
			}
		},

		getInstance: function(key){
			if(!key && this.isSingleton()){
				key = this.$name;
			}
			var obj = JSB().getGlobalInstancesScope()[key];
			if(obj == null || obj == undefined){
				obj = JSB().getSessionInstancesScope()[key];
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
				if(curProto.constructor && curProto.constructor.superclass){
					curProto = curProto.constructor.superclass;
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
			while(protoStack.length > 0){
				curProto = protoStack.pop();
				_translateFields(curProto, fieldMap, 0);
				_collectSyncScopes(curProto.jsb, syncScopes);
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
/*			
			// deploy object into class tree
			if(this._cls.jsb && this._cls.jsb.$name != this.$name){
				throw 'System error: wrong inheritance occured due to loading "' + this.$name + '": found "' + this._cls.jsb.$name + '"';
			}
			if(entry){
				this.deploy(this.$name, this._cls);
			}
*/

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
						
						if(entry.$globalize){
							if(self.isString(entry.$globalize)){
								self.deploy(entry.$globalize, o, true);
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
						keepFinalize();
					}
					if(self.isSystem()){
						ccall();
					} else {
						JSB().defer(function(){
							ccall();
						});
					}
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
		

		getClass: function(){
			return this._cls;
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
		
		setRepository: function(repo){
			this.repository = repo;
		},

		getRepository: function(){
			return this.repository;
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
		
		loadScript: function(curl, callback){
			var self = this;
			
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
			    _s.type = "text/javascript";
			    if(url.indexOf('http') == -1){
			    	_s.src = self.getProvider().getServerBase() + url;	 
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
			
			var scriptArr = [];
			if(JSB().isArray(curl)){
				scriptArr = curl;
			} else {
				scriptArr.push(curl);
			}
			for(var i in scriptArr){
				scriptArr[i] = self.injectServerVersion(scriptArr[i]);
			}

			var checkArr = JSB().clone(scriptArr);
			
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

		},
		
		loadCss: function(url){
			url = this.injectServerVersion(url);
			
			if(this.resourceLoaded[url]){
				return;
			}
			var _l = document.createElement("link");
			_l.rel = "stylesheet";
		    if(url.indexOf('http') == -1){
		    	_l.href = this.getProvider().getServerBase() + url;	 
		    } else {
		    	_l.href = url;
		    }
			_l.type = "text/css";
			
		    var _oHead = document.getElementsByTagName('HEAD').item(0);
		    _oHead.appendChild( _l);
			this.resourceLoaded[url] = true;
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
           		if (!body) body = error.message && (error.message + '\r\n' + (error.stackTrace||error.stack||'NO STACK')) || error;
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
		
		defer: function( deferProc, timeout, key ){
			var self = this;
			if(timeout == null || timeout == undefined ){
				timeout = 100;
			}
			if(key && this.deferTimeoutMap[key]){
				JSB().Window.clearTimeout(this.deferTimeoutMap[key]);
			}
			var callCtx = this.saveCallingContext();
			var deferTimeout = JSB().Window.setTimeout(function(){
				self.putCallingContext(callCtx);
				if(key && self.deferTimeoutMap[key]){
					delete self.deferTimeoutMap[key];
				}
				deferProc.call(self);
			}, timeout);
			if(key){
				this.deferTimeoutMap[key] = deferTimeout; 
			}
		},
		
		deferUntil: function(deferProc, untilProc, interval, silent, key){
			var self = this;
			if(interval == null || interval == undefined){
				interval = 100;
			}
			if(key && this.deferTimeoutMap[key]){
				JSB().Window.clearTimeout(this.deferTimeoutMap[key]);
			}
			var callCtx = this.saveCallingContext();
			var toProc = function(){
				self.putCallingContext(callCtx);
				var untilRes = false;
				if(key && self.deferTimeoutMap[key]){
					delete self.deferTimeoutMap[key];
				}
				try {
					untilRes = untilProc();
				} catch(e){
					if (!silent) throw e;
				}
				if(untilRes){
					deferProc();
				} else {
					var deferTimeout = JSB().Window.setTimeout(toProc, interval);
					if(key){
						self.deferTimeoutMap[key] = deferTimeout; 
					}
				}
			}
			var deferTimeout = JSB().Window.setTimeout(toProc, interval);
			if(key){
				this.deferTimeoutMap[key] = deferTimeout; 
			}
		},
		
		cancelDefer: function(key){
			if(key && this.deferTimeoutMap[key]){
				JSB().Window.clearTimeout(this.deferTimeoutMap[key]);
				delete this.deferTimeoutMap[key];
			}
		},
		
		fork: function(param, proc){
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
				this.forkJoinHandles = {};
			}
			// create handle
			var h = this.generateUid();
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
								locker.lock('_jsb_fork_' + h);
								self.forkJoinHandles[h].items[idx] = res;
								self.forkJoinHandles[h].ready++;
								locker.unlock('_jsb_fork_' + h);
								self._checkJoinCallback(h);
							});

						} catch(e){
							res = e;
							console.log(e);
						}
						if(res !== undefined){
							locker.lock('_jsb_fork_' + h);
							self.forkJoinHandles[h].items[idx] = res;
							self.forkJoinHandles[h].ready++;
							locker.unlock('_jsb_fork_' + h);
							self._checkJoinCallback(h);
						}
					}, 0);
				})(i);
			}
			
			return h;
		},
		
		join: function(forkHandle, callback){
			if(callback){
				this.forkJoinHandles[forkHandle].callback = callback;
				this._checkJoinCallback(forkHandle);
			} else {
				throw 'JSB.join: missing callback argument';
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
				}
			}
		},
		
		chain: function(params){
			var self = this;
			var procArr = [];
			if(arguments.length < 3){
				throw 'JSB.chain: wrong argument passed';
			}
			for(var i = 1; i < arguments.length; i++){
				if(JSB().isFunction(arguments[i])){
					procArr.push(arguments[i]);
				}
			}
			if(procArr.length < 2){
				throw 'JSB.chain: no chain callbacks passed';
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
					self.join(self.fork(pObj, forkProc), generateForkJoinTask);
				}
			}
			
			generateForkJoinTask(params);
		},

		substJsoInRpcResult: function(res){
			function _substJsoInRpcResult(res){
				if(JSB().isPlainObject(res)){
					// check if res is jso
					if(JSB().isBean(res)){
						// encode jso object
						return {
							__jso : res.getJsb().$name,
							__id: res.getId()
						};
					} else {
						// parse json object
						var nobj = {};
						for(var f in res){
							nobj[f] = _substJsoInRpcResult(res[f]);
						}
						return nobj;
					}
				} else if(JSB().isArray(res)){
					// parse array
					var nobj = [];
					for(var f in res){
						nobj[f] = _substJsoInRpcResult(res[f]);
					}
					return nobj;
				}
				return res;
			}
			
			return _substJsoInRpcResult(res);
		},
		
		injectJsoInRpcResult: function(res, callback){
			var self = this;
			function iterateResult(obj){
				// scan field names
				var fNames = {};
				var fnCnt = 0;
				for(var f in obj){
					fNames[f] = false;
					fnCnt++;
				}
				if(fnCnt > 0){
					for(var f in fNames ){
						(function(fn){
							self.injectJsoInRpcResult(obj[fn], function(r){
								obj[fn] = r;
								fNames[fn] = true;
								for(var i in fNames){
									if(!fNames[i]){
										return;
									}
								}
								if(callback){
									callback(obj);
								}
							});
						})(f);
					}
				} else {
					if(callback){
						callback(obj);
					}
				}
			}
			if(this.isPlainObject(res) && !this.isBean(res)){
				if(JSB().isString(res.__jso) && JSB().isString(res.__id)){
					// this is a server object reference
					this.constructInstanceFromRemote(res.__jso, res.__id, function(fObj){
						if(callback){
							callback(fObj);
						}
					});
				} else {
					// parse json object
					iterateResult(res);
				}
			} else if(this.isArray(res)){
				// parse json array
				iterateResult(res);
			} else {
				if(callback){
					callback(res);
				}
			}
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
				if(JSB().isNull(serverInstance)) {
					delete bindMapScope[instanceId];
				}
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
							return null;
						}
						if(jso.isSingleton()){
							serverInstance = JSB().getInstance(jsoName);
							if(JSB().isNull(serverInstance)){
								return null;
							}
						} else {
							serverInstance = JSB().getInstance(instanceId);
						}
						
						if(JSB().isNull(serverInstance)){
							
							// check for rpc instance creation permission
							if(jso.hasKeywordOption('$disableRpcInstance')){
								JSB().getLogger().warn('Unable to create new instance from RPC call for jsb: "' + jsoName + '('+instanceId+')" due option "disableRpcInstance" set')
								return null;
							}
							
							var f = jso.getClass();
							// create server-side instance with client-side id
							
							if(jso.hasKeywordOption('$fixedId')){
								JSB().getThreadLocal().put('_jsoRegisterCallback', function(){
									// use this to access current object
									this.id = instanceId;
								});
								serverInstance = new f();
								JSB().getThreadLocal().clear('_jsoRegisterCallback');
							} else {
								serverInstance = new f();
							}
							bNeedSync = true;
						}
						serverInstanceId = serverInstance.getId();
						bindMapScope[instanceId] = serverInstanceId;
						if(!reverseBindMapScope[serverInstanceId]){
							reverseBindMapScope[serverInstanceId] = {};
						}
						reverseBindMapScope[serverInstanceId][instanceId] = true;
						
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
		
		constructInstanceFromRemote: function(jsoName, id, callback){
			var self = this;
			if(JSB().isClient()){
				this.lookup(jsoName, function(cls){
					var obj = null;
					if(JSB().isBean(cls)){
						obj = cls;
						if(obj.$_bindKey != id && obj.getId() != id){
							throw 'constructInstanceFromRemote: Wrong singleton ID retrieved';
						}
					} else {
						// check for fixedId
						if(cls.jsb.hasKeywordOption('$fixedId')){
							obj = self.getInstance(id);
						}
					}
					
					if(!obj){
						JSB().getThreadLocal().put('_jsoRegisterCallback', function(){
							// use this to access current object
							if(cls.jsb.hasKeywordOption('$fixedId')){
								this.id = id;
							}
							this.$_bindKey = id;
						});
						obj = new cls();
						JSB().getThreadLocal().clear('_jsoRegisterCallback');
						obj.doSync();
					}
					
					if(!JSB().isNull(obj.$_syncScopes)){
						if(obj.isSynchronized()){
							if(callback){ callback(obj); }
						} else {
							// wait until object is synchronized
							obj.subscribeSynchronized(function(){
								if(callback){ callback(obj); }
							});
						}
					} else {
						if(callback){ callback(obj); }
					}
					
				});
			} else {
				var obj = JSB().constructServerInstanceFromClientId(jsoName, id);
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
	
	// expose JSO & JSB
	(function(){return this;}).call(null).JSO = JSO;
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
	
	
	// setup MD5
	JSB().addLibraryScope('MD5', {
		md5cycle: function(x, k) {
			var a = x[0], b = x[1], c = x[2], d = x[3];

			a = this.ff(a, b, c, d, k[0], 7, -680876936);
			d = this.ff(d, a, b, c, k[1], 12, -389564586);
			c = this.ff(c, d, a, b, k[2], 17,  606105819);
			b = this.ff(b, c, d, a, k[3], 22, -1044525330);
			a = this.ff(a, b, c, d, k[4], 7, -176418897);
			d = this.ff(d, a, b, c, k[5], 12,  1200080426);
			c = this.ff(c, d, a, b, k[6], 17, -1473231341);
			b = this.ff(b, c, d, a, k[7], 22, -45705983);
			a = this.ff(a, b, c, d, k[8], 7,  1770035416);
			d = this.ff(d, a, b, c, k[9], 12, -1958414417);
			c = this.ff(c, d, a, b, k[10], 17, -42063);
			b = this.ff(b, c, d, a, k[11], 22, -1990404162);
			a = this.ff(a, b, c, d, k[12], 7,  1804603682);
			d = this.ff(d, a, b, c, k[13], 12, -40341101);
			c = this.ff(c, d, a, b, k[14], 17, -1502002290);
			b = this.ff(b, c, d, a, k[15], 22,  1236535329);

			a = this.gg(a, b, c, d, k[1], 5, -165796510);
			d = this.gg(d, a, b, c, k[6], 9, -1069501632);
			c = this.gg(c, d, a, b, k[11], 14,  643717713);
			b = this.gg(b, c, d, a, k[0], 20, -373897302);
			a = this.gg(a, b, c, d, k[5], 5, -701558691);
			d = this.gg(d, a, b, c, k[10], 9,  38016083);
			c = this.gg(c, d, a, b, k[15], 14, -660478335);
			b = this.gg(b, c, d, a, k[4], 20, -405537848);
			a = this.gg(a, b, c, d, k[9], 5,  568446438);
			d = this.gg(d, a, b, c, k[14], 9, -1019803690);
			c = this.gg(c, d, a, b, k[3], 14, -187363961);
			b = this.gg(b, c, d, a, k[8], 20,  1163531501);
			a = this.gg(a, b, c, d, k[13], 5, -1444681467);
			d = this.gg(d, a, b, c, k[2], 9, -51403784);
			c = this.gg(c, d, a, b, k[7], 14,  1735328473);
			b = this.gg(b, c, d, a, k[12], 20, -1926607734);

			a = this.hh(a, b, c, d, k[5], 4, -378558);
			d = this.hh(d, a, b, c, k[8], 11, -2022574463);
			c = this.hh(c, d, a, b, k[11], 16,  1839030562);
			b = this.hh(b, c, d, a, k[14], 23, -35309556);
			a = this.hh(a, b, c, d, k[1], 4, -1530992060);
			d = this.hh(d, a, b, c, k[4], 11,  1272893353);
			c = this.hh(c, d, a, b, k[7], 16, -155497632);
			b = this.hh(b, c, d, a, k[10], 23, -1094730640);
			a = this.hh(a, b, c, d, k[13], 4,  681279174);
			d = this.hh(d, a, b, c, k[0], 11, -358537222);
			c = this.hh(c, d, a, b, k[3], 16, -722521979);
			b = this.hh(b, c, d, a, k[6], 23,  76029189);
			a = this.hh(a, b, c, d, k[9], 4, -640364487);
			d = this.hh(d, a, b, c, k[12], 11, -421815835);
			c = this.hh(c, d, a, b, k[15], 16,  530742520);
			b = this.hh(b, c, d, a, k[2], 23, -995338651);

			a = this.ii(a, b, c, d, k[0], 6, -198630844);
			d = this.ii(d, a, b, c, k[7], 10,  1126891415);
			c = this.ii(c, d, a, b, k[14], 15, -1416354905);
			b = this.ii(b, c, d, a, k[5], 21, -57434055);
			a = this.ii(a, b, c, d, k[12], 6,  1700485571);
			d = this.ii(d, a, b, c, k[3], 10, -1894986606);
			c = this.ii(c, d, a, b, k[10], 15, -1051523);
			b = this.ii(b, c, d, a, k[1], 21, -2054922799);
			a = this.ii(a, b, c, d, k[8], 6,  1873313359);
			d = this.ii(d, a, b, c, k[15], 10, -30611744);
			c = this.ii(c, d, a, b, k[6], 15, -1560198380);
			b = this.ii(b, c, d, a, k[13], 21,  1309151649);
			a = this.ii(a, b, c, d, k[4], 6, -145523070);
			d = this.ii(d, a, b, c, k[11], 10, -1120210379);
			c = this.ii(c, d, a, b, k[2], 15,  718787259);
			b = this.ii(b, c, d, a, k[9], 21, -343485551);

			x[0] = this.add32(a, x[0]);
			x[1] = this.add32(b, x[1]);
			x[2] = this.add32(c, x[2]);
			x[3] = this.add32(d, x[3]);

		},
		
		cmn: function(q, a, b, x, s, t) {
			a = this.add32(this.add32(a, q), this.add32(x, t));
			return this.add32((a << s) | (a >>> (32 - s)), b);
		},

		ff: function(a, b, c, d, x, s, t) {
			return this.cmn((b & c) | ((~b) & d), a, b, x, s, t);
		},

		gg: function(a, b, c, d, x, s, t) {
			return this.cmn((b & d) | (c & (~d)), a, b, x, s, t);
		},

		hh: function(a, b, c, d, x, s, t) {
			return this.cmn(b ^ c ^ d, a, b, x, s, t);
		},

		ii: function(a, b, c, d, x, s, t) {
			return this.cmn(c ^ (b | (~d)), a, b, x, s, t);
		},
		
		md51: function(s) {
			this.txt = '';
			var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
			for(i=64; i<=s.length; i+=64) {
				this.md5cycle(state, this.md5blk(s.substring(i-64, i)));
			}
			s = s.substring(i-64);
			var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
			for( i = 0; i < s.length; i++)
			tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
			tail[i>>2] |= 0x80 << ((i%4) << 3);
			if (i > 55) {
				this.md5cycle(state, tail);
				for( i = 0; i < 16; i++) tail[i] = 0;
			}
			tail[14] = n*8;
			this.md5cycle(state, tail);
			return state;
		},
		
		md5blk: function(s) { /* I figured global was faster.   */
			var md5blks = [], i; /* Andy King said do it this way. */
			for( i = 0; i < 64; i += 4 ) {
				md5blks[i>>2] = s.charCodeAt(i) + (s.charCodeAt(i+1) << 8) + (s.charCodeAt(i+2) << 16) + (s.charCodeAt(i+3) << 24);
			}
			return md5blks;
		},

		hex_chr: '0123456789abcdef'.split(''),

		rhex: function(n) {
			var s = '', j = 0;
			for(; j < 4; j++ )
				s += this.hex_chr[(n >> (j * 8 + 4)) & 0x0F] + this.hex_chr[(n >> (j * 8)) & 0x0F];
			return s;
		},

		hex: function(x) {
			for( var i = 0; i < x.length; i++ )
				x[i] = this.rhex(x[i]);
			return x.join('');
		},

		md5: function(s) {
			return this.hex(this.md51(s));
		},

		add32: function(a, b) {
			return (a + b) & 0xFFFFFFFF;
		},
		
	});

	
})();

JSB({
	$name: 'JSB.Bean',
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
		JSB().unregister(this);
		
		if(!this.$_destroyLocal && !this.jsb.isSession() && (this.jsb.isServer() || this.$_bindKey)){
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
	
	getSuperClass: function(className){
		if(JSB().isNull(className)){
			
			var ctxStack = this.jsb.getCallingContext();

			// get calling proc
			if(ctxStack.length < 2){
				throw 'Invalid "getSuperClass" function call';
			}

			var callerCtx = ctxStack[ctxStack.length - 2];
			var cls = callerCtx.jsb.getClass();
			
			var sClass = cls.superclass;
			if(JSB().isNull(sClass) || JSB().isNull(sClass.jsb)){
				throw 'Wrong parent class found';
			}
			return sClass;
		}
		
		var curScope = this.constructor.superclass;
		while(true){
			if(JSB().isNull(curScope) || JSB().isNull(curScope.jsb)){
				throw 'Unable to find className: "' + className + '"in "' + this.jsb.$name + '" hierarchy stack';
			}
			if(curScope.jsb.$name == className){
				return curScope; 
			}
			
			curScope = curScope.constructor.superclass;
		}
	},
	
	getClass: function(){
		return this.getJsb().getClass();
	},

	getJsb: function(){
		return this.jsb;
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
/*			
			if(JSB.isInstanceOf(this, 'Ontoed.Model.Function') && this.info['short-uri'] == 'spin:construct'){
				debugger;
			}
*/			
		function updateSyncScope(timeStamp, name, realScope, syncInfoScope){
			var updated = false;
			if(JSB().isBean(realScope)){
				// fixup realscope if it is Bean
				realScope = {
					__jso: realScope.jsb.$name,
					__id: realScope.getId()
				};
			}
			if(JSB().isFunction(realScope)){
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
				if(realScope != syncInfoScope.value || syncInfoScope.value === undefined){
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
				if(realScope === undefined){
//						throw 'getScopeSlice: sync error due to out of the realScope';
				} else if(JSB().isBean(realScope)){
					realScope = {
						__jso: realScope.jsb.$name,
						__id: JSB().isClient() ? (realScope.$_bindKey || realScope.getId()) : realScope.getId()
					};
				}
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
				} else {
					throw 'getScopeSlice: unknown syncScope.type';
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

	applySlice: function(slice, callback){
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
				if(syncSlice.d.__jso && syncSlice.d.__id && JSB().isString(syncSlice.d.__jso.v) && JSB().isString(syncSlice.d.__id.v)){
					// inject bean
					JSB().constructInstanceFromRemote(syncSlice.d.__jso.v, syncSlice.d.__id.v, function(obj){
						parentRealScope[name] = obj;
						callback.call(self);
					});
					return true;
				} else {
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
				}
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
			return this.$_synchronized;
		},
		
		subscribeSynchronized: function(callback){
			if(!this.$_syncCallbacks){
				this.$_syncCallbacks = [];
			}
			this.$_syncCallbacks.push(callback);
		},
		
		matchSynchronized: function(){
			if(!this.isSynchronized() || !this.$_syncCallbacks){
				return;
			}
			for(var i in this.$_syncCallbacks){
				this.$_syncCallbacks[i].call(this);
			}
			this.$_syncCallbacks = [];
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
					function _syncComplete(){
						self.$_synchronized = true;
						self.matchSynchronized();
						if(callback){
							callback.call(self);
						}
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
							self.applySlice(resp.slice, function(){
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
		
		rpc: function(procName, arg1, arg2, arg3, arg4){
			var params = null;
			var callback = null;
			var sync = false;
			var self = this;
			var disableInjectJsb = false;
			if(JSB().isFunction(arg1)){
				callback = arg1;
				sync = arg2;
				disableInjectJsb = arg3;
			} else {
				params = arg1;
				if(JSB().isFunction(arg2)){
					callback = arg2;
					sync = arg3;
					disableInjectJsb = arg4;
				} else {
					sync = arg2;
					disableInjectJsb = arg3;
				}
			}
			var tJso = this.getJsb();
			var callCtx = this.jsb.saveCallingContext();
			if(!this.$_bindKey){
				this.$_bindKey = this.id;
			}
			JSB().getProvider().enqueueRpc({
				jsb: tJso.$name,
				instance: this.$_bindKey,
				proc: procName,
				params: JSB().substJsoInRpcResult(params),
				sync: (sync ? true: false)
			}, function(res){
				var inst = this;
				var args = arguments;
				if(disableInjectJsb){
					args[0] = res;
					if(callback){
						self.jsb.putCallingContext(callCtx);
						callback.apply(inst, args);	
					}
				} else {
					JSB().injectJsoInRpcResult(res, function(r){
						args[0] = r;
						if(callback){
							self.jsb.putCallingContext(callCtx);
							callback.apply(inst, args);	
						}
					});
				}
			} );
		},

		loadScript: function( relativeUrl, callback ){
			var callingJsb = $jsb.getCallerJsb();
			JSB().loadScript( callingJsb.getBasePath() + relativeUrl, callback ); 
		},

		loadCss: function( relativeUrl ){
			var callingJsb = $jsb.getCallerJsb();
			JSB().loadCss( callingJsb.getBasePath() + relativeUrl );
		},

		ajax: function(url, params, callback){
			JSB().getProvider().ajax(JSB().getProvider().getServerBase() + url, params, callback);
		},

		onBeforeSync: function(syncInfo){
			var bUpdateClient = true;
			if(JSB().isPlainObject(this.getJsb().getSync()) && !JSB().isNull(this.getJsb().getSync().updateClient)){
				bUpdateClient = this.getJsb().getSync().updateClient;
			}
			return bUpdateClient;
		}
	},
	
	$server: {
		$constructor: function(){
			JSB().register(this);
			this.setupSync();
		},
		
		client: function(){
//			return $client;
			var f = function(){
				this.__instance = $this;
			};
			f.prototype = this.jsb.$_clientProcs;
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
				needUpdate |= this.updateSyncState()
			}
			
			if(needUpdate){
				JSB.defer(function(){
					self.client().doSync(true);	
				}, 0);
			}
			
			return retSlice;
		},
		
		rpc: function(procName, arg1, arg2, arg3){
			var params = null;
			var callback = null;
			var session = null;
			if(JSB().isFunction(arg1)){
				callback = arg1;
				session = arg2;
			} else {
				params = JSB().substJsoInRpcResult(arg1);
				callback = arg2;
				session = arg3;
			}
			var self = this;
			var callCtx = this.jsb.saveCallingContext();
			var wrapCallback = (callback ? function(res){
				var inst = this;
				var args = arguments;
				JSB().injectJsoInRpcResult(res, function(r){
					args[0] = r;
					self.jsb.putCallingContext(callCtx);
					callback.apply(inst, args);
				});
			} : null);
			
			JSB().getProvider().enqueueRpc({
				instance: this,
				proc: procName,
				params: params
			}, wrapCallback, session );
		}
	}
});

JSB({
	$name: 'JSB.Repository',
	$singleton: true,
	
	items: {},
	loadList: {},
	pathMapIndex: {},
	
	$constructor: function(){
		JSB().setRepository(this);
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
			throw err;
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
	
	load: function(){
		var locker = JSB().getLocker();
		var loadArr = Object.keys(this.loadList);
		for(var i = 0; i < loadArr.length; i++){
			var name = loadArr[i];
			var entry = this.items[name];
			var cfg = entry.cfg;
			
			// do load
			JSB(cfg);
			
			if(locker)locker.lock('_jsb_repo');
			delete this.loadList[name];
			if(locker)locker.unlock('_jsb_repo');
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
			if($jsb.isObject(obj)){
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
		
		info: function(str){
			console.log('INFO: ' + this._prepareObj(str));
		},
		debug: function(str){
			console.log('DEBUG: ' + this._prepareObj(str));
		},
		warn: function(str){
			console.log('WARNING: ' + this._prepareObj(str));
		},
		error: function(str){
			console.log('ERROR: ' + this._prepareObj(str));
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
			
			minScInterval: 10,
			maxScInterval: 3000,
			defScInterval: 100
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
		maxBatchSize: 100,

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
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				}
				xhr.onreadystatechange = function(){
					if(xhr.readyState != 4) return;
					window.clearTimeout(to);
					
					if (xhr.status == 200) {
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
				
				if(!xhrObj.timeout){
					xhrObj.timeout = 10000;
				}
				to = window.setTimeout(function(){
					xhr.abort();
					if(xhrObj.error){
						xhrObj.error(xhr, -1, 'XHR timeout');
					}
				}, xhrObj.timeout);
				
				xhr.send(params);
			}
		},
		
		ajax: function(url, params, callback){
			var self = this;
			if(this.crossDomain){
				this.xhr({
					url: url,
					data: params,
					dataType: 'jsonp',
					timeout: 100000,	// 100 secs
					success: function(data, status, xhr){
						self.curDeferTimeout = self.options.minDeferTimeout;
						var respObj = data;
						self.decodeObject(respObj);
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
								self.ajax(url, params, callback);
							}, self.curDeferTimeout);
						}
					}
				});
			} else {
				this.xhr({
					url: url,
					data: params,
					type: 'post',
					timeout: 100000,	// 100 secs
					success: function(data, status, xhr){
						self.curDeferTimeout = self.options.minDeferTimeout;
						var respObj = eval('('+data+')');
						self.decodeObject(respObj);
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
								self.ajax(url, params, callback);
							}, self.curDeferTimeout);
						}
					}
				});
			}
		},
		
		decodeObject: function(obj){
			if( typeof(obj) === 'object' ){
				for( var key in obj ) {
					var newKey = decodeURIComponent(key);
					if(newKey != key){
						obj[newKey] = obj[key];
						delete obj[key];
						key = newKey;
					}
					if(typeof(obj[key]) === 'object'){
						this.decodeObject(obj[key]);
					} else if(typeof(obj[key]) === 'string'){
						obj[key] = decodeURIComponent(obj[key]);
					}
				}
			} else if(typeof(obj) === 'array') {
				for( var i = 0; i < obj.length; i++ ) {
					if(typeof(obj[i]) === 'object'){
						this.decodeObject(obj[i]);
					} else if(typeof(obj[i]) === 'string'){
						obj[i] = decodeURIComponent(obj[i]);
					}
					
				}
			}
		},
		
		enqueueRpc: function(cmd, callback){
			var id = JSB().generateUid();
			this.queueToSend[id] = {
				cmd: JSB().merge(cmd,{id:id}),
				callback: callback
			};
			this.updateRpc();
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
		
		doRpc: function(){
			var self = this;
			var rpcBatch = [];

			// place new queries into batch 
			for(var id in this.queueToSend){
				var entry = this.queueToSend[id];
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
					self.enforceServerClientCallTracking();
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
		
		enforceServerClientCallTracking: function(){
			var newInterval = this.serverClientCallTrackInterval;
			if(newInterval > this.options.defScInterval){
				newInterval = this.options.defScInterval;
			} else {
				newInterval /= 2;
				if(newInterval < this.options.minScInterval){
					newInterval = this.options.minScInterval;
				}
			}
			this.enableServerClientCallTracking(newInterval);
		},
		
		slowDownServerClientCallTracking: function(){
			var newInterval = this.serverClientCallTrackInterval * 2;
			if(newInterval > this.options.maxScInterval){
				newInterval = this.options.maxScInterval;
			}
			this.enableServerClientCallTracking(newInterval);
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
				this.serverClientCallTrackInterval = trackInterval;
				_doTrack();
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
				self.rpc('getServerClientCallSlice', [self.lastTrackId], function(res){
					self.lastTrackId = res.lastId;
					var entries = res.slice;
					if(entries.length === 0){
						self.slowDownServerClientCallTracking();
					} else {
						self.enforceServerClientCallTracking();
					}
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
											if(JSB().isArray(p)){
												result = cInst[proc].apply(cInst, p);
											} else {
												result = cInst[proc].call(cInst, p);
											}
											if(respond){
												self.rpc('submitServerClientCallResult', {
													id: id,
													clientId: cId,
													result: result
												}, true);
											}
										}, 0);
									}
									if(cInst == self && proc == 'handleRpcResponse'){
										doCall(params);
									} else {
										JSB().injectJsoInRpcResult(params, doCall);
									}
								})(clientInstance, entry.proc, entry.params, entry.respond, entry.id, clientId);
							}
						} 
					}
					
					if(self.serverClientCallTrackInterval){
						JSB().defer(function(){
							_doTrack();
						}, self.serverClientCallTrackInterval, '_jsb_scct_' + $this.getId());
					}
				}, true, true);
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
		
		$constructor: function(){
			$base();
			if(JSB().getProvider()){
				JSB().getProvider().enableRpcCleanup(false);
			}
			JSB().setProvider(this);
			this.enableRpcCleanup(true);
		},
		
		performRpc: function(jsoName, instanceId, procName, params, rpcId){
			var np = {};
			$jsb.injectJsoInRpcResult(params, function(r){
				np.res = r;
			});
			var ret = null, fail = null;
			try {
				var res = this.executeClientRpc(jsoName, instanceId, procName, np.res);
				ret = $jsb.substJsoInRpcResult(res);
			} catch(e){
				fail = e;
				if($jsb.getLogger()){
					$jsb.getLogger().warn(e);
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
				if(fail){
					respPacket.error = fail;
					respPacket.success = false;
				} else {
					respPacket.result = ret;
					respPacket.success = true;
				}
				this.rpc('handleRpcResponse', [[respPacket]], null, $jsb.getCurrentSession());
			} else {
				return ret;
			}
		},


		executeClientRpc: function(jsoName, instanceId, procName, params){
			var serverInstance = JSB().constructServerInstanceFromClientId(jsoName, instanceId);
			if(!serverInstance){
				throw 'Unable to find Bean server instance: ' + jsoName + '(' + instanceId + ')';
			}
			
			if(!serverInstance[procName]){
				debugger;
				throw 'Failed to call method "' + procName + '" in bean "' + jsoName + '". Method not existed'
			}
			
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
		
		enqueueRpc: function(cmd, callback, session){
			// cmd.instance
			// cmd.proc
			// cmd.params
			var entry = {
				id: JSB().generateUid(),
				timestamp: Date.now(),
				instance: cmd.instance,
				proc: cmd.proc,
				params: cmd.params,
				callback: callback,
				session: session,
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
				}
				fromEntry = fromEntry.next;
			}
			
			return {
				lastId: lastId,
				slice: slice
			};
		},
		
		submitServerClientCallResult: function(obj){
			var entry = this.rpcMap[obj.id];
			if(!entry){
				return;
			}
			if(entry.callback){
				JSB().defer(function(){
					entry.callback.call(entry.instance, obj.result, obj.clientId);
				}, 0);
			}
		}
			
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
