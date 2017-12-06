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
			ArrayHelper: 	'java:org.jsbeans.helpers.ArrayHelper'
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
		
		getDatabaseVendor: function(connection){
			var databaseMetaData = connection.getMetaData();
			return '' + databaseMetaData.getDatabaseProductName();
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
		                    this._setStatementArgument(curStatement, i + 1, value, type, connection);
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
		                    this._setStatementArgument(st, i + 1, value, type, connection);
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

		validationQuery: function(connection, timeoutSecs) {
		    connection.setAutoCommit(false);
		    try {
                var st = connection.createStatement();
                try {
                    st.executeQuery('SELECT 1');
                } finally {
                    st.close();
                }
            } catch (e) {
            	try{
            		connection.rollback();
            	}catch(x){}
                throw e;
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
		    if(!connection){
		    	debugger;
		    }
		    connection.setAutoCommit(false);
		    try {
                if (JSB.isArray(values)) {
                    var st = connection.prepareStatement(sql);
                    for (var i = 0; i < values.length; i++) {
                        var value = values[i];
                        var type = types.length > i && types[i] || null;
                        var type = this._getJDBCType(value, type);
                        this._setStatementArgument(st, i + 1, value, type, connection);
                    }
                    st.setFetchSize(10);
                    rs = st.executeQuery();
                } else {
                    var st = connection.createStatement();
                    st.setFetchSize(10);
                    rs = st.executeQuery(sql);
                }
            } catch (e) {
            	try{
            		connection.rollback();
            	}catch(x){}
                throw e;
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
				var typeKey = '' + typeIdx;
				if(!typeMap[typeKey]){
					typeMap[typeKey] = [];
				}
				typeMap[typeKey].push({
					name: typeName,
					sqlType: typeIdx,
					precision: precision
				});
			}
			
			return typeMap;
		},
		
		getVendorTypeForSqlType: function(sqlType, typeMap){
			var arr = typeMap['' + sqlType];
			if(arr && arr.length > 0){
				return arr[0].name;
			}
			return null;
		},

		getVendorTypesForSqlType: function(sqlType, typeMap){
			var arr = typeMap['' + sqlType];
			var nameMap = {};
			if(arr && arr.length > 0){
				for(var i = 0; i < arr.length; i++){
					nameMap[arr[i].name] = arr[i];
				}
			}
			return nameMap;
		},
		
		_typeMap: {
			'PostgreSQL': {
				'integer': 'int8',
				'int': 'int8',
				'boolean': 'bool',
				'nvarchar': 'varchar',
				'varchar': 'varchar',
				'string': 'text',
				'float': 'real',
				'double': 'double precision',
				'number': 'numeric',
				'date': 'timestamp',
				'time': 'timestamp',
				'datetime': 'timestamp',
				'timestamp': 'timestamp',
				'array': '_text',
				'object': 'text'
			}
		},
		
		translateType: function(jsonType, vendor){
			var vendorTypeMap = this._typeMap[vendor];
			if(!vendorTypeMap){
				throw new Error('Unsupported database vendor: ' + vendor);
			}
			var sqlType = jsonType.toLowerCase();
			return vendorTypeMap[sqlType] || sqlType;
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
                } else if(JSB.isArray(value)) {
                	jdbcType = JDBCType.ARRAY;
                } else {
                    jdbcType = JDBCType.NVARCHAR;
                }
            }
            return jdbcType;
        },

        _setStatementArgument: function (st, idx, value, type, connection) {
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
                    case 0+Types.SMALLINT:
                        st.setInt(idx, value);
                        break;
                    case 0+Types.INTEGER:
                    case 0+Types.BIGINT:
                    	st.setLong(idx, value);
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
                    case 0+Types.NVARCHAR:
                    case 0+Types.CLOB:
                    case 0+Types.OTHER:
                    	if(JSB.isObject(value) || JSB.isArray(value)){
                    		value = JSON.stringify(value);
                    	}
                        st.setString(idx, '' + value);
                        break;
                    case 0+Types.DATE:
                    case 0+Types.TIME:
                    case 0+Types.TIMESTAMP:
                        st.setDate(idx, new SqlDate(value.getTime()));
                        break;
                    case 0+Types.ARRAY:
                    	var newArr = [];
                    	for(var i = 0; i < value.length; i++){
                    		if(JSB.isObject(value[i]) || JSB.isArray(value[i])){
                    			newArr.push(JSON.stringify(value[i]));
                        	} else {
                        		newArr.push('' + value[i]);
                        	}
                    	}
                    	var vendor = this.getDatabaseVendor(connection);
                    	st.setArray(idx, connection.createArrayOf(this.translateType('string', vendor), ArrayHelper.toArray(newArr)));
                    	break;
                    case 0+Types.NULL:
                        st.setNull(idx, 0);
                        break;
                    default:
                    	if(JSB.isObject(value) || JSB.isArray(value)){
                    		value = JSON.stringify(value);
                    	}
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