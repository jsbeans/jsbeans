{
	$name: 'DataCube.DashboardViewerView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('DashboardViewerView.css');
			this.addClass('dashboardViewerView');
			
		},
		
		refresh: function(){
		}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 0.5,
				acceptNode: 'DataCube.DashboardNode',
				caption: 'Просмотр'
			});
		},
	}
}