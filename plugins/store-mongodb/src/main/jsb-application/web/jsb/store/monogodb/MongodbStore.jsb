({
	$name: 'JSB.Store.Mongodb.MongodbStore',
	$parent: 'JSB.Store.DataStore',
	$session: false,
	$server: {
		$require: ['JSB.Store.Mongodb.Mongodb'],

		connections: {},

		$constructor: function(config, storeManager){
			$base(JSB.merge({
                    type: 'JSB.Store.Mongodb.MongodbStore',
//                    dbName: 'db',
			    }, config), storeManager);
		},

        getConnection: function(checkConnection) {
            var closed = false;
            if(!$this.mongoClient){
                // create pooled mongo client connection manager
            	$this.mongoClient = Mongodb.getMongoClient($this.config.url, $this.config.properties);	
            }
            if(checkConnection){
            	var res = this.asMongodb().runCommand({listCollections:1});
            	if(!res.ok){
            		throw new Error('Failed to list collections in database: ' + $this.config.dbName);
            	}
            }
            return {
                get: function(){
                    return $this.mongoClient;
                },
                close: function(){
                	if(closed){
                		return;
                	}
                	// nothing to do
                	closed = true;
                	if($this.mongoClient){
                		$this.mongoClient.close();
                		$this.mongoClient = null;
                	}
                },
                closed: function(){
                	return closed;
                }
            };
        },


		asMongodb: function() {
            return {
            	connected: function(func){
            		var conn = $this.getConnection(true);
                    try {
                        return func.call($this, conn.get());
                    } finally {
                        conn.close();
                    }
            	},
            	
                iteratedQuery: function(query, opts) {
                    return Mongodb.iteratedQuery($this.mongoClient, $this.config.dbName, query, opts);
                },

                runCommand: function(query) {
                	return Mongodb.runCommand($this.mongoClient, $this.config.dbName, query);
//                    return Mongodb.iteratedQuery($this.mongoClient, $this.config.dbName, query);
                },

                dropCollection: function(collection) {
                    return Mongodb.dropCollection($this.mongoClient, $this.config.dbName, collection);
                },
                
                listCollectionNames: function(opts){
                	return Mongodb.listCollectionNames($this.mongoClient, $this.config.dbName, opts);
                },
                
                listCollections: function(opts){
                	return Mongodb.listCollections($this.mongoClient, $this.config.dbName, opts);
                },
                
                listIndexes: function(collection, opts){
                	return Mongodb.listIndexes($this.mongoClient, $this.config.dbName, collection, opts);
                },

                dropDatabase: function(){
                	Mongodb.dropDatabase($this.mongoClient, $this.config.dbName);
                },
                
                count: function(collection, query){
                	return Mongodb.count($this.mongoClient, $this.config.dbName, collection, query);
                },
            };
		},
		
		extractSchema: function(stateCallback, filter){
            return this.asMongodb().connected(function(conn){
            	var scheme = {
                	collections: {},
                	functions: {},
                	users: {}
                };
            	// prepare filters
            	var rxFilters = [];
                if(filter && filter.length > 0){
                	// match filter
                	var filters = filter.split(',');
                	for(var i = 0; i < filters.length; i++){
                		var curFilter = filters[i];
                		var pattern = '^' + curFilter.trim().replace('.', '\\.').replace('*', '.*?') + '$';
                		var rx = new RegExp(pattern, 'i');
                		rxFilters.push(rx);
                	}
                }
            	
            	// obtain collections
                var colls = [];
            	var collIt = this.asMongodb().listCollections();
            	while(collIt.hasNext()){
            		colls.push(collIt.next());
            	}
            	collIt.close();
            	
            	for(var c = 0; c < colls.length; c++){
            		if(stateCallback){
            			stateCallback.call(this, c, colls.length);
                	}
            		var collDesc = colls[c];
            		var collectionName = collDesc.name;
            		
            		if(rxFilters && rxFilters.length > 0){
                    	var bMatched = false;
                    	// match filters
                    	for(var i = 0; i < rxFilters.length; i++){
                    		var rx = rxFilters[i];
                    		if(rx.test(collectionName)){
                    			bMatched = true;
                    			break;
                    		}
                    	}
                    	if(!bMatched){
                    		continue;
                    	}
                    }
            		
            		// extract count
            		var itemCount = this.asMongodb().count(collectionName);
            		
            		// extract indexes
            		var indexes = {};
            		var indexIt = this.asMongodb().listIndexes(collectionName);
            		while(indexIt.hasNext()){
            			var idxDesc = indexIt.next();
            			indexes[idxDesc.name] = idxDesc;
            		}
            		indexIt.close();
            		
            		scheme.collections[collectionName] = {
            			entryType: 'collection',
            			name: collectionName,
            			options: collDesc.options,
            			count: itemCount,
            			indexes: indexes
            		};
            	}
                return scheme;
            });
        },

		close: function() {
			if($this.mongoClient){
				$this.mongoClient.close();
				$this.mongoClient = null;
			}
		    
		    $base();
		},


    }
})