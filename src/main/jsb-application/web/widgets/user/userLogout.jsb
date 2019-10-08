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
	$name: 'UserLogout',
	$parent: 'UserMenuItem',

	expose: {
		path: 'User/Menu',
		displayName: 'Выход',
		order: 1000,
		group: 'exit'
	},
	$client: {
		$constructor: function(){
		},
		execute: function(){
			var self = this;
			var serverBase = JSB().getProvider().getServerBase();
			JSB().getProvider().ajax(serverBase + 'logout', {mode: 'json'}, function(status, res){
				self.publish('userLogout');
			});
		}
	},
	
	$server: {}
}