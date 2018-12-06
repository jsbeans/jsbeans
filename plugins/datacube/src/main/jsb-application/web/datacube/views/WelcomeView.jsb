{
	$name: 'DataCube.WelcomeView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$require: ['css:WelcomeView.css'],
		$constructor: function(opts){
			$base(opts);
			
			this.addClass('welcomeView');
			
		},
		
		refresh: function(){}
		
	},
	
	$server: {
		$require: 'JSB.Workspace.WorkspaceController',
		$bootstrap: function(){
			WorkspaceController.registerBrowserView(null, this, {
				priority: 1,
				caption: 'Главная'
			});
		},
	}
}