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