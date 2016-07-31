JSO({
	name:'Repo',
	require: ['Kernel'],
	server: {
		singleton: true,
		globalize: true,
		constructor: function(){
			var self = this;
			// install jso load hook
			JSO().onLoad(function(){
				if(!JSO().isNull(this.expose)){
					self.add(this);
				}
			});
		},
		body: {
			scope: {
				__parent__: null,
				__items__: []
			},
			
			touchScope: function(path){
				var pathParts = path.split('/');
				var lastScope = this.scope;
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
						Kernel.lock('repo_touchScope');
						if(JSO().isNull(lastScope[part])){
							lastScope[part] = {
								__parent__: lastScope,
								__items__: []
							};
						}
						lastScope = lastScope[part];
						Kernel.unlock('repo_touchScope');
					}
				}
				return lastScope;
			},
			
			searchScope: function(path){
				var pathParts = path.split('/');
				var lastScope = this.scope;
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
			
			add: function(jso){
				if(!jso || !jso.expose || (!jso.expose.path || jso.expose.path.length === 0) && (!jso.expose.category || jso.expose.category.length === 0)){
					throw 'Unable to expose object "'+jso.name+'" because "expose.path" element found';
				}
				var path = jso.expose.path || jso.expose.category;
				var scope = this.touchScope(path);
				Kernel.lock('repo_add');
				scope.__items__.push(jso);
				Kernel.unlock('repo_add');
			},
			
			list: function(path){
				var scope = this.scope;
				var retObj = {
					items: {},
					folders: []
				};
				if(path && path.length > 0){
					scope = this.searchScope(path);
					if(!scope){
						throw 'Scope is not existed: ' + path;
					}
				}

				// collect items
				for(var i in scope.__items__){
					retObj.items[scope.__items__[i].name] = scope.__items__[i];
				}
				
				// collect folders
				var keys = Object.keys(scope);
				for(var i = 0; i < keys.length; i++ ){
					if(keys[i] == '__items__' || keys[i] == '__parent__' ){
						continue;
					}
					retObj.folders.push(keys[i]);
				}
				
				return retObj;
			}
		}
	}
});
