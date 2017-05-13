{
	$name:'JSB.Widgets.DropTreeTool',
	$parent: 'JSB.Widgets.Tool',
	$require: ['JSB.Widgets.TreeView'],
	
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
			this.loadCss('dropTreeTool.css');
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