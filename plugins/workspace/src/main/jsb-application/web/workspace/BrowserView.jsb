{
	$name: 'JSB.Workspace.BrowserView',
	$parent: 'JSB.Widgets.Widget',
	
	$require: ['JSB.Workspace.WorkspaceController', 
	           'JSB.Widgets.Button',
	           'JQuery.UI.Effects'],
	
	$client: {
		node: null,
		workspace: null,
		
		$constructor: function(opts){
			$base(opts);
			
			this.loadCss('BrowserView.css');
			this.addClass('workspaceBrowserView');
			
		},
		
		setCurrentNode: function(node, workspace){
			this.node = node;
			this.workspace = workspace;
			this.refresh();
		},
		
		refresh: function(){
			throw 'This method should be overriden';
		},
	},
	
	$server: {
	}
}