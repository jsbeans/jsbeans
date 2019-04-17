{
	$name: 'DataCube.Query.QueryCache',
	$session: false,
	
	$server: {
		$require: ['DataCube.Query.QueryCacheController', 
		           'JSB.Crypt.MD5',
		           'JSB.Store.StoreManager',
		           'JSB.Store.Sql.JDBC'],
		
		cube: null,
		owner: null,
		loaded: false,
		storeQueued: false,
		batchSize: 100,
		closeIteratorTimeout: 10000,
		invalidateInterval: 0,
		updateInterval: 0,
		cacheMap: {},
		cacheStore: null,
		cacheSize: 4096,
		limitRows: 0,
		
		$constructor: function(owner, cube, opts){
			$base();
			this.cube = cube;
			this.owner = owner;
			
			QueryCacheController.registerCache(this);
			this.updateOptions(opts);
		},
		
		destroy: function(){
			$this.clear();
			QueryCacheController.unregisterCache(this);
			$base();
		},
		
		updateOptions: function(opts){
			this.options = opts || {};
			if(Config.has('datacube.queryCache.batchSize')){
				this.batchSize = Config.get('datacube.queryCache.batchSize');
			}
			if(Config.has('datacube.queryCache.closeIteratorTimeout')){
				this.closeIteratorTimeout = Config.get('datacube.queryCache.closeIteratorTimeout');
			}
			if(opts && opts.cacheSize){
				this.cacheSize = opts.cacheSize;
			}
			if(opts && opts.limitRows){
				this.limitRows = opts.limitRows;
			}
		},
		
		getOwner: function(){
			return this.owner;
		},
		
		getCube: function(){
			return this.cube;
		},
		
		load: function(){
			if(this.loaded){
				return;
			}
			this.lock('DataCube.Query.QueryCache.load');
			
			try {
				if(this.loaded){
					return;
				}
				this.loaded = true;
				if(this.owner.existsArtifact('.querycache')){
					var snapshot = this.owner.loadArtifact('.querycache', {silent:true});
					if(snapshot){
						// parse snapshot
						for(var qId in snapshot){
							$this.lock('cache_' + qId);
							var qDesc = snapshot[qId];
							if(qDesc){
								$this.cacheMap[qId] = {
									qId: qId,
									query: qDesc.query,
									params: qDesc.params,
									complete: qDesc.complete,
									lastUpdated: qDesc.lastUpdated,
									lastUsed: qDesc.lastUsed,
									cells: qDesc.cells,
									rows: qDesc.rows,
									cacheTable: qDesc.cacheTable,
									updateSuffix: qDesc.updateSuffix,
									dataHash: qDesc.dataHash,
									it: null,
									provider: null
								}
							}
							$this.unlock('cache_' + qId);
						}
					}
				}
				
			} catch(e){
				JSB.getLogger().warn(e);
			} finally {
				this.unlock('DataCube.Query.QueryCache.load');
			}
		},
		
		store: function(){
			if(this.storeQueued){
				return;
			}
			this.storeQueued = true;
			this.load();
			JSB.defer(function(){
				$this.lock('DataCube.Query.QueryCache.store');
				$this.storeQueued = false;
				
				try {
					// prepare artifact
					var art = {};
					var idArr = Object.keys($this.cacheMap);
					
					for(var i = 0; i < idArr.length; i++){
						var qId = idArr[i];
						$this.lock('cache_' + qId);
						try {
							var qDesc = $this.cacheMap[qId];
							if(qDesc && !qDesc.provider){
								art[qId] = {
									qId: qId,
									query: qDesc.query,
									params: qDesc.params,
									complete: qDesc.complete,
									lastUpdated: qDesc.lastUpdated,
									lastUsed: qDesc.lastUsed,
									cells: qDesc.cells,
									rows: qDesc.rows,
									cacheTable: qDesc.cacheTable,
									updateSuffix: qDesc.updateSuffix,
									dataHash: qDesc.dataHash
								};
							}
						} finally {
							$this.unlock('cache_' + qId);
						}
					}
					if(Object.keys(art).length > 0){
						$this.owner.storeArtifact('.querycache', art, {silent:true});
					} else {
						if($this.owner.existsArtifact('.querycache')){
							$this.owner.removeArtifact('.querycache', {silent:true});
						}
					}
				} catch(e){
					JSB.getLogger().warn(e);
				} finally {
					$this.unlock('DataCube.Query.QueryCache.store');
				}
			}, 15000, 'DataCube.Query.QueryCache.store.' + this.getId());
		},
		
		generateQueryId: function(query, provider){
			return MD5.md5(JSB.stringify(query) + (provider ? '_' + provider.getId() : ''));
		},
		
		clear: function(){
			this.load();
			for(var qId in this.cacheMap){
				if(this.cacheMap[qId].it){
					try {
						this.cacheMap[qId].it.close();
						this.removeCacheTable(this.cacheMap[qId]);
					} catch(e){}
					this.cacheMap[qId].it = null;
				}
			}
			this.cacheMap = {};
			this.store();
		},
/*		
		invalidate: function(bForce){
			this.load();
			var idsToRemove = [];
			var now = Date.now();
			for(var qId in this.cacheMap){
				var qDesc = this.cacheMap[qId];
				if((qDesc.lastUsed && now - qDesc.lastUsed > $this.invalidateInterval) || bForce){
					idsToRemove.push(qId);
				}
			}
			for(var i = 0; i < idsToRemove.length; i++){
				var qId = idsToRemove[i];
				$this.lock('cache_' + qId);
				if(this.options.onInvalidate && JSB.isFunction(this.options.onInvalidate)){
					if(!this.options.onInvalidate.call(this, this.cacheMap[qId])){
						continue;
					}
				}
				if(this.cacheMap[qId].it){
					try {
						this.cacheMap[qId].it.close();
					} catch(e){}
					this.cacheMap[qId].it = null;
				}
				delete this.cacheMap[qId];
				$this.unlock('cache_' + qId);
			}
			this.store();
		},
*/		
		update: function(){
			if($this._updating){
				return;
			}
			$this._updating = true;
			this.load();
			var now = Date.now();
			var bChanged = false;
			
			for(var qId in this.cacheMap){
				if(this.options.onUpdate && JSB.isFunction(this.options.onUpdate)){
					if(!this.options.onUpdate.call(this, this.cacheMap[qId])){
						continue;
					}
				}
				
				var qExistedDesc = $this.cacheMap[qId];
				
				$this.lock('cacheFill_' + qId);
				try {
					// close existed iterator
					JSB.cancelDefer($this.getId() + 'closeIterator_' + qId);
					if(qExistedDesc.it){
						try { qExistedDesc.it.close(); } catch(e){}
						qExistedDesc.it = null;
					}
					
					// generate shadow desc
					var qNewDesc = {
						qId: qId,
						query: qExistedDesc.query,
						params: qExistedDesc.params,
						provider: qExistedDesc.provider,
						complete: false,
						lastUpdated: qExistedDesc.lastUpdated,
						lastUsed: qExistedDesc.lastUsed,
						updateSuffix: JSB.isDefined(qExistedDesc.updateSuffix) ? qExistedDesc.updateSuffix + 1 : 2, 
						it: null,
						cells: 0,
						rows: 0,
						dataHash: ''
					};
					
					// fill shadow buffer with the same length
					while(!qNewDesc.complete && qNewDesc.rows < qExistedDesc.rows){
						$this._fillNextBatch(qNewDesc);
					}
					
					qNewDesc.lastUpdated = Date.now();
					
					// close new iterator
					if(qNewDesc.it){
						JSB.cancelDefer($this.getId() + 'closeIterator_' + qId);
						try {
							qNewDesc.it.close();
						} catch(e){}
						qNewDesc.it = null;
					}
					
					$this.lock('cache_' + qId);
					// substitute data
					$this.cacheMap[qId] = qNewDesc;
					$this.unlock('cache_' + qId);
					
					if(qNewDesc.dataHash != qExistedDesc.dataHash){
						bChanged = true;
					}
					
				} finally {
					$this.unlock('cacheFill_' + qId);
				}
				
				// remove prev cacheTable
				$this.removeCacheTable(qExistedDesc);
			}
			
			$this.store();
			$this._updating = false;
			if(bChanged){
				$this.publish('DataCube.Query.QueryCache.updated');
			}
		},
		
		getCacheMap: function(){
			return this.cacheMap;
		},
		
		copyFrom: function(otherCache, query){
			if(!otherCache || !query){
				return;
			}
			this.load();
			otherCache.load();
			var qId = $this.generateQueryId(query);
			var otherDesc = otherCache.getCacheMap()[qId];
			if(!otherDesc){
				return;
			}
			
			$this.lock('cache_' + qId);
			
			try {
				var curDesc = $this.cacheMap[qId];
				if(curDesc){
					$this.removeCacheTable(curDesc);
					if(curDesc.it){
						curDesc.it.close();
					}
				}
			
				$this.cacheMap[qId] = {
					qId: qId,
					query: otherDesc.query,
					params: otherDesc.params,
					provider: otherDesc.provider,
					complete: otherDesc.complete,
					lastUpdated: otherDesc.lastUpdated,
					lastUsed: Date.now(),
					it: null,
					cells: 0,
					rows: 0
				};
				
				// copy data
				if(otherDesc.rows > 0){
					var otherRows = otherDesc.rows;
					var cacheIt = otherCache.openTableIterator(otherDesc);
					var rows = [];
					try {
						for(var i = 0; i < otherRows; i++){
							var el = cacheIt.next();
							if(!el){
								break;
							}
							rows.push(el.DATA);
						}
					} finally {
						try { cacheIt.close(); } catch(e){}	
					}
					
					$this.appendTableRows($this.cacheMap[qId], rows, 0, true);
				}
				
			} finally {
				$this.unlock('cache_' + qId);
			}
			$this.store();
		},
		
		copyTo: function(otherCache, query){
			if(!otherCache || !query){
				return;
			}
			otherCache.copyFrom(this, query);
		},
		
		_fillNextBatch: function (desc, position){
			var written = 0;
			if(desc.complete){
				return written;
			}
			if(!position){
				position = 0;
			}
			
			JSB.cancelDefer($this.getId() + 'closeIterator_' + desc.qId);
			
			if(!desc.it){
				desc.it = $this.cube.executeQuery(desc.query, desc.params, desc.provider);
				desc.lastUpdated = Date.now();
				if(!desc.it){
					debugger;
					throw new Error('Failed to execute query');
				}
				// do skip
				for(var i = 0; i < position; i++){
					if(!desc.it){
						debugger;
					}
					var el = desc.it.next();
					if(!el){
						desc.complete = true;
						try { desc.it.close(); } catch(e){}
						desc.it = null;
						break;
					}
				}
			}
			if(!desc.complete){
				var rows = [];
				for(var i = 0; i < $this.batchSize; i++){
					var el = desc.it.next();
					if(!el || $this.isDestroyed()){
						try { desc.it.close(); } catch(e){}
						desc.it = null;
						desc.complete = true;
						break;
					}
					rows.push(el);
					desc.cells += Object.keys(el).length;
					desc.rows++;
				}
				written = $this.appendTableRows(desc, rows, position);
				if(written > 0){
					$this.store();
				}
			}
			if(!desc.complete){
				JSB.defer(function(){
					if(desc.it){
						try { desc.it.close(); } catch(e){}
						desc.it = null;
					}
				}, $this.closeIteratorTimeout, $this.getId() + 'closeIterator_' + desc.qId);
			}
			return written;
		},
		
		ensureCacheStore: function(){
			if(this.cacheStore){
				return this.cacheStore;
			}
			this.lock('cacheStore');
			try {
				if(this.cacheStore){
					return this.cacheStore;
				}
				var artDir = this.owner.getArtifactStore().getArtifactDir(this.owner);
				
				this.cacheStore = StoreManager.getStore({
					name: '_cacheStore_' + this.owner.getId(),
					type: 'JSB.Store.Sql.SQLStore',
					url: 'jdbc:h2:' + FileSystem.join(artDir, '.queryCacheData') + ';CACHE_SIZE=' + this.cacheSize
				});
			} finally {
				this.unlock('cacheStore');
			}
			return this.cacheStore;
		},
		
		constructCacheTableName: function(desc){
			if(!desc.cacheTable){
				var tName = '_cacheTable_' + desc.qId;
				if(desc.updateSuffix){
					tName += '_' + desc.updateSuffix;
				}
				desc.cacheTable = tName;
			}
			return desc.cacheTable;
		},
		
		ensureCacheTable: function(desc){
			var tableName = this.constructCacheTableName(desc);
			var store = this.ensureCacheStore();
			var connWrap = store.getConnection();
			var connection = connWrap.get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, tableName, null);
				var curTabRecord = rs.next();
				if(!curTabRecord){
					$this.lock('ensureCacheTable_' + desc.qId);
					try {
						var rs = databaseMetaData.getTables(null, null, tableName, null);
						if(rs.next()){
							return;
						}
						// create table
						var sql = 'create table "' +tableName + '" ( "POS" int8, "DATA" nvarchar )';
						JDBC.executeUpdate(connection, sql);
						// create index
						sql = 'create index "' + tableName + '_idx " on "' + tableName + '" ( "POS" )';
						JDBC.executeUpdate(connection, sql);
						
						desc.complete = false;
					} finally {
						$this.unlock('ensureCacheTable_' + desc.qId);
					}
				}
			} finally {
				try {connWrap.close();} catch(e){}
				
			}
		},
		
		removeCacheTable: function(desc){
			var tableName = this.constructCacheTableName(desc);
			var store = this.ensureCacheStore();
			var connWrap = store.getConnection();
			var connection = connWrap.get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, tableName, null);
				if(!rs.next()){
					return;
				}
				JDBC.executeUpdate(connection, 'drop table "' + tableName + '"');
			} finally {
				try {connWrap.close();} catch(e){}
			}
		},

		openTableIterator: function(desc, pos){
			if(!pos){
				pos = 0;
			}
			var tableName = this.constructCacheTableName(desc);
			var store = this.ensureCacheStore();
			this.ensureCacheTable(desc);
			var connWrap = store.getConnection();
			var connection = connWrap.get();
			var sql = 'select "POS", "DATA" from "' + tableName + '" where "POS" >= ' + pos + ' order by "POS" asc';
			return JDBC.iteratedQuery(connection, sql, null, null, null, function(){
				try {connWrap.close();} catch(e){}
			});
		},
		
		appendTableRows: function(desc, rows, pos, bStringified){
			if(!pos){
				pos = 0;
			}
			function _prepareStore(obj){
				if(!obj){
					return obj;
				} else if(JSB.isDate(obj)){
					return {
						__type: 'date',
						__value: obj.getTime()
					};
				} else if(JSB.isObject(obj)){
					var nObj = {};
					for(var k in obj){
						nObj[k] = _prepareStore(obj[k]);
					}
					return nObj;
				} else if(JSB.isArray(obj)){
					var nObj = [];
					for(var k = 0; k < obj.length; k++){
						nObj.push(_prepareStore(obj[k]));
					}
					return nObj;
				} else {
					return obj;
				}
			}
			
			var tableName = this.constructCacheTableName(desc);
			var store = this.ensureCacheStore();
			this.ensureCacheTable(desc);
			
			var batch = [];
			var curHash = desc.dataHash || '';
			for(var i = 0; i < rows.length; i++){
				var dataStr = '';
				if(bStringified){
					dataStr = rows[i];
				} else {
					dataStr = JSON.stringify(_prepareStore(rows[i]));
				}
				curHash = MD5.md5(curHash + dataStr);
				batch.push({
					sql: 'insert into "' + tableName + '" ( "POS", "DATA" ) values (?, ?)',
					values: [pos + i, dataStr]
				});
			}
			if(batch.length > 0){
				var connWrap = store.getConnection();
				var connection = connWrap.get();
				try {
					JDBC.executeUpdate(connection, batch);
				} finally {
					try {connWrap.close();} catch(e){}
				}
				desc.dataHash = curHash;
			}
			return batch.length;
		},
		
		executeQuery: function(query, params, provider){
			this.load();
			var qId = this.generateQueryId(query, provider);
			
			function produceIterator(desc){
				var position = 0;
				var closed = false;
				var cacheIt = null;
				var mtxCacheIt = JSB.generateUid();
				desc.lastUsed = Date.now();
				
				function closeCacheIt(){
					if(cacheIt){
						try { cacheIt.close(); } catch(e){}
						cacheIt = null;
					}
				}
				
				function _prepareLoad(obj){
					if(!obj){
						return obj;
					} else if(JSB.isObject(obj)){
						if(obj.__type && obj.__type == 'date'){
							return new Date(obj.__value);
						} else {
							var nObj = {};
							for(var k in obj){
								nObj[k] = _prepareLoad(obj[k]);
							}
							return nObj;
						}
					} else if(JSB.isArray(obj)){
						var nObj = [];
						for(var k = 0; k < obj.length; k++){
							nObj.push(_prepareLoad(obj[k]));
						}
						return nObj;
					} else {
						return obj;
					}
				}

				return {
					next: function(){
						if(closed || $this.isDestroyed()){
							return;
						}
						
						JSB.cancelDefer(mtxCacheIt);
						
						if(!cacheIt){
							cacheIt = $this.openTableIterator(desc, position);
						}
						
						try {
							desc.lastUsed = Date.now();
							var el = null;
							try {
								el = cacheIt.next();
							} catch(e){
								el = null;
							}
							if(!el){
								closeCacheIt();
								if(desc.complete){
									return null;
								}
								$this.lock('cacheFill_' + desc.qId);
								try {
									cacheIt = $this.openTableIterator(desc, position);
									try {
										el = cacheIt.next();
									} catch(e){
										el = null;
									}
									if(!el){
										closeCacheIt();
										var written = $this._fillNextBatch(desc, position);
										if(written == 0){
											this.close();
											return null;
										}
										cacheIt = $this.openTableIterator(desc, position);
										try {
											el = cacheIt.next();
										} catch(e){
											el = null;
										}
										if(!el){
											this.close();
											return null;
										}
									}
								} finally {
									$this.unlock('cacheFill_' + desc.qId);
								}
							}
							position++;
							return _prepareLoad(JSON.parse(el.DATA));
						} finally {
							JSB.defer(function(){
								closeCacheIt();
							}, $this.closeIteratorTimeout, mtxCacheIt);
						}
					},
					close: function(){
						closeCacheIt();
						if(closed){
							return;
						}
						closed = true;
					}
				};
			}

			
			if(this.cacheMap[qId]){
				// existed
				return produceIterator(this.cacheMap[qId]);
			}
			$this.lock('cache_' + qId);
			try {
				if(this.cacheMap[qId]){
					// existed
					return produceIterator(this.cacheMap[qId]);
				}

				var cDesc = {
					qId: qId,
					query: query,
					params: params,
					provider: provider,
					complete: false,
					it: null,
					cells: 0,
					rows: 0,
					dataHash: ''
				};
				$this.removeCacheTable(cDesc);
				
				$this.lock('cacheFill_' + qId);
				try {
					$this._fillNextBatch(cDesc);
				} finally {
					$this.unlock('cacheFill_' + qId);
				}
				
				$this.cacheMap[qId] = cDesc;
			} finally {
				$this.unlock('cache_' + qId);
			}
			
			$this.store();
			
			return produceIterator(this.cacheMap[qId]);

		}
	}
}