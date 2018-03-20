{
	$name: 'DataCube.Query.QueryCache',
	$session: false,
	
	$server: {
		$require: ['DataCube.Query.QueryCacheController', 
		           'JSB.Crypt.MD5'],
		
		cube: null,
		batchSize: 10,
		closeIteratorTimeout: 60000,
		cacheMap: {},
		
		$constructor: function(cube){
			$base();
			this.cube = cube;
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
			this.cacheMap = {};
		},
		
		update: function(){},
		
		getCacheMap: function(){
			return this.cacheMap;
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
							desc.it.close();
							desc.it = null;
							break;
						}
					}
				} else {
					JSB.cancelDefer('closeIterator_' + desc.qId);
				}
				if(!desc.complete){
					for(var i = 0; i < $this.batchSize; i++){
						var el = desc.it.next();
						if(!el){
							desc.it.close();
							desc.it = null;
							desc.complete = true;
							break;
						}
						desc.buffer.push(el);
					}
				}
				if(!desc.complete){
					JSB.defer(function(){
						if(desc.it){
							desc.it.close();
							desc.it = null;
						}
					}, $this.closeIteratorTimeout, 'closeIterator_' + desc.qId);
				}
			}
			
			function produceIterator(desc){
				var position = 0;
				var closed = false;
				desc.lastUsed = Date.now();

				return {
					next: function(){
						if(closed){
							throw new Error('Iterator has been closed');
						}
						desc.lastUsed = Date.now();
						if(desc.buffer.length <= position){
							if(desc.complete){
								return null;
							}
							JSB.getLocker().lock('cacheFill_' + desc.qId);
							try {
								if(desc.buffer.length <= position){
									fillNextBatch(desc);
									if(desc.buffer.length <= position){
										return null;
									}
								}
							} finally {
								JSB.getLocker().unlock('cacheFill_' + desc.qId);
							}
						}
						return desc.buffer[position++];
					},
					close: function(){
						closed = true;
					}
				};
			}

			
			if(this.cacheMap[qId]){
				// existed
				return produceIterator(this.cacheMap[qId]);
			}
			JSB.getLocker().lock('cache_' + qId);
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
					buffer: []
				};
				fillNextBatch(cDesc);
				this.cacheMap[qId] = cDesc;
				
				return produceIterator(cDesc);
			} finally {
				JSB.getLocker().unlock('cache_' + qId);
			}
		}
	}
}