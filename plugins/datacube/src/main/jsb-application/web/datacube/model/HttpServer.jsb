{
	$name: 'JSB.DataCube.Model.HttpServer',
	$parent: 'JSB.Workspace.Entry',
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		settings: null,
		
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.HttpServerNode');
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
			this.workspace.store();
		}
		
	}
}