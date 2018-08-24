({
	$name: 'JSB.Store.Mongodb.MongodbStore',
	$parent: 'JSB.Store.DataStore',
	$session: false,
	$server: {
		$require: [
		    'JSB.Store.Mongodb.Mongodb',
		],

		connections: {},

		$constructor: function(config, storeManager){
			$base(JSB.merge({
//                    type: JSB.Store.Mongodb.MongodbStore,
//                    dbName: 'db',
			    }, config), storeManager);

            // create pooled mongo client connection manager
            $this.mongoClient = Mongodb.getMongoClient($this.config.url, $this.config.properties);
		},

        getConnection: function(checkConnection) {
            var closed = false;
            return {
                get: function(){
                    return $this.mongoClient;
                },
                close: function(){
                	// nothing to do
                	closed = true;
                },
                closed: function(){
                	return closed;
                }
            };
        },


        extractSchema: function(stateCallback, filter){
            throw new Error('Not implemented');
        },

		asMongodb: function() {
            return {
                iteratedQuery: function(colName, query, onClose) {
                    return Mongodb.iteratedQuery($this.mongoClient, $this.config.dbName, colName, query, onClose);
                },

                runCommand: function(query) {
                    return Mongodb.iteratedQuery($this.mongoClient, $this.config.dbName, query);
                },

                dropCollection: function(collection) {
                    return Mongodb.dropCollection($this.mongoClient, $this.config.dbName, collection);
                },

            };
		},

		close: function() {
		    $this.mongoClient.close();
		    $base();
		},


    }
})