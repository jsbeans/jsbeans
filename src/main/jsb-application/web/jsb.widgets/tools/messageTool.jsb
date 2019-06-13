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
	$name:'JSB.Widgets.MessageTool',
	$parent: 'JSB.Widgets.Tool',
	$require:{
		Button: 'JSB.Widgets.Button'
	},
	$client: {
		$require: ['css:messageTool.css'],
		$bootstrap: function(){
			// register tooltip
			var self = this;
			JSB().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
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
		
		$constructor: function(opts){
			$base(opts);
			this.construct();
		},
		
		construct: function(){
			var self = this;
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
			
			// set class
			if(data.css)
				this.getElement().addClass(data.css);
			
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