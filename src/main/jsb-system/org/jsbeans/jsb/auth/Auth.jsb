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

		           'java:java.security.AccessControlContext',
		           'java:java.security.AccessController',
		           'java:javax.security.auth.Subject',
		           'java:java.security.Principal'],

	    $constructor: function(opts) {
	        $base(opts);
	        if ($this.isSecurityEnabled()) {
                var bean = Config.get('kernel.security.permissionsBean');
                JSB.lookup(bean, function(PermissionsClass){
                    $this.repo = new PermissionsClass();
                });
            }
            // setup JSB.Error
            $this.SecurityError = function (message){
                this.message = message;
                JSB.Error.apply(this, arguments);
                JSB.Error.captureStackTrace(this);
            };
            $this.SecurityError.prototype = Object.create(JSB.Error.prototype);
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

		getAccessControlContext: function() {
		    return AccessController.getContext();
		},

		getPrincipals: function(token){
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
            var principals = $this.getUserPrincipals();
            return principals && principals.size() > 0;
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

        hasRole: function() {
            // TODO check jaas role
            //$this.checkPermission()
        },

        checkPermission: function(permission, use) {
            var currentUser  = $this.getPrincipalName();
            if($this.isSecurityEnabled()) {
                if (!$this.repo) {
                    throw new $this.SecurityError('Permissions bean is not initialized, set config kernel.security.permissionsBean');
                }
                if(!currentUser) {
                    throw new $this.SecurityError('Not authorized user for permission ' + permission);
                }

                var status = $this.repo.hasPermission(currentUser, permission, use);
                if (status) {
                    return true;
                }
                throw new $this.SecurityError('User ' + currentUser + ' has no permission ' + permission);
            }
            return true;
        },

        getPermission: function(user, permission) {
            if($this.isSecurityEnabled()) {
                if (!$this.repo) {
                    throw new $this.SecurityError('Permissions bean is not initialized, set config kernel.security.permissionsBean');
                }
                var currentUser  = $this.getPrincipalName();
                if (currentUser) {
                    if (currentUser != user) {
                        $this.checkPermission('jsb.auth.getNotOwnPermission');
                    }
                    var desc = $this.repo.getPermission(user, permission);
                    return desc;
                }
            }
            return null;
		},

        addPermission: function(user, permission, desc) {
            if (!$this.repo) {
                throw new $this.SecurityError('Permissions bean is not initialized, set config kernel.security.permissionsBean');
            }
            $this.checkPermission('jsb.auth.addPermission');
            var status = $this.repo.addPermission(user, permission, desc);
            return status;
		},

		removePermission: function(user, permission, desc) {
            if (!$this.repo) {
                throw new $this.SecurityError('Permissions bean is not initialized, set config kernel.security.permissionsBean');
            }
            $this.checkPermission('jsb.auth.removePermission');
            var status = $this.repo.removePermission(user, permission, desc);
            return status;
		},

		_logStackHook: function() {
		    var stack = JSB.stackTrace();
		    //debugger;
		    FileSystem.write('logs/__jsbeans_auth-' + $this.getPrincipalName() + '-' + MD5.md5(stack).substring(0,8) + '.log', stack);
		},

	}
}