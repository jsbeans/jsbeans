{
	$name: 'JSB.DataCube.WelcomeView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('WelcomeView.css');
			this.addClass('welcomeView');
			
		},
		
		refresh: function(){}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(this, {
				wmKey: 'datacube',
				priority: 1,
				caption: 'Главная'
			});
		},
	}
}