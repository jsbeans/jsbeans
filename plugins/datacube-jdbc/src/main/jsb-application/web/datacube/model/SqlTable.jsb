{
	$name: 'DataCube.Model.SqlTable',
	$parent: 'DataCube.Model.DatabaseTable',

	view: false,
	
	isView: function(){
		return this.view;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.Store.Sql.JDBC'],
		
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

			JDBC.loadDrivers(true);
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
			/*
			this.subscribe(['DataCube.Model.SqlSource.updateSettings','DataCube.Model.SqlSource.clearCache'], function(sender){
				if($this.getParent() != sender){
					return;
				}
				// $this.getCube().invalidate();
			});
			
			this.subscribe('DataCube.Model.SqlSource.updateCache', function(sender){
				if($this.getParent() != sender){
					return;
				}
				// $this.getCube().updateCache();
			});
			*/
		},

		extractFields: function(opts){
			var columns = this.getDescriptor().columns,
			    fields = {};

            for(var i in columns){
                var nativeType = columns[i].datatypeName;

                // todo: name from comments
                fields[i] = {
                    name: i,
                    nativeType: nativeType,
                    type: JDBC.toJsonType(nativeType)
                }
            }

			return fields;
		},

		getDescriptor: function(){
			return this.descriptor;
		},

		getTableFullName:function(){
		    var tableDescriptor = this.getDescriptor();

		    return tableDescriptor.schema
		            ? '"' + tableDescriptor.schema + '"."' + tableDescriptor.name + '"'
		            : '"' + tableDescriptor.name + '"';
        },

		updateDescriptor: function(desc){
			if(!desc || JSB.isEqual(desc, this.descriptor)){
				return;
			}
			this.descriptor = desc;
			this.property('descriptor', this.descriptor);
			this.view = this.descriptor.isView || false;
			this.setName(this.descriptor.schema + '.' + this.descriptor.name);
			this.doSync();
			$this.publish('DataCube.Model.SqlTable.updated');
		}
	}
}