/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.ClientBootstrap',
	$http: true,
	$singleton: true,
	
	$server: {
		$require: ['JSB.Web',
		           'JSB.System.Config',
		           'java:org.jsbeans.web.JsMinifier'],
		
		cachedContent: null,
		
		get: function() {
			if(this.cachedContent){
				return this.cachedContent;
			}
			
			
			function setupServerPath(){
				var arrScripts = document.getElementsByTagName('script');
				for(var i in arrScripts){
					var curSrc = arrScripts[i].src;
					var match = /(.*?)\/jsbeans\.jsb/gi.exec(curSrc);
					if(!JSB().isNull(match)){
						JSB().getProvider().setServerBase(match[1]);
						break;
					}
				}
			}
			
			var code = '';
			
			// insert engine
			code += Web.getJsbCode();
			
			// insert server version to avoid browser cache
			code += 'JSB().setServerVersion("' + Config.get('build.version') + '");';
			
			// insert setup server code
			var setupProcStr = '(' + setupServerPath.toString().trim() + ')();';
			if(!Config.get('web.debug')){
				setupProcStr = '' + JsMinifier.minify(setupProcStr, false);
			}
			code += setupProcStr;
			
			// insert dom controller
			code += Web.getJsbCode('JSB.Widgets.DomController');
			
			this.cachedContent = code;
			
			return code;
		}
	}
}