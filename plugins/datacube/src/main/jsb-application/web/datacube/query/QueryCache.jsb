{
	$name: 'DataCube.Query.QueryCache',
	$session: false,
	
	$server: {
		$require: ['DataCube.Query.QueryCacheController', 
		           'JSB.Crypt.MD5'],
		
		cube: null,
		batchSize: 50,
		closeIteratorTimeout: 10000,
		invalidateInterval: 0,
		updateInterval: 0,
		cacheMap: {},
		
		$constructor: function(cube, opts){
			$base();
			this.cube = cube;
			this.options = opts;
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
			for(var qId in this.cacheMap){
				if(this.cacheMap[qId].it){
					try {
						this.cacheMap[qId].it.close();
					} catch(e){}
					this.cacheMap[qId].it = null;
				}
			}
			this.cacheMap = {};
		},
		
		invalidate: function(){
			var idsToRemove = [];
			var now = Date.now();
			for(var qId in this.cacheMap){
				var qDesc = this.cacheMap[qId];
				if(qDesc.lastUsed && now - qDesc.lastUsed > $this.invalidateInterval){
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
		},
		
		update: function(){
			var idsToUpdate = [];
			var now = Date.now();
			for(var qId in this.cacheMap){
				var qDesc = this.cacheMap[qId];
				if(qDesc.lastUpdated && now - qDesc.lastUpdated > $this.updateInterval){
					idsToUpdate.push(qId);
				}
			}
			
			//TODO: 
		},
		
		getCacheMap: function(){
			return this.cacheMap;
		},
		
		copyFrom: function(otherCache, query){
			if(!otherCache || !query){
				return;
			}
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
		},
		
		copyTo: function(otherCache, query){
			if(!otherCache || !query){
				return;
			}
			otherCache.copyFrom(this, query);
		},
		
		executeQuery: function(query, params, provider){
			var qId = this.generateQueryId(query, provider);

			function fillNextBatch(desc){
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
			}
			
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
									fillNextBatch(desc);
									if(desc.buffer.length <= position){
										return null;
									}
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
/*						
						JSB.cancelDefer($this.getId() + 'closeIterator_' + desc.qId);
						if(desc.it){
							try { desc.it.close(); } catch(e){}
							desc.it = null;
						}
*/						
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
				fillNextBatch(cDesc);
				this.cacheMap[qId] = cDesc;
				
				return produceIterator(cDesc);
			} finally {
				$this.unlock('cache_' + qId);
			}
		}
	}
}