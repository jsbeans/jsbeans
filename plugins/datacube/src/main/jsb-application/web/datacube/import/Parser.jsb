{
	$name: 'DataCube.Parser',
	$session: false,
	
	$scheme: {
		parserSettings: {
			render: 'group',
	        name: 'Парсер',
	        collapsable: false,
	        items: {}
		},
		
		structure: {
			render: 'parserBinding'
		},
		
		tablesSettings: {
			render: 'group',
	        name: 'Таблицы',
	        collapsable: false,
	        sortable: false,
	        
	        multiple: {
                createDefault: false,
                uniqueNames: true
            },
	        items: {
	        	tables: {
	        		render: 'group',
	        		name: 'Таблица',
	        		editableName: true,
	        		items: {
	        			store: {
	        				render: 'select',
	        				name: 'Сохранить в',
	        				items: {
	        					database: {
	        						name: 'базу'
	        					},
	        					collection: {
	        						name: 'коллекцию'
	        					}
	        				}
	        			},
	        			columns: {
	        				render: 'group',
	        				multiple: true,
	        				collapsable: false,
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
    							index: {
    								name: 'Установить индексацию',
    								render: 'item',
    								optional: true,
    								editor: 'none'
    							},
	        					transforms: {
	        						render: 'group',
	        						multiple: true,
	        						collapsable: false,
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
		}
	},
	
	$server: {
		entry: null,
		context: null,
		
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
		
		$constructor: function(entry, context){
			$base();
			this.entry = entry;
			this.context = context;
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
		
		checkBreak: function(){
			if(this.mode == 0){
				if(this.structScope != this.structTopArray){
					return;
				}
				if(this.structScope.count - this.structLastChangedCount > 10){
					throw 'Break';
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
			var record = this.dataTopArray[0];
			debugger;
		},
		
		beginArray: function(field){
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
			this.scopeType = this.scopeTypeStack.pop();
			if(this.mode == 0){
				this.structScope = this.structStack.pop();
			} else if(this.mode == 1){
				this.dataScope = this.dataStack.pop();
			}
			this.checkBreak();
		},
		
		beginObject: function(field){
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
			this.scopeType = this.scopeTypeStack.pop();
			if(this.mode == 0){
				this.structScope = this.structStack.pop();
			} else if(this.mode == 1){
				this.dataScope = this.dataStack.pop();
			}
			this.checkBreak();
		},
		
		setValue: function(field, value){
			function checkTypeOrder(newType, oldType){
				return $this.typeOrder[newType] > $this.typeOrder[oldType];
			}
			if(this.mode == 0){
				// detect value type
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
				} else if(JSB.isInteger(value)){
					throw new Error('Unknown value type: ' + JSON.stringify(value));
				}
				
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
			this.execute();
		},

		
		parse: function(rowCallback){
			debugger;
			this.mode = 1; // parse mode
			
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
				
				var tableDesc = {
					table: tableName,
					columns: {},
					bindings: {}
				};
				
				var columnsCtxArr = tableCtx.find('columns').values();
				if(columnsCtxArr.length == 0){
					continue;
				}
				for(var j = 0; j < columnsCtxArr.length; j++){
					var columnCtx = columnsCtxArr[j];
					var colName = columnCtx.find('columnAlias').value();
					var colField = columnCtx.find('field').binding();
					
					if(!colName || colName.length == 0){
						continue;
					}
					
					var colDesc = tableDesc.columns[colName] = {
						columns: colName,
						field: colField,
						transforms: []
					};
					
					if(colField && colField.length > 0 && !tableDesc.bindings[colField]){
						tableDesc.bindings[colField] = true;
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
								transformDesc.targetType = tCtx.find('resultType').value();
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
									if(varField && varField.length > 0 && !tableDesc.bindings[varField]){
										tableDesc.bindings[varField] = true;
									}
								}
								transformDesc.expression = tCtx.find('expression').value();
								break;
							}
							colDesc.transforms.push(transformDesc);
						}
						
					}
				}
				this.descriptors.push(tableDesc);
			}
			JSB.getLogger().debug(JSON.stringify(this.descriptors, null, 4));
			debugger;
			this.execute();
		}
	}
}