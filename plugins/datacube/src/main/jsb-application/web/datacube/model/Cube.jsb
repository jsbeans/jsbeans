{
	$name: 'DataCube.Model.Cube',
	$parent: 'JSB.Workspace.Entry',

	sliceCount: 0,

	getSliceCount: function(){
		return this.sliceCount;
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.Model.Slice',
		           'DataCube.Query.QueryEngine',
		           'DataCube.Query.QueryCache'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0.5, 
				nodeType:'DataCube.CubeNode',
				create: true,
				move: true,
				remove: true,
				title: 'Куб',
				description: 'Позволяет объединить несколько источников данных в единое информационное пространство для аналитики и визуализации',
				icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+DQoNCjxzdmcNCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyINCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiDQogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiDQogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIg0KICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiDQogICB2ZXJzaW9uPSIxLjEiDQogICBpZD0iQ2FwYV8xIg0KICAgeD0iMHB4Ig0KICAgeT0iMHB4Ig0KICAgd2lkdGg9IjIwIg0KICAgaGVpZ2h0PSIyMCINCiAgIHZpZXdCb3g9IjAgMCAyMCAyMCINCiAgIHhtbDpzcGFjZT0icHJlc2VydmUiDQogICBpbmtzY2FwZTp2ZXJzaW9uPSIwLjkxIHIxMzcyNSINCiAgIHNvZGlwb2RpOmRvY25hbWU9ImN1YmUuc3ZnIj48bWV0YWRhdGENCiAgICAgaWQ9Im1ldGFkYXRhNDEiPjxyZGY6UkRGPjxjYzpXb3JrDQogICAgICAgICByZGY6YWJvdXQ9IiI+PGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+PGRjOnR5cGUNCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz48ZGM6dGl0bGU+PC9kYzp0aXRsZT48L2NjOldvcms+PC9yZGY6UkRGPjwvbWV0YWRhdGE+PGRlZnMNCiAgICAgaWQ9ImRlZnMzOSIgLz48c29kaXBvZGk6bmFtZWR2aWV3DQogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiINCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiDQogICAgIGJvcmRlcm9wYWNpdHk9IjEiDQogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiDQogICAgIGdyaWR0b2xlcmFuY2U9IjEwIg0KICAgICBndWlkZXRvbGVyYW5jZT0iMTAiDQogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIg0KICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIg0KICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiDQogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExMzgiDQogICAgIGlkPSJuYW1lZHZpZXczNyINCiAgICAgc2hvd2dyaWQ9ImZhbHNlIg0KICAgICBpbmtzY2FwZTp6b29tPSIyNC42Nzk3MzgiDQogICAgIGlua3NjYXBlOmN4PSIzLjY0NTk4NDciDQogICAgIGlua3NjYXBlOmN5PSI2LjQ1NjE2NTEiDQogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCINCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii04Ig0KICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIg0KICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJDYXBhXzEiIC8+PGcNCiAgICAgaWQ9Imc3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnOSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzExIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTMiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcxNSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzE3Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMTkiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcyMSINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzIzIg0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMjUiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImcyNyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzI5Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnMzEiDQogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTU5MikiIC8+PGcNCiAgICAgaWQ9ImczMyINCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtNTkyKSIgLz48Zw0KICAgICBpZD0iZzM1Ig0KICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIiAvPjxnDQogICAgIGlkPSJnNDE5OSINCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC4wMzI0NDIyNiwwLDAsMC4wMzI0NDIyNiwwLjA3NzA1MjczLDE5LjI3MDM4NCkiPjxwYXRoDQogICAgICAgc3R5bGU9ImZpbGw6IzE4NjQ5ZjtmaWxsLW9wYWNpdHk6MSINCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NzY2NjYyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIGlkPSJwYXRoNS0wIg0KICAgICAgIGQ9Im0gMS42NTksLTEwNy4yNjMyMyAtMC42NTgsLTI3OC4xNDIgYyAtMC4wMzIsLTEzLjY4NiAxMy45NSwtMjIuOTM4IDI2LjUzNCwtMTcuNTU5IGwgMjUzLjIwNiwxMDguMjQxIGMgNi45OTcsMi45OTEgMTEuNTQyLDkuODU5IDExLjU2LDE3LjQ2OCBsIDAuNjU4LDI3OC4xNDIgYyAwLjAzMiwxMy42ODcgLTEzLjk1LDIyLjkzOSAtMjYuNTM0LDE3LjU2IEwgMTMuMjE5LC04OS43OTQyMyBjIC02Ljk5NywtMi45OTEgLTExLjU0MywtOS44NTkgLTExLjU2LC0xNy40NjkgeiIgLz48cGF0aA0KICAgICAgIHN0eWxlPSJmaWxsOiMxNDU2OGI7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY3NjY2NjY2NjYyINCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgIGlkPSJwYXRoNS0wLTYiDQogICAgICAgZD0ibSA1OTEuMjYwMDIsLTQwNi4yMjcwNyBjIDEwLjA0MywtMC4wMjUgMTkuMDU2LDguMDU0IDE5LjA4MSwxOS4wMjIgbCAwLjY1OCwyNzguMTQxOTkgYyAwLjAxOCw3LjYwOSAtNC40OTUsMTQuNSAtMTEuNDc4LDE3LjUyMyBsIC0yNTIuNjksMTA5LjQzOCBjIC0yLjQ5MywxLjA3OSAtNS4wNDcsMS41ODMgLTcuNTM0LDEuNTkgLTEwLjA0NCwwLjAyMyAtMTkuMDU4LC04LjA1NSAtMTkuMDgzLC0xOS4wMjIgbCAtMC42NTgsLTI3OC4xNDMgYyAtMC4wMTksLTcuNjA5IDQuNDk1LC0xNC41IDExLjQ3OSwtMTcuNTIzIGwgMjUyLjY5LC0xMDkuNDM2OTkgYyAyLjQ5MywtMS4wODEgNS4wNDYsLTEuNTg0IDcuNTM1LC0xLjU5IHoiIC8+PGcNCiAgICAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLC01OTIpIg0KICAgICAgIHN0eWxlPSJmaWxsOiMxYzc4YzA7ZmlsbC1vcGFjaXR5OjEiDQogICAgICAgaWQ9ImczIj48cGF0aA0KICAgICAgICAgc3R5bGU9ImZpbGw6IzFjNzhjMDtmaWxsLW9wYWNpdHk6MSINCiAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjY2NjY2MiDQogICAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIg0KICAgICAgICAgaWQ9InBhdGg1Ig0KICAgICAgICAgZD0ibSAzMDQuMDgzLDAgYyAyLjYzMiwtMC4wMDYgNS4yNjYsMC41MzMgNy43MjgsMS42MTggbCAyNjYuNDAzLDExNy40MzkgYyAxNS4xMTIsNi42NjMgMTUuMTYzLDI4LjA4OCAwLjA4MiwzNC44MjEgTCAzMTIuNDUxLDI3Mi41NzcgYyAtMi40NTYsMS4wOTcgLTUuMDg4LDEuNjQ4IC03LjcyMSwxLjY1NSAtMi42MzIsMC4wMDYgLTUuMjY2LC0wLjUzMyAtNy43MjgsLTEuNjE4IEwgMzAuNiwxNTUuMTc1IEMgMTUuNDg3LDE0OC41MTMgMTUuNDM3LDEyNy4wODcgMzAuNTE3LDEyMC4zNTQgTCAyOTYuMzYxLDEuNjU1IEMgMjk4LjgxOCwwLjU1OCAzMDEuNDQ5LDAuMDA2IDMwNC4wODMsMCBaIiAvPjwvZz48L2c+PC9zdmc+',
				order: 20
			});
		},
		
		loaded: false,

		diagramOpts: {position: {x: 0, y: 0}, zoom: 1},
		fields: {},
		slices: {},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);

			if(this.property('slices')){
				this.sliceCount = this.property('slices');
			}
		},
		
		destroy: function(){
			if(this.existsArtifact('.cube')){
				this.removeArtifact('.cube');
			}
			$base();
		},

		load: function(bRespond){
			if(!this.loaded){
			    var mtxName = 'load_' + this.getId();

				JSB.getLocker().lock(mtxName);
				try {
					if(!this.loaded) {
					    this.queryEngine = new QueryEngine(this);
					    if(Config.has('datacube.queryCache.enabled') && Config.get('datacube.queryCache.enabled')){
					    	var cacheInvalidateInterval = Config.has('datacube.queryCache.cubeInvalidateInterval') && Config.get('datacube.queryCache.cubeInvalidateInterval') || 600000;
					    	this.queryCache = new QueryCache(this, this, {
					    		invalidateInterval: cacheInvalidateInterval
					    	});
					    }
		
						if(this.existsArtifact('.cube')){
							var snapshot = this.loadArtifact('.cube');

							// construct slices
							for(var i = 0; i < snapshot.slices.length; i++){
								var desc = snapshot.slices[i],
								    idArr = desc.id.split('/');

								if(this.getWorkspace(idArr[0]).existsEntry(idArr[1])){
									var slice = this.getWorkspace(idArr[0]).entry(idArr[1]);

									if(!JSB.isInstanceOf(slice, 'DataCube.Model.Slice')){
										continue;
									}

									this.slices[desc.id] = {
									    entry: slice,
									    diagramOpts: desc.diagramOpts
									};
								}
							}

							// load fields
							this.fields = snapshot.fields || this.fields;

							// load diagram position & zoom
							this.diagramOpts = snapshot.diagramOpts || this.diagramOpts;
						}
						this.loaded = true;
						this.publish('DataCube.Model.Cube.changed', {action: 'loaded'}, {session: true});
						this.doSync();
					}
				} finally {
					JSB.getLocker().unlock(mtxName);
				}
			}
			
			if(!bRespond){
				return;
			}

			var dimensions = {},
			    fieldArray = [];

			for(var i in this.fields){
			    if(this.fields[i].isDimension){
			        dimensions[i] = {
			            slices: this.fields[i].slices
			        }
			    }

			    fieldArray.push({
			        isDimension: this.fields[i].isDimension,
			        key: i
			    });
			}

			fieldArray.sort(function(a, b){
                if(a.isDimension && !b.isDimension){
                    return -1;
                }

                if(!a.isDimension && b.isDimension){
                    return 1;
                }

                if(a.key > b.key){
                    return 1;
                }

                if(a.key < b.key){
                    return -1;
                }

                return 0;
            });

			return {
			    diagramOpts: this.diagramOpts,
			    dimensions: dimensions,
			    fields: this.fields,
			    fieldArray: fieldArray,
				slices: this.slices
			};
		},

		store: function(){
            JSB.defer(function(){
                $this._store();
            }, 200, "storeDefer_" + this.getId());
		},

		_store: function(){
			if(!this.loaded){
				this.load();
			}
			var mtxName = 'store_' + this.getId();
			JSB.getLocker().lock(mtxName);
			try {
				// construct snapshot
				var snapshot = {
				    diagramOpts: this.diagramOpts,
				    fields: this.fields,
					slices: []
				};
				
				// prepare slices
				for(var i in this.slices){
					snapshot.slices.push({
						id: i,
                        diagramOpts: this.slices[i].diagramOpts
					});
				}
				
				this.storeArtifact('.cube', snapshot);

				this.sliceCount = Object.keys(this.slices).length;

				this.property('slices', this.sliceCount);
				
				this.getWorkspace().store();
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},

		addDimension: function(field){
		    this.fields[field].isDimension = true;

		    this.store();
		},

		addSlice: function(opts){
			this.load();

			if(!opts){
			    opts = {};
			}

			var slice = new Slice(JSB.generateUid(), this.getWorkspace(), {
			    cube: this,
			    name: this.generateSliceName(opts.name),
			    sources: opts.sources,
			    sourceOpts: opts.sourceOpts,
			    sourceType: opts.sourceType
			});

			this.slices[slice.getFullId()] = {
			    diagramOpts: opts.diagramOpts,
			    entry: slice
			};

			this.addChildEntry(slice);

			this.updateCubeFields(slice, true);

			this.sliceCount = Object.keys(this.slices).length;

			this.store();
			this.doSync();

			return slice;
		},

		executeQuery: function(query, params, bUseCache){
		    this.load();

		    if(bUseCache && this.queryCache){
		    	return this.queryCache.executeQuery(query, params);
		    } else {
		    	return this.queryEngine.query(query, params);
		    }
		},

		extractFields: function(){
		    return this.fields;
		},

		generateSliceName: function(sName){
			var snMap = {};

			sName = sName || 'Срез';

			for(var sId in this.slices){
				snMap[this.slices[sId].entry.getName()] = true;
			}

			if(!snMap[sName]){
			    return sName;
			} else {
			    sName += ' ';
			}

			for(var cnt = 1; ; cnt++){
			    var suffix = '(' + cnt + ')';

				if(!snMap[sName + suffix]){
					return sName + suffix;
				}
			}
		},

		getDimensions: function(){
		    this.load();

		    var dimensions = {};

		    for(var i in this.fields){
		        if(this.fields[i].isDimension){
		            dimensions[i] = {
		                slices: this.fields[i].slices
		            };
		        }
		    }

		    return dimensions;
		},

		// Dima use it
		getManagedFields: function(){
			return this.extractFields();
		},

		getSlices: function(){
			this.load();

			var slices = {};

			for(var i in this.slices){
			    slices[i] = this.slices[i].entry;
			}

			return slices;
		},

		removeDimension: function(fields){
		    if(!JSB.isArray(fields)){
		        fields = [fields];
		    }

		    for(var i = 0; i < fields.length; i++){
		        this.fields[fields[i]].isDimension = false;
		    }

		    this.store();
		},
		
		removeSlice: function(sliceId){
			this.load();

			var slice = this.slices[sliceId];

			if(!slice){
				return;
			}

			// remove slice from fields
			var sliceFields = slice.entry.extractFields();

			for(var i in sliceFields){
			    var sliceIndex = this.fields[i].slices.indexOf(sliceId);

                this.fields[i].slices.splice(sliceIndex, 1);

                if($this.fields[i].slices.length === 0){
                    delete this.fields[i];
                }
			}

			delete this.slices[sliceId];

			this.sliceCount = Object.keys(this.slices).length;

			this.publish('DataCube.Model.Cube.updateCubeFields', { dimensions: this.getDimensions(), fields: this.fields }, {session: true});

			this.store();
		},

		updateCubeFields: function(slice, noStore){
		    function updateFields(slice){
		        var sliceFields = slice.extractFields(),
		            sliceId = slice.getId(),
		            isNeedUpdate = false;

                // add new fields
		        for(var i in sliceFields){
		            if(!$this.fields[i]){
		                $this.fields[i] = {
		                    slices: [sliceId],
		                    type: sliceFields[i].type
                        };

		                isNeedUpdate = true;
		            } else {
		                $this.fields[i].slices.push(sliceId);
		            }
		        }

		        // remove un-existed
		        for(var i in $this.fields){
		            var sliceIndex = $this.fields[i].slices.indexOf(sliceId);

		            if(sliceIndex > -1 && !sliceFields[i]){
		                $this.fields[i].slices.splice(sliceIndex, 1);

		                if($this.fields[i].slices.length === 0){
		                    delete $this.fields[i];
		                }
		            }
		        }

		        return isNeedUpdate;
		    }

		    var isNeedUpdate = false;

		    if(slice){
		        isNeedUpdate = updateFields(slice);
		    } else {
		        for(var i in this.slices){
		            isNeedUpdate = updateFields(this.slices[i]) || isNeedUpdate;
		        }
		    }

            if(isNeedUpdate){
                this.publish('DataCube.Model.Cube.updateCubeFields', { dimensions: this.getDimensions(), fields: this.fields }, {session: true});

                if(!noStore){
                    this.store();
                }
            }
		},

		updateDiagramPosition: function(diagramOpts){
		    this.diagramOpts = diagramOpts;

		    this.store();
		},

		updateNodePosition: function(entry, diagramOpts){
		    var entryId = entry.getFullId();

		    if(this.hasChildEntry(entry)){
		        this.slices[entryId].diagramOpts = JSB.merge(this.slices[entryId].diagramOpts, diagramOpts);
		    } else {
		        return;
		    }

		    this.store();
		},

		// check necessity
		parametrizeQuery: function(query){
			var newQuery = JSB.clone(query);
			var params = {};
			var filterOps = {
				'$eq': true,
				'$lt': true,
				'$lte': true,
				'$gt': true, 
				'$gte': true,
				'$ne': true,
				'$like': true,
				'$ilike': true
			};
			
			if(newQuery && Object.keys(newQuery).length > 0){
	        	// translate $filter
	        	if(newQuery.$filter || newQuery.$cubeFilter || newQuery.$postFilter){
	        		var c = {i: 1};
	        		function getNextParam(){
	        			return 'p' + (c.i++);
	        		}
	        		function prepareFilter(scope){
	        			for(var f in scope){
	        				if(filterOps[f] && !JSB.isObject(scope[f]) && !JSB.isArray(scope[f])){
/*	        					
	        					var pName = getNextParam();
	        					params[pName] = scope[f];
	        					scope[f] = '${'+pName+'}';
*/
	        					scope[f] = {$const:scope[f]};

	        				} else if(f == '$and' || f == '$or' || f == '$in' || f == '$nin'){
	        					var arr = scope[f];
	        					for(var i = 0; i < arr.length; i++){
	        						if(!JSB.isObject(arr[i]) && !JSB.isArray(arr[i])){
	        							arr[i] = {$const:arr[i]};
	        						} else {
	        							prepareFilter(arr[i]);
	        						}
	        					}
	        				} else {
	        					prepareFilter(scope[f]);
	        				}
	        			}
	        		}
	        		if(newQuery.$filter){
	        			prepareFilter(newQuery.$filter);
	        		}
	        		if(newQuery.$cubeFilter){
	        			prepareFilter(newQuery.$cubeFilter);
	        		}
	        		if(newQuery.$postFilter){
	        			prepareFilter(newQuery.$postFilter);
	        		}
	        	}
            }
			
			return {
				query: newQuery,
				params: params
			}
		},

		// check necessity
		invalidate: function(){
			$this.publish('DataCube.Model.Cube.status', {status: 'Очистка кэша', success: true}, {session: true});
			JSB.defer(function(){
				$this.load();
				// invalidate slices
				for(var slId in $this.slices){
					var slice = $this.slices[slId];
					if(slice){
						slice.invalidate();
					}
				}
				if($this.queryCache){
					$this.queryCache.clear();
				}
				$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
			}, 300, 'invalidate_' + this.getId());
		},

		// check necessity
		updateCache: function(){
			JSB.defer(function(){
				$this.load();
				$this.lock('DataCube.Model.Cube.updateCache');
				$this.updatingCache = true;
				try {
					// invalidate slices
					var totalSlices = Object.keys($this.slices).length;
					var cnt = 0;
					var lastPP = -1;
					for(var slId in $this.slices){
						var pp = Math.round(cnt * 100 / totalSlices);
						if(pp > lastPP){
		            		$this.publish('DataCube.Model.Cube.status', {status: 'Обновление кэша ' + pp + '%', success: true}, {session: true});
		            		lastPP = pp;
		            	}
						var slice = $this.slices[slId];
						if(slice){
							slice.updateCache();
							
							var it = null;
							try {
								it = slice.executeQuery({useCache:true});
							} catch(e){					
							} finally {
								if(it){
									try{ it.close(); }catch(e){}
								}
							}
							
						}
						cnt++;
					}
					if($this.queryCache){
						$this.queryCache.update();
					}
					$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
				} catch(e){
					$this.publish('DataCube.Model.Cube.status', {status: e.message, success: false}, {session: true});
				} finally {
					$this.updatingCache = false;
					$this.unlock('DataCube.Model.Cube.updateCache');
				}
			}, 300, 'updateCache_' + this.getId());
		}
	}
}