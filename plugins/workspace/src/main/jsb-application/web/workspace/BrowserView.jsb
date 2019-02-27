{
	$name: 'JSB.Workspace.BrowserView',
	$parent: 'JSB.Widgets.Widget',
	
	$require: ['JSB.Workspace.WorkspaceController', 
	           'JSB.Widgets.Button',
	           'JQuery.UI.Effects',
	           'css:BrowserView.css'],
	
	$client: {
//		node: null,
		entry: null,
		workspace: null,
		
		$constructor: function(opts){
			$base(opts);
			
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
			this.server().setCurrentEntry(entry);
			this.refresh();
		},
		
		getCurrentEntry: function(){
			return this.entry;
		},
		
		refresh: function(){
			throw 'This method should be overriden';
		},
	},
	
	$server: {
		setCurrentEntry: function(entry){
			this.publish('JSB.Workspace.BrowserView.setCurrentEntry', entry);
		}
	}
}