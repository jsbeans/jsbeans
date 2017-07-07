{
	$name: 'JSB.DataCube.Model.SqlTable',
	$parent: 'JSB.Workspace.Entry',
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.SqlTableNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			
			if(opts){
				this.descriptor = opts;
				this.property('descriptor', this.descriptor);
				this.title(this.descriptor.schema + '.' + this.descriptor.name);
			} else {
				this.descriptor = this.property('descriptor');
			}
		}
		
	}
}