({
	$name: 'jsb.store.sql.SQLStore',
	$parent: 'jsb.store.DataStore',

	$server: {
		$require: [
		    'jsb.store.sql.JDBC',
		    'jsb.store.sql.SQLSchemaInspector'
		],

		connections: {},

		$constructor: function(config){
			$base(JSB.merge({
//                    type: jsb.store.sql.SQLStore,
//                    url: '',
//                    properties: {
//                        user: '',
//                        password: '',
//                    },
                    maxConnections: 5,
                    argumentTypes: {
//                        paramName: java.sql.Types.VALUE,
//                        'name': 'STRING',
                    }
			    }, config));
			// init MongoSQL global var

			var console = {
			    log: function(){ Log.debug.apply(Log, arguments); },
			    error: function(){ Log.debug.apply(Log, arguments); }
			};
			`#include 'thirdparty/mongo-sql-bundle.js'`;
		},

        getConnection: function(checkConnection) {
            function closeConnection(cn) {
                JSB.locked($this, 'connection', function() {
                    if (cn.jdbcConnection) {
                        delete $this.connections[cn.id];
                        if (cn.deferredCloseKey) {
                            JSB.cancelDefer(cn.deferredCloseKey);
                        }
                        cn.jdbcConnection.close();
                        cn.jdbcConnection = null;
                    }
                });
            }

            var conn = null;
            for (var id in this.connections) if (this.connections.hasOwnProperty(id)) {
                conn = this.connections[id];
                if (conn.available) {
                    conn = JSB.locked(this, 'connection', function(){
                        if (conn.available) {
                            conn.available = false;
                            return conn;
                        }
                        return null;
                    });
                    if (conn) {
                        if (checkConnection) {
                            try {
                                conn.jdbcConnection.isValid(this.config.checkResponseTimeoutSec||5);
                            } catch(e) {
                                closeConnection(conn);
                                conn = null;
                                continue;
                            }
                        }
                        break;
                    }
                }
            }

            if (!conn) {
                if (Object.keys(this.connections).length >= this.config.maxConnections) {
                    throw new Error('Max connections limit for store ' + this.config.name);
                }

                // open new connection
                JSB.locked(this, 'connection', function(){
                    conn = {
                        id: JSB.generateUid(),
                        jdbcConnection: JDBC.getConnection($this.config.url, $this.config.properties),
                        available: false,
                        createdTimestamp: Date.now()
                    };
                    $this.connections[conn.id] = conn;
                });
            }

            conn.lastUpdatedTimestamp = Date.now();
            if (conn.deferredCloseKey) {
                JSB.cancelDefer(conn.deferredCloseKey);
                delete conn.deferredCloseKey;
            }
            return {
                get: function(){
                    return conn.jdbcConnection;
                },
                close: function(){
                    conn.deferredCloseKey = JSB.generateUid();
                    JSB.defer(function() {
                        closeConnection(conn);
                    }, $this.closeUselessConnectionTimeoutSec||60, conn.deferredCloseKey);
                    conn.available = true;
                },
            };
        },


        extractSchema: function(){
            return this.asSQL().connectedJDBC(function(conn){
                return new SQLSchemaInspector().extractSchemas(conn);
            });
        },

		asSQL: function() {
		    // TODO move to SqlStorageInterface
            return {
                connectedJDBC: function(func){
                    var conn = $this.getConnection();
                    try {
                        return func.call(null, conn.get());
                    } finally {
                        conn.close();
                    }
                },
                query: function(sql, values, types, rowExtractor) {
                    return this.connectedJDBC(function(conn){
                        return JDBC.query(conn, sql, values, types, rowExtractor);
                    });
                },
                execute: function(sql, values, types) {
                    return this.connectedJDBC(function(conn){
                        return JDBC.execute(conn, sql, values, types);
                    });
                },
            };
		},

		asParametrizedSQL: function() {
            // TODO move to PSqlStorageInterface
            return {
                query: function(sql, parameters, rowExtractor) {
                    var conn = $this.getConnection();
                    try {
                        return JDBC.parametrizedQuery(conn.get(), sql,
                                function getValue(param, sqlIndex) {
                                    return parameters[param];
                                },
                                function getTypes(param, sqlIndex) {
                                    return $this.config.argumentTypes[param];
                                },
                                rowExtractor);
                    } finally {
                        conn.close();
                    }
                }
            };
		},

		asMoSQL: function() {
            // TODO move to MoSqlStorageInterface
            return {
                query: function(query, rowExtractor) {
                    var query = JSB.merge({
                        type: 'select',
                    }, query, {});
                    var mosql = MongoSQL.sql(query);

                    var result = $this.asSQL().query(mosql.query, mosql.values, rowExtractor);
                    return result;
                },
                parametrizedQuery: function(query, parameters, rowExtractor) {
                    var query = JSB.merge({
                        type: 'select',
                    }, query, {});

                    var mosql = MongoSQL.sql(query);
                    var parametrizedSQL = mosql.query.replace(/\$(\d?)/g, function(str, param){
                        var idx = parseInt(param);
                        return mosql.values[idx - 1];
                    });

                    var result = $this.asParametrizedSQL()
                            .query(parametrizedSQL, parameters, rowExtractor);
                    return result;
                },
            };
		},

		destroy: function(){
            JSB.locked($this, 'connection', function() {
                for (var id in this.connections) if ($this.connections.hasOwnProperty(id)) {
                    var conn = this.connections[conn.id];
                    if (conn.jdbcConnection) {
                        if (conn.deferredCloseKey) {
                            JSB.cancelDefer(conn.deferredCloseKey);
                        }
                        cn.jdbcConnection.close();
                        cn.jdbcConnection = null;
                    }
                }
            });
		    $base();
		},


    }
})