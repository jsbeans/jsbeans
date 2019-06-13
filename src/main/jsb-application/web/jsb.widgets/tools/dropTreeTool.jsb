/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'JSB.Widgets.DropTreeTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.TreeView',
	           'css:dropTreeTool.css'],
	
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			JSB().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
				toolMgr.registerTool({
					id: '_dwp_dropTreeTool',
					jso: self,
					wrapperOpts: {
						exclusive: '_dwp_dropTreeTool',
						modal: false,
						hideByOuterClick: true,
						hideInterval: 0,
						cssClass: '_dwp_droplistToolWrapper'
					}
				});
			});
		},
		
		$constructor: function(opts){
			$base(opts);
			this.construct();
		},
		
		construct: function(){
			var self = this;
			this.addClass('_dwp_dropTreeTool');
			this.tree = new TreeView({
				onSelectionChanged: function(key, item, evt){
					if(!item.dontClose){
						$this.complete();
					}
					if(!JSB().isNull(self.data.callback)){
						$this.data.callback(key, item, evt);
					}
					evt.stopPropagation();
				}
			});
			this.append(this.tree);
		},
		
		complete: function(){
			this.close();	// close tool
		},
		
		onMessage: function(sender, msg, params ){
		},
		
		update: function(){
			var self = this;
			var arr = this.data.data;
			this.tree.detach();
			this.tree.clear();
			
			function addTreeItem(itemDesc, parent){
				if(!itemDesc.key){
					itemDesc.key = $jsb.generateUid();
				}
				var curTreeNode = $this.tree.addNode(itemDesc, parent);
				if(itemDesc.children){
					for(var i in itemDesc.children){
						addTreeItem(itemDesc.children[i], itemDesc.key);
					}
				}
			}
			
			for(var i in arr){
				addTreeItem(arr[i]);
			}
			this.tree.attach();
		},
		
		setFocus: function(){
			this.tree.setFocus();
		}
	}
}