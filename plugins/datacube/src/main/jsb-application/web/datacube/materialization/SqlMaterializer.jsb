{
	$name: 'DataCube.SqlMaterializer',
	$parent: 'DataCube.Materializer',
	
	$server: {
		$require: ['JSB.System.Config', 
		           'JSB.Store.StoreManager', 
		           'DataCube.MaterializationEngine',
		           'JSB.Store.Sql.JDBC',
		           'java:java.sql.JDBCType',
		           'java:java.sql.Types'],
		           
		$bootstrap: function(){
			MaterializationEngine.registerMaterializer('DataCube.Model.SqlSource', this);
		},
		
		$constructor: function(engine, source){
			$base(engine, source);
		},
		
		
		createTable: function(cName, fields){
			var sqlFields = {};
			var fieldMap = {};
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			var typeMap = JDBC.getSupportedTypeMap(connection);
			var vendor = JDBC.getDatabaseVendor(connection);
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
				var sql = 'create table "'+suggestedName+'" ()';
				JDBC.executeUpdate(connection, sql);
				
				var fNameArr = Object.keys(fields);
				for(var i = 0; i < fNameArr.length; i++){
					sql = 'alter table "' + suggestedName + '" add column "' + fNameArr[i] + '" ' + JDBC.translateType(fields[fNameArr[i]], vendor);
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
					JDBC.executeUpdate(connection, 'drop table "' + suggestedName + '"');
				} catch(ex) {
				}
				throw e;
			} finally {
				connWrap.close();
			}
			return {table: suggestedName, fieldMap: fieldMap};
		},
		
		removeTable: function(tName){
			if(!tName){
				return;
			}
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, tName, null);
				if(!rs.next()){
					return;
				}
				JDBC.executeUpdate(connection, 'drop table "' + tName + '"');
			} finally {
				connWrap.close();
			}
		},
		
		renameTable: function(oldName, newName){
			if(!oldName || !newName){
				return;
			}
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, oldName, null);
				if(!rs.next()){
					return;
				}
				JDBC.executeUpdate(connection, 'alter table "' + oldName + '" rename to "' + newName + '"');
			} finally {
				connWrap.close();
			}
		},
		
		createIndex: function(tName, idxName, idxFields){
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, idxName, null);
				if(rs.next()){
					JDBC.executeUpdate(connection, 'drop index "' + idxName + '"');
				}
				
				var sql = 'create index "' + idxName + '" on "' + tName + '" (';
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
				connWrap.close();
			}
		},
		
		removeIndex: function(tName, idxName){
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, idxName, null);
				if(rs.next()){
					JDBC.executeUpdate(connection, 'drop index "' + idxName + '"');
				}
			} finally {
				connWrap.close();
			}		
		},
		
		insert: function(tName, objArr){
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			if(!JSB.isArray(objArr)){
				objArr = [objArr];
			}
			try {
				var batch = [];
				for(var b = 0; b < objArr.length; b++){
					var obj = objArr[b];
					var fNameArr = Object.keys(obj);
					var sql = 'insert into "' + tName + '" (';
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
				connWrap.close();
			}
		}
	}
}