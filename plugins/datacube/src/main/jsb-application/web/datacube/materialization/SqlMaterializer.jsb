{
	$name: 'DataCube.SqlMaterializer',
	$parent: 'DataCube.Materializer',
	
	$server: {
		$require: ['JSB.System.Config', 
		           'JSB.Store.StoreManager', 
		           'DataCube.MaterializationEngine',
		           'JSB.Store.Sql.JDBC',
		           'java:java.sql.JDBCType',
		           'java:java.sql.Types',
		           'JSB.Text.Translit'],
		           
		$bootstrap: function(){
			MaterializationEngine.registerMaterializer('DataCube.Model.SqlSource', this);
		},
		
		$constructor: function(engine, source){
			$base(engine, source);
		},
		
		translateType: function(jsonType, typeMap){
			var sqlType = jsonType.toLowerCase();
			switch(sqlType){
			case 'int':
			case 'integer':
				sqlType = JDBC.getVendorTypeForSqlType(Types.INTEGER, typeMap);
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.DECIMAL, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.BIGINT, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.BIGINT, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.NUMERIC, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.DOUBLE, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.REAL, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.FLOAT, typeMap);
				}
				break;
			case 'boolean':
				sqlType = JDBC.getVendorTypeForSqlType(Types.BOOLEAN, typeMap);
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.BIT, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.INTEGER, typeMap);
				}
				break;
			case 'nvarchar':
			case 'varchar':
			case 'string':
				sqlType = JDBC.getVendorTypeForSqlType(Types.VARCHAR, typeMap);
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.NVARCHAR, typeMap);
				}
				break;
			case 'float':
				sqlType = JDBC.getVendorTypeForSqlType(Types.FLOAT, typeMap);
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.REAL, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.DOUBLE, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.NUMERIC, typeMap);
				}

				break;
			case 'double':
			case 'number':
				sqlType = JDBC.getVendorTypeForSqlType(Types.NUMERIC, typeMap);
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.DOUBLE, typeMap);
				}
				break;
			case 'date':
			case 'time':
			case 'datetime':
			case 'timestamp':
				sqlType = JDBC.getVendorTypeForSqlType(Types.TIMESTAMP, typeMap);
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.DATE, typeMap);
				}
				if(!sqlType){
					sqlType = JDBC.getVendorTypeForSqlType(Types.TIME, typeMap);
				}
				break;
			case 'array':
				sqlType = JDBCType.ARRAY.getName();
				break;
			}
			return sqlType;
		},
		
		createTable: function(cName, fields){
			var sqlFields = {};
			var fieldMap = {};
			var store = this.source.getStore();
			var connection = store.getConnection(true).get();
			var typeMap = JDBC.getSupportedTypeMap(connection);
			var suggestedName = cName;
			try {
				var databaseMetaData = connection.getMetaData();
				var i = 2;
				while(true){
					var rs = databaseMetaData.getTables(null, null, suggestedName, null);
					if(rs.next()){
						suggestedName = cName + '_' + i++;
						continue;
					}
					break;
				}
				
				// create table with suggestedName
				var sql = 'create table '+suggestedName+' ()';
				JDBC.executeUpdate(connection, sql);
				
				var fNameArr = Object.keys(fields);
				for(var i = 0; i < fNameArr.length; i++){
					sql = 'alter table ' + suggestedName + ' add column "c' + i + '_' + fNameArr[i] + '" ' + this.translateType(fields[fNameArr[i]], typeMap);
					JDBC.executeUpdate(connection, sql);
					
					// extract current field
					var columns = databaseMetaData.getColumns(null, null, suggestedName, null);
					while(columns.next()) {
						var columnName = ''+columns.getString("COLUMN_NAME");
						if(sqlFields[columnName]){
							continue;
						}
						sqlFields[columnName] = true;
						fieldMap[fNameArr[i]] = columnName;
						break;
					}
				}
				
			} catch(e){
				try {
					JDBC.executeUpdate(connection, 'drop table ' + suggestedName);
				} catch(ex) {
				}
				throw e;
			} finally {
				connection.close();
			}
			
			return {table: suggestedName, fieldMap: fieldMap};
		},
		
		removeTable: function(tName){
			if(!tName){
				return;
			}
			var store = this.source.getStore();
			var connection = store.getConnection(true).get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, tName, null);
				if(!rs.next()){
					return;
				}
				JDBC.executeUpdate(connection, 'drop table ' + tName);
			} finally {
				connection.close();
			}
		},
		
		renameTable: function(oldName, newName){
			if(!oldName || !newName){
				return;
			}
			var store = this.source.getStore();
			var connection = store.getConnection(true).get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, oldName, null);
				if(!rs.next()){
					return;
				}
				JDBC.executeUpdate(connection, 'alter table ' + oldName + ' rename to ' + newName);
			} finally {
				connection.close();
			}
		},
		
		createIndex: function(tName, idxName, idxFields){
			var store = this.source.getStore();
			var connection = store.getConnection(true).get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, idxName, null);
				if(rs.next()){
					JDBC.executeUpdate(connection, 'drop index ' + idxName);
				}
				
				var sql = 'create index ' + idxName + ' on ' + tName + '(';
				var fArr = Object.keys(idxFields);
				for(var i = 0; i < fArr.length; i++){
					sql += '"' + fArr[i] + '"';
					if(i < fArr.length - 1){
						sql += ', ';
					}
				}
				sql += ')';
				JDBC.executeUpdate(connection, sql);
			} finally {
				connection.close();
			}
		},
		
		removeIndex: function(tName, idxName){
			var store = this.source.getStore();
			var connection = store.getConnection(true).get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, idxName, null);
				if(rs.next()){
					JDBC.executeUpdate(connection, 'drop index ' + idxName);
				}
			} finally {
				connection.close();
			}		
		},
		
		insert: function(tName, objArr){
			var store = this.source.getStore();
			var connection = store.getConnection(true).get();
			if(!JSB.isArray(objArr)){
				objArr = [objArr];
			}
			try {
				var batch = [];
				for(var b = 0; b < objArr.length; b++){
					var obj = objArr[b];
					var fNameArr = Object.keys(obj);
					var sql = 'insert into ' + tName + '(';
					var bFirst = true;
					for(var i = 0; i < fNameArr.length; i++){
						if(JSB.isNull(obj[fNameArr[i]])){
							continue;
						}
						if(!bFirst){
							sql += ', ';
						}
						sql += '"' + fNameArr[i] + '"';
						bFirst = false;
					}
					sql += ') values(';
					var values = [];
					bFirst = true;
					for(var i = 0; i < fNameArr.length; i++){
						var fVal = obj[fNameArr[i]];
						if(JSB.isNull(fVal)){
							continue;
						}
						if(!bFirst){
							sql += ', ';
						}
						sql += '?'
						values.push(fVal);
						bFirst = false;
					}
					sql += ')';
					batch.push({
						sql: sql,
						values: values
					});
				}
				JDBC.executeUpdate(connection, batch);
			} finally {
				connection.close();
			}
		}
	}
}