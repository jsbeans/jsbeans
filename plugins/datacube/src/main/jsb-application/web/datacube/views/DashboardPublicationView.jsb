{
	$name: 'DataCube.DashboardPublicationView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('DashboardPublicationView.css');
			this.addClass('dashboardPublicationView');
			
		},
		
		refresh: function(){
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 0.3,
				acceptNode: 'DataCube.DashboardNode',
				caption: 'Публикация'
			});
		},
	}
}