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
	$name: 'JSB.Workspace.BrowserView',
	$parent: 'JSB.Widgets.Widget',
	
	$require: ['JSB.Workspace.WorkspaceController', 
	           'JSB.Widgets.Button',
	           'jQuery.UI.Effects',
	           'css:BrowserView.css'],
	           
	$client: {
		entry: 0,
		workspace: null,
		
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('workspaceBrowserView');
			
		},
		
		setCurrentEntry: function(entry, opts){
			if(this.entry === entry){
				return;
			}
			this.entry = entry;
			if(this.entry){
				this.workspace = this.entry.getWorkspace();
				this.server().setCurrentEntry(entry);
			} else {
				this.workspace = null;
			}
			this.refresh();
		},
		
		getCurrentEntry: function(){
			return this.entry;
		},
		
		refresh: function(){
			throw 'This method should be overriden';
		},
	},
	
	$server: {
		setCurrentEntry: function(entry){
			if(entry){
				this.publish('JSB.Workspace.BrowserView.setCurrentEntry', entry);
			}
		}
	}
}