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
	$name: 'JSB.Workspace.FolderBrowserView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$expose: {
		priority: 0,
		acceptNode: [null, 'JSB.Workspace.FolderNode'],
		acceptEntry: [null, 'JSB.Workspace.FolderEntry'],
		caption: 'Объекты'
	},
	
	$client: {
		$require: ['css:FolderBrowserView.css'],
		$constructor: function(opts){
			$base(opts);
			this.addClass('workspaceFolderBrowserView');
		},
		
		refresh: function(){}
		
	}
	
}