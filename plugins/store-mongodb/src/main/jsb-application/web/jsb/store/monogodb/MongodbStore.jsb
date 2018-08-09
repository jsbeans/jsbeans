({
	$name: 'JSB.Store.mongodb.MongodbStore',
	$parent: 'JSB.Store.DataStore',
	$session: false,
	$server: {
		$require: [
		    'JSB.Store.mongodb.Mongodb',
		],

		connections: {},

		$constructor: function(config, storeManager){
			$base(JSB.merge({
//                    type: JSB.Store.mongodb.MongodbStore,
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

		asMongo: function() {
            return {
                iteratedQuery: function(dbName, colName, query, onClose) {
                    return Mongodb.iteratedQuery($this.mongoClient, dbName, colName, query, onClose);
                },

            };
		},

		close: function() {
		    $this.mongoClient.close();
		    $base();
		},


    }
})