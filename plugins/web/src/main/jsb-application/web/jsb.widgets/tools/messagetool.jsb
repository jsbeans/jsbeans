{
	name:'JSB.Widgets.MessageTool',
	parent: 'JSB.Widgets.Tool',
	require:{
		'JSB.Widgets.Button': 'Button'
	},
	client: {
		bootstrap: function(){
			// register tooltip
			var self = this;
			JSO().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
				toolMgr.registerTool({
					id: '_dwp_messageTool',
					jso: self,
					wrapperOpts: {
						exclusive: true,
						modal: true,
						hideByEsc: true,
						hideByOuterClick: false,
						hideInterval: 0,
					}
				});
			});
		},
		
		constructor: function(opts){
			$base(opts);
			this.construct();
		},
		
		construct: function(){
			var self = this;
			this.loadCss('messageTool.css');
			var elt = this.getElement();
			elt.addClass('_dwp_messageTool');
			this.icon = this.$('<div class="_dwp_messageTool_Icon"></div>');
			this.append(this.icon);
			this.message = this.$('<div class="_dwp_messageTool_Message"></div>');
			this.append(this.message);
			this.buttons = this.$('<ul class="_dwp_messageTool_Buttons"></ul>');
			this.append(this.buttons);
			
		},
		
		complete: function(){
			this.close();	// close tool
		},
		
		onMessage: function(sender, msg, params ){
		},
		
		update: function(){
			var self = this;
			var data = this.data.data;
			
			// set icon
			this.icon.removeAttr('class');
			this.icon.addClass('_dwp_messageTool_Icon');
			if(data.icon){
				this.icon.addClass(data.icon);
			} else {
				this.icon.addClass('hidden');
			}
			
			// set message
			this.message.empty();
			this.message.append(data.text);
			
			// build button set
			this.buttons.empty();
			for(var i in data.buttons){
				var btn = data.buttons[i];
				var liElt = this.$('<li class="_dwp_messageTool_Button"></li>');
				this.buttons.append(liElt);
				
				(function(b){
					
					var btnElt = new Button({
						caption: b.text,
						onClick: function(){
							if(self.data.callback){
								self.data.callback.call(self, b.value);
							}
							self.complete();
						}
					});
					liElt.append(btnElt.getElement());
					
				})(btn);

			}
			
		},
		
		
		setFocus: function(){
		}
	}
}