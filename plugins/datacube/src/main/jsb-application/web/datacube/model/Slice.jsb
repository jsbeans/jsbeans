{
	$name: 'DataCube.Model.Slice',
	$parent: 'JSB.Workspace.Entry',
	
	cube: null,
	name: null,
	query: {},
	queryParams: {},
	
	getName: function(){
		return this.name;
	},
	
	getQuery: function(){
		return this.query;
	},

	getQueryParams: function(){
	    return this.queryParams;
	},
	
	getCube: function(){
		return this.cube;
	},
	
	$client: {},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'DataCube.SliceNode');
		},
		
		$constructor: function(id, workspace, cube, name){
			$base(id, workspace);
			if(cube && name){
				this.cube = cube;
				this.name = name;
				this.property('cube', this.cube.getLocalId());
				this.title(this.name);
				this.property('query', this.query);
			} else {
				if(this.property('cube')){
					this.cube = this.workspace.entry(this.property('cube'));
				}
				this.name = this.title();
				if(this.property('query')){
					this.query = this.property('query');
				}
			}
		},
		
		setName: function(name){
			this.name = name;
			this.title(this.name);
		},
		
		setQuery: function(q){
			this.query = q;
			this.property('query', this.query);
			this.doSync();
		},

		setQueryParams: function(q){
		    this.queryParams = q;
            this.property('queryParams', this.queryParams);
            this.doSync();
		},
		
		updateSettings: function(desc){
			this.name = desc.name;
			this.query = desc.query;
			this.title(this.name);
			this.property('query', this.query);
			this.cube.store();
			this.doSync();
		},
		
		executeQuery: function(extQuery){
			var params = {};
			var preparedQuery = JSB.clone(this.query);
            if(!preparedQuery || Object.keys(preparedQuery).length == 0){
            	preparedQuery = { $select: {}};
            }
            if(extQuery && Object.keys(extQuery).length > 0){
            	var qDesc = this.cube.parametrizeQuery(extQuery);
            	params = qDesc.params;
	           	JSB.merge(preparedQuery, qDesc.query);
            }

            this.cube.load();
            return this.cube.queryEngine.query(preparedQuery, params);
		}
		
	}
}