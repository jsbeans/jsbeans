({
	$name: 'JSB.Store.Mongodb.Mongodb',
	$singleton: true,

	$server: {
		$require: {
		    Class:                   'java:java.lang.Class',
		    Collections:              'java:java.util.Collections',
		    MongodbHelper:           'java:org.jsbeans.store.mongodb.MongodbHelper',

		    MongoClient:             'java:com.mongodb.MongoClient',
		    MongoClientURI:          'java:com.mongodb.MongoClientURI',
		    ServerAddress:           'java:com.mongodb.ServerAddress',
		    ServerAddressHelper:     'java:com.mongodb.internal.connection.ServerAddressHelper',
		    MongoCredential:         'java:com.mongodb.MongoCredential',
		    AuthenticationMechanism: 'java:com.mongodb.AuthenticationMechanism',
		    MongoClientOptions:      'java:com.mongodb.MongoClientOptions',
		    MongoDriverInformation:  'java:com.mongodb.MongoDriverInformation',
		},

		$constructor: function(){
			$base();

			$this.defaults = Config.has('jsb.store.mongodb.defaults')
			        ? Config.get('jsb.store.mongodb.defaults')
			        : {};

//            $this._examples();
		},

		_examples: function(){
debugger;
            var Mongodb = $this;
		    var client = Mongodb.getMongoClient("mongodb://localhost:27017", {});

            // one multi-command
		    var result = Mongodb.iteratedQuery(client, 'sm', {
		        find: 'sharedresources',
		        filter: {},
		        sort: {type:-1},
		    });
		    result.next();
		    result.close();

		    // command list
		    var result = Mongodb.iteratedQuery(client, 'sm', [
		        {
		            find: 'sharedresources',
		            filter: {},
                },
                {sort: {type:-1}},
                {filter: {b: {$eq: 123}}},
		    ]);
		    result.next();
		    result.close();
		},

        toDBObject: function(obj) {
            return MongodbHelper.toDBObject(obj);
        },

        toScriptable: function(obj) {
            return MongodbHelper.toScriptable(obj, $this);
        },

		getMongoClient: function(url, properties) {
		    if (url.startsWith('mongodb://')) {
		        /// mongodb://host[:port] -> host[:port]
		        url = url.substring('mongodb://'.length);
		    }
		    var reg = url.split(':')
            var host = reg[0];
            var port = reg[1] || ServerAddress.defaultPort();

		    var mongoClient = new MongoClient(
                ServerAddressHelper.createServerAddress(host, port),
                properties && (properties.user || properties.authenticationMechanism)
                    ? new MongoCredential(properties.authenticationMechanism ? AuthenticationMechanism.valueOf(properties.authenticationMechanism) : AuthenticationMechanism.valueOf("MONGODB-CR"), properties.user, properties.db, properties.password, null)
                    : Collections.emptyList(),
                MongoClientOptions.builder().build(),    // TODO build from properties
                MongoDriverInformation.builder().build() // TODO build from properties
            );

		    return mongoClient;
		},

		getDB: function(client, dbName){
		    return client.getDatabase(dbName);
		},

        dropDatabase: function(client, dbName){
            client.dropDatabase(dbName);
        },

        listDatabaseNames: function(){
            var names = client.listDatabaseNames();
			return $this.toScriptable(names);
        },

        listCollections: function(client, dbName){
            var names = $this.getDB(client, dbName).getCollectionNames();
            return $this.toScriptable(names);
        },

        iteratedQuery: function(client, dbName, query, onClose) {

            if (!JSB.isArray(query)) {
                query = [query];
            }
            if(query.length < 1 || !query[0].find) {
                throw $this._mongoError('Array query must contain find operator in first expression');
            }

            var collection = query[0].find;
            delete query[0].find;

            var collection = $this.getDB(client, dbName).getCollection(collection);
            var find = collection.find();

            for(var i = 0; i < query.length; i++) {
                var q = query[i];
                if (Object.keys(q).length == 0) continue;
                for(var op in q) if (q.hasOwnProperty(op)) {
                    var value = q[op] || null;
                    var arg = $this.toDBObject(value);
                    // call cursor`s method
                    find = find[op](arg);
                }
            }

            var cursor = find.iterator();

            var closed = false;
            return {
                next: function(){
                    if (cursor.hasNext()) {
                        var value = cursor.next();
                        if (value) {
                            value = $this.toScriptable(value);
                        }

                        if (JSB.isNull(value)) {
                            cursor.close();
                        }
                        return value;
                    }
                },
                close: function(){
                    if (!closed) {
                        cursor.close();
                        if (JSB.isFunction(onClose)) {
                            onClose();
                        }
                        closed = true;
                    }
                },
            };
        },

        runCommand: function(client, dbName, query) {
            var resultDB = $this.getDB(client, dbName).runCommand($this.toDBObject(query));
            var result = $this.toScriptable(resultDB);
            return result;
        },

        dropCollection: function(client, dbName, collectionName) {
            $this.getDB(client, dbName).getCollection(collectionName).drop();
        },



        _mongoError: function(obj) {
            throw new Error('MongoError: ' + obj);
        },
	}
})