{
	$name: 'DataCube.Parser',
	$session: false,
	
	$scheme: {
		parserSettings: {
			render: 'group',
	        name: 'Настройки парсера',
	        collapsible: false,
	        items: {}
		},
		
		structure: {
			render: 'parserBinding'
		},
		
		tablesSettings: {
			render: 'group',
	        name: 'Настройки таблиц',
	        collapsible: false,
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
	        						name: 'Преобразования',
	        						items: {
	        							transform: {
	        								render: 'select',
	        								name: 'Операция',
	        								items: {
	        									convertType: {
	    	        								render: 'group',
	    	        								name: 'Преобразовать тип',
	    	        								items: {
	    	        									resultType: {
	    	        										render: 'select',
	    	        										name: 'Привести к типу',
	    	        										items: {
	    	        											ctString: {
	    	    	        										name: 'string',
	    	    	        									},
	    	    	        									ctInteger: {
	    	    	        										name: 'integer',
	    	    	        									},
	    	    	        									ctFloat: {
	    	    	        										name: 'float',
	    	    	        									},
	    	    	        									ctBoolean: {
	    	    	        										name: 'boolean',
	    	    	        									},
	    	    	        									ctDate: {
	    	    	        										name: 'date',
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
		
		struct: null,
		structScope: null,
		structScopeType: null,
		structStack: [],
		structTypeStack: [],
		structTopArray: null,
		structLastChangedCount: null,
		
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
		
		analyze: function(){
			throw new Error('This method should be overriden');
		},
		
		getStruct: function(){
			return this.struct;
		},
		
		checkBreak: function(){
			if(this.structScope == this.structTopArray && this.structScope.count - this.structLastChangedCount > 10){
				throw 'Break';
			}
		},
		
		beginArray: function(field){
			if(field === null){
				this.struct = {count: 0, type:'array', arrayType:null};
				this.structScope = this.struct;
				if(!this.structTopArray){
					this.structTopArray = this.structScope;
				}
				if(this.structTopArray){
					this.structLastChangedCount = this.structTopArray.count;
				}
			} else {
				this.structStack.push(this.structScope);
				this.structTypeStack.push(this.structScopeType);
				if(this.structScopeType == 0){
					this.structScope.count++;
					if(!this.structScope.arrayType || this.structScope.arrayType.type != 'array'){
						this.structScope.arrayType = {count: 0, type:'array', arrayType:null};
						this.structLastChangedCount = this.structTopArray.count;
					}
					this.structScope = this.structScope.arrayType;
					
				} else if(this.structScopeType == 1){
					if(!this.structScope.record[field] || this.structScope.record[field].type != 'array'){
						this.structScope.record[field] = {count: 0, type:'array', arrayType:null};
						if(this.structTopArray){
							this.structLastChangedCount = this.structTopArray.count;
						}
					}
					this.structScope = this.structScope.record[field];
				} else {
					throw new Error('Unexpected structure type: ' + this.structScopeType);
				}
				
				if(!this.structTopArray){
					this.structTopArray = this.structScope;
					this.structLastChangedCount = this.structTopArray.count;
				}
			}
			this.structScopeType = 0;
		},
		
		endArray: function(){
			this.structScope = this.structStack.pop();
			this.structScopeType = this.structTypeStack.pop();
			this.checkBreak();
		},
		
		beginObject: function(field){
			if(field === null){
				this.struct = {type:'object', record:{}};
				this.structScope = this.struct;
			} else {
				this.structStack.push(this.structScope);
				this.structTypeStack.push(this.structScopeType);
				if(this.structScopeType == 0){
					this.structScope.count++;
					if(!this.structScope.arrayType || this.typeOrder['object'] > this.typeOrder[this.structScope.arrayType.type]){
						this.structScope.arrayType = {type:'object', record:{}};
						if(this.structTopArray){
							this.structLastChangedCount = this.structTopArray.count;
						}
					}
					this.structScope = this.structScope.arrayType;
				} else if(this.structScopeType == 1){
					if(!this.structScope.record[field] || this.typeOrder['object'] > this.typeOrder[this.structScope.record[field].type]){
						this.structScope.record[field] = {type:'object', record:{}};
						if(this.structTopArray){
							this.structLastChangedCount = this.structTopArray.count;
						}
					}
					this.structScope = this.structScope.record[field];
				} else {
					throw new Error('Unexpected structure type: ' + this.structScopeType);
				}
			}
			this.structScopeType = 1;
		},
		
		endObject: function(){
			this.structScope = this.structStack.pop();
			this.structScopeType = this.structTypeStack.pop();
			this.checkBreak();
		},
		
		setValue: function(field, value){
			function checkTypeOrder(newType, oldType){
				return $this.typeOrder[newType] > $this.typeOrder[oldType];
			}
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
			
			if(this.structScopeType == 0){
				this.structScope.count++;
				if(!this.structScope.arrayType || $this.typeOrder[type] > $this.typeOrder[this.structScope.arrayType.type]){
					this.structScope.arrayType = {type:type};
					if(this.structTopArray){
						this.structLastChangedCount = this.structTopArray.count;
					}
				}
				this.checkBreak();
			} else if(this.structScopeType == 1) {
				if(!this.structScope.record[field] || $this.typeOrder[type] > $this.typeOrder[this.structScope.record[field].type]){
					this.structScope.record[field] = {type: type};
					if(this.structTopArray){
						this.structLastChangedCount = this.structTopArray.count;
					}
				}
			} else {
				throw new Error('Unexpected structure type: ' + this.structScopeType);
			}
			
		}
	}
}