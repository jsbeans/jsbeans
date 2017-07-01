({
	$name: 'JSB.Store.Sql.JDBC',
	$singleton: true,

	$server: {
		$require: [
		    'java:java.lang.Class',
		    'java:java.util.Properties',
			'java:java.sql.DriverManager',
			'java:java.sql.JDBCType',
			'java:java.sql.Types',
			'java:java.sql.Date',
		],

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
		        debugger;
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
                Log.debug('JDBC driver ' + driverClassName + ' registered');
            } catch (e) {
                if (!skipError) {
                    throw new Error('Registering JDBC driver ' + driverClassName + ' failed: ' + e);
                }
            }
		},

		iteratedParametrizedQuery: function(connection, parametrizedSQL, getValue, getType, rowExtractor, onClose) {
		    var getType = getType || function(){
		        return null;
		    }

		    var values = [];
		    var types = [];
		    var sql = parametrizedSQL.replace(/\$\{(.*)\}/, function(str, param){
                var sqlIdx = values.length+1;

                values.push(getValue(param, sqlIdx));
                types.push(getType(param, sqlIdx));

                //return '$' + sqlIdx;
                return '?';
		    });

		    return this.query(connection, sql, values, types, rowExtractor, onClose);
		},

		iteratedQuery: function(connection, sql, values, types, rowExtractor, onClose) {
		    var values = values || null;
		    var types = types || [];
		    var rowExtractor = rowExtractor || this.RowExtractors.Json;

		    var rs;
		    if (JSB.isArray(values)) {
		        var st = connection.prepareStatement(sql);
		        for (var i = 0; i < values.length; i++) {
		            var value = values[i];
		            var type = types.length > i && types[i] || null;
		            var type = this._getJDBCType(value, type);
                    this._setStatementArgument(st, i + 1, value, type);
		        }
		        rs = st.executeQuery();
		    } else {
		        var st = connection.createStatement();
		        rs = st.executeQuery(sql);
		    }

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
                    var resultSet = rs.next();
                    var value = rowExtractor.call($this, resultSet);
                    if (JSB.isNull(value)) {
                        this.close();
                    }
                    return value;
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
                switch(0+type.getVendorTypeNumber()) {
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
                        st.setDate(idx, new Date(value.getTime()));
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
                case 0+Types.NULL:
                    return null;
                default:
                    return ''+resultSet.getString(i);
            }
        },

	}
})