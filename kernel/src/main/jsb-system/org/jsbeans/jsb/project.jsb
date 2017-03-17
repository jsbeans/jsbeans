{
	$name:'Project',
	$client: {
		$singleton: true,
		run: function(obj, callback){
			var self = this;
			this.rpc('run',[obj.project, obj.script, obj.args], function(res){
				if(!JSO().isNull(callback)){
					callback.call(self, res.result.response.result);
				}
			});
		}, 
		exec: function(alias, args, callback){
			this.rpc('exec', [alias, args], function(resp){
				if(!JSO().isNull(callback)){
					callback(resp);
				}
			});
		}
	},
	$server: {
		$require: ['Kernel'],
		$singleton: true,
		$globalize: true,
		$constructor: function(){
			// create databases
//			RDB.sql(this.connectionStr, 'create table if not exists projects (id varchar(32) primary key hash, name nvarchar(50), desc nvarchar(255))');
//			RDB.sql(this.connectionStr, 'create table if not exists processes (id varchar(32) primary key hash');
		},
		list: function(pat){
			var res = Kernel.ask('ProjectManagerService','LookupProjectMessage', pat);
			var retArr = [];
			for(var i in res.result.response){
				var desc = res.result.response[i];
				retArr.push({
					id: desc.simpleId,
					title: desc.title,
					desc: desc.description,
					scripts: desc.scriptMap
				});
			}
			return retArr;
		},
		
		run: function(projectTitle, scriptName, args){
			var arrArgs = [];
			if(!JSO().isNull(args)){
				if(!JSO().isArray(args)){
					arrArgs.push(args);
				} else {
					arrArgs = args;
				}
			}
			return Kernel.ask('ProjectManagerService','ExecuteProjectScriptMessage', {
				projectTitle: projectTitle,
				scriptName: scriptName,
				args: arrArgs,
				session: Kernel.session(),
				user: Kernel.user()
			});
		},
		
		exec: function(alias, args){
			var argsArr = [];
			if(JSO().isArray(args)){
				argsArr = args;
			} else {
				argsArr.push(args);
			}
			alias = alias.replace(/\./gi, '/');
			var func = this.searchScope(JSO().getGlobe(), alias);
			if(JSO().isNull(func)){
				var err = 'No function have been exported under "'+alias+'"';
				Log.error(err);
				throw err;
				return null;
			}

			if(!JSO().isFunction(func)){
				var err = 'Object resides under specified name: "'+alias+'" is not a function, and therefore cannot be called';
				Log.error(err);
				throw err;
				return null;
			}
			
			return func.apply(null, argsArr);
		},

		opts: function(alias){
			alias = alias.replace(/\./gi, '/');
			
			var ns = alias.substr(0, alias.lastIndexOf('/'));
			var scope = this.searchScope(JSO().getGlobe(), ns);
			
			var aName = alias.substr(alias.lastIndexOf('/') + 1);
			if(!scope){
				throw 'Scope not found: ' + alias;
			}
			
			var opts = {};
			if(scope.__opts__ && scope.__opts__[aName]){
				opts = scope.__opts__[aName];
			}
			
			return opts;
		},

		clearScope: function(root, path){
			var pathParts = path.split('.');
			if(pathParts.length == 0){
				return;
			}
			var partName = pathParts[0];
			delete root[partName];
		},
		
		touchScope: function(parentScope, path){
			var pathParts = path.split('/');
			if(path[0] == '/'){
				parentScope = JSO().getGlobe();
			}
			var lastScope = parentScope;
			for(var i in pathParts){
				var part = pathParts[i];
				if(part.length == 0){
					continue;
				}
				if(part == '.'){
					continue;
				} else if(part == '..'){
					lastScope = lastScope.__parent__;
				} else {
					Kernel.lock('touchScope');
					if(JSO().isNull(lastScope[part])){
						lastScope[part] = {
							__parent__: lastScope
						};
					}
					lastScope = lastScope[part];
					Kernel.unlock('touchScope');
				}
			}
			return lastScope;
		},
		
		searchScope: function(parentScope, path){
			var pathParts = path.split('/');
			if(path[0] == '/'){
				parentScope = JSO().getGlobe();
			}
			var lastScope = parentScope;
			for(var i in pathParts){
				var part = pathParts[i];
				if(part.length == 0){
					continue;
				}
				if(part == '.'){
					continue;
				} else if(part == '..'){
					lastScope = lastScope.__parent__;
				} else {
					if(JSO().isNull(lastScope[part])){
						return null;
					}
					lastScope = lastScope[part];
				}
			}
			
			return lastScope;
		},
		
		export: function(obj, scopePath){
			var alias = undefined;
			var opts = undefined;
			for(var i = 2; i < arguments.length; i++ ){
				if(JSO().isString(arguments[i])){
					alias = arguments[i];
				} else if(JSO().isPlainObject(arguments[i])){
					opts = arguments[i];
				}
			}
			
			var parentScope = this.touchScope(JSO().getGlobe(), scopePath);
			if (!alias && JSO().isFunction(obj)) {
				alias = obj.name;
				if(!alias){
					var m = obj.toString().match(/function ([^\(]+)/);
					if(m && m.length > 0){
						alias = m[1];
					}
				}
			}
			var scope = null;
			var aName = null;
			if(alias){
				var ns = alias.substr(0, alias.lastIndexOf('/'));
				scope = this.touchScope(parentScope, ns);
				aName = alias.substr(alias.lastIndexOf('/') + 1);
			} else {
				scope = parentScope;
			}
			
			if(aName && aName.length > 0){
				scope[aName] = obj;
				
				// export opts
				if(opts){
					scope.__opts__ = scope.__opts__ || {};
					scope.__opts__[aName] = opts;
				}
			} else {
				if(JSO().isFunction(obj)){
					// export anonymous function into script scope
					var pScope = scope.__parent__;
					// detect scope name
					var names = Object.keys(pScope);
					for(var i = 0; i < names.length; i++ ){
						if(pScope[names[i]] == scope){
							break;
						}
					}
					
					if(i < names.length){
						aName = names[i];
						pScope[aName] = obj;
						names = Object.keys(scope);
						for(var i in names){
							pScope[aName][names[i]] = scope[names[i]];
						}
						pScope[aName].__parent__ = pScope;
					}
					
				} else {
					// export JSON object into script scope
					JSO().merge(true, scope, obj);
				}
			}
		},
		
		import: function(scopePath, alias){
			var parentScope = this.searchScope(JSO().getGlobe(), scopePath);
			if(parentScope === null){
				this.touchScope(JSO().getGlobe(), scopePath);
				parentScope = this.searchScope(JSO().getGlobe(), scopePath);
			}
			return this.searchScope(parentScope, alias);
		},
		
		print: function(obj){
			
		}
	}
}