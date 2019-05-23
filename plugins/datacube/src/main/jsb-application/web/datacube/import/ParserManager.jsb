/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.ParserManager',
	$singleton: true,
	
	$client: {
		supportedMap: {},
		
		getSupportedParsers: function(entry, callback){
			this.server().getSupportedParsers(entry, callback);
		},
		
		onStatusChanged: function(entry){
			$this.publish('ParserManager.statusChanged', entry);
		},
		
		onClearLog: function(entry){
			$this.publish('ParserManager.clearLog', {entry:entry});
		},
		
		onAppendLog: function(entry, desc){
			$this.publish('ParserManager.appendLog', {entry:entry, desc:desc});
		}
	},
	
	$server: {
		$require: ['DataCube.MaterializationEngine',
		           'JSB.Workspace.WorkspaceController',
		           'JSB.Crypt.MD5'],
		           
		parsers: {},
		
		registerParser: function(parserJsb, opts){
			if(!(parserJsb instanceof JSB)){
				throw new Error('Only JSB object expected in registerParser');
			}
			if(!parserJsb.isSubclassOf('DataCube.Parser')){
				throw new Error('Bean "'+parserJsb.$name+'" is not subclassed from "DataCube.Parser"');
			}
			
			this.parsers[parserJsb.$name] = {opts: opts};
		},
		
		getParserScheme: function(jsb){
			if(!jsb || !jsb.getDescriptor() || !jsb.isSubclassOf('DataCube.Parser')){
				return;
			}
			
			return JSB.merge(true, {}, this.getParserScheme(jsb.getParent()) || {}, jsb.getDescriptor().$scheme || {})
		},
		
		getSupportedParsers: function(fileEntry){
			var supported = [];
			for(var pJsbName in this.parsers){
				var pDesc = this.parsers[pJsbName];
				var pOpts = pDesc.opts;
				if(!pOpts || !pOpts.accepts || !JSB.isFunction(pOpts.accepts)){
					continue;
				}
				var bAccepts = pOpts.accepts.call(this, fileEntry);
				if(bAccepts){
					var pJsb = JSB.get(pJsbName);
					supported.push({
						jsb: pJsbName,
						scheme: this.getParserScheme(pJsb),
						name: pOpts.name
					});
				}
			}
			
			return supported;
		},
		
		createParser: function(entry, parser, values){
			if(!this.parsers[parser]){
				throw new Error('Failed to find parser: ' + parser);
			}
			var pJsbClass = JSB.get(parser).getClass();
			
			var parser = new pJsbClass(entry, values);
			return parser;
		},
		
		runStructureAnalyzing: function(entry, parser, values){
			var curStatus = entry.property('status') || 'ready';
			if(curStatus != 'ready'){
				return;
			}
			$this.logClear(entry);
			
			var pInst = this.createParser(entry, parser, values);
			JSB.defer(function(){
				entry.property('status', 'analyzing');
				entry.property('values', values);
				JSB.getLogger().debug('Analyzing structure for: ' + entry.getName());
				$this.client().onStatusChanged(entry);
				var struct = null;
				try {
					try {
						$this.logAppend(entry, 'info', 'Анализ файла: ' + entry.getName());
						pInst.analyze();
					} catch(e){
						if(e == 'Break'){
							// Do nothing
						} else if(e == 'Cancel'){
							$this.logAppend(entry, 'error', 'Анализ прерван пользователем');
							throw e;
						} else {
							$this.logAppend(entry, 'error', e);
							throw e;
						}
					}
					struct = pInst.getStruct();
					pInst.prepare();
					
					entry.property('structure', struct);
					entry.property('values', pInst.getValues());
					$this.logAppend(entry, 'ok', 'Анализ успешно завершен: ' + entry.getName());
					JSB.getLogger().debug('Analysis complete for: ' + entry.getName() + ': ' + JSON.stringify(struct, null, 4));
				} finally {
					entry.property('status', 'ready');
					$this.client().onStatusChanged(entry);
					pInst.destroy();
				}
			}, 0);
			return pInst;
		},
		
		runImport: function(entry, parser, values){
			var curStatus = entry.property('status') || 'ready';
			if(curStatus != 'ready'){
				return;
			}
			$this.logClear(entry);
			var pInst = null;
			try {
				// create parser
				pInst = this.createParser(entry, parser, values);
				
				JSB.defer(function(){
					entry.property('values', values);
					entry.property('status', 'importing');
					$this.client().onStatusChanged(entry);
					
					var mInst = null;
					
					try {
						// prepare batch
						var batch = [], importTables = {}, lastParser = null;
						
						if(pInst.getContext().find('useBatch').checked() && pInst.getContext().find('batchFolder').getEntry()){
							// combine items in folder
							var entries = $this._combineEntriesInFolder(pInst.getContext().find('batchFolder').getEntry(), pInst);
							for(var i = 0; i < entries.length; i++){
								var curEntry = entries[i];
								batch.push({
									rootEntry: entry,
									entry: curEntry,
									cancelFlag: false,
									importTables: importTables,
								});
							}
						} else {
							batch.push({
								rootEntry: entry,
								entry: entry,
								parser: pInst,
								cancelFlag: false,
								importTables: importTables,
							});
						}
						
						if(batch.length > 0){
							// create materializer
							var dbSource = pInst.getContext().find('databaseEntry').getEntry();
/*							var dbVal = pInst.getContext().find('databaseEntry').value();
							var dbSource = WorkspaceController.getWorkspace(dbVal.workspaceId).entry(dbVal.entryId);*/
							$this.logAppend(entry, 'info', 'Создание материализатора для источника "' + dbSource.getName() + '"');
							mInst = MaterializationEngine.createMaterializer(dbSource);

							for(var i = 0; i < batch.length; i++){
								var b = batch[i];
								b.mInst = mInst;
								if(b.rootEntry != b.entry){
									if(!b.parser){
										lastParser = b.parser = $this.createParser(b.entry, parser, values);
									}
									b.entry.property('values', values);
									b.entry.property('status', 'importing');
									$this.client().onStatusChanged(b.entry);
								} else {
									if(!b.parser){
										b.parser = pInst;
									}
								}
								
								$this._import(b);
								
								if(b.rootEntry != b.entry){
									b.parser.destroy();
									lastParser = null;
									b.entry.property('status', 'ready');
									$this.client().onStatusChanged(b.entry);
								}
							}
							
							dbSource.extractScheme();
						}

					} catch(e){
						if(e == 'Break'){
							// Do nothing
						} else if(e == 'Cancel'){
							$this.logAppend(entry, 'error', 'Импорт файла прерван пользователем');
							throw e;
						} else {
							$this.logAppend(entry, 'error', e);
							throw e;
						}
					} finally {
						if(mInst){
							mInst.destroy();
						}
						if(lastParser){
							lastParser.destroy();
						}
						entry.property('status', 'ready');
						$this.client().onStatusChanged(entry);
						pInst.destroy();
					}
				}, 0);
			} catch(e){
				if(pInst){
					pInst.destroy();
				}
				throw e;
			}
		},
		
		_import: function(importContext){
			var batchSize = 100;
			var mInst = importContext.mInst;
			
			$this.logAppend(importContext.rootEntry, 'info', 'Импорт файла: ' + importContext.entry.getName());
			
			importContext.localTablesStats = {};
			
			importContext.parser.parse(function(tableDesc, rowData){
				if(importContext.parser.cancelFlag || importContext.cancelFlag){
					throw 'Cancel';
				}
				if(!importContext.importTables){
					importContext.importTables = {};
				}
				if(!importContext.importTables[tableDesc.table]){
					importContext.importTables[tableDesc.table] = {
						created: false,
						columns: {},
						rows: [],
						total: 0
					}
				}
				if(!importContext.localTablesStats[tableDesc.table]){
					importContext.localTablesStats[tableDesc.table] = {
						created: false,
						columns: {},
						total: 0
					}
				}
				
				var tDesc = importContext.importTables[tableDesc.table];
				var tStatDesc = importContext.localTablesStats[tableDesc.table];
				
				// update columns
				if(!tDesc.created){
					for(var c in tableDesc.columns){
						tDesc.columns[c] = tableDesc.columns[c];
						if(!tDesc.columns[c].type){
							// detect type
							var type = importContext.parser.detectValueTable(rowData[c]);
							if(type != 'null'){
								tDesc.columns[c].type = type;
							}
						}
					}	
				}
				if(!tStatDesc.created){
					for(var c in tableDesc.columns){
						tStatDesc.columns[c] = tableDesc.columns[c];
					}
					tStatDesc.created = true;
				}
				
				
				// update rows
				tDesc.rows.push(rowData);
				if(tDesc.rows.length >= batchSize){
					$this._storeBatch(importContext);
				}
			});
			$this._storeBatch(importContext);
			
			var entry = importContext.entry;
			
			// store tables count
			entry.tables = Object.keys(importContext.localTablesStats).length;
			entry.property('tables', entry.tables);
			
			// store records count
			var records = 0, columns = 0;
			for(var t in importContext.localTablesStats){
				records += importContext.localTablesStats[t].total;
				columns += Object.keys(importContext.localTablesStats[t].columns).length;
			}
			
			entry.records = records;
			entry.property('records', entry.records);

			entry.columns = columns;
			entry.property('columns', entry.columns);
			
			entry.lastTimestamp = Date.now();
			entry.property('lastTimestamp', entry.lastTimestamp);
			
			$this.logAppend(importContext.rootEntry, 'ok', 'Импорт файла ' + entry.getName() + ' успешно завершен');
		},
		
		_storeBatch: function(importContext){
			var mInst = importContext.mInst;
			var pCtx = importContext.parser.getContext();
			if(!importContext.importOpts){
				importContext.importOpts = {
					schema: pCtx.find('databaseScheme').value() || 'public',
					treatEmptyStringsAsNull: importContext.parser.options.treatEmptyStringsAsNull,
					useExistingTable: pCtx.find('existingTableAction').value() == 'databaseTableAppend',
					skipExistingRows: pCtx.find('existingTableAction').value() == 'databaseTableAppend' && pCtx.find('skipExistingRows').checked()
				};
			}
			for(var t in importContext.importTables){
				var tDesc = importContext.importTables[t];
				var tStatDesc = importContext.localTablesStats[t];
				
				if(!tDesc.created){
					// check for all columns are filled
					var bColumnsCorrect = true;
					for(var c in tDesc.columns){
						if(!tDesc.columns[c] || !tDesc.columns[c].type){
							bColumnsCorrect = false;
							break;
						}
					}
					if(bColumnsCorrect){
						if(pCtx.find('existingTableAction').value() == 'databaseTableOverwrite'){
							this.logAppend(importContext.rootEntry, 'info', 'Удаление старой таблицы: ' + t);
							mInst.removeTable(t, importContext.importOpts);
						}
						// create table in db
						var createTableInfoText = 'Создание таблицы: ' + t;
						if(importContext.importOpts.useExistingTable){
							createTableInfoText = 'Актуализация таблицы: ' + t;
						}
						this.logAppend(importContext.rootEntry, 'info', createTableInfoText);
						var res = mInst.createTable(t, tDesc.columns, importContext.importOpts);
						if(res){
							tDesc.table = res.table;
							tDesc.fieldMap = res.fieldMap;
							tDesc.created = true;
							if(!importContext.importOpts.useExistingTable){
								this.logAppend(importContext.rootEntry, 'info', 'Таблица "'+tDesc.table+'" успешно создана');
							}
						}
					} else {
						continue;
					}
				}
				
				// upload rows
				if(tDesc.rows.length == 0){
					continue;
				}
				
				var translatedRows = [];
				for(var i = 0; i < tDesc.rows.length; i++){
					var row = tDesc.rows[i];
					var nRow = {};
					for(var j in row){
						nRow[tDesc.fieldMap[j]] = row[j];
					}
					translatedRows.push(nRow);
				}
				var written = mInst.insert(tDesc.table, translatedRows, importContext.importOpts);
				tDesc.total += written;
				tStatDesc.total += written;
				this.logAppend(importContext.rootEntry, 'info', 'В таблицу "'+tDesc.table+'" записано ' + tDesc.total + ' строк', MD5.md5('rowsWritten' + tDesc.table));
				tDesc.rows = [];
			}
		},
		
		_combineEntriesInFolder: function(folderEntry, pInst){
			var entries = [];
			var bRecursive = pInst.getContext().find('batchRecursive').checked();
			
			function proceedFolder(f){
				var chDesc = f.getChildren();
				for(var chId in chDesc){
					var chObj = chDesc[chId];
					if(bRecursive && JSB.isInstanceOf(chObj, 'JSB.Workspace.FolderEntry')){
						proceedFolder(chObj);
					}
					if(!JSB.isInstanceOf(chObj, 'JSB.Workspace.FileEntry')){
						continue;
					}
					var supported = $this.getSupportedParsers(chObj);
					for(var i = 0; i < supported.length; i++){
						var sJsbName = supported[i].jsb;
						if(pInst.getJsb().$name == sJsbName){
							entries.push(chObj);
							break;
						}
					}
				}
			}
			
			proceedFolder(folderEntry);
			
			return entries;
		},

		
		loadSourcePreview: function(entry, parser, values){
			var pInst = this.createParser(entry, parser, values);
			try {
				return pInst.getSourcePreview();
			} finally {
				pInst.destroy();
			}
		},
		
		getEntryStatus: function(entry){
			return {
				status: entry.property('status') || 'ready',
				values: entry.property('values')
			}
		},
		
		storeEntryValues: function(entry, values){
			entry.property('values', values);
			$this.client().onStatusChanged(entry);
		},
		
		cancelAction: function(entry){
			this.publish('ParserManager.cancel', entry);
			entry.property('status', 'ready');
			$this.client().onStatusChanged(entry);
		},
		
		executePreview: function(entry, parser, values){
			var pInst = this.createParser(entry, parser, values);
			try {
				var context = pInst.getContext();
				var maxRows = context.find('previewRowCount').value() || 50;
				var restrictCellLength = context.find('restrictCellLength').checked() ? context.find('restrictCellLength').value() : 0;
				var tables = {};
				var tablesCtxArr = context.findAll('tables');
				if(tablesCtxArr.length == 0){
					return tables;
				}
				for(var i = 0; i < tablesCtxArr.length; i++){
					var tableCtx = tablesCtxArr[i];
					var tableName = tableCtx.getName();
					if(tableCtx.find('unionWithTable').checked()){
						var unionWithTable = tableCtx.find('unionWithTable').value();
						if(unionWithTable && unionWithTable != tableName){
							continue;
						}
					}
					tables[tableName] = {
						columns: null,
						rows: []
					};
				}
				
				try {
					pInst.parse(function(tableDesc, rowData){
						if(!tables[tableDesc.table]){
							tables[tableDesc.table] = {
								columns: null,
								rows: []
							}
						}
						if(tables[tableDesc.table].rows.length >= maxRows){
							return;
						}
						if(!tables[tableDesc.table].columns){
							tables[tableDesc.table].columns = tableDesc.columns;
						}
						if(restrictCellLength){
							for(var c in rowData){
								if(JSB.isString(rowData[c]) && rowData[c].length > restrictCellLength){
									rowData[c] = rowData[c].substr(0, restrictCellLength) + '...';
								}
							}
						}
						tables[tableDesc.table].rows.push(rowData);
						if(tables[tableDesc.table].rows.length >= maxRows){
							// check for all tables to be filled enough
							for(var t in tables){
								if(tables[t].rows.length < maxRows){
									return;
								}
							}
							throw 'Break';
						}
					});
				} catch(e){
					if(e != 'Break'){
						$this.logAppend(entry, 'error', e);
						throw e;
					}
				} 
				
				// combine tables
				return tables;
			} finally {
				pInst.destroy();
			}
		},
		
		logClear: function(entry){
			if(entry.existsArtifact('.log')){
				entry.removeArtifact('.log');
				this.client().onClearLog(entry);
			}
		},
		
		logAppend: function(entry, type, str, key){
			if(!key){
				key = JSB.generateUid();
			}
			if(!JSB.isString(str)){
				if(str.message){
					str = (str.name ? str.name + ': ' : '') + str.message;
				} else {
					str = JSON.stringify(str);
				}
			}
			
			var desc = {key: key, type: type, data: str, time: Date.now()};
			var opts = {charset: 'UTF-8'};
			if(entry.existsArtifact('.log')){
				opts.append = true;
			}
			entry.storeArtifact('.log', JSON.stringify(desc) + '\r\n', opts);
			this.client().onAppendLog(entry, desc);
		},
		
		logRead: function(entry){
			var logEntries = [];
			var logMap = {};
			if(!entry.existsArtifact('.log')){
				return logEntries;
			}
			var stream = entry.loadArtifact('.log', {stream:true, charset: 'UTF-8'});
			try {
				while(true) {
					var line = stream.readLine();
					if(JSB.isNull(line)){
						break;
					}
					var logEntry = JSON.parse(line);
					logMap[logEntry.key] = logEntry;
				}
			} finally {
				stream.close();	
			}
			for(var key in logMap){
				logEntries.push(logMap[key]);
			}
			logEntries.sort(function(a, b){
				return a.time - b.time;
			});
			
			return logEntries;
		}
	}
}