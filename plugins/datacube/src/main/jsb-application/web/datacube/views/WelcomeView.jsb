{
	$name: 'DataCube.WelcomeView',
	$parent: 'JSB.Workspace.BrowserView',
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			
			$jsb.loadCss('WelcomeView.css');
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