{
	$name: 'JSB.ClientBootstrap',
	$require: ['Web'],
	$http: true,
	$singleton: true,
	
	$server: {
		
		get: function() {
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
			code += '(' + setupServerPath.toString() + ')();';
			
			// insert dom controller
			code += Web.getJsbCode('JSB.Widgets.DomController');
			
			return code;
		}
	}
}