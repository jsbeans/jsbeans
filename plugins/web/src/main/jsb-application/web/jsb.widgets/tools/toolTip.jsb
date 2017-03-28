{
	$name:'JSB.Widgets.Tooltip',
	$parent: 'JSB.Widgets.Tool',
	
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			JSB.lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
				toolMgr.registerTool({
					id: '_dwp_standardTooltip',
					jso: self,
					wrapperOpts: {
						exclusive: 'tooltip',
						modal: false,
						hideByOuterClick: true,
						hideInterval: 3000,
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
			var elt = this.getElement();
			elt.addClass('_dwp_tooltip');
		},
		
		complete: function(){
			this.close();	// close tool
		},
		
		onMessage: function(sender, msg, params ){
		},
		
		update: function(){
			var data = this.data.data;
			this.getElement().empty();
			this.getElement().append(data);
		},
		
		
		setFocus: function(){
		}
	}
}