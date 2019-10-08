/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name:'UserMenuTool',
	$parent: 'JSB.Widgets.Tool',
	$require: {
		WidgetContainer: 'JSB.Widgets.FloatingContainer',
		css:'css:userMenuTool.css'
	},
	$client: {
		$bootstrap: function(){
			// register tooltip
			var self = this;
			JSB().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
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
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('_dwp_userMenuTool');
			
			// append header
			this.header = this.$('<div class="header"><div class="icon"></div><div class="title"></div><div class="close"></div></div>');
			this.append(this.header);

			this.header.find('.close').click(function(){
				self.close();
			});
			
			// append container
			this.wc = new WidgetContainer({
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
			this.header.find('.title').text(widget.getJsb().expose.displayName);
			this.header.find('.icon').attr('key', widget.getJsb().$name);
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
}