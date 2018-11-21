{
	$name: 'JSB.Workspace.BrowserView',
	$parent: 'JSB.Widgets.Widget',
	
	$require: ['JSB.Workspace.WorkspaceController', 
	           'JSB.Widgets.Button',
	           'JQuery.UI.Effects'],
	
	$client: {
		node: null,
		entry: null,
		workspace: null,
		
		$constructor: function(opts){
			$base(opts);
			
			$jsb.loadCss('BrowserView.css');
			this.addClass('workspaceBrowserView');
			
		},
		
		setCurrentEntry: function(entry){
			this.entry = entry;
			this.workspace = this.entry.getWorkspace();
			this.refresh();
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
		
		getCurrentEntry: function(){
			if(!this.entry){
				this.entry = this.getCurrentNode().getTargetEntry();
			}
			return this.entry;
		},
		
		refresh: function(){
			throw 'This method should be overriden';
		},
	},
	
	$server: {
	}
}