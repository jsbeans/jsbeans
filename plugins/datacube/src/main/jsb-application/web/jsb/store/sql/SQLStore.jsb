({
	$name: 'JSB.Store.Sql.SQLStore',
	$parent: 'JSB.Store.DataStore',

	$server: {
		$require: [
		    'JSB.Store.Sql.JDBC',
		    'JSB.Store.Sql.SQLSchemaInspector'
		],

		connections: {},

		$constructor: function(config){
			$base(JSB.merge({
//                    type: JSB.Store.Sql.SQLStore,
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


        extractSchema: function(stateCallback){
            return this.asSQL().connectedJDBC(function(conn){
            	var schemaInspector = new SQLSchemaInspector();
                var schemas = schemaInspector.extractSchemas(conn, stateCallback);
                schemaInspector.destroy();
                return schemas;
            });
        },

		asSQL: function() {
            return {
                connectedJDBC: function(func){
                    var conn = $this.getConnection();
                    try {
                        return func.call(null, conn.get());
                    } finally {
                        conn.close();
                    }
                },
                iteratedQuery: function(sql, values, types, rowExtractor, onClose) {
                    var conn = $this.getConnection();
                    try {
                        return JDBC.iteratedQuery(conn, sql, values, types, rowExtractor, function onClose2() {
                            conn.close();
                            if (JSB.isFunction(onClose)) {
                                onClose();
                            }
                        });
                    } finally {
                        conn.close();
                    }
                },

                iteratedParametrizedQuery: function(sql, parameters, rowExtractor, onClose) {
                    try {
                        return this.iteratedParametrizedQuery2(
                            sql,
                            function getValue(param, sqlIndex) {
                                return parameters[param];
                            },
                            function getTypes(param, sqlIndex) {
                                return $this.config.argumentTypes[param];
                            },
                            rowExtractor,
                            onClose
                        );
                    } finally {
                        conn.close();
                    }
                },

                iteratedParametrizedQuery2: function(sql, getValue, getType, rowExtractor, onClose) {
                    var conn = $this.getConnection();
                    try {
                        return JDBC.iteratedParametrizedQuery(conn.get(), sql, getValue, getType, rowExtractor, function onClose2() {
                            conn.close();
                            if (JSB.isFunction(onClose)) {
                                onClose();
                            }
                        });
                    } finally {
                        conn.close();
                    }
                }
            };
		},

		asMoSQL: function() {
            return {
                iteratedQuery: function(query, rowExtractor, onClose) {
                    var query = JSB.merge({
                        type: 'select',
                    }, query, {});
                    var mosql = MongoSQL.sql(query);

                    var result = $this.asSQL().iteratedQuery(mosql.query, mosql.values, rowExtractor, onClose);
                    return result;
                },
                iteratedParametrizedQuery: function(query, parameters, rowExtractor) {
                    var query = JSB.merge({
                        type: 'select',
                    }, query, {});

                    var mosql = MongoSQL.sql(query);
                    var parametrizedSQL = mosql.query.replace(/\$(\d?)/g, function(str, param){
                        var idx = parseInt(param);
                        return mosql.values[idx - 1];
                    });

                    var result = $this.asSQL().iteratedParametrizedQuery(parametrizedSQL, parameters, rowExtractor, onClose);
                    return result;
                },
                iteratedParametrizedQuery2: function(query, getValue, getType, rowExtractor, onClose) {
                    var query = JSB.merge({
                        type: 'select',
                    }, query, {});

                    var mosql = MongoSQL.sql(query);
                    var parametrizedSQL = mosql.query;
                    parametrizedSQL = parametrizedSQL.replace(/\$(\d?)/g, function(str, param){
                        var idx = parseInt(param);
                        return mosql.values[idx - 1];
                    });
                    parametrizedSQL = parametrizedSQL.replace(new RegExp('`','g'), "\"\"");
                    Log.debug('Parametrized SQL Query: ' + parametrizedSQL);
                    var result = $this.asSQL().iteratedParametrizedQuery2(parametrizedSQL, getValue, getType, rowExtractor, onClose);
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