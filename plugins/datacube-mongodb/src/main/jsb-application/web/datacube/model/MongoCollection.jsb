{
	$name: 'DataCube.Model.MongoCollection',
	$parent: 'DataCube.Model.DatabaseTable',
	
	view: false,
	itemCount: 0,
	
	isView: function(){
		return this.view;
	},
	
	getItemCount: function(){
		return this.itemCount;
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		descriptor: null,
	
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority:0.5, 
				nodeType:'DataCube.MongoCollectionNode',
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
				this.setName(this.descriptor.name);
				this.view = this.descriptor.isView || false;
				this.itemCount = this.descriptor.count || 0;
				$this.publish('DataCube.Model.SqlTable.updated');
			} else {
				this.descriptor = this.property('descriptor');
				this.missing = this.property('missing') || false;
				this.view = this.descriptor.isView || false;
				this.itemCount = this.descriptor.count || 0;
			}
			
			this.subscribe(['DataCube.Model.MongoSource.updateSettings','DataCube.Model.MongoSource.clearCache'], function(sender){
				if($this.getParent() != sender){
					return;
				}
				$this.publish('DataCube.Model.MongoCollection.updated');
			});
			
			this.subscribe('DataCube.Model.MongoSource.updateCache', function(sender){
				if($this.getParent() != sender){
					return;
				}
				$this.publish('DataCube.Model.MongoSource.updateCache');
			});

		},
		
		updateDescriptor: function(desc){
			this.descriptor = desc;
			this.property('descriptor', this.descriptor);
			this.view = this.descriptor.isView || false;
			this.itemCount = this.descriptor.count || 0;
			this.setName(this.descriptor.name);
			this.doSync();
			$this.publish('DataCube.Model.SqlTable.updated');
		},
		
		getDescriptor: function(){
			return this.descriptor;
		}
		
	}
}