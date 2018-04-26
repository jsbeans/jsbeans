{
	$name: 'DataCube.Query.QueryCache',
	$session: false,
	
	$server: {
		$require: ['DataCube.Query.QueryCacheController', 
		           'JSB.Crypt.MD5'],
		
		cube: null,
		owner: null,
		loaded: false,
		batchSize: 100,
		closeIteratorTimeout: 10000,
		invalidateInterval: 0,
		updateInterval: 0,
		cacheMap: {},
		
		$constructor: function(owner, cube, opts){
			$base();
			this.cube = cube;
			this.owner = owner;
			this.options = opts || {};
			if(Config.has('datacube.queryCache.batchSize')){
				this.batchSize = Config.get('datacube.queryCache.batchSize');
			}
			if(Config.has('datacube.queryCache.closeIteratorTimeout')){
				this.closeIteratorTimeout = Config.get('datacube.queryCache.closeIteratorTimeout');
			}
			QueryCacheController.registerCache(this);
			
			if(opts && opts.invalidateInterval){
				this.setInvalidateInterval(opts.invalidateInterval);
			}
			if(opts && opts.updateInterval){
				this.setUpdateInterval(opts.updateInterval);
			}
		},
		
		destroy: function(){
			this.setInvalidateInterval(0);
			this.setUpdateInterval(0);
			QueryCacheController.unregisterCache(this);
			$base();
		},
		
		load: function(){
			if(this.loaded){
				return;
			}
			this.lock('DataCube.Query.QueryCache.load');
			function _prepareLoad(obj){
				if(JSB.isNull(obj)){
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
			try {
				if(this.loaded){
					return;
				}
				this.loaded = true;
				if(this.owner.existsArtifact('.querycache')){
					var snapshot = this.owner.loadArtifact('.querycache');
					// parse snapshot
					for(var qId in snapshot){
						$this.lock('cache_' + qId);
						var qDesc = snapshot[qId];
						if(qDesc){
							var restoredBuffer = [];
							for(var k = 0; k < qDesc.buffer.length; k++){
								restoredBuffer.push(_prepareLoad(qDesc.buffer[k]));
							}
							$this.cacheMap[qId] = {
								qId: qId,
								query: qDesc.query,
								params: qDesc.params,
								complete: qDesc.complete,
								lastUpdated: qDesc.lastUpdated,
								lastUsed: qDesc.lastUsed,
								buffer: restoredBuffer,
								cells: qDesc.cells,
								it: null,
								provider: null
							}
						}
						$this.unlock('cache_' + qId);
					}
				}
				
			} catch(e){
				JSB.getLogger().warn(e);
			} finally {
				this.unlock('DataCube.Query.QueryCache.load');
			}
		},
		
		store: function(){
			this.load();
			JSB.defer(function(){
				$this.lock('DataCube.Query.QueryCache.store');
				
				function _prepareStore(obj){
					if(JSB.isNull(obj)){
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
				
				try {
					// prepare artifact
					var art = {};
					var idArr = Object.keys($this.cacheMap);
					
					for(var i = 0; i < idArr.length; i++){
						var qId = idArr[i];
						$this.lock('cache_' + qId);
						var qDesc = $this.cacheMap[qId];
						if(qDesc && !qDesc.provider){
							// prepare buffer
							var prepBuffer = [];
							for(var j = 0; j < qDesc.buffer; j++){
								prepBuffer.push(_prepareStore(qDesc.buffer[j]));
							}
							
							art[qId] = {
								qId: qId,
								query: qDesc.query,
								params: qDesc.params,
								complete: qDesc.complete,
								lastUpdated: qDesc.lastUpdated,
								lastUsed: qDesc.lastUsed,
								buffer: prepBuffer,
								cells: qDesc.cells
							};
						}
						$this.unlock('cache_' + qId);
					}
					if(Object.keys(art).length > 0){
						$this.owner.storeArtifact('.querycache', art);
					} else {
						if($this.owner.existsArtifact('.querycache')){
							$this.owner.removeArtifact('.querycache');
						}
					}
				} catch(e){
					JSB.getLogger().warn(e);
				} finally {
					$this.unlock('DataCube.Query.QueryCache.store');
				}
			}, 300, 'DataCube.Query.QueryCache.store.' + this.getId());
		},
		
		setInvalidateInterval: function(val){
			if(!JSB.isNumber(val) || this.invalidateInterval == val){
				return;
			}
			var mtx = 'DataCube.Query.QueryCache.invalidateInterval.' + this.getId();
			JSB.cancelDefer(mtx);
			this.invalidateInterval = val;
			function _invalidate(){
				if($this.invalidateInterval > 0){
					$this.invalidate();
					JSB.defer(_invalidate, $this.invalidateInterval, mtx);
				}
			}
			if($this.invalidateInterval > 0){
				JSB.defer(_invalidate, $this.invalidateInterval, mtx);
			}
		},
		
		setUpdateInterval: function(val){
			if(!JSB.isNumber(val) || this.updateInterval == val){
				return;
			}
			var mtx = 'DataCube.Query.QueryCache.updateInterval.' + this.getId();
			JSB.cancelDefer(mtx);
			this.updateInterval = val;
			function _update(){
				if($this.updateInterval > 0){
					$this.update();
					JSB.defer(_update, $this.updateInterval, mtx);
				}
			}
			if($this.updateInterval > 0){
				JSB.defer(_update, $this.updateInterval, mtx);
			}
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
					} catch(e){}
					this.cacheMap[qId].it = null;
				}
			}
			this.cacheMap = {};
			this.store();
		},
		
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
		
		update: function(bForce){
			this.load();
			var idsToUpdate = [];
			var now = Date.now();
			for(var qId in this.cacheMap){
				var qDesc = this.cacheMap[qId];
				if((qDesc.lastUpdated && now - qDesc.lastUpdated > $this.updateInterval) || bForce){
					idsToUpdate.push(qId);
				}
			}
			
			for(var i = 0; i < idsToUpdate.length; i++){
				var qId = idsToUpdate[i];
				
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
						it: null,
						buffer: [],
						cells: 0
					};
					
					// fill shadow buffer with the same length
					while(!qNewDesc.complete && qNewDesc.buffer.length < qExistedDesc.buffer.length){
						$this._fillNextBatch(qNewDesc);
					}
					
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
					qExistedDesc.buffer = qNewDesc.buffer;
					qExistedDesc.cells = qNewDesc.cells;
					qExistedDesc.lastUpdated = Date.now();
					qExistedDesc.complete = qNewDesc.complete;
					$this.unlock('cache_' + qId);
					
				} finally {
					$this.unlock('cacheFill_' + qId);
				}
			}
			
			$this.store();
			$this.publish('DataCube.Query.QueryCache.updated');
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
			var curDesc = $this.cacheMap[qId];
			if(curDesc && curDesc.it){
				curDesc.it.close();
			}
			$this.lock('cache_' + qId);
			$this.cacheMap[qId] = {
				qId: qId,
				query: otherDesc.query,
				params: otherDesc.params,
				provider: otherDesc.provider,
				complete: otherDesc.complete,
				lastUpdated: otherDesc.lastUpdated,
				lastUsed: Date.now(),
				it: null,
				buffer: JSB.clone(otherDesc.buffer),
				cells: otherDesc.cells
			};
			$this.unlock('cache_' + qId);
			$this.store();
		},
		
		copyTo: function(otherCache, query){
			if(!otherCache || !query){
				return;
			}
			otherCache.copyFrom(this, query);
		},
		
		_fillNextBatch: function (desc){
			if(desc.complete){
				return;
			}
			if(!desc.it){
				desc.it = $this.cube.executeQuery(desc.query, desc.params, desc.provider);
				desc.lastUpdated = Date.now();
				// do skip
				for(var i = 0; i < desc.buffer.length; i++){
					var el = desc.it.next();
					if(!el){
						desc.complete = true;
						try { desc.it.close(); } catch(e){}
						desc.it = null;
						break;
					}
				}
			} else {
				JSB.cancelDefer($this.getId() + 'closeIterator_' + desc.qId);
			}
			if(!desc.complete){
				for(var i = 0; i < $this.batchSize; i++){
					var el = desc.it.next();
					if(!el){
						try { desc.it.close(); } catch(e){}
						desc.it = null;
						desc.complete = true;
						break;
					}
					desc.buffer.push(el);
					desc.cells += Object.keys(el).length;
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
		},

		
		executeQuery: function(query, params, provider){
			this.load();
			var qId = this.generateQueryId(query, provider);

			
			function produceIterator(desc){
				var position = 0;
				var closed = false;
				desc.lastUsed = Date.now();

				return {
					next: function(){
						if(closed){
							return;
						}
						desc.lastUsed = Date.now();
						if(desc.buffer.length <= position){
							if(desc.complete){
								return null;
							}
							$this.lock('cacheFill_' + desc.qId);
							try {
								if(desc.buffer.length <= position){
									$this._fillNextBatch(desc);
									if(desc.buffer.length <= position){
										return null;
									}
									$this.store();
								}
							} finally {
								$this.unlock('cacheFill_' + desc.qId);
							}
						}
						return desc.buffer[position++];
					},
					close: function(){
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
					buffer: [],
					cells: 0
				};
				$this._fillNextBatch(cDesc);
				this.cacheMap[qId] = cDesc;
				$this.store();
				
				return produceIterator(cDesc);
			} finally {
				$this.unlock('cache_' + qId);
			}
		}
	}
}