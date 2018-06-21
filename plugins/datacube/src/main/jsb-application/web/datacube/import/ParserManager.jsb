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
					JSB.getLogger().debug('Importing: ' + entry.getName());
					$this.client().onStatusChanged(entry);
					try {
						$this.logAppend(entry, 'info', 'Импорт файла: ' + entry.getName());
						pInst.import();
						JSB.getLogger().debug('Import complete for: ' + entry.getName());
						$this.logAppend(entry, 'ok', 'Импорт файла ' + entry.getName() + ' успешно завершен');
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