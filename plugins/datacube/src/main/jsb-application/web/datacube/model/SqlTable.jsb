{
	$name: 'DataCube.Model.SqlTable',
	$parent: 'JSB.Workspace.Entry',
	
	descriptor: null,
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'DataCube.SqlTableNode');
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
		},
		
		updateDescriptor: function(desc){
			this.descriptor = desc;
			this.property('descriptor', this.descriptor);
			this.title(this.descriptor.schema + '.' + this.descriptor.name);
			this.doSync();
		},
		
		getDescriptor: function(){
			return this.descriptor;
		}
		
	}
}