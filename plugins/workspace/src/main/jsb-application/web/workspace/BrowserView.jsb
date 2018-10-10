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
			
			$jsb.loadCss('BrowserView.css');
			this.addClass('workspaceBrowserView');
			
		},
		
		setCurrentNode: function(node, workspace){
			if(this.node == node){
				return;
			}
			this.node = node;
			this.workspace = workspace;
			this.refresh();
		},
		
		getCurrentNode: function(){
			return this.node;
		},
		
		refresh: function(){
			throw 'This method should be overriden';
		},
	},
	
	$server: {
	}
}