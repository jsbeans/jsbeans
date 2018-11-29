({
	$name: 'JSB.Store.Sql.SQLSchemaInspector',
	$parent: 'JSB.Store.DataStore',

	$server: {
		$require: ['java:java.sql.JDBCType'],

		$constructor: function(){
		    $base();
		},

		extractSchemas: function(jdbcConnection, stageCallback, filter){
			var schemas = {};
            var databaseMetaData = jdbcConnection.getMetaData();
            var skipTypes = {
            	'INDEX': true,
            	'SEQUENCE': true,
            	'SYSTEM INDEX': true,
            	'SYSTEM TABLE': true,
            	'SYSTEM TOAST INDEX': true,
            	'SYSTEM VIEW': true
            };
            var tables = databaseMetaData.getTables(null, null, null, null/*['TABLE', 'VIEW']*/);
            var tableArr = [];
            var rxFilters = [];
            if(filter && filter.length > 0){
            	// match filter
            	var filters = filter.split(',');
            	for(var i = 0; i < filters.length; i++){
            		var curFilter = filters[i];
            		var pattern = '^' + curFilter.trim().replace('.', '\\.').replace('*', '.*?') + '$';
            		var rx = new RegExp(pattern, 'i');
            		rxFilters.push(rx);
            	}
            }
            
            while (tables.next()) {

                var tableSchema = ''+tables.getString("TABLE_SCHEM");
                var tableName = ''+tables.getString("TABLE_NAME");
                var tableType = ''+tables.getString("TABLE_TYPE");
                
                if(skipTypes[tableType]){
                	continue;
                }
                if(!tableSchema || tableSchema == 'null'){
                	tableSchema = 'public';
                }
                var compoundName = tableSchema + '.' + tableName;
                if(rxFilters && rxFilters.length > 0){
                	var bMatched = false;
                	// match filters
                	for(var i = 0; i < rxFilters.length; i++){
                		var rx = rxFilters[i];
                		if(rx.test(compoundName)){
                			bMatched = true;
                			break;
                		}
                	}
                	if(!bMatched){
                		continue;
                	}
                }
                
                if (!schemas[tableSchema]) {
                    schemas[tableSchema] = {
                        entryType: 'schema',
                        name: tableSchema,
                        tables: {}
                    };
                }

                var schemaDesc = schemas[tableSchema];

                var tableDesc = schemaDesc.tables[tableName] = JSB.merge({
                    entryType: 'table',
                    name: tableName,
                    type: tableType,
                    isView: tableType == "VIEW",
                    schema: tableSchema,
                    columns: {}
                }, schemaDesc.tables[tableName]);
                
                tableArr.push({
                	table: tableName,
                	schema: tableSchema
                });
            }
            
            for(var i = 0; i < tableArr.length; i++){
            	if(stageCallback){
            		stageCallback.call(this, i, tableArr.length);
            	}
            	var tableSchema = tableArr[i].schema;
            	var tableName = tableArr[i].table;
            	var schemaDesc = schemas[tableSchema];
            	var tableDesc = schemaDesc.tables[tableName];
                // list columns
                var columns = databaseMetaData.getColumns(null, tableSchema, tableName, null);
                while (columns.next()) {
                    var columnName = ''+columns.getString("COLUMN_NAME");
                    
                    try {
	                    tableDesc.columns[columnName] = JSB.merge({
	                        entryType: 'column',
	                        name: columnName,
	                        datatype: columns.getInt("DATA_TYPE"),
	                        datatypeName: '' + JDBCType.valueOf(columns.getInt("DATA_TYPE")).toString(),
	                        size: ''+columns.getString("COLUMN_SIZE"),
	                        decimalDigits: ''+columns.getString("DECIMAL_DIGITS"),
	                        comment: '' + columns.getString("REMARKS"),
	                        nullable: (columns.getString("IS_NULLABLE")||'').equalsIgnoreCase('YES'),
	                        autoIncrment: (columns.getString("IS_AUTOINCREMENT")||'').equalsIgnoreCase('YES'),
	                    }, tableDesc.columns[columnName]);
                    } catch(e){
                    	JSB.getLogger().warn('Column "'+columnName+'" skipped due to following error: ' + e.message);
                    }
                }

                // list primary keys
                var pks = databaseMetaData.getPrimaryKeys(null, tableSchema, tableName);
                while (pks.next()) {
                    var columnName = ''+pks.getString("COLUMN_NAME");
                    if(tableDesc.columns[columnName]){
                    	tableDesc.columns[columnName].primaryKey = ''+pks.getString("PK_NAME");
                    }
                }
                
                // list foreign keys
                var fks = databaseMetaData.getImportedKeys(null, tableSchema, tableName);
                while (fks.next()) {
                    var pTableName = ''+fks.getString("PKTABLE_NAME");
                    var pColumnName = ''+fks.getString("PKCOLUMN_NAME");
                    var fTableName = ''+fks.getString("FKTABLE_NAME");
                    var fColumnName = ''+fks.getString("FKCOLUMN_NAME");

                    var fTable = schemaDesc.tables[fTableName] = schemaDesc.tables[fTableName] || {columns:{}};
                    var fColumn = fTable.columns[fColumnName] = fTable.columns[fColumnName] || {};

                    fColumn.foreignKey = {
                        table: pTableName,
                        column: pColumnName
                    };
                }

            }
            return schemas;
		}
    }
})