{
	$name: 'JSB.Workspace.BrowserView',
	$parent: 'JSB.Widgets.Widget',
	
	$require: ['JSB.Workspace.WorkspaceController', 
	           'JSB.Widgets.Button',
	           'JQuery.UI.Effects'],
	
	$client: {
//		node: null,
		entry: null,
		workspace: null,
		
		$constructor: function(opts){
			$base(opts);
			
			$jsb.loadCss('BrowserView.css');
			this.addClass('workspaceBrowserView');
			
		},
		
		setCurrentEntry: function(entry){
			if(this.entry == entry){
				return;
			}
			this.entry = entry;
			if(this.entry){
				this.workspace = this.entry.getWorkspace();
			} else {
				this.workspace = null;
			}
			this.refresh();
		},
/*		
		setCurrentNode: function(node, workspace){
			if(this.node == node){
				return;
			}
			this.node = node;
			this.entry = this.node.getTargetEntry();
			this.workspace = workspace;
			this.refresh();
		},
		
		getCurrentNode: function(){
			return this.node;
		},
*/		
		getCurrentEntry: function(){
			return this.entry;
		},
		
		refresh: function(){
			throw 'This method should be overriden';
		},
	},
	
	$server: {
	}
}