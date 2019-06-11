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
	$name:'JSB.System.Debug',
	$require: ['JSB.System.Kernel'],
	$server: {
		$singleton: true,
		$globalize: true,
		list: function(template){
			if(JSB().isNull(template)){
				template = {};
			}
			return Kernel.ask('ExecutionDebuggerService', 'AccessSignalLogMessage', {
				operation: 'Lookup',
				withArtifact: false,
				template: template,
				onlyWaiting: false,
				offset: 0,
				limit: 0
			});
		},
		
		clear: function(){
			return Kernel.ask('ExecutionDebuggerService', 'AccessSignalLogMessage', {
				operation: 'Remove',
				withArtifact: false,
				template: {},
				onlyWaiting: false,
				offset: 0,
				limit: 0
			});
		}
	}
}