{
	$name: 'DataCube.Model.SqlTable',
	$parent: 'JSB.Workspace.Entry',
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		descriptor: null,
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority:0.5, 
				nodeType:'DataCube.SqlTableNode',
				create: false,
				move: false,
				remove: false
			});
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			
			if(opts){
				this.descriptor = opts;
				this.property('descriptor', this.descriptor);
				this.setName(this.descriptor.schema + '.' + this.descriptor.name);
				$this.publish('DataCube.Model.SqlTable.updated');
			} else {
				this.descriptor = this.property('descriptor');
			}
			
			this.subscribe(['DataCube.Model.SqlSource.updateSettings','DataCube.Model.SqlSource.clearCache'], function(sender){
				if($this.getParent() != sender){
					return;
				}
				$this.publish('DataCube.Model.SqlTable.updated');
			});
			
			this.subscribe('DataCube.Model.SqlSource.updateCache', function(sender){
				if($this.getParent() != sender){
					return;
				}
				$this.publish('DataCube.Model.SqlTable.updateCache');
			});

		},
		
		updateDescriptor: function(desc){
			this.descriptor = desc;
			this.property('descriptor', this.descriptor);
			this.setName(this.descriptor.schema + '.' + this.descriptor.name);
			this.doSync();
			$this.publish('DataCube.Model.SqlTable.updated');
		},
		
		getDescriptor: function(){
			return this.descriptor;
		}
		
	}
}