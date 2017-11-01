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
			$this.getCube().load();
			this.name = desc.name;
			this.query = desc.query;
			this.title(this.name);
			this.property('query', this.query);
			this.cube.store();
			this.doSync();
		},
		
		executeQuery: function(extQuery){
			$this.getCube().load();
			var params = {};
			var preparedQuery = JSB.clone(this.query);
            if(!preparedQuery || Object.keys(preparedQuery).length == 0){
            	preparedQuery = { $select: {}};
            }
            if(extQuery && Object.keys(extQuery).length > 0){
            	var qDesc = this.cube.parametrizeQuery(extQuery);
            	params = qDesc.params;
            	
            	// merge queries
            	if(qDesc.query.$filter && Object.keys(qDesc.query.$filter).length > 0){
            		if(preparedQuery.$filter){
            			preparedQuery.$filter = {$and:[preparedQuery.$filter, qDesc.query.$filter]}
            		} else {
            			preparedQuery.$filter = qDesc.query.$filter;
            		}
            	}

            	if(qDesc.query.$cubeFilter && Object.keys(qDesc.query.$cubeFilter).length > 0){
            		if(preparedQuery.$cubeFilter){
            			preparedQuery.$cubeFilter = {$and:[preparedQuery.$cubeFilter, qDesc.query.$cubeFilter]}
            		} else {
            			preparedQuery.$cubeFilter = qDesc.query.$cubeFilter;
            		}
            	}

            	if(qDesc.query.$postFilter && Object.keys(qDesc.query.$postFilter).length > 0){
            		if(preparedQuery.$postFilter){
            			preparedQuery.$postFilter = {$and:[preparedQuery.$postFilter, qDesc.query.$postFilter]}
            		} else {
            			preparedQuery.$postFilter = qDesc.query.$postFilter;
            		}
            	}
            	
            	if(qDesc.query.$sort){
            		preparedQuery.$sort = qDesc.query.$sort;
            	}
            	
            	if(qDesc.query.$select){
            		JSB.merge(preparedQuery.$select, qDesc.query.$select);
            	}

            	if(qDesc.query.$groupBy){
            		if(!preparedQuery.$groupBy){
            			preparedQuery.$groupBy = qDesc.query.$groupBy;
            		} else {
            			JSB.merge(preparedQuery.$groupBy, qDesc.query.$groupBy);
            		}
            	}

            }
//            JSB.getLogger().debug('Slice.executeQuery: ' + JSON.stringify(preparedQuery, null, 4));
            return this.cube.executeQuery(preparedQuery, params);
		},
		
		getInputFields: function(){
			$this.getCube().load();
			var fields = $this.getCube().getManagedFields();
			var fMap = {};
			for(var fName in fields){
				fMap[fName] = fields[fName].type;
			}
			
			return fMap;
		}
		
	}
}