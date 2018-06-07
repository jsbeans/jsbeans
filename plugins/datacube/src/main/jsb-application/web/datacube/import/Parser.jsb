{
	$name: 'DataCube.Parser',
	$session: false,
	
	$scheme: {
		parserSettings: {
			render: 'group',
	        name: 'Парсер',
	        items: {}
		},
		
		analyzer: {
			render: 'group',
	        name: 'Анализатор',
	        items: {
	        	useHeuristics: {
	        		render: 'switch',
	        		name: 'Использовать эвристику при извлечении структуры',
	        		optional: 'checked',
	        		items: {
	        			heuricticRecords: {
		        			render: 'item',
			        		name: 'Количество записей для анализа',
			        		value: 30,
			        		valueType: 'number'
	        			}
	        		}
	        	},
	    		structure: {
	    			render: 'parserBinding'
	    		}
	        }
		},
		
		previewSettings: {
			render: 'group',
	        name: 'Предварительный просмотр',
	        items: {
	        	previewRowCount: {
	        		render: 'item',
	        		name: 'Количество записей в таблице',
	        		value: 50,
	        		valueType: 'number'
	        	},
	        	restrictCellLength: {
	        		render: 'item',
	        		name: 'Ограничить длину строк',
	        		value: 150,
	        		valueType: 'number',
	        		optional: 'checked'
	        	}
	        }
		},
		
		tablesSettings: {
			render: 'group',
	        name: 'Таблицы',
	        sortable: false,
	        
	        multiple: {
                createDefault: false,
                uniqueNames: true
            },
	        items: {
	        	tables: {
	        		render: 'group',
	        		name: 'MyTable',
	        		editableName: true,
	        		items: {
	        			columns: {
	        				render: 'group',
	        				multiple: true,
	        				collapsible: false,
	        				name: 'Столбцы',
	        				items: {
	        					columnAlias: {
                                    name: 'Столбец',
        							render: 'item'
    							},
    							field: {
                                    name: 'Поле',
                                	render: 'dataBinding',
                                	editor: 'scheme',
                                	selectNodes: false,
                                    linkTo: 'structure'
    							},
	        					transforms: {
	        						render: 'group',
	        						multiple: true,
	        						collapsible: false,
	        						optional: true,
	        						name: 'Выполнить преобразование данных',
	        						items: {
	        							transform: {
	        								render: 'select',
	        								name: 'Операция',
	        								items: {
	        									convertType: {
	    	        								render: 'group',
	    	        								name: 'Преобразование типа',
	    	        								items: {
	    	        									resultType: {
	    	        										render: 'select',
	    	        										name: 'Привести к типу',
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
	    	    	        										name: 'float',
	    	    	        										value: 'float',
	    	    	        									},
	    	    	        									ctBoolean: {
	    	    	        										name: 'boolean',
	    	    	        										value: 'boolean',
	    	    	        									},
	    	    	        									ctArray: {
	    	    	        										name: 'array',
	    	    	        										value: 'array',
	    	    	        									},
	    	    	        									ctDate: {
	    	    	        										name: 'date',
	    	    	        										value: 'date',
	    	    	        									}		
	    	        										}
	    	        									}
	    	        									
	    	        								}
	    	        							},
	    	        							scriptExpression: {
	    	        								render: 'group',
	    	        								name: 'Скриптовое выражение',
	    	        								items: {
	    	        									variables: {
	    	        										render: 'group',
	    	        										name: 'Переменные',
	    	        										multiple: true,
	    	        										collapsable: false,
	    	        										sortable: false,
	    	        										items: {
	    	        											varField: {
	    	        												name: 'Поле',
	    	    	        	                                	render: 'dataBinding',
	    	    	        	                                	editor: 'scheme',
	    	    	        	                                	selectNodes: false,
	    	    	        	                                    linkTo: 'structure'
	    	        											},
	    	        											varName: {
	    	        												name: 'Название',
	    	        												render: 'item',
	    	        												commonField: 'vars'
	    	        											}
	    	        										}
	    	        									},
	    	        									expression: {
	    	        										name: 'Шаблон выражения',
	    	        										render: 'item',
	    	        										editor: 'JSB.Widgets.MultiEditor',
	    	        	                                    editorOpts: {
	    	        	                                        valueType: 'org.jsbeans.types.JavaScript'
	    	        	                                    },
	    	        	                                    value: 'this.value'
	    	        									}
	    	        								}
	    	        							}
	        								}
	        							}
	        							
	        						}
	        					}
	        				}
	        			}
	        		}
	        	}
	        }
		},
		
		importSettings: {
			render: 'group',
	        name: 'Сохранение',
	        items: {
	        	target: {
	        		render: 'select',
	        		name: 'Сохранить таблицы в',
	        		items: {
	        			database: {
	        				render: 'group',
	        				name: 'базу',
	        				items: {
	        					databaseEntry: {
	        						render: 'databaseBinding',
	        						name: 'База данных'
	        					},
	        					removeOldTable: {
	        						render: 'item',
	        						name: 'Перезаписать существующие таблицы',
	        						optional: 'checked',
	        						editor: 'none'
	        					}
	        				}
	        			}
	        		}
	        	}
	        }
		}
	},
	
	$server: {
		$require: ['Unimap.ValueSelector',
		           'DataCube.MaterializationEngine',
		           'JSB.Workspace.WorkspaceController',
		           'DataCube.ParserManager',
		           'JSB.Crypt.MD5'],
		
		entry: null,
		context: null,
		cancelFlag: false,
		
		mode: null,
		
		scopeType: null,
		scopeTypeStack: [],

		struct: null,
		structScope: null,
		structStack: [],
		structTopArray: null,
		structLastChangedCount: null,
		
		data: null,
		dataScope: null,
		dataStack: [],
		dataTopArray: null,
		
		importTables: {},
		
		deep: 0,
		typeOrder: {
			'null':0,
			'boolean': 1,
			'integer': 2,
			'float': 3,
			'string': 4,
			'object': 5,
			'array': 6
		},
		
		$constructor: function(entry, values){
			$base();
			this.entry = entry;
			this.values = values;
			
			this.fileSize = entry.getFileSize();
			
			this.context = new ValueSelector({
				bootstrap: 'Datacube.Unimap.Bootstrap',
				values: this.values,
				scheme: this.getParserScheme(this.getJsb())
			});
			
			this.subscribe('ParserManager.cancel', function(sender, msg, entry){
				if($this.entry != entry){
					return;
				}
				$this.cancelFlag = true;
			});
			
			this.subscribe('Parser.progress', function(sender, msg, params){
				if(sender != $this){
					return;
				}
				var status = $this.entry.property('status') || 'ready';
				if(status == 'ready'){
					return;
				}
				$this.logAppend('info', 'Обработано ' + params.progress + '% (' + params.position + ' из ' + params.total + ')', 'progress');
			});
		},
		
		getFileSize: function(){
			return this.fileSize;
		},
		
		getParserScheme: function(jsb){
			if(!jsb || !jsb.getDescriptor() || !jsb.isSubclassOf('DataCube.Parser')){
				return;
			}
			
			return JSB.merge(true, {}, this.getParserScheme(jsb.getParent()) || {}, jsb.getDescriptor().$scheme || {})
		},

		
		isAnalyzing: function(){
			return this.mode == 0;
		},
		
		isParsing: function(){
			return this.mode == 1;
		},
		
		getStruct: function(){
			return this.struct;
		},
		
		getContext: function(){
			return this.context;
		},
		
		getEntry: function(){
			return this.entry;
		},
		
		getValues: function(){
			return this.values;
		},
		
		checkBreak: function(){
			if($this.cancelFlag){
				throw 'Cancel';
			}
			if(this.mode == 0){
				if(this.structScope != this.structTopArray){
					return;
				}
				if(this.useHeuristics){
					if(this.structScope.count - this.structLastChangedCount > this.heuristicRecords){
						throw 'Break';
					}	
				}
			} else if(this.mode == 1){
				if(this.dataScope != this.dataTopArray){
					return;
				}
				this.emitTables();
				this.dataTopArray.splice(0, 1);
			}
			
		},
		
		emitTables: function(){
			function resolveCellType(bindingInfo){
				if(bindingInfo.type == 'array'){
					return resolveCellType(bindingInfo.arrayType);
				}
				return bindingInfo.type;
			}
			function resolveCellValue(colDesc, rootSel, dataBindMap){
				var val = dataBindMap[colDesc.field];
				var type = resolveCellType(colDesc.bindingInfo);
				return {value: val, type: type};
			}
			
			for(var i = 0; i < this.descriptors.length; i++){
				var tableDesc = this.descriptors[i];
				var dataBindMap = {};
				tableDesc.bindingTree.setData(this.data, dataBindMap);
				do {
					// iterate over columns and construct record
					var record = {};
					var columns = {};
					for(var colName in tableDesc.columns){
						var colDesc = tableDesc.columns[colName];
						var cellInfo = resolveCellValue(colDesc, tableDesc.bindingTree, dataBindMap);
						record[colName] = cellInfo.value;
						columns[colName] = cellInfo.type;
					}
					this.emitRecord({table: tableDesc.table, columns: columns}, record);
				} while(tableDesc.bindingTree.next(dataBindMap));
			}
		},
		
		emitRecord: function(table, record){
			if(this.rowCollback){
				this.rowCollback.call(this, table, record);
			}
		},
		
		beginArray: function(field){
			if($this.cancelFlag){
				throw 'Cancel';
			}

			if(field === null){
				if(this.mode == 0){
					this.struct = {count: 0, type:'array', arrayType:null};
					this.structScope = this.struct;
					if(!this.structTopArray){
						this.structTopArray = this.structScope;
					}
					if(this.structTopArray){
						this.structLastChangedCount = this.structTopArray.count;
					}
				} else if(this.mode == 1){
					this.data = [];
					this.dataScope = this.data;
					if(!this.dataTopArray){
						this.dataTopArray = this.dataScope;
					}
				}
			} else {
				this.scopeTypeStack.push(this.scopeType);
				if(this.mode == 0){
					this.structStack.push(this.structScope);
					if(this.scopeType == 0){
						this.structScope.count++;
						if(!this.structScope.arrayType || this.structScope.arrayType.type != 'array'){
							this.structScope.arrayType = {count: 0, type:'array', arrayType:null};
							this.structLastChangedCount = this.structTopArray.count;
						}
						this.structScope = this.structScope.arrayType;
						
					} else if(this.scopeType == 1){
						if(!this.structScope.record[field] || this.structScope.record[field].type != 'array'){
							this.structScope.record[field] = {count: 0, type:'array', arrayType:null};
							if(this.structTopArray){
								this.structLastChangedCount = this.structTopArray.count;
							}
						}
						this.structScope = this.structScope.record[field];
					} else {
						throw new Error('Unexpected structure type: ' + this.scopeType);
					}
					
					if(!this.structTopArray){
						this.structTopArray = this.structScope;
						this.structLastChangedCount = this.structTopArray.count;
					}
				} else if(this.mode == 1){
					this.dataStack.push(this.dataScope);
					if(this.scopeType == 0){
						var newScope = [];
						this.dataScope.push(newScope);
						this.dataScope = newScope;
					} else if(this.scopeType == 1){
						var newScope = [];
						this.dataScope[field] = newScope;
						this.dataScope = newScope;
					}
					if(!this.dataTopArray){
						this.dataTopArray = this.dataScope;
					}
				}
			}
			this.scopeType = 0;
		},
		
		endArray: function(){
			if($this.cancelFlag){
				throw 'Cancel';
			}

			this.scopeType = this.scopeTypeStack.pop();
			if(this.mode == 0){
				this.structScope = this.structStack.pop();
			} else if(this.mode == 1){
				this.dataScope = this.dataStack.pop();
			}
			this.checkBreak();
		},
		
		beginObject: function(field){
			if($this.cancelFlag){
				throw 'Cancel';
			}

			if(field === null){
				if(this.mode == 0){
					this.struct = {type:'object', record:{}};
					this.structScope = this.struct;
				} else if(this.mode == 1){
					this.data = {};
					this.dataScope = this.data;
				}
			} else {
				this.scopeTypeStack.push(this.scopeType);
				if(this.mode == 0){
					this.structStack.push(this.structScope);
					if(this.scopeType == 0){
						this.structScope.count++;
						if(!this.structScope.arrayType || this.typeOrder['object'] > this.typeOrder[this.structScope.arrayType.type]){
							this.structScope.arrayType = {type:'object', record:{}};
							if(this.structTopArray){
								this.structLastChangedCount = this.structTopArray.count;
							}
						}
						this.structScope = this.structScope.arrayType;
					} else if(this.scopeType == 1){
						if(!this.structScope.record[field] || this.typeOrder['object'] > this.typeOrder[this.structScope.record[field].type]){
							this.structScope.record[field] = {type:'object', record:{}};
							if(this.structTopArray){
								this.structLastChangedCount = this.structTopArray.count;
							}
						}
						this.structScope = this.structScope.record[field];
					} else {
						throw new Error('Unexpected structure type: ' + this.scopeType);
					}
				} else if(this.mode == 1){
					this.dataStack.push(this.dataScope);
					if(this.scopeType == 0){
						var newScope = {};
						this.dataScope.push(newScope);
						this.dataScope = newScope;
					} else if(this.scopeType == 1){
						var newScope = {};
						this.dataScope[field] = newScope;
						this.dataScope = newScope;
					}
				}
			}
			this.scopeType = 1;
		},
		
		endObject: function(){
			if($this.cancelFlag){
				throw 'Cancel';
			}

			this.scopeType = this.scopeTypeStack.pop();
			if(this.mode == 0){
				this.structScope = this.structStack.pop();
			} else if(this.mode == 1){
				this.dataScope = this.dataStack.pop();
			}
			this.checkBreak();
		},
		
		detectValueTable: function(value){
			var type = null;
			if(JSB.isNull(value)){
				type = 'null';
			} else if(JSB.isBoolean(value)){
				type = 'boolean';
			} else if(JSB.isString(value)){
				type = 'string';
			} else if(JSB.isFloat(value)){
				type = 'float';
			} else if(JSB.isInteger(value)){
				type = 'integer';
			} else if(JSB.isArray(value)) {
				type = 'array';
			} else if(JSB.isObject(value)) {
				type = 'object';
			} else if(JSB.isDate(value)) {
				type = 'date';
			} else {
				throw new Error('Unknown value type: ' + JSON.stringify(value));
			}
			return type;
		},
		
		setValue: function(field, value){
			if($this.cancelFlag){
				throw 'Cancel';
			}

			function checkTypeOrder(newType, oldType){
				return $this.typeOrder[newType] > $this.typeOrder[oldType];
			}
			if(this.mode == 0){
				// detect value type
				var type = $this.detectValueTable(value);
				
				if(this.scopeType == 0){
					this.structScope.count++;
					if(!this.structScope.arrayType || $this.typeOrder[type] > $this.typeOrder[this.structScope.arrayType.type]){
						this.structScope.arrayType = {type:type};
						if(this.structTopArray){
							this.structLastChangedCount = this.structTopArray.count;
						}
					}
					this.checkBreak();
				} else if(this.scopeType == 1) {
					if(!this.structScope.record[field] || $this.typeOrder[type] > $this.typeOrder[this.structScope.record[field].type]){
						this.structScope.record[field] = {type: type};
						if(this.structTopArray){
							this.structLastChangedCount = this.structTopArray.count;
						}
					}
				} else {
					throw new Error('Unexpected structure type: ' + this.scopeType);
				}
			} else if(this.mode == 1){
				if(this.scopeType == 0){
					this.dataScope.push(value);
					this.checkBreak();
				} else if(this.scopeType == 1){
					this.dataScope[field] = value;
				}
			}
		},
		
		execute: function(){
			throw new Error('This method should be overriden');
		},
		
		analyze: function(){
			this.mode = 0;	// analyze mode
			this.useHeuristics = this.getContext().find('useHeuristics').checked();
			if(this.useHeuristics){
				this.heuristicRecords = this.getContext().find('heuricticRecords').value();
			}
			this.execute();
		},
		
		prepare: function(){
			var struct = this.getStruct();
			
			// generate columns
			var cols = [];
			var pathMap = {};
			var nameMap = {};
			
			function generateName(bindingPath){
				var parts = bindingPath.split(/\./i);
				var qName = '';
				var lastName = '';
				for(var i = 0; i < parts.length - 1; i++){
					var part = parts[i];
					if(qName && qName.length > 0){
						qName += '.';
					}
					qName += part;
					if(!pathMap[qName]){
						var testName = null;
						for(var j = 1; ; j++){
							var nc = '' + part.charAt(0).toLowerCase();
							if(j > 1){
								nc += j;
							}
							testName = lastName + nc;
							if(!nameMap[testName]){
								nameMap[testName] = true;
								break;
							}
						}
						pathMap[qName] = testName;
					}
					 
					lastName = pathMap[qName];
				}
				var fName = parts[parts.length - 1];
				if(lastName && lastName.length > 0){
					fName = lastName + '-' + fName;
				}
				return fName;
			}
			
			function processStructureElement(elt, path){
				if(!elt || !elt.type || elt.type == 'null'){
					return;
				} else if(elt.type == 'object'){
					for(var f in elt.record){
						var p = (path && path.length > 0 ? (path + '.') : '') + f;
						processStructureElement(elt.record[f], p);
					}
				} else if(elt.type == 'array'){
					processStructureElement(elt.arrayType, path);
				} else {
					cols.push({
						name: generateName(path),
						type: elt.type,
						binding: path
					});
				}
			}
			
			processStructureElement(struct, null);

			var sourceSelector = this.getContext().find('structure');
			sourceSelector.setFullValue({binding: struct});

			var tableGroup = this.getContext().find('tablesSettings');
			tableGroup.removeAllValues();
			var tableSel = tableGroup.addValue();
			var tName = this.getEntry().getName().replace(/\./g, '_');
			tableSel.setName(tName);
						
			var colGroup = tableSel.find('columns');
			
			for(var i = 0; i < cols.length; i++){
				var colDesc = cols[i];
				var colSel = colGroup.addValue();
				colSel.find('columnAlias').setValue(colDesc.name);
				colSel.find('field').setBinding(colDesc.binding, sourceSelector);
			}
		},
		
		parse: function(rowCallback){
			this.mode = 1; // parse mode
			this.rowCollback = rowCallback;
			
			var BindingSelector = function(){
				this.nested = {};
				this.nestedArr = [];
				this.nestedCursor = 0;
				this.path = null;
				this.data = null;
				this.binding = false;
			}
			BindingSelector.prototype = {
				addSelector: function(name, isBinding){
					var sel = this.nested[name];
					if(!sel){
						sel = new BindingSelector();
						if(this.path){
							sel.path = this.path + '.' + name;
						} else {
							sel.path = name;
						}
						this.nested[name] = sel;
						this.nestedArr.push(sel);
					}
					
					if(isBinding){
						sel.binding = true;
					}
					return sel;
				},
				
				setData: function(data, dataBindMap){
					this.data = data;
					this.reset(dataBindMap);
				},
				
				next: function(dataBindMap){
					for(var i = 0; i < this.nestedArr.length; i++){
						if(this.nestedArr[i].next(dataBindMap)){
							for(var j = 0; j < i; j++){
								this.nestedArr[j].reset(dataBindMap);
							}
							return true;
						}
					}
					this.cursor++;
					return this.propagate(dataBindMap);
				},
				
				propagate: function(dataBindMap){
					var curData = null;
					if(JSB.isArray(this.data)){
						if(this.data.length > this.cursor){
							curData = this.data[this.cursor];
						} else {
							return false;
						}
					} else {
						if(this.cursor == 0){
							curData = this.data;
						} else {
							return false;
						}
					}
					if(this.binding){
						dataBindMap[this.path] = curData;
					}
					for(var n in this.nested){
						var nSel = this.nested[n];
						if(curData){
							nSel.setData(curData[n], dataBindMap);
						} else {
							nSel.setData(null, dataBindMap);
						}
					}
					return true;
				},
				
				reset: function(dataBindMap){
					this.cursor = 0;
					return this.propagate(dataBindMap);
				}
			};
			
			this.descriptors = [];
			
			// combine bindings
			var sourceCtx = this.context.find('structure');
			
			var tablesCtxArr = this.context.findAll('tables');
			if(tablesCtxArr.length == 0){
				throw new Error('No tables to import');
			}
			for(var i = 0; i < tablesCtxArr.length; i++){
				var tableCtx = tablesCtxArr[i];
				var tableName = tableCtx.getName();
				
				var bindings = {};
				var tableDesc = {
					table: tableName,
					columns: {},
					bindingTree: {}
				};
				
				var columnsCtxArr = tableCtx.find('columns').values();
				if(columnsCtxArr.length == 0){
					continue;
				}
				for(var j = 0; j < columnsCtxArr.length; j++){
					var columnCtx = columnsCtxArr[j];
					var colName = columnCtx.find('columnAlias').value();
					var fieldCtx = columnCtx.find('field');
					var colField = fieldCtx.binding();
					var colBindingInfo = fieldCtx.bindingInfo();
					var colType = fieldCtx.bindingType();
					
					if(!colName || colName.length == 0){
						continue;
					}
					
					var colDesc = tableDesc.columns[colName] = {
						column: colName,
						field: colField,
						type: colType,
						bindingInfo: colBindingInfo,
						transforms: []
					};
					
					if(colField && colField.length > 0 && !bindings[colField]){
						bindings[colField] = true;
					}
					
					var transformCtx = columnCtx.find('transforms');
					if(transformCtx.checked()){
						var transformCtxArr = transformCtx.values();
						for(var t = 0; t < transformCtxArr.length; t++){
							var transformCtx = transformCtxArr[t];
							var tCtx = transformCtx.find('transform');
							var op = tCtx.value();
							var transformDesc = {
								op: op
							};
							
							switch(op) {
							case 'convertType':
								transformDesc.targetType = {
									'ctString': 'string',
									'ctInteger': 'integer',
									'ctFloat': 'float',
									'ctBoolean': 'boolean',
									'ctArray': 'array',
									'ctDate': 'date'
								}[tCtx.find('resultType').value()]
								break;
							case 'scriptExpression':
								var valArrCtx = tCtx.find('variables').values();
								transformDesc.vars = {};
								for(var v = 0; v < valArrCtx.length; v++){
									var valCtx = valArrCtx[v];
									var varName = valCtx.find('varName').value();
									var varField = valCtx.find('varField').binding();
									if(!varName || varName.length == 0){
										continue;
									}
									transformDesc.vars[varName] = {
										name: varName,
										field: varField
									}
									if(varField && varField.length > 0 && !bindings[varField]){
										bindings[varField] = true;
									}
								}
								transformDesc.expression = tCtx.find('expression').value();
								break;
							}
							colDesc.transforms.push(transformDesc);
						}
						
					}
				}
				// generate binding tree
				var bindingTree = new BindingSelector();
				for(var b in bindings){
					var parts = b.split('.');
					var bindScope = bindingTree;
					for(var p = 0; p < parts.length; p++){
						var b = parts[p];
						bindScope = bindScope.addSelector(b, p == parts.length - 1);
					}
				}
				tableDesc.bindingTree = bindingTree;
				this.descriptors.push(tableDesc);
			}
			this.execute();
		},
		
		import: function(){
			var batchSize = 100;
			// create materializer
			var dbVal = this.getContext().find('databaseEntry').value();
			var dbSource = WorkspaceController.getWorkspace(dbVal.workspaceId).entry(dbVal.entryId);
			this.logAppend('info', 'Создание материализатора для источника "' + dbSource.getName() + '"');
			var mInst = MaterializationEngine.createMaterializer(dbSource);
			
			try {
				this.parse(function(tableDesc, rowData){
					if($this.cancelFlag){
						throw 'Cancel';
					}
					if(!$this.importTables[tableDesc.table]){
						$this.importTables[tableDesc.table] = {
							created: false,
							columns: {},
							rows: [],
							total: 0
						}
					}
					var tDesc = $this.importTables[tableDesc.table];
					
					// update columns
					if(!tDesc.created){
						for(var c in tableDesc.columns){
							if(tableDesc.columns[c]){
								tDesc.columns[c] = tableDesc.columns[c];
							} else {
								// detect type
								var type = $this.detectValueTable(rowData[c]);
								if(type != 'null'){
									tDesc.columns[c] = type;
								}
							}
						}	
					}
					
					
					// update rows
					tDesc.rows.push(rowData);
					if(tDesc.rows.length >= batchSize){
						$this.storeBatch(mInst);
					}
				});
				$this.storeBatch(mInst);
				
				var entry = this.getEntry();
				
				// store tables count
				entry.tables = Object.keys($this.importTables).length;
				entry.property('tables', entry.tables);
				
				// store records count
				var records = 0, columns = 0;
				for(var t in $this.importTables){
					records += $this.importTables[t].total;
					columns += Object.keys($this.importTables[t].columns).length;
				}
				
				entry.records = records;
				entry.property('records', entry.records);

				entry.columns = columns;
				entry.property('columns', entry.columns);
				
				entry.lastTimestamp = Date.now();
				entry.property('lastTimestamp', entry.lastTimestamp);
				
				entry.fileSize = $this.getFileSize();
				entry.property('fileSize', entry.fileSize);
				
				dbSource.extractScheme();
			} finally {
				if(mInst){
					mInst.destroy();
				}
			}
		},
		
		storeBatch: function(mInst){
			for(var t in $this.importTables){
				var tDesc = $this.importTables[t];
				if(!tDesc.created){
					// check for all columns are filled
					var bColumnsCorrect = true;
					for(var c in tDesc.columns){
						if(!tDesc.columns[c]){
							bColumnsCorrect = false;
							break;
						}
					}
					if(bColumnsCorrect){
						if(this.getContext().find('removeOldTable').checked()){
							this.logAppend('info', 'Удаление старой таблицы: ' + t);
							mInst.removeTable(t);
						}
						// create table in db
						this.logAppend('info', 'Создание таблицы: ' + t);
						var res = mInst.createTable(t, tDesc.columns);
						if(res){
							tDesc.table = res.table;
							tDesc.fieldMap = res.fieldMap;
							tDesc.created = true;
							this.logAppend('info', 'Таблица "'+tDesc.table+'" успешно создана');
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
				mInst.insert(tDesc.table, translatedRows);
				tDesc.total += translatedRows.length;
				this.logAppend('info', 'В таблицу "'+tDesc.table+'" записано ' + tDesc.total + ' строк', MD5.md5('rowsWritten' + tDesc.table));
				tDesc.rows = [];
			}
		},
		
		logAppend: function(type, str, key){
			ParserManager.logAppend(this.getEntry(), type, str, key);
		}
	}
}