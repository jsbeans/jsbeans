{
	$name: 'DataCube.Query.QueryCache',
	$session: false,
	
	$server: {
		$require: ['DataCube.Query.QueryCacheController', 
		           'JSB.Crypt.MD5'],
		
		cube: null,
		batchSize: 50,
		closeIteratorTimeout: 60000,
		cacheMap: {},
		
		$constructor: function(cube, opts){
			$base();
			this.cube = cube;
			this.options = opts || {};
			if(Config.has('datacube.queryCache.batchSize')){
				this.batchSize = Config.get('datacube.queryCache.batchSize');
			}
			if(Config.has('datacube.queryCache.closeIteratorTimeout')){
				this.closeIteratorTimeout = Config.get('datacube.queryCache.closeIteratorTimeout');
			}
			QueryCacheController.registerCache(this);
		},
		
		destroy: function(){
			QueryCacheController.unregisterCache(this);
			$base();
		},
		
		generateQueryId: function(query){
			return MD5.md5(JSB.stringify(query));
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
		
		update: function(){},
		
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
				complete: otherDesc.complete,
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
		
		executeQuery: function(query, params){
			var qId = this.generateQueryId(query);

			function fillNextBatch(desc){
				if(desc.complete){
					return;
				}
				if(!desc.it){
					desc.it = $this.cube.executeQuery(desc.query, desc.params);
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