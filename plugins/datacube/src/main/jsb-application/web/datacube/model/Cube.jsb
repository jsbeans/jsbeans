{
	$name: 'DataCube.Model.Cube',
	$parent: 'JSB.Workspace.Entry',
	
	sourceCount: 0,
	fieldCount: 0,
	sliceCount: 0,
	
	getSourceCount: function(){
		return this.sourceCount;
	},
	
	getFieldCount: function(){
		return this.fieldCount;
	},

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

		fields: {},
		fieldMap: null,
		slices: {},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(this.property('sources')){
				this.sourceCount = this.property('sources');
			}
			if(this.property('fields')){
				this.fieldCount = this.property('fields');
			}
			if(this.property('slices')){
				this.sliceCount = this.property('slices');
			}
			if(this.property('fieldMap')){
				this.fieldMap = this.property('fieldMap');
			}
		},
		
		destroy: function(){
			if(this.existsArtifact('.cube')){
				this.removeArtifact('.cube');
			}
			$base();
		},
		
		getFieldMap: function(){
			return this.fieldMap;
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
								var sDesc = snapshot.slices[i];

								if(this.getWorkspace().existsEntry(sDesc.id)){
									var slice = this.getWorkspace().entry(sDesc.id);

									if(!JSB.isInstanceOf(slice, 'DataCube.Model.Slice')){
										continue;
									}

									this.slices[sDesc.id] = slice;

									this.fields = JSB.merge(this.fields, slice.getStructFields());
								}
							}
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
			
			// construct response for drawing
			var desc = {
				fields: this.fields,
				slices: []
			};

			for(var sId in this.slices){
				desc.slices.push({
					slice: this.slices[sId]
				});
			}

			return desc;
		},
		
		fixupProviders: function(){
			var bNeedSave = false;
			for(pId in this.dataProviders){
				var p = this.dataProviders[pId];
				if(!JSB.isInstanceOf(p.entry, 'DataCube.Model.SqlTable')){
					continue;
				}
				if(!p.entry.isMissing()){
					continue;
				}
				// lookup appropriate entry
				var dbSource = p.entry.getParent();
				if(!JSB.isInstanceOf(dbSource, 'DataCube.Model.SqlSource')){
					continue;
				}
				var chMap = dbSource.getChildren();
				var nCh = null;
				for(var chId in chMap){
					var chEntry = chMap[chId];
					if(!JSB.isInstanceOf(chEntry, 'DataCube.Model.SqlTable')){
						continue;
					}
					if(chEntry == p.entry || chEntry.isMissing()){
						continue;
					}
					if(chEntry.getName() == p.entry.getName()){
						nCh = chEntry;
						break;
					}
				}
				if(nCh){
					bNeedSave = true;
					// do replace
					p.entry = nCh;
					//this.dataProviderEntries[pId] = nCh; // todo
				}
			}
			if(bNeedSave){
				this.publish('DataCube.Model.Cube.changed', {action: 'providerChanged'}, {session: true});
				this.store();
			}
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
					slices: []
				};
				
				// prepare slices
				for(var sId in this.slices){
					var sDesc = {
						id: sId,
						name: this.slices[sId].getName()
					}
					snapshot.slices.push(sDesc);
				}
				
				this.storeArtifact('.cube', snapshot);
				
				this.fieldCount = Object.keys(this.fields).length;
				this.sliceCount = Object.keys(this.slices).length;
				
				this.property('sources', this.sourceCount);
				this.property('fields', this.fieldCount);
				this.property('slices', this.sliceCount);
				
				this.getWorkspace().store();
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},

		extractFields: function(){
		    // todo
		},

		prepareFieldName: function(name){
			name = name.trim();
			if(name.length == 0){
				return name;
			}
			if(name[0] == '\"' || name[0] == '\''){
				name = name.substr(1, name.length - 1);
			}
			if(name[name.length - 1] == '\"' || name[name.length - 1] == '\''){
				name = name.substr(0, name.length - 1);
			}
			
			if(name.indexOf('.') >= 0){
				var parts = name.split(/[\.\s]/i);
				name = '';
				for(var i = 0; i < parts.length; i++){
					var pName = parts[i];
					if(i > 0){
						pName = pName[0].toUpperCase() + pName.substr(1);
					}
					name += pName;
				}
			}

			return name;
		},
		
		addSlice: function(){
			this.load();
			// generate slice name map
			var snMap = {};
			for(var sId in this.slices){
				snMap[this.slices[sId].getName()] = true;
			}
			var sName = null;
			for(var cnt = 1; ; cnt++){
				sName = 'Срез ' + cnt;
				if(!snMap[sName]){
					break;
				}
			}
			var sId = JSB.generateUid();
			var slice = new Slice(sId, this.getWorkspace(), this, sName);

			this.slices[sId] = slice;
			this.sliceCount = Object.keys(this.slices).length;
			this.addChildEntry(slice);
			this.publish('DataCube.Model.Cube.changed', {action: 'sliceAdded'}, {session: true});
			this.store();
			this.doSync();
			return slice;
		},
		
		removeChildEntry: function(e){
			if(!this.hasChildEntry(e)){
				return;
			}
			$base(e);

			if(JSB.isString(e)){
				e = this.getWorkspace().entry(e);
			}
			if(JSB.isInstanceOf(e, 'DataCube.Model.Slice')){
				this.removeSlice(e.getId());
			}
		},
		
		removeSlice: function(sId){
			this.load();
			var slice = this.slices[sId];
			if(!slice){
				return;
			}
			delete this.slices[sId];
			this.removeChildEntry(sId);
			slice.remove();
			this.publish('DataCube.Model.Cube.changed', {action: 'sliceRemoved'}, {session: true});
			this.sliceCount = Object.keys(this.slices).length;
			this.store();
		},
		
		getSliceById: function(sId){
			this.load();
			if(!this.slices[sId]){
				throw new Error('Unable to find slice with id: ' + sId);
			}
			return this.slices[sId];
		},
		
		getSlices: function(){
			this.load();
			return this.slices;
		},
		
		getFields: function(){
			this.load();
			return this.fields;
		},
		
		getManagedFields: function(){   // Dima use it
			this.load();

			return this.getFields();
		},
		
		getOutputFields: function(){
			var fields = $this.getManagedFields();
			var fMap = {};
			for(var fName in fields){
				fMap[fName] = {
					type: fields[fName].type,
					comment: fields[fName].comment
				};
			}
			
			return fMap;
		},
		
		updateSliceSettings: function(sId, desc){
			this.load();

			this.getSliceById(sId).setSliceParams(desc);

			this.publish('DataCube.Model.Cube.changed', {action: 'sliceChanged'}, {session: true});
			this.store();
			this.doSync();
		},

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
		
		executeQuery: function(query, params, provider, bUseCache){
		    this.load();
		    if(bUseCache && this.queryCache){
		    	return this.queryCache.executeQuery(query, params, provider);
		    } else {
		    	return this.queryEngine.query(query, params, provider);
		    }
		},
		
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