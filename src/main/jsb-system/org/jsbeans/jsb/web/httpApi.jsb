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
	$name:'JSB.HttpApi',
	$server: {
		$require: ['JSB.System.Kernel','JSB.System.Log', 'JSB.Web'],
		$singleton: true,
		httpMap: {},
		
		$constructor: function(){
			var self = this;
			JSB().onLoad(function(){
				if(this.HttpApi || this.$server.HttpApi){
					self.registerBeanHttpMethods(this);
				}
			});
		},
		
		registerBeanHttpMethods: function(jsb){
			var httpApiDesc = jsb.HttpApi || jsb.$server.HttpApi;
			var mapping = httpApiDesc.mapping;
			var prefix = httpApiDesc.alias || '';
			if(prefix.length > 0 && prefix[prefix.length - 1] != '/'){
				prefix += '/';
			}
			for(var key in mapping){
				var urlPath = prefix + key;
				this.registerHttpMethod(urlPath, mapping[key], jsb);
			}
			
		},
		
		registerHttpMethod: function(url, mtdName, jsb){
			this.httpMap[url] = {
				method: mtdName,
				jsb: jsb
			}
		},
		
		exec: function(proc, params){
			var procDesc = this.httpMap[proc];
			if(!procDesc){
				throw 'Error: No API method found under "' + proc + '" path';
			}
			return JSB().getProvider().executeClientRpc(procDesc.jsb.$name, '__httpCall__' + procDesc.jsb.$name, procDesc.method, params);
		}
		
	}
}