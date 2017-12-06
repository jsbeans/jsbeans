({
	$name: 'JSB.Store.Sql.SQLStore',
	$parent: 'JSB.Store.DataStore',

	$server: {
		$require: [
		    'JSB.Store.Sql.JDBC',
		    'JSB.Store.Sql.SQLSchemaInspector'
		],

		connections: {},

		$constructor: function(config, storeManager){
			$base(JSB.merge({
//                    type: JSB.Store.Sql.SQLStore,
//                    url: '',
//                    properties: {
//                        user: '',
//                        password: '',
//                    },
                    maxConnections: 500,
                    argumentTypes: {
//                        paramName: java.sql.Types.VALUE,
//                        'name': 'STRING',
                    }
			    }, config), storeManager);
			// init MongoSQL global var
		},

        getConnection: function(checkConnection) {
            function closeConnection(cn) {
                JSB.locked($this, 'connection', function() {
                    if (cn.jdbcConnection) {
                        delete $this.connections[cn.id];
                        cn.jdbcConnection.close();
                        cn.jdbcConnection = null;
                        if (cn.deferredCloseKey) {
                            JSB.cancelDefer(cn.deferredCloseKey);
                            delete cn.deferredCloseKey;
                        }
                    }
                });
            }

            var conn = null;
            for (var id in this.connections) if (this.connections.hasOwnProperty(id)) {
                conn = this.connections[id];
                if (conn && conn.available) {
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
                                JDBC.validationQuery(conn.jdbcConnection, this.config.checkResponseTimeoutSec||5);
                            } catch(e) {
                                closeConnection(conn);
                                conn = null;
                                continue;
                            }
                        }
                        break;
                    }
                } else {
                    conn = null;
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
            var closed = false;
            return {
                get: function(){
                    if(closed) throw new Error('Connection closed');
                    return conn.jdbcConnection;
                },
                close: function(){
                	if(closed) throw new Error('Connection already closed');
                    closed = true;
                    conn.deferredCloseKey = JSB.generateUid();
                    conn.available = true;
                    JSB.defer(function() {
                        closeConnection(conn);
                    }, ($this.closeUselessConnectionTimeoutSec||60)*1000, conn.deferredCloseKey);
                },
                closed: function(){
                	return closed;
                }
            };
        },


        extractSchema: function(stateCallback, filter){
            return this.asSQL().connectedJDBC(function(conn){
            	var schemaInspector = new SQLSchemaInspector();
                var schemas = schemaInspector.extractSchemas(conn, stateCallback, filter);
                schemaInspector.destroy();
                return schemas;
            });
        },

		asSQL: function() {
            return {
                connectedJDBC: function(func){
                    var conn = $this.getConnection(true);
                    try {
                        return func.call(null, conn.get());
                    } finally {
                        conn.close();
                    }
                },
                iteratedQuery: function(sql, values, types, rowExtractor, onClose) {
                    var conn = $this.getConnection(true);
                    try {
                        return JDBC.iteratedQuery(conn, sql, values, types, rowExtractor, function onClose2() {
                            conn.close();
                            if (JSB.isFunction(onClose)) {
                                onClose();
                            }
                        });
                    } catch(e) {
                        conn.close();
                        throw e;
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
                    } catch(e) {
                        conn.close();
                        throw e;
                    }
                },

                iteratedParametrizedQuery2: function(sql, getValue, getType, rowExtractor, onClose) {
                    var conn = $this.getConnection(true);
                    try {
                        sql = sql.replace(new RegExp('`','g'), "\"\"");
                        return JDBC.iteratedParametrizedQuery(conn.get(), sql, getValue, getType, rowExtractor, function onClose2() {
                            conn.close();
                            if (JSB.isFunction(onClose)) {
                                onClose();
                            }
                        });
                    } catch(e) {
                        conn.close();
                        throw e;
                    }
                }
            };
		},

		close: function() {
		    // close all JDBC connections and clear pull
            JSB.locked($this, 'connection', function() {
                var ids = Object.keys($this.connections);
                for (var i in ids) {
                    var id = ids[i];
                    var conn = $this.connections[id];
                    if (conn.jdbcConnection) {
                        if (conn.deferredCloseKey) {
                            JSB.cancelDefer(conn.deferredCloseKey);
                        }
                        conn.jdbcConnection.close();
                        conn.jdbcConnection = null;
                    }
                    delete $this.connections[conn.id];
                }
            });

		    $base();
		},


    }
})