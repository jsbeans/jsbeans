/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'Cache',
	$server: {
		$singleton: true,
		$globalize: true,
		// vars
		globalScope: {},
		
		// methods
		globalRootScope: function(){
			return this.globalScope;
		},
		
		localRootScope: function(){
			var l = (function(){ return this; }).call(null);
			var lcName = 'localCache'; 
			if(l[lcName] == null || l[lcName] == undefined){
				l[lcName] = {};
			}
			return l[lcName];
		},
		
		global: function(path){
			return this.subScope(this.globalRootScope(), path);
		},
		
		local: function(path){
			return this.subScope(this.localRootScope(), path);
		},

		subScope: function(rootScope, path){
			if( path == null || path == undefined){
				return rootScope;
			}
			var subScopes = path.split('/');
			var curScope = rootScope;
			for(var i = 0; i < subScopes.length; i++ ){
				var ss = subScopes[i];
				if(curScope[ss] == null || curScope[ss] == undefined){
					curScope[ss] = {};
				}
				curScope = curScope[ss];
			}
			 
			return curScope;
		}			
	}
}