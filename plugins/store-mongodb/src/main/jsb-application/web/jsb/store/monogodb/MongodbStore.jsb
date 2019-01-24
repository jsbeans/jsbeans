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
                    properties: {
                        db : config.dbName,
                        authDb : config.dbName,
                    }
			    }, config), storeManager);
		},

        getConnection: function(checkConnection) {
            var closed = false;
            if(!$this.mongoClient){
                JSB.locked($this, 'connection', function(){
                    if(!$this.mongoClient){
                        // create pooled mongo client connection manager
                        $this.mongoClient = Mongodb.getMongoClient($this.config.url, $this.config.properties);
                    }

                });
            }
            if(checkConnection){
            	var res = this.asMongodb().runCommand({listCollections:1});
            	if(!res.ok){
                    JSB.locked($this, 'connection', function(){
                        if($this.mongoClient){
                            $this.mongoClient.close();
                            $this.mongoClient = null;
                        }
                    });
            		throw new Error('Failed check connection to database: ' + $this.config.dbName);
            	}
            }
            if ($this._deferredCloseKey) {
                JSB.cancelDefer($this._deferredCloseKey);
                delete $this._deferredCloseKey;
            }
            return {
                get: function(){
                    return $this.mongoClient;
                },
                close: function(){
                	if(closed){
                		return;
                	}
                	closed = true;
                    $this._deferredCloseKey = JSB.generateUid();
                    JSB.defer(function() {
                        JSB.locked($this, 'connection', function(){
                            if($this.mongoClient){
                                $this.mongoClient.close();
                                $this.mongoClient = null;
                            }
                        });
                    }, ($this.closeUselessConnectionTimeoutSec||10)*1000, $this._deferredCloseKey);
                },
                closed: function(){
                	return closed;
                }
            };
        },

		getVendor: function(){
		    return 'Mongodb';
		},


		asMongodb: function() {
		    function prepareClose(conn, opts){
		        var opts = opts || {};
                var extClose = opts.onClose;
                opts.onClose = function(){
                    if (extClose) {
                        extClose.call(this);
                        conn.close();
                    }
                };
		    }
            return {
            	connected: function(func){
            		var conn = $this.getConnection(false);
                    try {
                        return func.call($this, conn.get());
                    } finally {
                        conn.close();
                    }
            	},
            	
                iteratedQuery: function(query, opts) {
                    var conn = $this.getConnection(false);
                    try {
                        var opts = prepareClose(conn, opts);
                        return Mongodb.iteratedQuery(conn.get(), $this.config.dbName, query, opts);
                    } catch(e) {
                        conn.close();
                        throw e;
                    }
                },

                iterateAggregate: function(collection, pipeline, opts){
                    var conn = $this.getConnection(false);
                    try {
                        var opts = prepareClose(conn, opts);
                        return Mongodb.iterateAggregate(conn.get(), $this.config.dbName, collection, pipeline, opts);
                    } catch(e) {
                        conn.close();
                        throw e;
                    }
                },
                
                iterateCollectionNames: function(opts){
                    var conn = $this.getConnection(false);
                    try {
                        var opts = prepareClose(conn, opts);
                        return Mongodb.iterateCollectionNames(conn.get(), $this.config.dbName, opts);
                    } catch(e) {
                        conn.close();
                        throw e;
                    }
                },
                
                iterateCollections: function(opts){
                    var conn = $this.getConnection(false);
                    try {
                        var opts = prepareClose(conn, opts);
                        return Mongodb.iterateCollections(conn.get(), $this.config.dbName, opts);
                    } catch(e) {
                        conn.close();
                        throw e;
                    }
                },
                
                iterateIndexes: function(collection, opts){
                    var conn = $this.getConnection(false);
                    try {
                        var opts = prepareClose(conn, opts);
                        return Mongodb.iterateIndexes(conn.get(), $this.config.dbName, collection, opts);
                    } catch(e) {
                        conn.close();
                        throw e;
                    }
                },

                runCommand: function(query) {
                    var conn = $this.getConnection(false);
                    try {
                        return Mongodb.runCommand(conn.get(), $this.config.dbName, query);
                    } finally {
                        conn.close();
                    }
                },

                dropDatabase: function(){
                    var conn = $this.getConnection(false);
                    try {
                        return Mongodb.dropDatabase(conn.get(), $this.config.dbName);
                    } finally {
                        conn.close();
                    }
                },

                dropCollection: function(collection) {
                    var conn = $this.getConnection(false);
                    try {
                        return Mongodb.dropCollection(conn.get(), $this.config.dbName, collection);
                    } catch(e) {
                        conn.close();
                        throw e;
                    }
                },
                
                count: function(collection, query){
                    var conn = $this.getConnection(false);
                    try {
                        return Mongodb.count(conn.get(), $this.config.dbName, collection, query);
                    } finally {
                        conn.close();
                    }
                },
            };
		},
		
		extractSchema: function(stateCallback, filter){
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
            var collIt = this.asMongodb().iterateCollections();
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
                var indexIt = this.asMongodb().iterateIndexes(collectionName);
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