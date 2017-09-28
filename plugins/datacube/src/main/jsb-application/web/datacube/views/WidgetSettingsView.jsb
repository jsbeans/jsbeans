{
	$name: 'DataCube.WidgetSettingsView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('WidgetSettingsView.css');
			this.addClass('widgetSettingsView');
			
		},

		refresh: function(){
			var entry = this.node.getEntry();
			// TODO: do something with widget entry
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 1,
				acceptNode: ['DataCube.WidgetNode'],
				caption: 'Настройка'
			});
		},
	}
}