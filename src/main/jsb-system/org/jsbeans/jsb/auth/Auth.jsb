/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2021гг.
 */

{
	$name: 'JSB.Auth',
	$singleton: true,
    $globalize: 'Auth',

	$server: {
		$require: ['JSB.System.Kernel',
		           'JSB.System.Log',
		           'JSB.System.Config',

		           'JSB.IO.FileSystem',
		           'JSB.Crypt.MD5',
		           'JSB.Auth.AccessPermissions',

		           'java:org.jsbeans.web.SystemPrincipal',
		           'java:org.jsbeans.web.AnonymousPrincipal',

                   'java:java.util.Collections',
		           'java:java.security.AccessControlContext',
		           'java:java.security.AccessController',
		           'java:java.security.Principal',
		           'java:javax.security.auth.Subject',
		           'java:java.security.PrivilegedExceptionAction'
               ],
               
        _userManager: null,
        _permissionMap: {},
        _userManager: null,

	    $constructor: function(opts) {
	        $base(opts);
	        
	        JSB.onLoad(function(){
				if(JSB.isDefined(this.$expose) && this.isSubclassOf('JSB.Auth.BasicPermission')){
					$this._registerPermission(this);
				}
			});

/*	        
	        if ($this.isSecurityEnabled()) {
                var bean = Config.get('kernel.security.permissionsBean');
                if (bean) {
                    JSB.getRepository().ensureLoaded(function(){
                        JSB.lookup(bean, function(PermissionsClass){
                            $this.repo = new PermissionsClass();
                        });
                    });
                }
            }
*/
	        
            // setup JSB.Error
            $this.SecurityError = function (message){
                this.message = message;
                JSB.Error.apply(this, arguments);
                Error.captureStackTrace(this);
            };
            $this.SecurityError.prototype = Object.create(JSB.Error.prototype);
        },
        
        setUserManager: function(userManager){
        	Kernel.checkSystemOrAdmin();
        	if(this._userManager){
        		JSB.getLogger().info('User manager has already been installed. Please check.');
        		return;
        	}
        	this._userManager = userManager;
        },
        
        _registerPermission: function(permissionJsb){
			if(!permissionJsb.$expose || !permissionJsb.$expose.id || !JSB.isString(permissionJsb.$expose.id)){
				JSB.getLogger().error('Invalid permission "' + permissionJsb.getName() + '" - missing "id" in $expose descriptor');
				return;
			}
			this.lock('permissionMap');
			this._permissionMap[permissionJsb.$expose.id] = new (permissionJsb.getClass())(permissionJsb.$expose.id);
			this.unlock('permissionMap');
			/* JSB.getLogger().info('Permission "' + permissionJsb.$expose.name + '" registered' ); */
		},

		isSecurityEnabled: function(){
			return Config.get('kernel.security.enabled');
		},

		isThroughAuth: function() {
		    return Config.get("kernel.security.throughAuthEnabled");
		},
		
		getUser: function(){
			return Kernel.user();
		},

		getUserId: function() {
			if(!$this._userManager){
				throw new this.SecurityError('UserManager has not been installed');
			}
			return this._userManager.getUserIdByName(Kernel.user());
		},
		
		getUserInfo: function(opts){
			var userInfo = {
				userName: this.getUser()
			};
			if(this._userManager){
				JSB.merge(userInfo, this._userManager.getUserInfo(userInfo.userName, opts));
			}
			return userInfo;
		},

		getUserGroupNames: function(userId) {
			if(this._userManager){
				return this._userManager.getUserGroupNames(userId||this.getUserId());
			}
			return {};
		},

        getUserGroups: function(userId){
			if(this._userManager){
				return this._userManager.getUserGroups(userId);
			}
            return {};
        },

        getAllGroups: function(){
			if(this._userManager){
				return this._userManager.getAllGroups();
			}
            return {};
        },

		getAccessControlContext: function() {
		    return AccessController.getContext();
		},

		getPrincipals: function(){
            var subject = Subject.getSubject($this.getAccessControlContext());
            var principals = [];
            if(subject != null) {
                for(var it = subject.getPrincipals().iterator(); it.hasNext(); ) {
                    var principal = it.next();
                    principals.push(principal);
                }
            }
            return principals;
		},

		isAuthenticated: function(){
            var principals = $this.getPrincipals();
            let pCnt = 0;
            if(principals){
	            for(let i = 0; i < principals.length; i++){
	            	if(principals[i] instanceof AnonymousPrincipal){
	            		continue;
	            	}
	            	pCnt++;
	            }
            }
            return pCnt > 0;
		},

		getPrincipal: function(){
            var subject = Subject.getSubject($this.getAccessControlContext());
            if(subject != null) {
                for(var it = subject.getPrincipals().iterator(); it.hasNext(); ) {
                    var principal = it.next();
                    return principal;
                }
            }
            return null;
        },

		getPrincipalName: function(){
            var p = $this.getPrincipal();
            if (p) {
                return p.getName();
            }
            return null;
        },

		getPrincipalUserName: function(){
            var p = $this.getPrincipalName();
            var i = p.indexOf('@');
            return i > 0 ? p.substring(0,i) : p;
        },

        doAsSystem: function(callback, asSystem){
            var asSystem = JSB.isDefined(asSystem) ? asSystem : true;
            if (!asSystem) {
                return callback();
            }
            var systemPrincipal = new SystemPrincipal();
            var subj = new Subject(true, Collections.singleton(systemPrincipal), Collections.emptySet(), Collections.emptySet());
            return Subject.doAs(subj, new PrivilegedExceptionAction() {
                run: function(){
                    return callback();
                }
            });
        },

        getPermissions: function(){
        	return this._permissionMap;
		},
		
		getPermission: function(pId){
			return this._permissionMap[pId];
		},
		
		getPermissionParams: function(permissionId){
			if(!$this._userManager){
				throw new this.SecurityError('UserManager has not been installed');
			}
			
			if(!this._permissionMap[permissionId]){
				throw new this.SecurityError('Missing permission with id "' + permissionId + '"');
			}
			
			return $this._userManager.getPermissionParamsForUser(Auth.getUser(), permissionId);
		},

		/** Check user permission
		*/
		checkPermission: function(permissionId){
			if(!Auth.isSecurityEnabled()){
				return;
			}
			
			if(!$this._userManager){
				throw new this.SecurityError('UserManager has not been installed');
			}
			
			if(!this._permissionMap[permissionId]){
				throw new this.SecurityError('Missing permission with id "' + permissionId + '"');
			}

			if(Kernel.isSystemOrAdmin()){
				return;
			}
			
			var permissionParamChain = $this._userManager.getPermissionParamsForUser(Auth.getUser(), permissionId);

			var callArgs = [null];
			for(var i = 1; i < arguments.length; i++){
				callArgs.push(arguments[i]);
			}
			var lastError = null;
			var pInst = this._permissionMap[permissionId];
			for(var i = 0; i < permissionParamChain.length; i++){
				callArgs[0] = permissionParamChain[i];
				try {
					pInst.check.apply(pInst, callArgs);
					return;
				} catch(e){
					lastError = e;
				}
			}
			if(lastError){
				throw lastError;
			}
		},
		
		testPermission: function(permissionId){
			try {
				this.checkPermission.apply(this, arguments);
			} catch(e) {
				return e;
			}
		},

		checkAccessPermission: function(requests, permissions){
			if(!Auth.isSecurityEnabled()){
				return;
			}

			if(!$this._userManager){
				throw new this.SecurityError('UserManager has not been installed');
			}

            if (JSB.isString(requests)) {
			    requests = AccessPermissions.parseAccessRequest(requests);
            }

			var level = 0;
			for(var i = 0; i < requests.length; i++){
				var request = requests[i];
				var pInst = this._permissionMap[request.type];
				var lvl = pInst.check(request, permissions);
				if(lvl < 0) {
				    return lvl;
				}
				if (lvl > level) {
				    level = lvl;
				}
			}

            return level;
		},

		_logStackHook: function() {
//		    var stack = JSB.stackTrace();
//		    //debugger;
//		    FileSystem.write('logs/__jsbeans_auth-' + $this.getPrincipalName() + '-' + MD5.md5(stack).substring(0,8) + '.log', stack);
		},

	}
}