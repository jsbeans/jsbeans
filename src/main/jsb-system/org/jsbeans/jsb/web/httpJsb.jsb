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
	$name:'JSB.HttpJsb',
	$server: {
		$require: ['JSB.System.Kernel','JSB.System.Log', 'JSB.Web'],

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
/*			
			if(!repoEntry.jsb['$http'] && (!repoEntry.jsb.currentSection() || !repoEntry.jsb.currentSection()['$http'])){
				throw 'Bean "' + repoEntry.jsb.$name + '" does not allow to be called via HTTP. Use "$http" option in bean declaration.';
			}
*/			
			var instanceId = '__httpCall__' + repoEntry.jsb.$name;
			if(repoEntry.jsb.getKeywordOption('$fixedId') && params && params.length > 0 && params[0]['id']){
				instanceId = params[0]['id'];
			}
			return $jsb.getProvider().executeClientRpc(repoEntry.jsb.$name, instanceId, proc, params);
		}
		
	}
}