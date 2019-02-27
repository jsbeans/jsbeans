{
	$name: 'DataCube.SqlMaterializer',
	$parent: 'DataCube.Materializer',
	
	$server: {
		$require: ['JSB.System.Config', 
		           'JSB.Store.StoreManager', 
		           'DataCube.MaterializationEngine',
		           'JSB.Store.Sql.JDBC',
		           'java:java.sql.JDBCType',
			        'Datacube.Types.DataTypes',
		           'java:java.sql.Types'],
		           
		$bootstrap: function(){
			MaterializationEngine.registerMaterializer('DataCube.Model.SqlSource', this);
		},
		
		$constructor: function(engine, source){
			$base(engine, source);
		},
		
		
		createTable: function(cName, fields, opts){
			var fieldMap = {};
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			var typeMap = JDBC.getSupportedTypeMap(connection);
			var vendor = JDBC.getDatabaseVendor(connection);
			var suggestedName = cName;
			var schema = opts && opts.schema || 'public';
			var alreadyExisted = false;
			try {
				var databaseMetaData = connection.getMetaData();
				// check schema for existence
				var rs = databaseMetaData.getSchemas();
				var schemaMap = {};
				while(rs.next()){
					var schemaName = ''+rs.getString("TABLE_SCHEM");
					schemaMap[schemaName] = true;
				}
				
				if(!schemaMap[schema]){
					// create new schema
					var sql = 'create schema "' + schema + '"';
					JDBC.executeUpdate(connection, sql);
				}
				
				var i = 2;
				while(true){
					var rs = databaseMetaData.getTables(null, schema, suggestedName, null);
					var curTabRecord = rs.next();
					if(curTabRecord){
						if(opts && opts.useExistingTable){
							alreadyExisted = true;
							// extract columns and return current name
							var columns = databaseMetaData.getColumns(null, schema, suggestedName, null);
							while(columns.next()) {
								var columnName = ''+columns.getString("COLUMN_NAME");
								if(fields[columnName]){
									fieldMap[columnName] = columnName;
								} else {
									// try to detect near column
									for(var fn in fields){
										if(fn.indexOf(columnName) >= 0 || columnName.indexOf(fn) >= 0){
											fieldMap[fn] = columnName;
											break;
										}
									}
								}
							}
/*							
							// check fieldMap
							if(Object.keys(fieldMap).length == 0 && Object.keys(fields).length > 0){
								throw new Error('Existed table "' + schema + '"."' + suggestedName + '" completely differs with current field set');
							}
*/							
							// perform missing columns
							for(var fn in fields){
								if(!fieldMap[fn]){
									// append missing column
									var fType = fields[fn].type;
									var fComment = fields[fn].comment;
									var sql = 'alter table "' + schema + '"."' +suggestedName + '" add column "' + fn + '" ' + DataTypes.toVendor(vendor, fType);
									JDBC.executeUpdate(connection, sql);
									
									// extract current field
									var columns = databaseMetaData.getColumns(null, schema, suggestedName, null);
									while(columns.next()) {
										var columnName = ''+columns.getString("COLUMN_NAME");
										if(columnName != fn && fn.indexOf(columnName) == -1 && columnName.indexOf(fn) == -1){
											continue;
										}
										fieldMap[fn] = columnName;
										
										if(fComment && fComment.length > 0){
											sql = 'comment on column "' + schema + '"."' + suggestedName + '"."' + columnName + '" is \'' + fComment + '\'';
											JDBC.executeUpdate(connection, sql);
										}
										break;
									}
								}
							}
							
							return {table: suggestedName, fieldMap: fieldMap};
						}
						suggestedName = cName + '_' + i++;
						continue;
					}
					break;
				}
				
				if(vendor == 'Microsoft SQL Server'){
					var sql = 'create table "' + schema + '"."' +suggestedName + '" (';
					var fNameArr = Object.keys(fields);
					for(var i = 0; i < fNameArr.length; i++){
						var fName = fNameArr[i];
						var fType = fields[fName].type;
						var jdbcType = DataTypes.toVendor(vendor, fType);
						if(i > 0){
							sql += ', ';
						}
						sql += '"' + fName + '" ' + jdbcType;
					}
					sql += ')';
					JDBC.executeUpdate(connection, sql);
					
					var columns = databaseMetaData.getColumns(null, schema, suggestedName, null);
					while(columns.next()) {
						var columnName = ''+columns.getString("COLUMN_NAME");
						if(fields[columnName]){
							fieldMap[columnName] = columnName;
						} else {
							throw new Error('Invalid column name: ' + columnName);
						}
					}
				} else {
					var sqlFields = {};

					// create table with suggestedName
					var sql = 'create table "' + schema + '"."' +suggestedName + '" ()';
					JDBC.executeUpdate(connection, sql);
					
					var fNameArr = Object.keys(fields);
					for(var i = 0; i < fNameArr.length; i++){
						var fType = fields[fNameArr[i]].type;
						var fComment = fields[fNameArr[i]].comment;
						sql = 'alter table "' + schema + '"."' +suggestedName + '" add column "' + fNameArr[i] + '" ' + DataTypes.toVendor(vendor, fType);
						JDBC.executeUpdate(connection, sql);
						
						// extract current field
						var columns = databaseMetaData.getColumns(null, schema, suggestedName, null);
						while(columns.next()) {
							var columnName = ''+columns.getString("COLUMN_NAME");
							if(sqlFields[columnName]){
								continue;
							}
							sqlFields[columnName] = true;
							fieldMap[fNameArr[i]] = columnName;
							
							if(fComment && fComment.length > 0){
								sql = 'comment on column "' + schema + '"."' + suggestedName + '"."' + columnName + '" is \'' + fComment + '\'';
								JDBC.executeUpdate(connection, sql);
							}
							break;
						}
					}
				}
				
			} catch(e){
				try {
					if(!alreadyExisted){
						JDBC.executeUpdate(connection, 'drop table "' + schema + '"."' +suggestedName + '"');
					}
				} catch(ex) {
				}
				throw e;
			} finally {
				connWrap.close();
			}
			return {table: suggestedName, fieldMap: fieldMap};
		},
		
		removeTable: function(tName, opts){
			if(!tName){
				return;
			}
			var schema = opts && opts.schema || 'public';
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, schema, tName, null);
				if(!rs.next()){
					return;
				}
				JDBC.executeUpdate(connection, 'drop table "' + schema + '"."' + tName + '"');
			} finally {
				connWrap.close();
			}
		},
		
		renameTable: function(oldName, newName, opts){
			if(!oldName || !newName){
				return;
			}
			var schema = opts && opts.schema || 'public';
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, schema, oldName, null);
				if(!rs.next()){
					return;
				}
				JDBC.executeUpdate(connection, 'alter table "' + schema + '"."' + oldName + '" rename to "' + schema + '"."' + newName + '"');
			} finally {
				connWrap.close();
			}
		},
		
		createIndex: function(tName, idxName, idxFields, opts){
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			var schema = opts && opts.schema || 'public';
			try {
				var databaseMetaData = connection.getMetaData();
				var rs = databaseMetaData.getTables(null, null, idxName, null);
				if(rs.next()){
					if(opts && opts.useExistingIndex){
						return;
					}
					JDBC.executeUpdate(connection, 'drop index "' + idxName + '"');
				}
				
				var sql = 'create index if not exists "' + idxName + '" on "' + schema + '"."' + tName + '" (';
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
		
		removeIndex: function(tName, idxName, opts){
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
		
		insert: function(tName, objArr, opts){
			function fixupValue(val){
				if(!JSB.isString(val)){
					return val;
				}
				// check for invalid UTF-8 symbols
				var newVal = '';
				for(var i = 0; i < val.length; i++){
					if(val[i] == '\u0000'){
						continue;
					}
					newVal += val[i];
				}
				return newVal;
			}
			
			var store = this.source.getStore();
			var connWrap = store.getConnection(true);
			var connection = connWrap.get();
			var schema = opts && opts.schema || 'public';
			if(!JSB.isArray(objArr)){
				objArr = [objArr];
			}
			try {
				var batch = [];
				for(var b = 0; b < objArr.length; b++){
					var obj = objArr[b];
					var fNameArr = Object.keys(obj);
					var sql = 'insert into "' + schema + '"."' + tName + '" (';
					var checkSql = 'select count(*) as count from "' + schema + '"."' + tName + '" where ';
					var bFirst = true;
					for(var i = 0; i < fNameArr.length; i++){
						if(JSB.isNull(obj[fNameArr[i]])){
							continue;
						}
						if(!bFirst){
							sql += ',';
							checkSql += ' and ';
						}
						sql += '"' + fNameArr[i] + '"';
						checkSql += '"' + fNameArr[i] + '" = ?'
						bFirst = false;
					}
					if(bFirst){
						// no columns added
						continue;
					}
					sql += ') values (';
					var values = [];
					bFirst = true;
					for(var i = 0; i < fNameArr.length; i++){
						var fVal = obj[fNameArr[i]];
						if(JSB.isNull(fVal)){
							continue;
						}
						if(!bFirst){
							sql += ',';
						}
						sql += '?';
						values.push(fixupValue(fVal));
						bFirst = false;
					}
					sql += ')';
					
					if(opts && opts.skipExistingRows){
						var checkIt = null, existedCount = 0;
						try {
							checkIt = JDBC.iteratedQuery(connection, checkSql, values);
							var checkRes = checkIt.next();
							existedCount = checkRes && checkRes.count && checkRes.count || 0;
						} catch(e) {
							existedCount = 0;
						} finally {
							if(checkIt){
								checkIt.close();
							}
						}
						
						if(existedCount > 0){
							continue;
						}
					}
					batch.push({
						sql: sql,
						values: values
					});
				}
				if(batch.length > 0){
					JDBC.executeUpdate(connection, batch);
				}
				return batch.length;
			} finally {
				connWrap.close();
			}
			return 0;
		}
	}
}