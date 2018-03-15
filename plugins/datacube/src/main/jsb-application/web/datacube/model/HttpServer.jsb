{
	$name: 'DataCube.Model.HttpServer',
	$parent: 'JSB.Workspace.Entry',
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		settings: null,
		
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, 0.5, 'DataCube.HttpServerNode');
		},

		$constructor: function(id, workspace){
			$base(id, workspace);
			this.settings = this.property('settings');
		},
		
		getSettings: function(){
			return this.settings;
		},
		
		
		updateSettings: function(settings){
			this.settings = settings;
			this.property('settings', this.settings);
			this.getWorkspace().store();
		}
		
	}
}