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
	$name:'JSB.Widgets.WidgetTool',
	$parent: 'JSB.Widgets.Tool',
	$require: {
		WidgetContainer: 'JSB.Widgets.WidgetContainer'
	},
	$client: {
		$require: ['css:widgetTool.css'],
		$bootstrap: function(){
			// register tooltip
			var self = this;
			JSB().lookupSingleton('JSB.Widgets.ToolManager', function(toolMgr){
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
		
		$constructor: function(opts){
			var self = this;
			$base(opts);
			this.addClass('_dwp_widgetTool');
			
			this.wc = new WidgetContainer();
			this.append(this.wc);
		},
		
		complete: function(){
			this.close();	// close tool
		},
		
		onMessage: function(sender, msg, params ){},
		
		update: function(){
			var widget = this.data.data;
			if(!this.wc.getWidget() || (this.wc.getWidget() && this.wc.getWidget().getId() != widget.getId())){
				this.wc.attachWidget(widget);
			}
		},

		setFocus: function(){}
	}
}