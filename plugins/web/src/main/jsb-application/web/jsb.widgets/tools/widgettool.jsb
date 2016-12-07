JSB({
	name:'JSB.Widgets.WidgetTool',
	parent: 'JSB.Widgets.Tool',
	require: {
		'JSB.Widgets.WidgetContainer': 'WidgetContainer'
	},
	client: {
		bootstrap: function(){
			// register tooltip
			var self = this;
			JSO().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
				toolMgr.registerTool({
					id: '_dwp_widgetTool',
					jso: self,
					wrapperOpts: {
						exclusive: true,
						modal: false,
						hideByOuterClick: true,
						hideInterval: 0
					}
				});
			});
		},
		
		constructor: function(opts){
			var self = this;
			$base(opts);
			this.loadCss('widgettool.css');
			this.addClass('_dwp_widgetTool');
			
			this.wc = new self.WidgetContainer();
			this.append(this.wc);
		},
		
		complete: function(){
			this.close();	// close tool
		},
		
		onMessage: function(sender, msg, params ){
		},
		
		update: function(){
			var widget = this.data.data;
			if(!this.wc.getWidget() || (this.wc.getWidget() && this.wc.getWidget().getId() != widget.getId())){
				this.wc.attachWidget(widget);
			}
		},
		
		
		setFocus: function(){
		}
	}
});