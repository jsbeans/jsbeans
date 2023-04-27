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
	$name: 'JSB.Manifest',
	$http: true,
	$singleton: true,

	$server: {
		$require: ['JSB.Web'],

		cachedContent: {},
		
		get: function(params, url){
/*			
			function urlJoin(pObj, bRelative){
				// expand url
				let pIdx = url.indexOf('?'), leftPart, rightPart;
				if(pIdx < 0){
					leftPart = url;
					rightPart = '';
				} else {
					leftPart = url.substr(0, pIdx);
					rightPart = url.substr(pIdx + 1);
				}
				
				if(bRelative){
					let idx = leftPart.lastIndexOf('\/');
					leftPart = leftPart.substr(idx);
				}
				
				// parse right part
				let rMap = {};
				if(rightPart.length > 0){
					var rx = /([^\=\&]+)(\=([^\&]+))?/g;
					while(true){
						let m = rx.exec(rightPart);
						if(!m){
							break;
						}
						rMap[m[1]] = m[3];
					}
				}
				JSB.merge(rMap, pObj);
				let oUrl = leftPart;
				if(Object.keys(rMap).length > 0){
					let bWas = false;
					for(let p in rMap){
						if(JSB.isNull(rMap[p])){
							continue;
						}
						oUrl += (bWas ? '&' : '?');
						oUrl += p + '=' + rMap[p];
						bWas = true;
					}
				}
				return oUrl;
			}
*/			
			if(!params.jsb){
				throw new Error('Missing jsb parameter to generate manifest for');
			}
			
			let jsb = JSB.get(params.jsb);
			if(!jsb){
				throw new Error('Unable to find bean: ' + params.jsb);
			}
			var htmlSection = jsb['$html'];
			if(!htmlSection){
				throw new Error('Bean "' + params.jsb + '" has no $html expose');
			}
			if(!htmlSection.manifest){
				throw new Error('Bean "' + params.jsb + '" has no manifest descriptor');
			}
			
			
			let manObj = JSB.merge({
				'start_url': jsb.getBasePathFile(),
				'name': htmlSection && htmlSection.title,
				'background_color': '#fff',
				'display': 'standalone',
				'description': htmlSection && htmlSection.title,
				
			}, htmlSection.manifest);
			return Web.respond(manObj, {
				mode:'json',
				contentType: 'application/manifest+json'
			});
			
		},

	}
}