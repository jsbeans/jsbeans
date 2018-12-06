{
	$name:'JSB.Widgets.DroplistTool',
	$parent: 'JSB.Widgets.Tool',
	$require: {
		ListBox: 'JSB.Widgets.ListBox'
	},
	$client: {
		$require: ['css:dropListTool.css'],
		$bootstrap: function(){
			// register tooltip
			var self = this;
			JSB().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
				toolMgr.registerTool({
					id: '_dwp_droplistTool',
					jso: self,
					wrapperOpts: {
						exclusive: '_dwp_droplistTool',
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
			this.addClass('_dwp_droplistTool');
			this.listbox = new ListBox({
				onSelectionChanged: function(key, item, evt){
					if(!item.dontClose){
						self.complete();
					}
					if(!JSB().isNull(self.data.callback)){
						self.data.callback(key, item, evt);
					}
					evt.stopPropagation();
				}
			});
			this.append(this.listbox);
		},
		
		complete: function(){
			this.close();	// close tool
		},
		
		onMessage: function(sender, msg, params ){
		},
		
		update: function(){
			var self = this;
			var arr = this.data.data;
			this.listbox.detach();
			this.listbox.clear();
			for(var i in arr){
				this.listbox.addItem(arr[i]);
			}
			this.listbox.attach();
		},
		
		setFocus: function(){
			this.listbox.setFocus();
		}
	}
}