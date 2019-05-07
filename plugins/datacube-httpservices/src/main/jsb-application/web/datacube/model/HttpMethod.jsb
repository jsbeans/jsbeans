{
	$name: 'DataCube.Model.HttpMethod',
	$parent: 'DataCube.Model.QueryableEntry',
	
	$scheme: {
		request: {
			render: 'group',
			name: 'Запрос',
			items: {
				params: {
					render: 'group',
					name: 'Параметры',
					multiple: true,
					items: {
						pName: {
							render: 'item',
							name: 'Название',
							commonField: 'pName'
						},
						pType: {
							render: 'select',
							name: 'Тип',
							items: {
								ctString: {
									name: 'string',
									value: 'string',
								},
								ctInteger: {
									name: 'integer',
									value: 'integer',
								},
								ctFloat: {
									name: 'double',
									value: 'double',
								},
								ctBoolean: {
									name: 'boolean',
									value: 'boolean',
								}
							}
						},
						pValue: {
							render: 'item',
							name: 'Значение по умолчанию',
							commonField: 'pValue'
						},
						pUseInRequest: {
							render: 'item',
							name: 'Использовать в запросе',
							optional: 'checked',
							editor: 'none'
						}
					}
				},
				url: {
					render: 'item',
					name: 'URL',
					editor: 'DataCube.Controls.HttpTemplateEditor',
					editorOpts: {
						prefix: '',
						paramNameCommonField: 'pName',
						paramValueCommonField: 'pValue'
					}
				},
				method: {
					render: 'select',
					name: 'Метод',
					items: {
						mtdGet: {
							render: 'item',
							name: 'GET'
						},
						mtdPost: {
							render: 'item',
							name: 'POST'
						}
					}
				},

			}
		},
		useParser: {
			render: 'select',
			name: 'Обработать парсером',
			optional: 'checked',
			items: {}
		},
/*		
		response: {
			render: 'group',
			name: 'Ответ',
			items: {
				
			}
		}*/
	},
	
	httpService: null,
	
	getHttpService: function(){
		return this.httpService;
	},
	
	$client: {
/*		
		loadContext: function(c){
			$this.loadSettingsContext(c);
		},
		
		_updateClient: function(){
			$this._settings = null;
			$this._settingsContext = null;
			$this.publish('Analytics.Model.Entity.changed');
		},
		
		_dataUpdated: function(dataCount){
			$this.publish('Analytics.Model.Entity.dataUpdated', dataCount);
		},
		
		rename: function(newName, callback){
			this.server().setName(newName, callback);
		}
*/		
		
		onStatusChanged: function(status){
			this.publish('DataCube.Model.HttpMethod.statusChanged', status);
		}
	},
	
	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'DataCube.ParserManager',
		           'Unimap.Selector',
		           'JSB.Net.Http'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority: 0.5, 
				nodeType:'DataCube.HttpMethodNode',
				create: false,
				move: false,
				remove: true,
				rename: false,
				share: false
			});
		},
		
		$constructor: function(id, workspace, httpService, name){
			$base(id, workspace);
			if(httpService && name){
				this.httpService = httpService;
				this.property('httpService', this.httpService.getId());
				this.setName(name);
				this.status = 'ready';
				this.property('status', this.status);
				this.property('hasResponse', false);
			} else {
				if(this.property('httpService')){
					this.httpService = this.getWorkspace().entry(this.property('httpService'));
				}
				if(this.property('status')){
					this.status = this.property('status');
				}
			}
/*			
			$this.subscribe('Analytics.Model.Entity.changed', function(sender, msg, params){
				if(sender == $this){
					return;
				}
				
				$this.updateClient();
				$this.publish('Analytics.Model.Entity.changed', params);
			});
			$this.subscribe('Analytics.Model.AnalyticalGraph.changed', function(sender, msg, params){
				if(params.action == 'entityRemoved'){
					
				}
			});
*/			
		},
		
		getSettingsScheme: function(){
			var scheme = $base();
			var parsers = ParserManager.getSupportedParsers(this);
			var parserItems = scheme.useParser.items;
			for(var i = 0; i < parsers.length; i++){
				var pDesc = parsers[i];
				
				var parserScheme = JSB.clone(pDesc.scheme);
				if(parserScheme.batchSettings){
					delete parserScheme.batchSettings;
				}
				if(parserScheme.importSettings){
					delete parserScheme.importSettings;
				}
				
				parserItems[pDesc.name] = {
					render: 'group',
					name: pDesc.name,
					items:{
						parser: {
							render: 'scheme',
							jsb: pDesc.jsb,
							scheme: parserScheme
						}
					}
				};
			}
			
			var serviceUrl = this.getHttpService().getServiceAddress().trim();
            if(serviceUrl[serviceUrl.length -1] != '/'){
            	serviceUrl += '/';
            }
            
			scheme.request.items.url.editorOpts.prefix = serviceUrl;
			return scheme;
		},
		
		getContext: function(){
			return this.getSettingsContext();
		},
		
		remove: function(){
			this.getHttpService().removeHttpMethod(this.getId(), true);
			$base();
		},
		
/*		
		onChangeSettings: function(){
			$base();
			$this.publish('Analytics.Model.Entity.changed', {source:this});
			$this.updateClient();
		},
		
		updateClient: function(){
			JSB.defer(function(){
				$this.client()._updateClient();	
			}, 100, '_updateClient_' + this.getId());
		},
*/		
		
		executeQuery: function(opts){
			var ctx = null;
			if(opts.settings){
				ctx = this.createContext(opts.settings, this.getSettingsScheme());
			} else {
				ctx = this.getSettingsContext();
			}
			
			var url = this.getHttpService().getServiceAddress().trim();
			if(url[url.length -1] != '/'){
				url += '/';
			}
			url += opts.name || this.getName();
			var method = 'GET';
			if(ctx.find('request method').value() == 'mtdPost'){
				method = 'POST';
			}
			
			var params = {};
			var pSelArr = ctx.find('request params').values();
			for(var i = 0; i < pSelArr.length; i++){
				var pSel = pSelArr[i];
				var pName = pSel.find('pName').value().trim();
				if(opts.params && JSB.isDefined(opts.params[pName])){
					params[pName] = opts.params[pName];
				} else {
					if(pSel.find('pUseInRequest').checked()){
						var pValue = pSel.find('pValue').value();
						var pType = 'string';
						switch(pSel.find('pType').value()){
						case 'ctString':
							pType = 'string';
							break;
						case 'ctInteger':
							pType = 'integer';
							pValue = parseInt(pValue);
							break;
						case 'ctFloat':
							pType = 'double';
							pValue = parseFloat(pValue);
							break;
						case 'ctBoolean':
							pType = 'boolean';
							if(pValue == 'true'){
								pValue = true;
							} else {
								pValue = false;
							}
							break;
						}
						params[pName] = pValue;
					}
				}
			}
			if(method == 'GET'){
				var bFirst = true;
				for(var pName in params){
					if(bFirst){
						url += '?';		
					} else {
						url += '&';
					}
					var bFirst = false;
					url += pName + '=' + encodeURIComponent(params[pName]); 
				}
			}
			var httpOpts = {connectTimeout:600000, socketTimeout: 600000};
			// TODO: enhance httpOpts
			
			return this._processResult(Http.request(method, url, method == 'GET' ? null : params, httpOpts), ctx, params, opts);
		},
		
		_processResult: function(result, ctx, params, opts){
			if(result.responseCode != 200){
				throw new Error(result.responseMessage);
			}
			// prepare initial result
			var items = [{
				result: '' + result.body,
			}];
			
			if(!opts.disableParser){
				var tablesDesc = $this.proceedParserTranformations(opts, ctx, items);
				if(Object.keys(tablesDesc).length == 0){
					throw new Error('Unable to parse response');
				}
				
				var tName = Object.keys(tablesDesc)[0];
				var tDesc = tablesDesc[tName];
				items = tDesc.rows;
			}
			
			// inject parameters into result
			for(var i = 0; i < items.length; i++){
				var el = items[i];
				for(var pName in params){
					el[pName] = params[pName];
				}
			}
			
			if(opts.respondRows){
				return items;
			}
			
			// prepare iterator
			function Iterator(items){
				if(!JSB.isArray(items)){
					throw new Error('Array expected as an iterator input');
				}
				this._items = items;
				this._position = 0;
				this._closed = false;
			}
			Iterator.prototype = {
				next: function(){
					if(this._closed){
						return null;
					}
					if(this._position >= this._items.length){
						this.close();
						return null;
					}
					return this._items[this._position++];
				},
				hasNext: function(){
					if(this._closed){
						return false;
					}
					return this._position < this._items.length;
				},
				close: function(){
					this._closed = true;
					this._items = null;
				},
				count: function(){
					if(this._closed){
						return 0;
					}
					return this._items.length;
				}
			};
			
			return new Iterator(items);
		},
		
		executeRequestStage: function(opts){
			try {
				this.setStatus('requesting');
				var items = this.executeQuery(JSB.merge(opts, {
					respondRows: true,
					disableParser: true
				}));
				// save response artifact
				this.storeArtifact('.response', items);
				this.property('hasResponse', true);
				
				this.storeValues({
					name: opts.name || this.getName(),
					values: opts.settings || this.getSettings()
				});

				return items;
			} catch(e){
				if(this.existsArtifact('.response')){
					this.removeArtifact('.response');
				}
				this.property('hasResponse', false);
				throw e;
			} finally {
				this.setStatus('ready');
			}
		},
		
		executeAnalyzeStage: function(opts){
			var pInst = null;
			try {
				var responseItems = this.loadResponseData();
				if(!responseItems || responseItems.length == 0){
					responseItems = this.executeRequestStage(opts);
				}
				if(!responseItems || responseItems.length == 0){
					throw new Error('Failed to request HTTP-service');
				}
				var bodyStr = responseItems[0].result;
				
				var ctx = null;
				if(opts.settings){
					ctx = this.createContext(opts.settings, this.getSettingsScheme());
				} else {
					ctx = this.getSettingsContext();
				}
				
				if(!ctx.find('useParser').checked()){
					return;
				}
				
				this.setStatus('analyzing');
				var parserSel = ctx.find('useParser parser');
				var parserJsb = parserSel.scheme().jsb;
				var parserValues = parserSel.getSchemeValues();
				
				pInst = ParserManager.createParser(bodyStr, parserJsb, parserValues);
				var struct = null;
				try {
					pInst.analyze();
				} catch(e){
					if(e == 'Break'){
						// Do nothing
					} else if(e == 'Cancel'){
						throw e;
					} else {
						throw e;
					}
				}
				struct = pInst.getStruct();
				pInst.prepare();
				parserValues = pInst.getValues();
				parserSel.setSchemeValues(parserValues);
				$this.property('structure', struct);
				
				$this.applySettings(ctx.getValues());
			} finally {
				if(pInst){
					pInst.destroy();
				}
				this.setStatus('ready');
			}
		},
		
		executePreviewStage: function(opts){
			var responseItems = this.loadResponseData();
			if(!responseItems || responseItems.length == 0){
				responseItems = this.executeRequestStage(opts);
			}
			if(!responseItems || responseItems.length == 0){
				throw new Error('Failed to request HTTP-service');
			}
			
			var ctx = null;
			if(opts && opts.settings){
				ctx = this.createContext(opts.settings, this.getSettingsScheme());
			} else {
				ctx = this.getSettingsContext();
			}
			
			if(!ctx.find('useParser').checked()){
				var colsInfo = this.generateColumnsTypeInfo({
					includeServiceFields: true,
					settings: opts && opts.settings
				});
				colsInfo.result = {
					name: 'result',
					type: 'string'
				};
				
				return {
					cols: colsInfo,
					rows: responseItems
				};
			}
			
			var tablesDesc = $this.proceedParserTranformations(opts, ctx, responseItems, true);
			if(Object.keys(tablesDesc).length == 0){
				throw new Error('Unable to parse response');
			}
			
			var tName = Object.keys(tablesDesc)[0];
			var tDesc = tablesDesc[tName];
			var colsInfo = this.generateColumnsTypeInfo({
				includeServiceFields: true,
				includeResultTable: tName,
				settings: opts && opts.settings
			});
			
			// post process rows
			var cols = colsInfo;
			for(var colName in tDesc.columns){
				if(cols[colName] && tDesc.columns[colName].type != null && tDesc.columns[colName].type != 'null'){
					cols[colName].type = tDesc.columns[colName].type;
				}
			}
			var rows = tDesc.rows;
			for(var i = 0; i < rows.length; i++){
				var row = rows[i];
				for(var rName in responseItems[0]){
					if(rName == 'result'){
						continue;
					}
					row[rName] = responseItems[0][rName];
				}
			}
			
			return {
				cols: cols,
				rows: rows
			};
		},
		
		generateColumnsTypeInfo: function(opts){
			var ctx = null;
			if(opts && opts.settings){
				ctx = this.createContext(opts.settings, this.getSettingsScheme());
			} else {
				ctx = this.getSettingsContext();
			}
			
			var fInfo = {};
			if(opts.includeServiceFields){
				// iterate over service fields
				var pSelArr = ctx.find('request params').values();
				for(var i = 0; i < pSelArr.length; i++){
					var pSel = pSelArr[i];
					var pObj = {
						name: pSel.find('pName').value()
					};
					var pType = pSel.find('pType').value();
					switch(pType){
					case 'ctString':
						pObj.type = 'string';
						break;
					case 'ctInteger':
						pObj.type = 'integer';
						break;
					case 'ctFloat':
						pObj.type = 'double';
						break;
					case 'ctBoolean':
						pObj.type = 'boolean';
						break;
					}
					fInfo[pObj.name] = pObj;
				}
			}
			
			if(opts.includeResultTable){
				var tName = opts.includeResultTable;
				
				var parserSel = ctx.find('useParser parser');
				var parserJsb = parserSel.scheme().jsb;
				var parserScheme = parserSel.scheme().scheme;
				var parserValues = parserSel.getSchemeValues();
				
				var parserCtx = new Selector({
					values: parserValues,
					scheme: parserScheme
				});
				
				try {
					var tableSelArr = parserCtx.findAll('tables');
					for(var i = 0; i < tableSelArr.length; i++){
						var tableSel = tableSelArr[i];
						if(tableSel.getName() != tName){
							continue;
						}
						var colSelArr = tableSel.find('columns').values();
						for(var j = 0; j < colSelArr.length; j++){
							var colSel = colSelArr[j];
							var colName = colSel.find('columnAlias').value();
							var colBinding = colSel.find('field').bindingInfo();
							var pObj = {
								name: colName,
								type: colBinding.type
							};
							fInfo[pObj.name] = pObj;
						}
					}
				} finally {
					parserCtx.destroy();
				}
				
			}
			return fInfo;
		},
		
		proceedParserTranformations: function(opts, ctx, items, bPreviewMode){
			var bodyStr = items[0].result;
			var parserSel = ctx.find('useParser parser');
			var parserJsb = parserSel.scheme().jsb;
			var parserScheme = parserSel.scheme().scheme;
			var parserValues = parserSel.getSchemeValues();
			var parserCtx = new Selector({
				values: parserValues,
				scheme: parserScheme
			});
			var tables = {};
			var tableStats = {};
			var maxRows = parserCtx.find('previewRowCount').value() || 50;
			var restrictCellLength = parserCtx.find('restrictCellLength').checked() ? parserCtx.find('restrictCellLength').value() : 0;
			var pInst = ParserManager.createParser(bodyStr, parserJsb, parserValues);
			try {
				pInst.parse(function(tableDesc, rowData){
					if(pInst.cancelFlag){
						throw 'Cancel';
					}
					if(!tables[tableDesc.table]){
						tables[tableDesc.table] = {
							created: false,
							columns: {},
							rows: [],
							total: 0
						}
					}
					if(!tableStats[tableDesc.table]){
						tableStats[tableDesc.table] = {
							created: false,
							columns: {},
							total: 0
						}
					}
					
					var tDesc = tables[tableDesc.table];
					var tStatDesc = tableStats[tableDesc.table];
					
					// update columns
					if(!tDesc.created){
						for(var c in tableDesc.columns){
							tDesc.columns[c] = tableDesc.columns[c];
							if(!tDesc.columns[c].type){
								// detect type
								var type = pInst.detectValueTable(rowData[c]);
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
					
					if(bPreviewMode && restrictCellLength){
						for(var c in rowData){
							if(JSB.isString(rowData[c]) && rowData[c].length > restrictCellLength){
								rowData[c] = rowData[c].substr(0, restrictCellLength) + '...';
							}
						}
					}
					
					// update rows
					tDesc.rows.push(rowData);
					if(bPreviewMode && maxRows && tDesc.rows.length >= maxRows){
						throw 'Break';
					}
				});
				
			} catch(e) {
				if(e != 'Break'){
					throw e;
				}
			} finally {
				if(pInst){
					pInst.destroy();
				}
				if(parserCtx){
					parserCtx.destroy();
				}
			}
			
			return tables;
		},
		
		loadResponseData: function(){
			if(this.existsArtifact('.response')){
				return this.loadArtifact('.response');
			}
			return [];
		},
		
		extractFields: function(){
			if(!this.property('fields')){
				try {
					var rDesc = this.executePreviewStage();
					if(rDesc && rDesc.cols){
						this.property('fields', rDesc.cols);
					}
				} catch(e){}
			}
			return this.property('fields') || {};
		},
		
		getStore: function(){
			return this.getHttpService().getStore();
		},
		
		storeValues: function(desc){
			this.setName(desc.name);
			this.applySettings(desc.values);
/*			
			try {
				var rDesc = this.executePreviewStage();
				if(rDesc.cols){
					this.property('fields', rDesc.cols);
				}
			} catch(e){}
*/			
			
		},
		
		getInfo: function(){
			return {
				status: this.property('status') || 'ready',
				hasResponse: this.property('hasResponse') || false,
				hasStructure: this.property('structure') ? true : false
			}
		},
		
		setStatus: function(status){
			if(this.property('status') == status){
				return;
			}
			this.property('status', status);
			this.client().onStatusChanged(status);
		}
	}
}