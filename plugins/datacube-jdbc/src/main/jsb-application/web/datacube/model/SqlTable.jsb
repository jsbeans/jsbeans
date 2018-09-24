{
	$name: 'DataCube.Model.SqlTable',
	$parent: 'DataCube.Model.DatabaseTable',

	view: false,
	
	isView: function(){
		return this.view;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		descriptor: null,
	
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority:0.5, 
				nodeType:'DataCube.SqlTableNode',
				create: false,
				move: false,
				remove: false,
				share: false,
				rename: false
			});
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			
			if(opts){
				this.descriptor = opts;
				this.property('descriptor', this.descriptor);
				this.setName(this.descriptor.schema + '.' + this.descriptor.name);
				this.view = this.descriptor.isView || false;
				$this.publish('DataCube.Model.SqlTable.updated');
			} else {
				this.descriptor = this.property('descriptor');
				this.missing = this.property('missing') || false;
				this.view = this.descriptor.isView || false;
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
			this.view = this.descriptor.isView || false;
			this.setName(this.descriptor.schema + '.' + this.descriptor.name);
			this.doSync();
			$this.publish('DataCube.Model.SqlTable.updated');
		},
		
		
		
		getDescriptor: function(){
			return this.descriptor;
		}
		
	}
}