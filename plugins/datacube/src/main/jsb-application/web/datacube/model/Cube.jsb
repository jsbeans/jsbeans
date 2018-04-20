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
		           'DataCube.Providers.DataProviderRepository',
		           'DataCube.Model.Slice',
		           'DataCube.Query.QueryEngine',
		           'DataCube.Query.QueryCache',
		           'DataCube.MaterializationEngine',
		           'JSB.Crypt.MD5'],
		
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
		dataProviders: {},
		dataProviderEntries: {},
		dataProviderFields: {},
		dataProviderPositions: {},
		dataProviderSizes: {},
		fieldOrder: [],
		fields: {},
		slices: {},
		slicePositions: {},
		materialization: {},
		materializing: false,
		nodePosition: null,
		nodeSize: null,
		defaultFields: null,

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
		},
		
		destroy: function(){
			if(this.existsArtifact('.cube')){
				this.removeArtifact('.cube');
			}
			$base();
		},
		
		load: function(bRespond){
			var mtxName = 'load_' + this.getId();
			if(!this.loaded){
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
							
							this.nodePosition = snapshot.position;
							this.nodeSize = snapshot.size;
							this.defaultFields = snapshot.defaultFields;
							
							// construct data providers
							for(var i = 0; i < snapshot.providers.length; i++){
								var pDesc = snapshot.providers[i];
								var pEntry = null;
								if(!this.getWorkspace().existsEntry(pDesc.entry)){
									JSB.getLogger().warn('Unable to construct data provider "'+pDesc.jsb+'" due to missing source entry: ' + pDesc.entry);
									continue;
								} else {
									pEntry = this.getWorkspace().entry(pDesc.entry);
								}
								var pJsb = JSB.get(pDesc.jsb);
								if(!pJsb){
									JSB.getLogger().error('Unable to construct data provider "'+pDesc.jsb+'" due to missing its bean');
									continue;
								}
								var ProviderClass = pJsb.getClass();
								var providerDesc = DataProviderRepository.queryDataProviderInfo(pEntry);
								var provider = new ProviderClass(pDesc.id, pEntry, this, pDesc.options || {mode: pDesc.mode});
								this.dataProviders[pDesc.id] = provider;
								this.dataProviderEntries[pDesc.id] = pEntry;
								this.dataProviderFields[pDesc.id] = pDesc.fields;
								this.dataProviderPositions[pDesc.id] = pDesc.position;
								this.dataProviderSizes[pDesc.id] = pDesc.size;
		
								// actualize dataProviderFields
								for(var fName in this.dataProviderFields[pDesc.id]){
									if(this.dataProviderFields[pDesc.id][fName] && !JSB.isObject(this.dataProviderFields[pDesc.id][fName])){
										this.dataProviderFields[pDesc.id] = provider.extractFields({comment:true, type:true, nativeType:true});
										break;
									}
								}
							}
							
							// construct fields
							for(var i = 0; i < snapshot.fields.length; i++){
								var fDesc = snapshot.fields[i];
								this.fields[fDesc.field] = {
									field: fDesc.field,
									type: fDesc.type,
									link: fDesc.link,
									order: fDesc.order,
									comment: fDesc.comment,
									binding: []
								};
								for(var j = 0; j < fDesc.binding.length; j++){
									var bDesc = fDesc.binding[j];
									if(this.dataProviders[bDesc.provider]){
										this.fields[fDesc.field].binding.push({
											provider: this.dataProviders[bDesc.provider],
											field: bDesc.field,
											type: bDesc.type
										});
									}
								}
								if(this.fields[fDesc.field].binding.length == 0){
									delete this.fields[fDesc.field];
								}
							}
							
							// construct materialization
							if(snapshot.materialization && Object.keys(snapshot.materialization).length > 0 && snapshot.materialization.tables && Object.keys(snapshot.materialization.tables).length > 0){
								try {
									var materialization = {
										lastUpdate: snapshot.materialization.lastUpdate,
										fields: {},
										tables: {}
									};
									
									for(var tId in snapshot.materialization.tables){
										if(!snapshot.materialization.tables[tId].provider.entry){
											throw new Error('Missing materialized source for cube: ' + $this.getName());
										}
										var dataProviderEntry = this.getWorkspace().entry(snapshot.materialization.tables[tId].provider.entry);
		
										var pJsb = JSB.get(snapshot.materialization.tables[tId].provider.jsb);
										if(!pJsb){
											throw new Error('Unable to construct data provider "'+snapshot.materialization.tables[tId].provider.jsb+'" due to missing its bean');
										}
										var ProviderClass = pJsb.getClass();
										var providerDesc = DataProviderRepository.queryDataProviderInfo(dataProviderEntry);
										var dataProvider = new ProviderClass(snapshot.materialization.tables[tId].provider.id, dataProviderEntry, this, snapshot.materialization.tables[tId].provider.options || {mode:snapshot.materialization.tables[tId].provider.mode});
										
										materialization.tables[tId] = {
											table: snapshot.materialization.tables[tId].table,
											dataProviderEntry: dataProviderEntry,
											dataProvider: dataProvider,
											indexes: snapshot.materialization.tables[tId].indexes || {}
										};
									}
									
									for(var i = 0; i < snapshot.materialization.fields.length; i++){
										var fDesc = snapshot.materialization.fields[i];
										materialization.fields[fDesc.field] = {
											field: fDesc.field,
											type: fDesc.type,
											binding: []
										}
										for(var j = 0; j < fDesc.binding.length; j++){
											var provider = JSB.getInstance(fDesc.binding[j].provider);
											if(provider){
												materialization.fields[fDesc.field].binding.push({
													provider: provider,
													field: fDesc.binding[j].field,
													type: fDesc.binding[j].type
												});
											}
										}
										if(materialization.fields[fDesc.field].binding.length == 0){
											delete materialization.fields[fDesc.field];
										}
									}
									
									this.materialization = materialization;
								} catch(e){
									JSB.getLogger().error(e);
								}
							}
							
							// construct slices
							for(var i = 0; i < snapshot.slices.length; i++){
								var sDesc = snapshot.slices[i];
								if(this.getWorkspace().existsEntry(sDesc.id)){
									var slice = this.getWorkspace().entry(sDesc.id);
									if(!JSB.isInstanceOf(slice, 'DataCube.Model.Slice')){
										continue;
									}
									slice.setQuery(sDesc.query);
									slice.setQueryParams(sDesc.queryParams);
									this.slices[sDesc.id] = slice;
									this.slicePositions[sDesc.id] = sDesc.position;
								}
							}
							
						}
						this.loaded = true;
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
				cubePosition: this.nodePosition,
				cubeSize: this.nodeSize,
				defaultFields: this.defaultFields,
				providers: [],
				fields: this.fields,
				slices: []
			};
			for(var pId in this.dataProviders){
				desc.providers.push({
					provider: this.dataProviders[pId],
					position: this.dataProviderPositions[pId],
					size: this.dataProviderSizes[pId]
				});
			}
			for(var sId in this.slices){
				desc.slices.push({
					slice: this.slices[sId],
					position: this.slicePositions[sId]
				});
			}
			
			return desc;
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
					providers: [],
					fields: [],
					slices: [],
					position: this.nodePosition,
					size: this.nodeSize,
					defaultFields: this.defaultFields
				};
	
				// prepare providers
				for(var pId in this.dataProviders){
				    var provider = this.dataProviders[pId],
				        providerFields = {};
	
	                // prepare providers' fields
	                /*
	                for(var i in this.dataProviderFields[pId]){
	                    providerFields[i] = {
	                        nativeType: this.dataProviderFields[pId][i].nativeType,
	                        type: this.dataProviderFields[pId][i].type
	                    }
	
	                    if(this.dataProviderFields[pId][i].alias){
	                        providerFields[i][alias] = this.dataProviderFields[pId][i].alias;
	                    }
	                }
	                */
					var pDesc = {
						id: pId,
						jsb: provider.getJsb().$name,
						entry: this.dataProviderEntries[pId].getId(),
						fields: this.dataProviderFields[pId],
						options: provider.getOptions(),
						position: this.dataProviderPositions[pId],
						size: this.dataProviderSizes[pId]
					};
					snapshot.providers.push(pDesc);
				}
	
				// prepare fields
				for(var fName in this.fields){
					var fDesc = {
						field: fName,
						type: this.fields[fName].type,
						link: this.fields[fName].link,
						order: this.fields[fName].order,
						comment: this.fields[fName].comment,
						binding: []
					};
					for(var i = 0; i < this.fields[fName].binding.length; i++){
						var b = this.fields[fName].binding[i];
						fDesc.binding.push({
							provider: b.provider.getId(),
							field: b.field,
							type: b.type
						});
					}
					snapshot.fields.push(fDesc);
				}
				
				// prepare materialization
				if(this.materialization && Object.keys(this.materialization).length > 0){
					snapshot.materialization = {
						lastUpdate: this.materialization.lastUpdate,
						tables: {},
						fields: []
					};
					for(var tId in this.materialization.tables){
						snapshot.materialization.tables[tId] = {
							table: this.materialization.tables[tId].table,
							provider: {
								id: this.materialization.tables[tId].dataProvider.getId(),
								jsb: this.materialization.tables[tId].dataProvider.getJsb().$name,
								entry: this.materialization.tables[tId].dataProviderEntry.getId(),
								options: this.materialization.tables[tId].dataProvider.getOptions()
							},
							indexes: this.materialization.tables[tId].indexes || {}
						};
					}
					for(var fName in this.materialization.fields){
						var fDesc = {
							field: fName,
							type: this.materialization.fields[fName].type,
							binding: []
						};
						for(var i = 0; i < this.materialization.fields[fName].binding.length; i++){
							var bDesc = this.materialization.fields[fName].binding[i];
							fDesc.binding.push({
								provider: bDesc.provider.getId(),
								field: bDesc.field,
								type: bDesc.type
							});
						}
						snapshot.materialization.fields.push(fDesc);
					}
				}
				
				// prepare slices
				for(var sId in this.slices){
					var sDesc = {
						id: sId,
						name: this.slices[sId].getName(),
						query: this.slices[sId].getQuery(),
						queryParams: this.slices[sId].getQueryParams(),
						position: this.slicePositions[sId]
					}
					snapshot.slices.push(sDesc);
				}
				
				this.storeArtifact('.cube', snapshot);
				
				this.fieldCount = Object.keys(this.fields).length;
				this.sourceCount = Object.keys(this.dataProviders).length;
				this.sliceCount = Object.keys(this.slices).length;
				
				this.property('sources', this.sourceCount);
				this.property('fields', this.fieldCount);
				this.property('slices', this.sliceCount);
				this.getWorkspace().store();
			} finally {
				JSB.getLocker().unlock(mtxName);
			}
		},
		
		updateCubeNodePosition: function(pt){
			this.load();
			this.nodePosition = pt;
			this.store();
		},

		updateCubeNodeSize: function(size){
			this.load();
		    this.nodeSize = size;
		    this.store();
		},
		
		addDataProvider: function(providerEntry){
			this.load();
			var providerDesc = DataProviderRepository.queryDataProviderInfo(providerEntry);
			var providerJsb = JSB.get(providerDesc.pType);
			if(!providerJsb){
				throw new Error('Unable to find provider bean: ' + providerDesc.pType);
			}
			var ProviderCls = providerJsb.getClass();
			var pId = this.getId() + '|dp_' + JSB.generateUid();
			var provider = new ProviderCls(pId, providerEntry, this, providerDesc);
			this.dataProviders[pId] = provider;
			this.dataProviderEntries[pId] = providerEntry;
			this.sourceCount = Object.keys(this.dataProviders).length;
			this.store();
			this.doSync();
			return provider;
		},

		getFields: function(){
			this.load();
		    return this.fields;
		},
		
		getProviderById: function(pId){
			this.load();
			if(!this.dataProviders[pId]){
				throw new Error('Unable to find data provider by id: ' + pId);
			}
			return this.dataProviders[pId];
		},

		getOrderedDataProviders: function(){
			this.load();
			if(this.materialization && this.materialization.dataProvider){
				return [this.materialization.dataProvider];
			}

		    var ordered = [];
		    var joins = [];
		    for(var id in this.dataProviders) {
                var provider = this.dataProviders[id];
		        if ((provider.getMode()||'union') == 'union') {
		            ordered.push(provider);
		        } else {
		            joins.push(provider);
		        }
		    }

            function orderJoins(allOrAny){
                var cubeFields = $this.getManagedFields();
                var stop = false;
                while(!stop) {
                    stop = true;
                    for (var p =0; p < joins.length; p++) {
                        var provider = joins[p];
                        var allBinded = true;
                        var anyBinded = false;
                        //  check all shared fields has binding with ordered
                        cubeFields:
                        for(var cubeField in cubeFields) {
                            var binding = cubeFields[cubeField].binding;
                            if (binding.length > 1) {
                                for(var b in binding) {
                                    if(binding[b].provider == provider) {
                                        // here cubeField is shared field of provider
                                        var hasBinding = (function(){
                                            // find left provider with binding
                                            for (var o in ordered) {
                                                var leftProvider = ordered[o];
                                                for(var b2 in binding) {
                                                    if(binding[b2].provider == leftProvider) {
                                                        return true;
                                                    }
                                                }
                                            }
                                            return false;
                                        })();
                                        if (hasBinding) {
                                            anyBinded = true;
                                            if (!allOrAny) {
                                                break cubeFields;
                                            }
                                        } else {
                                            allBinded = false;
                                            if (allOrAny) {
                                                break cubeFields;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (allOrAny ? allBinded : anyBinded) {
                            joins.splice(p--, 1);
                            ordered.push(provider);
                            stop = false;
                        }
                    }
                }
            }

            orderJoins(true); // first all shared fields binded
            orderJoins(false); // then any shared field binded

            if (joins.length > 0) {
                throw new Error('Some provider`s fields has no JOIN ON binding');
            }
		    return ordered;
		},

//		getOrderedDataProviders: function(){
//			this.load();
//			if(this.materialization && this.materialization.dataProvider){
//				return [this.materialization.dataProvider];
//			}
//		    function compareProviders(leftProvider, rightProvider){
//		        // by mode
//		        if ((leftProvider.getMode()||'union') != (rightProvider.getMode()||'union')) {
//		            return rightProvider.getMode() == 'join' ? -1 : 1;
//		        }
//		        // by position
//		        for(var f in $this.fields){
//                    var binding = $this.fields[f].binding;
//                    if (binding.length > 1) {
//                        var leftPosition = binding.length;
//                        for(var b = 0; b < binding.length; b++) {
//                            if (binding[b].provider == leftProvider) {
//                                leftPosition = b;
//                            }
//                        }
//                        var rightPosition = binding.length;
//                        for(var b = 0; b < binding.length; b++) {
//                            if (binding[b].provider == rightProvider) {
//                                rightPosition = b;
//                            }
//                        }
//                        if (leftPosition != binding.length && rightPosition != binding.length) {
//                            return leftPosition - rightPosition;
//                        }
//                    }
//                }
//                return 0;
//		    }
//
//		    var providers = [];
//		    for(var id in this.dataProviders) {
//		        providers.push(this.dataProviders[id]);
//		    }
//		    providers.sort(compareProviders);
//		    return providers;
//		},

		createProviderFieldsList: function(provider, fields){
			this.load();
            var res = {
                fields: {}
            };

            var isUseComments = provider.getOption('useComments'),
                alias = provider.getOption('commentField');

            for(var i in fields){
                res.fields[i] = {
                    type: fields[i].type,
                    nativeType: fields[i].nativeType,
                    alias: isUseComments ? (alias ? fields[i].comment[alias] : fields[i].comment) : undefined
                }
            }

            if(fields[i].comment){
                if(JSB.isObject(fields[i].comment)){
                    res.commentsType = 'json';
                    res.commentsList = Object.keys(fields[i].comment);
                } else {
                    res.commentsType = 'string';
                }
            }

            for(var i in this.fields){
                for(var j = 0; j < this.fields[i].binding.length; j++){
                    if(provider.getId() == this.fields[i].binding[j].provider.getId()){
                        if(this.fields[i].binding.length > 1){
                            res.fields[this.fields[i].binding[j].field].keyField = true;
                        }

                        res.fields[this.fields[i].binding[j].field].cubeField = i;
                    }
                }
            }

            return res;
		},

		changeProviderOptions: function(providerId, opts){
			this.load();
			var provider = this.getProviderById(providerId);
			var curOpts = provider.getOptions();
			var bChanged = false;
			for(var o in opts){
				if(JSB.isNull(opts[o]) && !JSB.isNull(curOpts[o])){
					delete curOpts[o];
					bChanged = true;
				} else {
					if(curOpts[o] != opts[o]){
						curOpts[o] = opts[o];
						bChanged = true;
					}
				}
			}
			if(bChanged){
				provider.setOptions(curOpts);
				this.store();
	            this.doSync();
			}
			return curOpts;
		},
		
		getProviderOptions: function(providerId){
			this.load();
			var provider = this.getProviderById(providerId);
			return provider.getOptions();
		},

		extractDataProviderFields: function(pId){
			this.load();
			var provider = this.getProviderById(pId);
			if(this.dataProviderFields[provider.getId()]){
				return this.createProviderFieldsList(provider, this.dataProviderFields[provider.getId()]);
			}
			var dpFields = provider.extractFields({comment:true, type:true, nativeType:true});
			this.dataProviderFields[provider.getId()] = dpFields;
			this.store();
			this.doSync();
			return this.createProviderFieldsList(provider, dpFields);
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

			return name;
		},

		removeProvider: function(pId){
			this.load();
		    var fieldsForRemove = [];

            for(var i in this.fields){
                for(var j = 0; j < this.fields[i].binding.length; j++){
                    var field = this.fields[i].binding[j];
                    if(field.provider.getId() == pId){
                        fieldsForRemove.push(i);
                    }
                }
            }

            this.removeFields(fieldsForRemove);
            delete this.dataProviders[pId];
            delete this.dataProviderFields[pId];
            delete this.dataProviderEntries[pId];
            delete this.dataProviderPositions[pId];
            delete this.dataProviderSizes[pId];
            this.sourceCount--;

		    this.store();
            this.doSync();

            this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
		},
		
		refreshDataProviderFields: function(pId){
			this.load();
			var provider = this.getProviderById(pId);
			var dpNewFields = provider.extractFields({comment:true, type:true, nativeType:true});
			var dpFields = this.dataProviderFields[provider.getId()];
			var bNeedStore = false;
			
			this.dataProviderFields[provider.getId()] = dpNewFields;
			if(this.removeUnexistedFields(provider)){
				bNeedStore = true;
			}
			
			var providerBindingMap = {};
			for(var fName in this.fields){
				var fDesc = this.fields[fName];
				var bindingArr = fDesc.binding;
				for(var i = 0; i < bindingArr.length; i++){
					var bDesc = bindingArr[i];
					if(bDesc.provider != provider){
						continue;
					}
					if(bDesc.type != dpNewFields[bDesc.field].nativeType){
						bDesc.type = dpNewFields[bDesc.field].nativeType;
						bNeedStore = true;
					}
					if(!providerBindingMap[bDesc.field]){
						providerBindingMap[bDesc.field] = [];
					}
					providerBindingMap[bDesc.field].push({
						field: bDesc.field,
						type: bDesc.type,
						link: fDesc.link,
						order: fDesc.order
					});
				}
			}

			if(bNeedStore){
				this.store();
				this.doSync();
			}
			
			return {fields: this.createProviderFieldsList(provider, dpNewFields), binding: providerBindingMap};
		},
		
		renameDataProviderField: function(provider, oldName, newName, type){
			this.load();
			// iterate over all fields in cube
			for(var fName in this.fields){
				var fDesc = this.fields[fName];
				var bindingArr = fDesc.binding;
				for(var i = 0; i < bindingArr.length; i++){
					var bDesc = bindingArr[i];
					if(bDesc.provider != provider){
						continue;
					}
					if(bDesc.field == oldName){
						bDesc.field = newName;
						bDesc.type = type;
					}
				}
			}
		},
		
		removeUnexistedFields: function(provider){
			this.load();
			var bNeedStore = false;
			var dpFields = this.dataProviderFields[provider.getId()];
			var fieldsToRemove = [];
			for(var fName in this.fields){
				var fDesc = this.fields[fName];
				var bindingArr = fDesc.binding;
				for(var i = bindingArr.length - 1; i >= 0 ; i--){
					var bDesc = bindingArr[i];
					if(bDesc.provider != provider){
						continue;
					}

					if(!dpFields[bDesc.field]){
						bindingArr.splice(i, 1);
					} else {
					    if(fDesc.type != dpFields[bDesc.field].type){
					        fDesc.type = dpFields[bDesc.field].type;
					    }
					}
				}

				if(bindingArr.length == 0){
					fieldsToRemove.push(fName);
					bNeedStore = true;
				}
				if(bindingArr.length == 1){
				    fDesc.link = false;
				}
				if(bindingArr.length >= 2){
				    var first = bindingArr[0].type;
				    for(var i = 1; i < bindingArr.length; i++){
				        if(first !== bindingArr[i].type){
				            this.removeFields(fName);
				        }
				    }
				}
			}
			for(var i = 0; i < fieldsToRemove.length; i++){
				if(this.fields[fieldsToRemove[i]]){
					delete this.fields[fieldsToRemove[i]];
				}
			}
			
			return bNeedStore;
		},
		
		updateDataProviderNodePosition: function(pId, pt){
			this.load();
			var provider = this.getProviderById(pId);
			this.dataProviderPositions[provider.getId()] = pt;
			this.store();
		},

		updateDataProviderNodeSize: function(pId, size){
			this.load();
		    this.dataProviderSizes[pId] = size;
			this.store();
		},
		
		addField: function(pId, pField){
			this.load();
			var provider = this.getProviderById(pId);
			var pfName = pField;
			var fMap = provider.extractFields({comment:true, type:true, nativeType:true});
			var pType = fMap[pField].nativeType;
			var cType = fMap[pField].type;

			if(provider.getOption('useComments')){
			    var alias = provider.getOption('commentField');

			    if(alias){
			        if(JSB.isString(fMap[pField].comment[alias]) && fMap[pField].comment[alias].length > 0){
			            pfName = fMap[pField].comment[alias];
			        }
			    } else {
                    if(JSB.isString(fMap[pField].comment) && fMap[pField].comment.length > 0){
                        pfName = fMap[pField].comment;
                    }
			    }
			}
			var nameCandidate = this.prepareFieldName(pfName);
			if(this.fields[nameCandidate]){
				// lookup appropriate name
				for(var cnt = 2; ; cnt++){
					nameCandidate = this.prepareFieldName(pfName) + cnt;
					if(!this.fields[nameCandidate]){
						break;
					}
				}
			}
			var order = Object.keys(this.fields).length;
			this.fields[nameCandidate] = {
			    comment: fMap[pField].comment,
				field: nameCandidate,
				type: cType,
				binding: [],
				link: false,
				order: order
			};
			this.fields[nameCandidate].binding.push({
				provider: provider,
				field: pField,
				type: pType
			});
			this.fieldCount = Object.keys(this.fields).length;
			this.removeMaterialization();
			this.invalidate();
			this.store();
			this.doSync();
			return this.fields[nameCandidate];
		},

		linkFields: function(fields){
			this.load();
            var nFields = [], nField, fType;

		    for(var i = 0; i < fields.length; i++){
		        var f = this.fields[fields[i].field];

		        if(f.binding.length > 1){   // key field
		            if(!nField){
		                nField = f;
		            } else {
		                for(var j = 0; j < f.binding.length; j++){
                            nFields.push({
                                field: f.binding[j].field,
                                type: f.binding[j].type,
                                provider: f.binding[j].provider
                            });
		                }
		                delete this.fields[fields[i].field];
		            }
		        } else {
		        	if(!fType){
		        		fType = f.type;
		        	}
                    nFields.push({
                        field: f.binding[0].field,
                        type: f.binding[0].type,
                        provider: f.binding[0].provider
                    });
		            delete this.fields[fields[i].field];
		        }
		    }

		    if(!nField){
                var nField = this.fields[nFields[0].field] = {
                    binding: [],
                    field: nFields[0].field,
                    link: true,
                    type: fType
                };
		    }

		    for(var i = 0; i < nFields.length; i++){
		        nField.binding.push(nFields[i]);
		    }

		    this.fieldCount = Object.keys(this.fields).length;
		    this.invalidate();
		    this.store();
            this.doSync();

            return nField;
		},

		renameField: function(oldName, newName){
			this.load();
			if(!this.fields[oldName]){
				throw new Error('Field not existed: ' + oldName);
			}
			if(oldName == newName){
				return this.fields[oldName];	
			}
			var n = newName.trim();
			if(n.length == 0){
				return false;
			}
			if(/$\d/.test(n)){
				return false;
			}
			if(this.fields[n]){
				return false;
			}
			
			// update fields
			this.fields[n] = this.fields[oldName];
			delete this.fields[oldName];
			this.fields[n].field = n;
			
			// update materialization
			if(this.materialization && this.materialization.fields && this.materialization.fields[oldName]){
				this.materialization.fields[n] = this.materialization.fields[oldName];
				delete this.materialization.fields[oldName];
				this.materialization.fields[n].field = n;
			}
			this.invalidate();
			this.store();
			this.doSync();
			return this.fields[n];
		},

		removeFields: function(fields){
			this.load();
		    if(!JSB.isArray(fields)){
		        fields = [fields];
		    }

		    var nFields = {
		        add: [],
		        uncheck: []
		    };

		    for(var i = 0; i < fields.length; i++){
                if(!this.fields[fields[i]]){
                    continue;
                }

                var oldField = JSB.clone(this.fields[fields[i]]);
                delete this.fields[fields[i]];

                if(oldField.binding.length > 1){ // key field
                    for(var i = 0; i < oldField.binding.length; i++){
                        var f = this.addField(oldField.binding[i].provider.getId(), oldField.binding[i].field);

                        nFields.add.push(f);
                    }
                } else {
                    nFields.uncheck.push(oldField);
                }
		    }

			this.fieldCount = Object.keys(this.fields).length;

			// remove materialization
			this.removeMaterialization();
			this.invalidate();
			this.store();
			this.doSync();

			return nFields;
		},

		setDefaultFields: function(fields){
			this.load();
		    this.defaultFields = fields;
            this.store();
            this.doSync();
		},
		
		addSlice: function(selectedFields, isMerge){
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

			// add default fields or selected fields
			if(selectedFields && Object.keys(selectedFields).length > 0){
			    if(isMerge && this.defaultFields){
                    var q = {};
                    for(var i in this.defaultFields){
                        q[i] = i;
                    }
                    for(var i in selectedFields){
                        q[i] = i;
                    }
                    slice.setQuery({
                        $select: q
                    });
			    } else {
                    var q = {};
                    for(var i in selectedFields){
                        q[i] = i;
                    }
                    slice.setQuery({
                        $select: q
                    });
			    }
			} else if(this.defaultFields){
                var q = {};
                for(var i in this.defaultFields){
                    q[i] = i;
                }
                slice.setQuery({
                    $select: q
                });
			}

			this.slices[sId] = slice;
			this.sliceCount = Object.keys(this.slices).length;
			this.addChildEntry(slice);
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
		
		getManagedFields: function(){
			this.load();
			if(this.materialization && this.materialization.fields){
				return this.materialization.fields;
			}
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
		
		isMaterializing: function(){
			this.load();
			return this.materializing;
		},
		
		isMaterialized: function(){
			this.load();
			return (this.materialization && Object.keys(this.materialization).length > 0 ? true: false);
		},
		
		getMaterializationInfo: function(){
			this.load();
			return {
				materialization: this.materialization,
				materializing: this.materializing
			};
		},
		
		startMaterialization: function(database){
			this.load();
			if(!database){
				return;
/*				// chose database from currently existed materialization
				if(this.materialization && this.materialization.dataProviderEntry){
					database = this.materialization.dataProviderEntry.getParent();
				} else {
					return;
				}*/
			}
			this.materializing = true;
			this.materializer = MaterializationEngine.createMaterializer(database);
			
			// run materialization on deferred manner
			JSB.defer(function(){
				JSB.getLocker().lock('materialization_' + $this.getId());
				
				function checkStop(){
					if($this.stopMaterializing){
						$this.materializing = false;
						$this.stopMaterializing = false;
						$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
						return true;
					}
					return false;
				}
				
				var materializationDesc = {
					tables: {},
					fields: {}
				};
				var tableDescMap = {};
				var tableFieldMap = {};
				
				function destroyCurrentMaterialization(){
					for(var tId in materializationDesc.tables){
						if(materializationDesc.tables[tId].table){
							$this.materializer.removeTable(materializationDesc.tables[tId].table);
						}
						if(materializationDesc.tables[tId].dataProvider){
							materializationDesc.tables[tId].dataProvider.destroy();
						}
					}
				}
				
				try {
					$this.publish('DataCube.Model.Cube.status', {status: 'Подготовка к материализации', success: true}, {session: true});
					
					// create table list description
					var conflictMap = {};
					for(var fName in $this.fields){
						var fDesc = $this.fields[fName];
						var lastType = null, lastProvider = null, lastField = null;
						for(var i = 0; i < fDesc.binding.length; i++){
							var pDesc = fDesc.binding[i];
							if(!lastType){
								lastType = pDesc.type;
								lastProvider = pDesc.provider;
								lastField = pDesc.field;
							} else {
								if(pDesc.type != lastType){
									if(!conflictMap[fName]){
										conflictMap[fName] = [{field: lastField, type: lastType, provider: lastProvider}];
									}
									conflictMap[fName].push({
										field: pDesc.field,
										type: pDesc.type,
										provider: pDesc.provider
									});
								}
							}
							var pId = pDesc.provider.getId();
//							var tId = 'union_' + pId;
							var tId = 'union';
							if(pDesc.provider.getMode() != 'union'){
								tId = 'join_' + pId;
							}
							if(!materializationDesc.tables[tId]){
								materializationDesc.tables[tId] = {
									table: null,
									dataProvider: null,
									dataProviderEntry: null,
									mode: pDesc.provider.getMode(),
									indexes: {}
								};
								tableFieldMap[tId] = {};
							}
							tableFieldMap[tId][fName] = fDesc.type;
						}
					}
					if(Object.keys(conflictMap).length > 0){
						// generate error
						var errorStr = 'В кубе "' + $this.getName() + '" найдены конфликты типов у полей:\n';
						for(var fn in conflictMap){
							errorStr += '* "' + fn + '": \n';
							for(var c = 0; c < conflictMap[fn].length; c++){
								errorStr += '\t' + conflictMap[fn][c].provider.getName() + '.' + conflictMap[fn][c].field + '(' + conflictMap[fn][c].type + ')\n'
							}
						}
						throw new Error(errorStr);
					}
					var tIdx = 1;
					for(var tId in materializationDesc.tables){
						var fields = tableFieldMap[tId];
						var suggestedName = 'cube_' + $this.getId() + '_' + (materializationDesc.tables[tId].mode == 'union' ? ('u' + tIdx) : ('j' + tIdx) );
						tIdx++;
/*						if(materializationDesc.tables[tId].mode != 'union'){
							tIdx++;	
						}
*/						
						// create table
						var tableDesc = $this.materializer.createTable(suggestedName, fields);
						materializationDesc.tables[tId].table = tableDesc.table;
						tableDescMap[tId] = tableDesc;
						
						// generate query
						var q = {$select:{}};
						for(var fName in fields){
							q.$select[fName] = fName;
						}

						// transmit data
						var iterator = $this.queryEngine.query(q, {});
						var batch = [];
						var lastStatusTimestamp = 0;
						var lastCount = 0;
						for(var i = 0; ; i++){
/*							
							if(i > 5000){
								break;
							}
*/							
							
							var el = null;
							try {
								el = iterator.next();
							}catch(e){
								el = null;
							}
							if(!el){
								break;
							}
							
							if(!JSB.isObject(el)){
								continue;
							}
	
							// translate data into new fields
							var nEl = {};
							var bIncorrect = false;
							for(var f in el){
								if(!fields[f]){
									continue;
								}
								var val = el[f];
								
								// check correspondence val to it's type
								switch(fields[f].toLowerCase()){
								case 'string':
									if(!JSB.isNull(val) && !JSB.isString(val)){
										val = '' + val;
									}
									break;
								case 'integer':
									if(!JSB.isNull(val) && !JSB.isInteger(val)){
										val = parseInt(val);
										if(JSB.isNaN(val)){
											bIncorrect = true;
										}
									}
									break;
								case 'float':
								case 'double':
									if(!JSB.isNull(val) && !JSB.isFloat(val)){
										val = parseFloat(val);
										if(JSB.isNaN(val)){
											bIncorrect = true;
										}
									}
									break;
								case 'boolean':
									if(!JSB.isNull(val) && !JSB.isBoolean(val)){
										if(val.toLowerCase() == 'true'){
											val = true;
										} else {
											val = false;
										}
									}
									break;
								case 'date':
									if(!JSB.isNull(val) && !JSB.isDate(val)){
										val = Date.parse(val);
										if(JSB.isNaN(val)){
											bIncorrect = true;
										} else {
											val = new Date(val);
										}
									}
									break;
								case 'array':
									break;
								case 'object':
									break;
								}
								
								nEl[tableDesc.fieldMap[f]] = val;
							}
							
							if(!bIncorrect && Object.keys(nEl).length > 0){
								batch.push(nEl);
							}
							
							if(batch.length >= 100){
								$this.materializer.insert(materializationDesc.tables[tId].table, batch);
								batch = [];
								
								var curTimestamp = Date.now();
								if(curTimestamp - lastStatusTimestamp > 3000 && i - lastCount > 1000){
									lastStatusTimestamp = curTimestamp;
									lastCount = i;
									if(checkStop()){
										try {
											iterator.close();
										} catch(e){}
										destroyCurrentMaterialization();
										return;
									}
									
									$this.publish('DataCube.Model.Cube.status', {status: 'Сохранено записей: ' + (i + 1), success: true}, {session: true});
								}
	
							}
						}
						
						if(batch.length > 0){
							$this.materializer.insert(materializationDesc.tables[tId].table, batch);
						}
						
						try {
							iterator.close();
						} catch(e){}
						
						if(checkStop()){
							destroyCurrentMaterialization();
							return;
						}
					}
					
					
					
					// prepare materialization object
					$this.publish('DataCube.Model.Cube.status', {status: 'Обновление схемы базы материализации', success: true}, {session: true});
					database.extractScheme();
					var chEntries = database.getChildren();
					$this.publish('DataCube.Model.Cube.status', {status: 'Обновление структуры куба', success: true}, {session: true});
					for(var tId in materializationDesc.tables){
						var source = null;
						for(var chId in chEntries){
							var tableSource = chEntries[chId];
							var tDesc = tableSource.getDescriptor();
							if(tDesc.name == materializationDesc.tables[tId].table){
								source = tableSource;
								break;
							}
						}
						if(!source){
							throw new Error('Internal error: unable to find materialization table');
						}
						var providerDesc = DataProviderRepository.queryDataProviderInfo(source);
						var providerJsb = JSB.get(providerDesc.pType);
						if(!providerJsb){
							throw new Error('Unable to find provider bean: ' + providerDesc.pType);
						}
						var ProviderCls = providerJsb.getClass();
						var pId = $this.getId() + '|dp_' + JSB.generateUid();
						materializationDesc.tables[tId].dataProvider = new ProviderCls(pId, source, $this, JSB.merge({},providerDesc,{mode:materializationDesc.tables[tId].mode}));
						materializationDesc.tables[tId].dataProviderEntry = source;
						var providerFields = materializationDesc.tables[tId].dataProvider.extractFields();
						for(var fName in $this.fields){
							if(!materializationDesc.fields[fName]){
								materializationDesc.fields[fName] = {
									field: fName,
									type: $this.fields[fName].type,
									binding: []
								};
							}
							var fDesc = materializationDesc.fields[fName];
							var pName = tableDescMap[tId].fieldMap[fName];
							if(pName && providerFields[pName]){
								fDesc.binding.push({
									provider: materializationDesc.tables[tId].dataProvider,
									field: pName,
									type: providerFields[pName].nativeType
								});
								continue;
							}
						}
					}
					$this.updateIndexes(materializationDesc);
					materializationDesc.lastUpdate = Date.now();
					var oldMaterialization = $this.materialization;
					$this.materialization = materializationDesc;
					
					if(oldMaterialization && oldMaterialization.tables){
						for(var oldId in oldMaterialization.tables){
							if(oldMaterialization.tables[oldId].dataProvider){
								oldMaterialization.tables[oldId].dataProvider.destroy();
							}
						}
					}
					$this.materializing = false;
					$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
					
				} catch(e){
					for(var tId in materializationDesc.tables){
						if(materializationDesc.tables[tId].table){
							try {
								$this.materializer.removeTable(materializationDesc.tables[tId].table);	
							}catch(e){}
						}
					}
					$this.materializing = false;
					$this.publish('DataCube.Model.Cube.status', {status: e.message, success: false}, {session: true});
					throw e;
				} finally {
					$this.materializer.destroy();
					$this.materializer = null;
					JSB.getLocker().unlock('materialization_' + $this.getId());
				}
				
				$this.store();
				$this.doSync();
			});
			
		},
		
		stopMaterialization: function(){
			$this.stopMaterializing = true;
		},
		
		removeMaterialization: function(){
			this.load();
			var bLocked = false;
			if(!this.materialization || Object.keys(this.materialization).length == 0){
				return;
			}
			$this.publish('DataCube.Model.Cube.status', {status: 'Удаление материализации', success: true}, {session: true});
			JSB.getLocker().lock('materialization_' + $this.getId());
			var materialization = $this.materialization;
			$this.materialization = {};
			var materializer = null;
			
			try {
				if(materialization && materialization.tables && Object.keys(materialization.tables).length > 0){
					for(var tId in materialization.tables){
						if(materialization.tables[tId].dataProvider){
							materialization.tables[tId].dataProvider.destroy();
						}
						
						if(materialization.tables[tId].dataProviderEntry){
							var sourceEntry = materialization.tables[tId].dataProviderEntry;
							// remove table
/*							
							if(materialization.tables[tId].table){
								var database = sourceEntry.getParent();
								materializer = MaterializationEngine.createMaterializer(database);
								materializer.removeTable(materialization.tables[tId].table);
							}
							sourceEntry.remove();
*/							
						}
					}
				}
			} finally {
				if(materializer){
					materializer.destroy();
				}
				$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
				JSB.getLocker().unlock('materialization_' + $this.getId());	
				$this.store();
				$this.doSync();
			}
		},
		
		updateIndexes: function(materialization){
			this.load();
			var bLocked = false;
			var bCreatedMaterializer = false;
			var bChanged = false;
			
			if(!materialization){
				JSB.getLocker().lock('materialization_' + $this.getId());
				bLocked = true;
				materialization = this.materialization;
				$this.materializing = true;
			}
			
			var matFields = materialization.fields;

			function extractIndexesForSlice(slice){
				var q = slice.getQuery();
				
				function parseObject(obj){
					var indexMap = {};
					if(!JSB.isObject(obj)){
						return null;
					}
					
					for(var fObj in obj){
						if(fObj == '$groupBy'){
							// parse groupBy
							var groupByObj = obj[fObj];
							if(!JSB.isArray(groupByObj)){
								groupByObj = [groupByObj];
							}
							var fStr = '';
							var indexDesc = {};
							for(var i = 0; i < groupByObj.length; i++){
								var f = groupByObj[i];
								if(!matFields[f]){
									continue;
								}
								if(fStr.length > 0){
									fStr += '|';
								}
								fStr += f;
								indexDesc[f] = true;
							}
							var idxName = 'idx_' +  MD5.md5($this.getId() + '_' + fStr);
							indexMap[idxName] = indexDesc;
						} else if(fObj == '$filter') {
							// parse filter
							if(!JSB.isObject(obj[fObj])){
								continue;
							}
							var fStr = '';
							var indexDesc = {};
							for(var f in obj[fObj]){
								if(!matFields[f]){
									continue;
								}
								if(fStr.length > 0){
									fStr += '|';
								}
								fStr += f;
								indexDesc[f] = true;
							}
							var idxName = 'idx_' + MD5.md5($this.getId() + '_' + fStr);
							indexMap[idxName] = indexDesc;
						} else if(obj[fObj] && JSB.isObject(obj[fObj]) && Object.keys(obj[fObj]).length > 0){
							var sMap = parseObject(obj[fObj]);
							if(sMap && Object.keys(sMap).length > 0){
								JSB.merge(indexMap, sMap);
							}
						} else if(obj[fObj] && JSB.isArray(obj[fObj])){
							for(var i = 0; i < obj[fObj].length; i++){
								var sMap = parseObject(obj[fObj][i]);
								if(sMap && Object.keys(sMap).length > 0){
									JSB.merge(indexMap, sMap);
								}
							}
						}
					}

					return indexMap;
				}
				
				return parseObject(q);
			}
			
			try {
				var materializer = this.materializer;
				if(!materializer){
					if(Object.keys(materialization.tables).length == 0){
						throw new Error('Materialization contains no tables to build index on');
					}
					var database = materialization.tables[Object.keys(materialization.tables)[0]].dataProviderEntry.getParent();
					materializer = MaterializationEngine.createMaterializer(database);
					bCreatedMaterializer = true;
				}

				$this.publish('DataCube.Model.Cube.status', {status: 'Обновление индексов материализации', success: true}, {session: true});
				var cubeIdxMap = {};
				// generate single indexes
				for(var f in matFields){
					if(!matFields[f].binding || matFields[f].binding.length < 2){
						continue;
					}
					var idxName = 'idx_' + MD5.md5($this.getId() + '_' + f);
					var indexDesc = {};
					indexDesc[f] = true;
					cubeIdxMap[idxName] = indexDesc;
				}
				// iterate over slices
				for(var sId in this.slices){
					var slice = this.slices[sId];
					var indexes = extractIndexesForSlice(slice);
					if(indexes && Object.keys(indexes).length > 0){
						JSB.merge(cubeIdxMap, indexes);
					}
				}
				
				// adding new indexes
				for(var tId in materialization.tables){

					var tableIdxMap = {};
					var tDesc = materialization.tables[tId];
					for(var cubeIdxName in cubeIdxMap){
						var cubeIdxDesc = cubeIdxMap[cubeIdxName];
						var tableIdxDesc = {};
						var tableIdxStr = tDesc.table;
						for(var fName in cubeIdxDesc){
							if(materialization.fields[fName] && materialization.fields[fName].binding && materialization.fields[fName].binding.length > 0){
								for(var i = 0; i < materialization.fields[fName].binding.length; i++){
									if(materialization.fields[fName].binding[i].provider == tDesc.dataProvider){
										var pField = materialization.fields[fName].binding[i].field;
										tableIdxDesc[pField] = cubeIdxDesc[fName];
										if(tableIdxStr.length > 0){
											tableIdxStr += '|';
										}
										tableIdxStr += fName;
										break;
									}
								}
							}
						}
						var tableIdxName = 'idx_' +  MD5.md5($this.getId() + '_' + tableIdxStr);
						if(Object.keys(tableIdxDesc).length == 0){
							continue;
						}
						
						tableIdxMap[tableIdxName] = tableIdxDesc;
					}
					
					var indexCount = Object.keys(tableIdxMap).length;
					var curIndexPos = 0;
					var lastPcnt = -1;

					for(var idxName in tableIdxMap){
						if(tDesc.indexes && tDesc.indexes[idxName]){
							continue;
						}
						var idxDesc = tableIdxMap[idxName];
						
						if(Object.keys(idxDesc).length > 0){
							try {
								materializer.createIndex(tDesc.table, idxName, idxDesc);
								if(!tDesc.indexes){
									tDesc.indexes = {};
								}
								tDesc.indexes[idxName] = tableIdxMap[idxName];
								bChanged = true;
							} catch(e){
								JSB.getLogger().warn('Failed to create index ' + idxName + ' for ' + JSON.stringify(idxDesc));
							}
						}
						
						curIndexPos++;
						var pcnt = Math.floor(curIndexPos * 100 / indexCount);
						if(lastPcnt != pcnt){
							$this.publish('DataCube.Model.Cube.status', {status: 'Создание новых индексов: ' + pcnt + '%', success: true}, {session: true});
							lastPcnt = pcnt;
						}
						
					}
					
					// remove missing indexes
					$this.publish('DataCube.Model.Cube.status', {status: 'Удаление старых индексов', success: true}, {session: true});
					var idxToRemove = [];
					if(tDesc.indexes){
						for(var idxName in tDesc.indexes){
							if(!tableIdxMap[idxName]){
								idxToRemove.push(idxName);
							}
						}
					}
					for(var i = 0; i < idxToRemove.length; i++){
						var idxName = idxToRemove[i];
						try {
							materializer.removeIndex(tDesc.table, idxName);
							delete tDesc.indexes[idxName];
							bChanged = true;
						}catch(e){
							JSB.getLogger().warn('Failed to remove index ' + idxName + ' with ' + JSON.stringify(materialization.indexes[idxName]));
						}
					}

				}
				
			} finally {
				if(bCreatedMaterializer){
					materializer.destroy();
				}
				if(bLocked){
					$this.materializing = false;
					JSB.getLocker().unlock('materialization_' + $this.getId());
					if(bChanged){
						$this.store();
						$this.doSync();
					}
					$this.publish('DataCube.Model.Cube.status', {status: null, success: true}, {session: true});
				}
			}
		},
		
		renameSlice: function(sId, newName){
			this.load();
			var slice = this.getSliceById(sId);
			if(slice.getName() == newName){
				return slice;
			}
			for(var ssId in this.slices){
				if(this.slices[ssId].getName() == newName){
					return false;
				}
			}
			slice.setName(newName);
			return slice;
		},
		
		updateSliceSettings: function(sId, desc){
			this.load();
			var slice = this.getSliceById(sId);
			this.renameSlice(sId, desc.name);
			if(desc.query){
				slice.setQuery(desc.query);
			}
			if(desc.queryParams){
			    slice.setQueryParams(desc.queryParams);
			}
			this.store();
			this.doSync();
		},
		
		updateSliceNodePosition: function(sId, pt){
			this.load();
			var slice = this.getSliceById(sId);
			this.slicePositions[sId] = pt;
			this.store();
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
			JSB.defer(function(){
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
			}, 300, 'invalidate_' + this.getId());
		},
		
		updateCache: function(){
			JSB.defer(function(){
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