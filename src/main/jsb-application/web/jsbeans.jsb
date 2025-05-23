/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2025
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2025гг.
 */

{
	$name: 'JSB.ClientBootstrap',
	$http: true,
	$singleton: true,
	
	$server: {
		$require: ['JSB.Web',
		           'JSB.System.Config',
		           'JSB.System.Kernel',
		           'JSB.Auth',
		           'java:org.jsbeans.web.JsMinifier'],
		
		cachedContent: {},
		
		$constructor: function(){
			this._minifyScripts = Config.has('web.minifyScripts') && Config.get('web.minifyScripts') || false;
			this._es5Compatible = Config.has('web.es5Compatible') && Config.get('web.es5Compatible') || false;
		},
		
		get: function(obj) {
			var path = 'jsbeans.jsb';
			var refType = null;
			if(obj && obj.refid){
				var refInst = JSB.getInstance(obj.refid);
				if(refInst){
					refType = refInst.getJsb().getDescriptor().$name;
					if(refType){
						path += '?ref=' + refType;
					}
				}
			} else if(obj && obj.ref){
				refType = obj.ref;
				path += '?ref=' + refType;
			}
			if(this.cachedContent[path]){
				var retCode = this.cachedContent[path] + 'JSB().setCurrentSession("' + JSB.getCurrentSession() + '");';
				
				return Web.respond(retCode, {
					contentType: 'application/javascript; charset=UTF-8'
				});
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

			// insert session & param name
			code += 'JSB().setSessionIdParameterName("' + Web.getSessionIdPathParameterName() + '");';

			// insert server version to avoid browser cache
			code += 'JSB().setServerVersion("' + Config.get('build.version') + '");';
			
			// insert setup server code
			var setupProcStr = '(' + setupServerPath.toString().trim() + ')();';
			if(!Config.get('web.debug')){
				setupProcStr = '' + JsMinifier.minify(setupProcStr, false, this._minifyScripts, this._es5Compatible);
			}
			code += setupProcStr;
			
			// insert dom controller
			code += Web.getJsbCode('JSB.Widgets.DomController');
			
			if(refType){
				// inject referencer requires
				var reqMap = {};
				$this.combineRequires(refType, reqMap);
				for(var r in reqMap){
					code += Web.getJsbCode(r);
				}
			}
			
			this.cachedContent[path] = code;
			
			var retCode = code + 'JSB().setCurrentSession("' + JSB.getCurrentSession() + '");';
			
			return Web.respond(retCode, {
				contentType: 'application/javascript; charset=UTF-8'
			});
		},
		
		combineRequires: function(refType, reqMap){
			if(reqMap[refType]){
				return;
			}
			reqMap[refType] = true;
			
			function parseReqEntry(e){
				if(JSB.isArray(e)){
					for(var i = 0; i < e.length; i++){
						parseReqEntry(e[i]);
					}
				} else if(JSB.isString(e)){
					var rObj = {};
					// generate alias
					var alias = e;
					if(alias.toLowerCase().indexOf('script:') == 0 || alias.toLowerCase().indexOf('css:') == 0 || alias.toLowerCase().indexOf('java:') == 0){
						return;
					}
					rObj[alias] = e;
					parseReqEntry(rObj);
				} else {
					for(var alias in e){
						var requiredJsb = e[alias];
						if(requiredJsb.toLowerCase().indexOf('script:') == 0 || requiredJsb.toLowerCase().indexOf('css:') == 0 || requiredJsb.toLowerCase().indexOf('java:') == 0){
							continue;
						}
						$this.combineRequires(requiredJsb, reqMap);
					}
				}
			}
			
			
			var refJsb = JSB.get(refType);
			var refDesc = refJsb.getDescriptor();
			// insert parent
			if(refDesc.$parent){
				$this.combineRequires(refDesc.$parent, reqMap);
			}
			// inject global requires
			if(refDesc.$require){
				parseReqEntry(refDesc.$require)
			}
			if(refDesc.$client && refDesc.$client.$require){
				parseReqEntry(refDesc.$client.$require)
			}
		}
	}
}