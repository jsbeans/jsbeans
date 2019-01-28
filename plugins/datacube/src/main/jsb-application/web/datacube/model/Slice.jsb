{
    $name: 'DataCube.Model.Slice',
    $parent: 'DataCube.Model.SettingsEntry',

    $require: [
        'DataCube.Query.QuerySyntax',
        'DataCube.Query.QueryUtils'
    ],

    $scheme: {
        cacheSettings: {
            render: 'group',
            name: 'Кэширование данных',
            collapsible: true,
            items: {
                useCache: {
                    render: 'switch',
                    name: 'Использовать кэширование срезов',
                    optional: 'checked',
                    items: {
                        cacheSize: {
                            render: 'item',
                            name: 'Размер кэша (Кб)',
                            value: 1024,
                            valueType: 'number'
                        },
                        cacheRowLimit: {
                            render: 'item',
                            name: 'Ограничить максимальное количество строк',
                            value: 1000,
                            valueType: 'number',
                            optional: true
                        },
                        cacheExtraQueries: {
                            render: 'item',
                            name: 'Кэшировать производные запросы (с фильтрами)',
                            optional: 'checked',
                            editor: 'none'
                        },
                        updateInterval: {
                            render: 'item',
                            name: 'Обновлять данные',
                            optional: true,
                            editor: 'JSB.Widgets.CronEditor',
                            value: '0 * * * *'
                        }
                    }
                }
            }
        }
    },

    cube: null,
    source: null,
    query: {},

    extractSources: function(query){
        var fromKeys = QuerySyntax.getFromContext(), //['$from', '$cube', '$join', '$union', '$provider', '$recursive']
            sources = [];

        if(query['$provider']){
            return sources;
        }

        if(!query){
            query = this.query;
        }

        for(var i = 0; i < fromKeys.length; i++){
            if(query[fromKeys[i]]){
                switch(fromKeys[i]){
                    case '$from':
                        if(query[fromKeys[i]]){
                            sources.push(query[fromKeys[i]]);
                        }
                        break;
                    case '$join':
                        if(query.$join.$left){
                            sources.push(query.$join.$left);
                        }

                        if(query.$join.$right){
                            sources.push(query.$join.$right);
                        }
                        break;
                    case '$union':
                        sources = query.$union;
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

        return '$cube';
    },

    getSource: function(){
        return this.source;
    },

	getQuery: function(){
		return this.query;
	},

	$client: {
        extractFields: function(){
            var fields = {};

            if(this.query.$select){
                for(var i in this.query.$select){
                    fields[i] = {};
                }
            }

            return fields;
        }
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.Query.QueryCache',
		           'DataCube.Scheduler.EntryScheduleController'],
		
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

		fieldsTypes: {},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);

			if(opts){   // new slice
			    this.cube = opts.cube;
                this.property('cube', this.cube.getId());

                $super.setName(opts.name);

                if(opts.sourceType){
                    this.query = this.generateQueryFromSource(opts);
                    this.property('query', this.query);

                    if(opts.sourceType === '$provider'){
                        this.source = opts.sources[0];
                        this.property('source', this.source.getFullId());
                    }
                }
				this.property('queryParams', this.queryParams);
			} else {    // load existed slice
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

				if(this.property('fieldsTypes')){
				    this.fieldsTypes = this.property('fieldsTypes');
				}
			}
			var ctx = this.getSettingsContext();
			this.cacheEnabled = Config.has('datacube.queryCache.enabled') && Config.get('datacube.queryCache.enabled') && ctx.find('useCache').checked();
			this.extCacheEnabled = this.cacheEnabled && ctx.find('cacheExtraQueries').checked();

			this.subscribe('DataCube.Query.QueryCache.updated', function(sender){
				if($this.queryCache && sender == $this.queryCache){
					$this.publish('DataCube.Model.Slice.updated');
				}
			});
			
			this.subscribe('DataCube.Scheduler.EntryScheduleController.executeJob', function(sender, msg, params){
				if(sender != $this){
					return;
				}
				$this.executeScheduledJob(params);
			});
		},

		createQuerySelect: function(useContext){
            var fields = this.extractFields(),
                context = this.getFullId(),
                select = {};

            for(var i in fields){
                if(useContext){
                    select[i] = {
                        $context: context,
                        $field: i
                    };
                } else {
                    select[i] = {
                        $field: i
                    };
                }
            }

            return select;
		},
		
		destroy: function(){
			if($this.queryCache){
				$this.queryCache.destroy();
				$this.queryCache = null;
			}
			$base();
		},
		
		setName: function(name){
			$base(name);
			$this.publish('DataCube.Model.Slice.renameSlice', { name: name }, {session: true});
			this.doSync();
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
            var isExtQuery = false;
            if(opts && opts.extQuery && Object.keys(opts.extQuery).length > 0){
            	isExtQuery = true;
            }
            if(opts && opts.wrapQuery && Object.keys(opts.wrapQuery).length > 0){
            	isExtQuery = true;
            }
            if(useCache && this.cacheEnabled && (!isExtQuery || this.extCacheEnabled)){
            	this.ensureQueryCache();
				return this.queryCache.executeQuery(preparedQuery, params);
            }
            return this.cube.executeQuery(preparedQuery, params);
		},

        extractFields: function(){
            var fieldsTypes = this.fieldsTypes,
                fields = {};

            if(this.query.$select){
                for(var i in this.query.$select){
                    if(!this.fieldsTypes[i]){
                        this.updateFieldsTypes();
                    }

                    fields[i] = {
                        type: this.fieldsTypes[i]
                    };
                }
            }

            return fields;
        },

		generateQueryFromSource: function(opts){
		    var sources = opts.sources,
		        query = {
		            $context: opts.name,
		            $select: {}
		        };

		    try{
                switch(opts.sourceType){
                    case '$provider':
                    case '$from':
                        query[opts.sourceType] = sources[0] ? sources[0].getFullId() : undefined;
                        query['$select'] = sources[0].createQuerySelect();
                        break;
                    case '$join':
                        query['$join'] = {
                            $left: sources[0] ? sources[0].getFullId() : undefined,
                            $right: sources[1] ? sources[1].getFullId() : undefined
                        }

                        if(opts.sourceOpts){
                            query['$join'] = JSB.merge(query['$join'], opts.sourceOpts);
                        }

                        JSB.merge(query['$select'], sources[0].createQuerySelect(true), sources[1].createQuerySelect(true));
                        break;
                    case '$union':
                        query['$union'] = [];

                        for(var i = 0; i < sources.length; i++){
                            query['$union'].push(sources[i].getFullId());

                            JSB.merge(query['$select'], sources[i].createQuerySelect());
                        }
                        break;
                }
		    } catch(ex){
		        JSB.getLogger().error(ex);
		    }

		    return query;
		},
		
		combineCacheOpts: function(){
			var ctx = this.getSettingsContext();
			return {
				cacheSize: ctx.find('cacheSize').value(),
				limitRows: ctx.find('cacheRowLimit').checked() ? ctx.find('cacheRowLimit').value() : 0
			};
		},
		
		ensureQueryCache: function(){
			if(!this.queryCache){
				var mtx = this.getId() + '_queryCache';
				JSB.getLocker().lock(mtx);
				if(!this.queryCache){
					this.queryCache = new QueryCache(this, this.cube, this.combineCacheOpts());
				}
				JSB.getLocker().unlock(mtx);
			}
			
			return this.queryCache;
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

			this.publish('DataCube.Model.Slice.renameSlice', { name: name }, {session: true});

			this.doSync();
		},

		setSliceParams: function(params){
		    var updates = {},
		        result = {};

            // name
		    if(JSB.isDefined(params.name) && !JSB.isEqual(this.getName(), params.name)){
		        $super.setName(params.name);

		        this.publish('DataCube.Model.Slice.renameSlice', { name: params.name }, {session: true});

		        updates.name = params.name;
		    }

		    // query
		    if(JSB.isDefined(this.getName(params.query)) && !JSB.isEqual(this.query, params.query)){
                this.query =  params.query;
                this.property('query', this.query);

                this.updateFieldsTypes();

    			this.invalidate();
    			this.loadCacheFromCube();

    			this.cube.updateCubeFields(this);

		        updates.query = params.query;
		        updates.fields = this.extractFields();
		    }

		    result = {
		        updates: params.returnUpdates ? updates : undefined,
		        wasUpdated: Boolean(Object.keys(updates).length)
		    }

		    if(result.wasUpdated){
		        this.doSync();
		    }

		    return result;
		},
		
		updateCache: function(){
			if(!this.cacheEnabled){
				return;
			}
			this.ensureQueryCache();
			this.queryCache.update();
		},

		updateFieldsTypes: function(){
		    function getQuery(name) {
		        if ($this.query.$views && $this.query[name]) {
		            return $this.query[name];
		        }
		        return QueryUtils.findView(name, null, $this.query);
		    }

		    for(var i in this.query.$select){
		        try{
		            this.fieldsTypes[i] = QueryUtils.extractType(this.query.$select[i], this.query, this.getCube(), getQuery);
                } catch(ex){
                    JSB.getLogger().error(ex);

                    this.fieldsTypes[i] = '';
                }
		    }

		    this.property('fieldsTypes', this.fieldsTypes);
		},

		onChangeSettings: function(){
			var ctx = this.getSettingsContext();
			
			// perform check for scheduled tasks
			var updateCacheCron = null;
			if(ctx.find('useCache').checked() && ctx.find('updateInterval').checked()){
				EntryScheduleController.registerJob(this, 'updateCache', ctx.find('updateInterval').value());
			} else {
				EntryScheduleController.unregisterJob(this, 'updateCache');
			}
			
			// update cache opts
			this.cacheEnabled = Config.has('datacube.queryCache.enabled') && Config.get('datacube.queryCache.enabled') && ctx.find('useCache').checked();
			this.extCacheEnabled = this.cacheEnabled && ctx.find('cacheExtraQueries').checked();
			if(this.queryCache){
				this.queryCache.updateOptions(this.combineCacheOpts());
			}
		},
		
		executeScheduledJob: function(job){
			if(job.key == 'updateCache'){
				$this.updateCache();
			}
		}
	}
}