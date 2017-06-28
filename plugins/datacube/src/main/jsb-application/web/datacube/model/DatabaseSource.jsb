{
	$name: 'JSB.DataCube.Model.DatabaseSource',
	$parent: 'JSB.Workspace.Entry',
	
	tables: null,
	
	getTableCount: function(){
		return this.tables;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.DatabaseSourceNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
		}
	}
}