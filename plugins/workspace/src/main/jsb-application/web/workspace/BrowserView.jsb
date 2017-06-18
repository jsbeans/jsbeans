{
	$name: 'JSB.Workspace.BrowserView',
	$parent: 'JSB.Widgets.Widget',
	
	$require: ['JSB.Workspace.WorkspaceController', 
	           'JSB.Widgets.Button',
	           'JQuery.UI.Effects'],
	
	$client: {
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('BrowserView.css');
			this.addClass('workspaceBrowserView');
			
		},
		
		setCurrentNode: function(node){},
		
		refresh: function(){},
	},
	
	$server: {
	}
}