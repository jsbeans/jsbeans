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
	$name:'JSB.Template.Template',
	$require: ['JSB.System.Kernel', 'JSB.System.Log'],
	$server: {
		$singleton: true,
		$globalize: 'Template',
		$constructor: function(){},

		exec: function(te, pattern, json){
			var execProc = 'exec_' + te;
			if(!this[execProc]){
				throw 'Unable to find template engine: ' + te;
			}
			return this[execProc](pattern, json);
		}
	}
}