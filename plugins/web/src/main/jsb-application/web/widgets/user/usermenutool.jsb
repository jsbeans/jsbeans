JSB({
	name:'UserMenuTool',
	parent: 'JSB.Widgets.Tool',
	group: 'dwp',
	require: {
		'JSB.Widgets.FloatingContainer': 'WidgetContainer'
	},
	client: {
		bootstrap: function(){
			// register tooltip
			var self = this;
			JSO().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
				toolMgr.registerTool({
					id: '_dwp_userMenuTool',
					jso: self,
					wrapperOpts: {
						exclusive: false,
						modal: true,
						hideByOuterClick: false,
						hideInterval: 0,
						cssClass: '_dwp_userMenuToolWrapper'
					}
				});
			});
		},
		
		constructor: function(opts){
			var self = this;
			this.base(opts);
			this.loadCss('usermenutool.css');
			this.addClass('_dwp_userMenuTool');
			
			// append header
			this.header = this.$('<div class="header"><div class="icon"></div><div class="title"></div><div class="close"></div></div>');
			this.append(this.header);

			this.header.find('.close').click(function(){
				self.close();
			});
			
			// append container
			this.wc = new self.WidgetContainer({
				position: 'fixed',
				allowClose: false
			});
			this.append(this.wc);
			this.subscribe('userMenuClose', function(){
				self.close();
			});
		},
		
		onMessage: function(sender, msg, params ){
		},
		
		update: function(){
			var widget = this.data.data;
			this.header.find('.title').text(widget.jso.expose.displayName);
			this.header.find('.icon').attr('key', widget.jso.name);
			if(!this.wc.getWidget() || (this.wc.getWidget() && this.wc.getWidget().getId() != widget.getId())){
				if(this.wc.getWidget()){
					this.wc.getWidget().detachContainer();
				}
				this.wc.attachWidget(widget);
			}
		},
		
		
		setFocus: function(){
		}
	}
});