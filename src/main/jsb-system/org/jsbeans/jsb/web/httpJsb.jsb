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
	$name:'JSB.Web.HttpJsb',
	$server: {
		$require: ['JSB.System.Kernel','JSB.System.Log', 'JSB.Web', 'JSB.Crypt.MD5'],
		$singleton: true,
		
		$constructor: function(){
		},
		
		exec: function(beanPath, proc, params){
			if(!beanPath || beanPath.length === 0){
				throw 'Wrong bean path';
			}
			if(beanPath[0] == '/' || beanPath[0] == '\\'){
				beanPath = beanPath.substr(1);
			}
			var repoEntry = $jsb.getRepository().getByPath(beanPath);
			if(!repoEntry || !repoEntry.jsb){
				throw 'Unable to find bean: ' + beanPath;
			}

            if(!$this.findHttpBean(repoEntry.jsb)) {
                throw 'Bean "' + repoEntry.jsb.$name + '" does not allow to be called via HTTP. Use "$http" option in bean declaration.';
            }
/*			
			if(!repoEntry.jsb['$http'] && (!repoEntry.jsb.currentSection() || !repoEntry.jsb.currentSection()['$http'])){
				throw 'Bean "' + repoEntry.jsb.$name + '" does not allow to be called via HTTP. Use "$http" option in bean declaration.';
			}
*/			
			var instanceId = params && params.length > 1 ? MD5.md5(params[1]) : '__httpCall__' + repoEntry.jsb.$name;
			if(repoEntry.jsb.getKeywordOption('$fixedId') && params && params.length > 0 && params[0]['id']){
				instanceId = params[0]['id'];
			}
			var request = Web.getRequest();
			var response = Web.getResponse();
			var servlet = Web.getServlet();
			var context = Web.getContext();
			try {
				if(proc == 'options'){
					var hMtd = request.getHeader("Access-Control-Request-Method");
					if(hMtd){
						var mtd = '' + hMtd;
						// check whether method existed
						var jsb = JSB.get(repoEntry.jsb.$name);
						if(jsb && jsb.hasMethod(mtd.toLowerCase())){
							response.addHeader("Access-Control-Allow-Methods", mtd);
						}
					} else {
						// return standard headers
						response.addHeader("Allow", 'OPTIONS, GET, HEAD, POST');
					}
					var headers = request.getHeader("Access-Control-Request-Headers");
					if(headers){
						response.addHeader("Access-Control-Allow-Headers", ''+headers);
					}
					
					// allow CORS
					response.addHeader("Access-Control-Allow-Origin", '*');
					
					servlet.processExecResultAsync(null, null, context);
					return;
				}
				var result = $jsb.getProvider().executeClientRpc(repoEntry.jsb.$name, instanceId, proc, params);
				var opts = {};
				if(result instanceof Web.Response){
				    if (result.opts && result.opts.noComplete) {
				        return;
				    }
					opts = result.opts; 
					result = result.data; 
				}
				if(JSB.isFuture(result)){
					// call processExecResultAsync after future raise
					result.await(function(ret, fail){
						if(fail){
							servlet.processExecResultAsync(null, fail, context);
						} else {
							var opts = {};
							if(ret instanceof Web.Response){
								opts = ret.opts; 
								ret = ret.data; 
							}
							servlet.processExecResultAsync({
								exec: ret, 
								opts: opts
							}, null, context);
						}
					});
				} else {
					// call processExecResultAsync immediately
					if(JSB.isDefined(result)){
						servlet.processExecResultAsync({
							exec: result, 
							opts: opts
						}, null, context);
					} else {
						servlet.processExecResultAsync(null, null, context);
					}
				}
			} catch(e){
				var err = e;
				servlet.processExecResultAsync(null, err, context);
			}
		},

		findHttpBean: function(jsb) {
		    while(jsb && jsb.$name != 'JSB.Object') {
		        if (jsb.$http || (jsb.currentSection() && jsb.currentSection().$http)) {
		            return jsb;
		        }
		        jsb = jsb.getParent();
		    }
		    return false;
		},
		
	}
}