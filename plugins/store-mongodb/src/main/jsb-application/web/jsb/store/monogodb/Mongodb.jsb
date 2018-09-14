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
        
        createIterator: function(iterable, opts){
        	var cursor = iterable.iterator();
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
                hasNext: function(){
                	return cursor.hasNext();
                },
                close: function(){
                    if (!closed) {
                        cursor.close();
                        if (opts && JSB.isFunction(opts.onClose)) {
                        	opts.onClose.call($this);
                        }
                        closed = true;
                    }
                },
            };
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
                    ? MongodbHelper.createMongoCredential(properties.authenticationMechanism ? AuthenticationMechanism.valueOf(properties.authenticationMechanism) : AuthenticationMechanism.valueOf("MONGODB-CR"), properties.user, properties.db, properties.password)
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

        listDatabaseNames: function(client, opts){
            var names = client.listDatabaseNames();
            return $this.createIterator(names, opts);
        },

        listCollectionNames: function(client, dbName, opts){
            var names = $this.getDB(client, dbName).listCollectionNames();
            return $this.createIterator(names, opts);
        },
        
        listCollections: function(client, dbName, opts){
        	var collections = $this.getDB(client, dbName).listCollections​();
        	return $this.createIterator(collections, opts);
        },
        
        listIndexes: function(client, dbName, collectionName, opts){
        	var indexes = $this.getDB(client, dbName).getCollection(collectionName).listIndexes​();
        	return $this.createIterator(indexes, opts);
        },
        
        iteratedQuery: function(client, dbName, query, opts) {
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
            
            return $this.createIterator(find, opts);
        },

        runCommand: function(client, dbName, query) {
            var resultDB = $this.getDB(client, dbName).runCommand($this.toDBObject(query));
            var result = $this.toScriptable(resultDB);
            return result;
        },

        dropCollection: function(client, dbName, collectionName) {
            $this.getDB(client, dbName).getCollection(collectionName).drop();
        },

        count: function(client, dbName, collectionName, query){
        	var collection = $this.getDB(client, dbName).getCollection(collectionName);
        	if(!query){
        		return collection.count();
        	}
        	return collection.count($this.toDBObject(query));
        },

        _mongoError: function(obj) {
            throw new Error('MongoError: ' + obj);
        },
	}
})