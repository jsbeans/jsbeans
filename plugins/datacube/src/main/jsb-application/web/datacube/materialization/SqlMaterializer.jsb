{
	$name: 'DataCube.SqlMaterializer',
	$parent: 'DataCube.Materializer',
	
	$server: {
		$require: ['JSB.System.Config', 
		           'JSB.Store.StoreManager', 
		           'DataCube.MaterializationEngine',
		           'JSB.Store.Sql.JDBC',
		           'java:java.sql.JDBCType',
		           'JSB.Text.Translit'],
		           
		$bootstrap: function(){
			MaterializationEngine.registerMaterializer('DataCube.Model.SqlSource', this);
		},
		
		$constructor: function(engine, source){
			$base(engine, source);
		},
		
		translateType: function(jsonType){
			var sqlType = jsonType;
			switch(jsonType){
			case 'int':
			case 'integer':
				sqlType = JDBCType.INTEGER.getName();
				break;
			case 'boolean':
				sqlType = JDBCType.BOOLEAN.getName();
				break;
			case 'string':
				sqlType = JDBCType.VARCHAR.getName();
				break;
			case 'float':
			case 'double':
				sqlType = JDBCType.DOUBLE.getName();
				break;
			case 'date':
			case 'time':
			case 'datetime':
			case 'timestamp':
				sqlType = JDBCType.TIMESTAMP.getName();
				break;
			case 'array':
				sqlType = JDBCType.ARRAY.getName();
				break;
			}
			return sqlType;
		},
		
		createTable: function(cName, fields){
			var store = this.source.getStore();
			var connection = store.getConnection(true).get();
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
				var sql = 'create table '+suggestedName+' (';
				
				var fNameArr = Object.keys(fields);
				for(var i = 0; i < fNameArr.length; i++){
					sql += '"' + fNameArr[i] + '" ' + this.translateType(fields[fNameArr[i]]);
					if(i < fNameArr.length - 1){
						sql += ', ';
					}
				}
				sql += ')';
				
				JDBC.executeUpdate(connection, sql);
				
			} finally {
				connection.close();
			}
			
			return suggestedName;
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
					JDBC.executeUpdate(connection, 'drop index ' + tName + '.' + idxName);
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
					for(var i = 0; i < fNameArr.length; i++){
						sql += '"' + fNameArr[i] + '"';
						if(i < fNameArr.length - 1){
							sql += ', ';
						}
					}
					sql += ') values(';
					var values = [];
					for(var i = 0; i < fNameArr.length; i++){
						var fVal = obj[fNameArr[i]];
						values.push(fVal);
						sql += '?'
						if(i < fNameArr.length - 1){
							sql += ', ';
						}
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