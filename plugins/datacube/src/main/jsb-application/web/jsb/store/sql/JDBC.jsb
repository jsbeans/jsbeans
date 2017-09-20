({
	$name: 'JSB.Store.Sql.JDBC',
	$singleton: true,

	$server: {
		$require: {
		    Class:          'java:java.lang.Class',
		    Properties:     'java:java.util.Properties',
			DriverManager:  'java:java.sql.DriverManager',
			JDBCType:       'java:java.sql.JDBCType',
			Types:          'java:java.sql.Types',
			SqlDate:        'java:java.sql.Date',
		},

		$constructor: function(){
			$base();
		},

		JDBCDrivers: {
            MySQL:      "com.mysql.jdbc.Driver",
            PostgreSQL: "org.postgresql.Driver",
            H2:         "org.h2.Driver",
            SQLServer:  "com.microsoft.sqlserver.jdbc.SQLServerDriver",
            Oracle:     "oracle.jdbc.driver.OracleDriver"
		},

		RowExtractors: {
		    Array: function(resultSet) {
		        debugger;
		        // TODO
		        return [];
		    },

		    Json: function(rs){
		        var json = {};
                var count = rs.getMetaData().getColumnCount();
                for(var i = 1; i < count + 1; i++) {
                    var name = rs.getMetaData().getColumnLabel(i) || rs.getMetaData().getColumnName(i);
                    json[''+name] = this._getColumnValue(rs, i);
                    
                }
		        return json;
		    }
		},

		getConnection: function(url, properties) {
		    var properties = properties || {};

		    var connectionProps = new Properties();
            for (var p in properties) if (properties.hasOwnProperty(p)) {
                connectionProps.put(p, properties[p]);
            }

		    return DriverManager.getConnection(url, connectionProps);
		},

		loadDrivers: function(skipErrors){
		    for(var name in this.JDBCDrivers) if (this.JDBCDrivers.hasOwnProperty(name)) {
		        var className = this.JDBCDrivers[name];
		        this.loadDriver(className, skipErrors);
		    }
		},

		loadDriver: function(driverClassName, skipError) {
            try {
                Class.forName(driverClassName);
//                Log.debug('JDBC driver ' + driverClassName + ' registered');
            } catch (e) {
                if (!skipError) {
                    throw new Error('Registering JDBC driver ' + driverClassName + ' failed: ' + e);
                }
            }
		},
		
		executeUpdate: function(connection, sql, values, types){
			if(JSB.isArray(sql)){
				// batch processing
				var batch = sql;
				var lastSql = null;
				var curStatement = null;
				connection.setAutoCommit(false);
				try {
					for(var b = 0; b < batch.length; b++){
						var bDesc = batch[b];
						var sql = bDesc.sql;
						var values = bDesc.values || null;
					    var types = bDesc.types || [];
					    if(sql !== lastSql){
					    	// commit previous statement
					    	if(curStatement){
								curStatement.executeBatch();
								if(!curStatement.isClosed()) {
									curStatement.close();
				                }
							}
					    	// create new statement
					    	lastSql = sql;
					    	curStatement = connection.prepareStatement(sql);
					    }
				    	for (var i = 0; i < values.length; i++) {
				            var value = values[i];
				            var type = types.length > i && types[i] || null;
				            var type = this._getJDBCType(value, type);
		                    this._setStatementArgument(curStatement, i + 1, value, type);
				        }
				    	curStatement.addBatch();
					}
					if(curStatement){
						curStatement.executeBatch();
						if(!curStatement.isClosed()) {
							curStatement.close();
		                }
						curStatement = null;
					}
					connection.commit();
				} finally {
					if(curStatement && !curStatement.isClosed()){
						curStatement.close();
					}
				}
			} else {
				var values = values || null;
			    var types = types || [];
			    connection.setAutoCommit(true);
				if(JSB.isArray(values)){
					var st = connection.prepareStatement(sql);
					try {
						for (var i = 0; i < values.length; i++) {
				            var value = values[i];
				            var type = types.length > i && types[i] || null;
				            var type = this._getJDBCType(value, type);
		                    this._setStatementArgument(st, i + 1, value, type);
				        }
						return st.executeUpdate();
					} finally {
						if (!st.isClosed()) {
		                    st.close();
		                }
					}
				} else {
					var st = connection.createStatement();
					try {
						return st.executeUpdate(sql);
					} finally {
						if (!st.isClosed()) {
		                    st.close();
		                }
					}
				}
			}
		},

		iteratedParametrizedQuery: function(connection, parametrizedSQL, getValue, getType, rowExtractor, onClose) {
		    var getType = getType || function(){
		        return null;
		    }

		    var values = [];
		    var types = [];
		    var sql = parametrizedSQL.replace(/\$\{(.*?)\}/g, function(str, param){
                var sqlIdx = values.length+1;

                values.push(getValue(param, sqlIdx));
                types.push(getType(param, sqlIdx));

                //return '$' + sqlIdx;
                return '?';
		    });

		    return this.iteratedQuery(connection, sql, values, types, rowExtractor, onClose);
		},

		iteratedQuery: function(connection, sql, values, types, rowExtractor, onClose) {
		    var values = values || null;
		    var types = types || [];
		    var rowExtractor = rowExtractor || this.RowExtractors.Json;

            Log.debug('Native SQL query: \n' + sql);
            Log.debug('Native SQL parameters: ' + JSON.stringify(values) + ', ' + JSON.stringify(types));

		    var rs;
		    connection.setAutoCommit(false);
		    try {
                if (JSB.isArray(values)) {
                    var st = connection.prepareStatement(sql);
                    for (var i = 0; i < values.length; i++) {
                        var value = values[i];
                        var type = types.length > i && types[i] || null;
                        var type = this._getJDBCType(value, type);
                        this._setStatementArgument(st, i + 1, value, type);
                    }
                    st.setFetchSize(10);
                    rs = st.executeQuery();
                } else {
                    var st = connection.createStatement();
                    st.setFetchSize(10);
                    rs = st.executeQuery(sql);
                }
            } catch (e) {
                connection.rollback();
            }
//		        Log.debug('SQL query executed');

		    return {
//		        columns: (function(){
//                    var count = rs.getMetaData().getColumnCount();
//                    var columns = [];
//                    for(var i = 1; i < count + 1; i++) {
//                        columns.push({
//                            index: i,
//                              label : ''+rs.getMetaData().getColumnLabel(i),
//                              name : ''+rs.getMetaData().getColumnName(i),
//                              sqlType : rs.getMetaData().getColumnType(i),
//                              type: '' + JDBCType.valueOf(rs.getMetaData().getColumnType(i))
//                          });
//                      }
//                      return columns;
//                })(),
                next: function(){
                    if (!st.isClosed()) {
                        var hasNext = rs.next();
                        var value = hasNext ? rowExtractor.call($this, rs): null;
                        if (JSB.isNull(value)) {
                            this.close();
                        }
                        return value;
                    }
                },
                close: function(){
                    if (!st.isClosed()) {
                        st.close();
                        if (JSB.isFunction(onClose)) {
                            onClose();
                        }
                    }
                },
		    };
		},

		// createStatement, prepareStatement, query, execute, call
		
		getSupportedTypeMap: function(connection){
			var databaseMetaData = connection.getMetaData();
			var rs = databaseMetaData.getTypeInfo();
			var typeMap = {};
			while(rs.next()){
				var typeName = '' + rs.getString('TYPE_NAME');
				var typeIdx = 0 + rs.getInt('DATA_TYPE');
				var precision = 0 + rs.getInt('PRECISION');
				typeMap['' + typeIdx] = {
					name: typeName,
					sqlType: typeIdx,
					precision: precision
				};
			}
			
			return typeMap;
		},
		
		getVendorTypeForSqlType: function(sqlType, typeMap){
			if(typeMap['' + sqlType]){
				return typeMap['' + sqlType].name;
			}
			return null;
		},

        _getJDBCType: function (value, type) {
            var jdbcType = type || null;
            if (JSB.isString(jdbcType)) {
                jdbcType = JDBCType.valueOf(jdbcType);
            } else if (JSB.isNull(jdbcType)) {
                // auto detect some standard types
                if (JSB.isNull(value)) {
                    jdbcType = JDBCType.NULL;
                } else if (JSB.isNumber(value)) {
                    if (Number.isInteger(value)) {
                        jdbcType = JDBCType.INTEGER;
                    } else {
                        jdbcType = JDBCType.DOUBLE;
                    }
                } else if (JSB.isBoolean(value)) {
                    jdbcType = JDBCType.BOOLEAN;
                } else if (JSB.isString(value)) {
                    jdbcType = JDBCType.NVARCHAR;
                } else if (JSB.isDate(value)) {
                    jdbcType = JDBCType.DATE;
                } else {
                    jdbcType = JDBCType.NVARCHAR;
                }
            }
            return jdbcType;
        },

        _setStatementArgument: function (st, idx, value, type) {
            if (JSB.isNull(value)) {
                st.setNull(idx, type.getVendorTypeNumber());
            } else {
                var sqlType = 0 + type.getVendorTypeNumber().intValue();
                switch(sqlType) {
                    case 0+Types.BIT:
                    case 0+Types.BOOLEAN:
                        st.setBoolean(idx, value);
                        break;
                    case 0+Types.TINYINT:
                    case 0+Types.BIGINT:
                    case 0+Types.SMALLINT:
                    case 0+Types.INTEGER:
                        st.setInt(idx, value);
                        break;
                    case 0+Types.REAL:
                    case 0+Types.FLOAT:
                    case 0+Types.DOUBLE:
                    case 0+Types.DECIMAL:
                    case 0+Types.NUMERIC:
                        st.setDouble(idx, value);
                        break;
                    case 0+Types.VARBINARY:
                    case 0+Types.BINARY:
                    case 0+Types.LONGVARBINARY:
                    case 0+Types.LONGVARCHAR:
                    case 0+Types.CHAR:
                    case 0+Types.VARCHAR:
                    case 0+Types.CLOB:
                    case 0+Types.OTHER:
                        st.setString(idx, value);
                        break;
                    case 0+Types.DATE:
                    case 0+Types.TIME:
                    case 0+Types.TIMESTAMP:
                        st.setDate(idx, new SqlDate(value.getTime()));
                        break;
                    case 0+Types.NULL:
                        st.setNull(idx, 0);
                        break;
                    default:
                        st.setString(idx, ''+value);
                        break;
                }
            }
        },

        _getColumnValue: function(resultSet, i){
        	var valObj = resultSet.getObject(i);
        	if(valObj == null){
        		return null;
        	}
            var type = 0+resultSet.getMetaData().getColumnType(i);
            switch (type) {
                case 0+Types.BIT:
                case 0+Types.BOOLEAN:
                    return !!resultSet.getBoolean(i);
                case 0+Types.TINYINT:
                case 0+Types.BIGINT:
                case 0+Types.SMALLINT:
                case 0+Types.INTEGER:
                    return 0.0+resultSet.getLong(i);
                case 0+Types.REAL:
                case 0+Types.FLOAT:
                case 0+Types.DOUBLE:
                case 0+Types.DECIMAL:
                case 0+Types.NUMERIC:
                    return 0.0+resultSet.getDouble(i);
                case 0+Types.VARBINARY:
                case 0+Types.BINARY:
                case 0+Types.LONGVARBINARY:
                case 0+Types.LONGVARCHAR:
                case 0+Types.CHAR:
                case 0+Types.VARCHAR:
                case 0+Types.CLOB:
                case 0+Types.OTHER:
                    return ''+resultSet.getString(i);
                case 0+Types.DATE:
                case 0+Types.TIME:
                case 0+Types.TIMESTAMP:
                    var date = new Date();
                    date.setTime(resultSet.getTimestamp(i).getTime());
                    return date;
                case 0+Types.ARRAY: {
                        var array = [];
                        var arrayRS = resultSet.getArray(i).getResultSet();
                        while(arrayRS.next()) {
                            array.push(this._getColumnValue(arrayRS, 2));
                        }
                        return array;
                    }
                case 0+Types.NULL:
                    return null;
                default:
                    return ''+resultSet.getString(i);
            }
        },

	}
})