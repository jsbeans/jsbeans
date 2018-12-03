{
	$name: 'DataCube.Model.Slice',
	$parent: 'JSB.Workspace.Entry',

	$require: ['DataCube.Query.QuerySyntax'],

	cube: null,
	query: {},

    extractSources: function(query){
        var fromKeys = QuerySyntax.getFromContext(), //['$from', '$cube', '$join', '$union', '$provider', '$recursive']
            sources = [];

        if(!query){
            query = this.query;
        }

        for(var i = 0; i < fromKeys.length; i++){
            if(query[fromKeys[i]]){
                switch(fromKeys[i]){
                    case '$from':
                    case '$cube':
                    case '$provider':
                        sources.push(query[fromKeys[i]]);
                        break;
                    case '$join':
                        // todo: add cube
                        var left = query.$join.$left.$provider,
                            right = query.$join.$right.$provider;

                        sources.push(left);
                        sources.push(right);
                        break;
                    case '$union':
                        // todo
                        break;
                    case '$recursive':
                        // todo
                        break;
                }
            }
        }

        return sources;
    },

	getCube: function(){
		return this.cube;
	},

    getMainContext: function(){
        var query = this.getQuery();

        if(query){
            return query.$context;
        }
    },

    getSourceType: function(){
        var fromKeys = QuerySyntax.getFromContext();

        for(var i = 0; i < fromKeys.length; i++){
            if(this.query[fromKeys[i]]){
                return fromKeys[i];
            }
        }

        return 'Текущий куб';
    },

	getQuery: function(){
		return this.query;
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.Query.QueryCache'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0.5, 
				nodeType:'DataCube.SliceNode',
				create: false,
				move: false,
				remove: true,
				rename: true,
				share: false
			});
		},
		
		$constructor: function(id, workspace, cube, name){
			$base(id, workspace);

			if(cube && name){
				this.cube = cube;
				this.property('cube', this.cube.getId());
				this.setName(name);
				this.property('query', this.query);
			} else {
				if(this.property('cube')){
					this.cube = this.getWorkspace().entry(this.property('cube'));
				}

				if(this.property('query')){
					this.query = this.property('query');
				}
			}

			this.cacheEnabled = Config.has('datacube.queryCache.enabled') && Config.get('datacube.queryCache.enabled');

			this.subscribe('DataCube.Query.QueryCache.updated', function(sender){
				if($this.queryCache && sender == $this.queryCache){
					$this.publish('DataCube.Model.Slice.updated');
				}
			});
		},

		ensureQueryCache: function(){
			if(!this.queryCache){
				var mtx = this.getId() + '_queryCache';
				JSB.getLocker().lock(mtx);
				if(!this.queryCache){
					this.queryCache = new QueryCache(this, this.cube);
				}
				JSB.getLocker().unlock(mtx);
			}
			return this.queryCache;
		},

		executeQuery: function(opts){
			$this.getCube().load();
			var params = {};
			var extQuery = (opts && opts.extQuery) || {};
			var useCache = (opts && opts.useCache) || false;
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
            if(opts && opts.wrapQuery && Object.keys(opts.wrapQuery).length > 0){
            	var q = JSB.clone(opts.wrapQuery);
            	if(preparedQuery.$cubeFilter){
            		if(q.$cubeFilter){
            			q.$cubeFilter = {$and:[q.$cubeFilter, preparedQuery.$cubeFilter]};
            		} else {
            			q.$cubeFilter = preparedQuery.$cubeFilter;
            		}
            		delete preparedQuery.$cubeFilter;
            	}
            	q.$from = preparedQuery;
            	preparedQuery = q;
            }
            if(useCache && this.cacheEnabled){
            	this.ensureQueryCache();
				return this.queryCache.executeQuery(preparedQuery, params);
            }
            return this.cube.executeQuery(preparedQuery, params);
		},

		extractFields: function(){
		    var fields = {};

		    if(this.query.$select){
		        for(var i in this.query.$select){
		            fields[i] = i;
		        }
		    }

		    return fields;
		},

		getEditorData: function(){
		    var cube = this.getCube();

		    return {
		        cubeFields: cube.extractFields(),
		        cubeSlices: cube.getSlices()
		    }
		},

		getOutputFields: function(){
			var fMap = {};
			if(this.query && this.query.$select && Object.keys(this.query.$select).length > 0){
				for(var fName in this.query.$select){
					fMap[fName] = {
						type: null,	// TODO: need to resolve
						comment: null
					}
				}
			}

			return fMap;
		},

		invalidate: function(){
			if(!this.cacheEnabled){
				return;
			}
			this.ensureQueryCache();
			this.queryCache.clear();
		},

		loadCacheFromCube: function(){
			if(!this.cacheEnabled || !$this.getCube().queryCache){
				return;
			}
			this.ensureQueryCache();
			this.queryCache.copyFrom($this.getCube().queryCache, $this.query);
		},

		remove: function(){
		    this.cube.removeSlice(this.getFullId());

		    $base();
		},

		setName: function(name){
			$base(name);
			$this.publish('DataCube.Model.Slice.renameSlice', { name: name }, {session: true});
			this.doSync();
		},

		setSliceParams: function(params){
		    var isNeedUpdate = false;

		    if(JSB.isDefined(params.name) && !JSB.isEqual(this.getName(), params.name)){
		        $super.setName(params.name);

		        this.publish('DataCube.Model.Slice.renameSlice', { name: params.name }, {session: true});

		        isNeedUpdate = true;
		    }

		    if(JSB.isDefined(this.getName(params.query)) && !JSB.isEqual(this.query, params.query)){
                this.query =  params.query;
                this.property('query', this.query);

    			this.invalidate();
    			this.loadCacheFromCube();

		        isNeedUpdate = true;
		    }

		    if(isNeedUpdate){
		        this.doSync();

		        return {
		            wasUpdated: true
		        }
		    }

		    return {
		        wasUpdated: false
		    }
		},
		
		updateCache: function(){
			if(!this.cacheEnabled){
				return;
			}
			this.ensureQueryCache();
			this.queryCache.update(true);
		}
	}
}