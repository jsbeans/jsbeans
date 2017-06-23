{
	$name: 'JSB.DataCube.Model.Cube',
	$parent: 'JSB.Workspace.Entry',
	
	sourceCount: 0,
	fieldCount: 0,
	sliceCount: 0,
	
	getSourceCount: function(){
		return this.sourceCount;
	},
	
	getFieldCount: function(){
		return this.fieldCount;
	},

	getSliceCount: function(){
		return this.sliceCount;
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.CubeNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
			} else {
				
			}
		},
		
		load: function(){}

	}
}