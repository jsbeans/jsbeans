{
	$name: 'DataCube.Model.Slice',
	$parent: 'JSB.Workspace.Entry',

	$require: ['DataCube.Query.QuerySyntax'],

	cube: null,
	source: null,
	query: {},

    extractFields: function(){
        var fields = {};

        if(this.query.$select){
            for(var i in this.query.$select){
                fields[i] = i;
            }
        }

        return fields;
    },

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
                        sources.push(query[fromKeys[i]]);
                        break;
                    case '$join':
                        // todo: add cube
                        var left = query.$join.$left.$from,
                            right = query.$join.$right.$from;

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

    getFromType: function(){
        var fromKeys = QuerySyntax.getFromContext();

        for(var i = 0; i < fromKeys.length; i++){
            if(this.query[fromKeys[i]]){
                return fromKeys[i];
            }
        }

        return 'Текущий куб';
    },

    getMainContext: function(){
        var query = this.getQuery();

        if(query){
            return query.$context;
        }
    },

    getSource: function(){
        return this.source;
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
		
		$constructor: function(id, workspace, opts){
			$base(id, workspace);

			if(opts){
			    this.cube = opts.cube;
                this.property('cube', this.cube.getId());

                $super.setName(opts.name);

                if(opts.sourceType){
                    this.query = this.generateQueryFromSource(opts.sources, opts.sourceType, opts.sourceOpts);
                    this.property('query', this.query);

                    if(opts.sourceType === '$provider'){
                        this.source = opts.sources[0];
                        this.property('source', this.source.getFullId());
                    }
                }
			} else {
				if(this.property('cube')){
					this.cube = this.getWorkspace().entry(this.property('cube'));
				}

				if(this.property('query')){
					this.query = this.property('query');
				}

				if(this.property('source')){
				    var idArr = this.property('source').split('/');

				    this.source = this.getWorkspace(idArr[0]).entry(idArr[1]);
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

		generateQueryFromSource: function(sources, sourceType, opts){
		    var query = {};

		    function createSelect(query, source, context){
		        var fields = source.extractFields();

		        query['$select'] = query['$select'] || {};

                for(var i in fields){
                    if(context){
                        if(query['$select'][i]){
                            var cnt = 2;

                            while(true){
                                if(!query['$select'][i + ' (' + cnt + ')']){
                                    query['$select'][i + ' (' + cnt + ')'] = {
                                        $context: context,
                                        $field: i
                                    }
                                    break;
                                }

                                cnt++;
                            }
                        } else {
                            query['$select'][i] = {
                                $context: context,
                                $field: i
                            }
                        }
                    } else {
                        query['$select'][i] = {
                            $field: i
                        }
                    }
                }
		    }

		    query['$context'] = sourceType;
//debugger;
		    switch(sourceType){
		        case '$provider':
		        case '$from':
		            query[sourceType] = sources[0].getFullId();

		            createSelect(query, sources[0]);
		            break;
                case '$join':
                    query['$join'] = {
                        $left: {
                            $from: sources[0].getFullId()
                        },
                        $right: {
                            $from: sources[1].getFullId()
                        }
                    }
                    query['$join'] = JSB.merge(query['$join'], opts);

                    query['$join']['$left']['$context'] = 'joinLeft';
                    createSelect(query['$join']['$left'], sources[0]);

                    query['$join']['$right']['$context'] = 'joinRight';
                    createSelect(query['$join']['$right'], sources[1]);

                    createSelect(query, sources[0], 'joinLeft');
                    createSelect(query, sources[1], 'joinRight');
                    break;
                case '$union':

                    break;
		    }

		    return query;
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