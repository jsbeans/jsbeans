({
	$name: 'jsb.store.sql.JDBC',
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
		        // TODO
		    },

		    Json: function(resultSet){
		        // TODO
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
		    for(var name in this.JDBCDrivers) if (properties.hasOwnProperty(p)) {
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

		parametrizedQuery: function(connection, parametrizedSQL, getValue, getType, rowExtractor) {
		    var getType = getType || function(){
		        return null;
		    }
		    var values = [];
		    var types = [];
		    var sql = parametrizedSQL.replace(/\$\{(.*)\{/, function(str, param){
                var sqlIdx = values.length+1;

                values.push(getValue(param, sqlIdx));

                var type = getType(param, sqlIdx);
                if (type) types.push(type);

                return '$' + sqlIdx;
		    });

		    return query: function(connection, sql, values, types, rowExtractor);
		},

		query: function(connection, sql, values, types, rowExtractor) {
		    var values = values || null;
		    var types = types || [];
		    var resultSetProcessor = resultSetProcessor || this.RowExtractors.Json;

		    var st;
		    if (JSB.isArray(values)) {
		        st = connection.prepareStatement();
		        for (var i = 0; i < values.length; i++) {
		            var value = values[i];
		            var type = types.length > idx && types[idx] || null;
		            var type = this._getJDBCType(value, type);
                    this._setStatementArgument(st, value, type);
		        }
		    } else {
		        st = connection.createStatement();
		    }

		    var rs = st.executeQuery();
		    return {
		        columns: function(){
		            var count = rs.getMetaData().getColumnCount();
		            var columns = [];
		            for(var i = 1; i < count + 1; i++) {
		                columns.push({
		                    index: i,
                            label : rs.getMetaData().getColumnLabel(i),
                            name : rs.getMetaData().getColumnName(i),
                            type : rs.getMetaData().getColumnTypeName(i)
                        });
                    }
                    return columns;
		        },

		        next: function(){
		            var resultSet = rs.next();
		            if (resultSet == null) {
		                rs.close();
		            }
		            return rowExtractor(resultSet);
		        },

		        close: function() {
		            rs.close();
		        },

		        toArray: function() {
		            var resultArray = [];
		            while(resultSet = rs.next()) {
                        resultArray.push(rowExtractor(resultSet));
                    }
                    rs.close();
                    return resultArray;
		        }
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
                    jdbcType = JDBCType.STRING;
                } else {
                    jdbcType = JDBCType.STRING;
                }
            }
            return jdbcType;
        },

        _setStatementArgument: function (st, value, type) {
            if (JSB.isNull(value)) {
                st.setNull(i+1, type.getVendorTypeNumber());
            } else {
                switch(type.getVendorTypeNumber()) {
                    case Types.BIT:
                    case Types.BOOLEAN:
                        st.setBoolean(i+1, value);
                        break;
                    case Types.TINYINT:
                    case Types.BIGINT:
                    case Types.SMALLINT:
                    case Types.INTEGER:
                        st.setInt(i+1, value);
                        break;
                    case Types.REAL:
                    case Types.FLOAT:
                    case Types.DOUBLE:
                    case Types.DECIMAL:
                    case Types.NUMERIC:
                        st.setDouble(i+1, value);
                        break;
                    case Types.VARBINARY:
                    case Types.BINARY:
                    case Types.LONGVARBINARY:
                    case Types.LONGVARCHAR:
                    case Types.CHAR:
                    case Types.VARCHAR:
                    case Types.CLOB:
                    case Types.OTHER:
                        st.setString(i+1, value);
                        break;
                    case Types.DATE:
                    case Types.TIME:
                    case Types.TIMESTAMP:
                        st.setDate(i+1, new Date(value.getTime()));
                        break;
                    case Types.NULL:
                        st.setNull(i+1, 0);
                        break;
                    default:
                        st.setString(i+1, ''+value);
                        break;
                }
            }
        }

	}
})