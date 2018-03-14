{
	$name: 'DataCube.Model.SqlTable',
	$parent: 'JSB.Workspace.Entry',
	
	descriptor: null,
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, 0.5, 'DataCube.SqlTableNode');
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			
			if(opts){
				this.descriptor = opts;
				this.property('descriptor', this.descriptor);
				this.title(this.descriptor.schema + '.' + this.descriptor.name);
				$this.publish('DataCube.Model.SqlTable.updated');
			} else {
				this.descriptor = this.property('descriptor');
			}
			
			this.subscribe('DataCube.Model.SqlSource.updateSettings', function(sender){
				if($this.getParent() != sender){
					return;
				}
				$this.publish('DataCube.Model.SqlTable.updated');
			});
		},
		
		updateDescriptor: function(desc){
			this.descriptor = desc;
			this.property('descriptor', this.descriptor);
			this.title(this.descriptor.schema + '.' + this.descriptor.name);
			this.doSync();
			$this.publish('DataCube.Model.SqlTable.updated');
		},
		
		getDescriptor: function(){
			return this.descriptor;
		}
		
	}
}