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
	$name:'Repo',
	$server: {
		$require: ['JSB.System.Kernel'],
		$singleton: true,
		$constructor: function(){
			var self = this;
			// install jso load hook
			JSB().onLoad(function(){
				if(!JSB().isNull(this.expose) || !JSB().isNull(this.$server.expose)){
					self.add(this);
				}
			});
		},
		
		scope: {
			__parent__: null,
			__items__: []
		},
		subscribeMap: {},
		
		touchScope: function(path){
			path = path.toLowerCase();
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
					if(JSB().isNull(lastScope[part])){
						lastScope[part] = {
							__parent__: lastScope,
							__items__: {},
							__options__: {}
						};
					}
					lastScope = lastScope[part];
					Kernel.unlock('repo_touchScope');
				}
			}
			return lastScope;
		},
		
		searchScope: function(path){
			path = path.toLowerCase();
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
					if(JSB().isNull(lastScope[part])){
						return null;
					}
					lastScope = lastScope[part];
				}
			}
			
			return lastScope;
		},
		
		add: function(jsb){
			if(!jsb || (!jsb.expose && !jsb.$server.expose)){
				throw 'Unable to expose object "'+jsb.$name+'" because no "expose" element found';
			}
			var self = this;
			function _expose(path, opts, jsb){
				path = path.toLowerCase();
				Kernel.lock('repo_add');
				var scope = self.touchScope(path);
				scope.__items__[jsb.$name] = jsb;
				scope.__options__[jsb.$name] = opts;
				Kernel.unlock('repo_add');
				
				// call subscribers
				var pathParts = path.split('/');
				var curPath = '';
				for(var i = 0; i < pathParts.length; i++){
					if(curPath.length > 0){
						curPath += '/';
					} 
					curPath += pathParts[i];
					if(self.subscribeMap[curPath]){
						var callbackArr = self.subscribeMap[curPath];
						for(var j = 0; j < callbackArr.length; j++){
							if(callbackArr[j]){
								callbackArr[j].call(self, path, opts, jsb);
							}
						}
					}
				}
			}
			
			var expose = jsb.expose || jsb.$server.expose;
			
			if((expose.path && expose.path.length > 0) || (expose.category && expose.category.length > 0)){
				// old expose format
				_expose(expose.path || expose.category, expose, jsb);
			} else {
				for(var path in expose){
					var opts = expose[path];
					_expose(path, opts, jsb);
				}
			}
		},
		
		list: function(path){
			var scope = this.scope;
			var retObj = {
				items: {},
				options: {},
				folders: []
			};
			if(path && path.length > 0){
				path = path.toLowerCase();
				scope = this.searchScope(path);
				if(!scope){
					throw 'Scope is not existed: ' + path;
				}
			}

			// collect items
			for(var name in scope.__items__){
				retObj.items[name] = scope.__items__[name];
				retObj.options[name] = scope.__options__[name];
			}
			
			// collect folders
			var keys = Object.keys(scope);
			for(var i = 0; i < keys.length; i++ ){
				if(keys[i] == '__items__' || keys[i] == '__parent__' || keys[i] == '__options__'){
					continue;
				}
				retObj.folders.push(keys[i]);
			}
			
			return retObj;
		},
		
		subscribeExposed: function(path, callback){
			path = path.toLowerCase();
			if(!this.subscribeMap[path]){
				this.subscribeMap[path] = [];
			}
			Kernel.lock('subscribe_add');
			this.subscribeMap[path].push(callback);
			Kernel.unlock('subscribe_add');
		}
	}
}