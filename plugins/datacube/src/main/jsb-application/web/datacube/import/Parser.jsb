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
	        		editableName: {
	        			commonField: 'tableName'
	        		},
	        		items: {
	        			columns: {
	        				render: 'group',
	        				multiple: true,
	        				collapsible: true,
	        				name: 'Столбцы',
	        				items: {
    							field: {
                                    name: 'Поле',
                                	render: 'dataBinding',
                                	editor: 'scheme',
                                	selectNodes: false,
                                    linkTo: 'structure'
    							},
	        					columnAlias: {
                                    name: 'Столбец',
        							render: 'item'
    							},
    							mandatory: {
    								render: 'item',
    								editor: 'none',
    								name: 'Обязательное поле',
    								optional: true
    							},
    							columnComment: {
    								name: 'Вставить комментарий',
        							render: 'item',
        							optional: true
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
	    	    	        										render: 'group',
	    	    	        										items: {
	    	    	        											datePattern: {
	    	    	        												render: 'item',
	    	    	        												name: 'Использовать шаблон для анализа строк',
	    	    	        												optional: true,
	    	    	        												value: 'YYYY-MM-DDTHH:mm:ss.SSS',
	    	    	        												description: `
<h3>Примеры</h3>
<div>DD.MM.YYYY HH:mm</div>
<div>YYYY-MM-DDTHH:mm:ss.SSS</div>
<h3>Значения</h3>
<table>
  <thead>
    <tr><th>Токен</th><th>Пример</th><th>Описание</th></tr>
  </thead>
  <tbody>
    <tr><td>YYYY</td><td>2018</td><td>2 или 4 цифры года</td></tr>
    <tr><td>YY</td><td>18</td><td>2 цифры года</td></tr>
    <tr><td>Q</td><td>1..4</td><td>Номер квартала</td></tr>
    <tr><td>M MM</td><td>1..12</td><td>Номер месяца</td></tr>
    <tr><td>MMM MMMM</td><td>Янв..Декабрь</td><td>Название месяца</td></tr>
    <tr><td>D DD</td><td>1..31</td><td>День месяца</td></tr>
    <tr><td>DDD DDDD</td><td>1..365</td><td>День года</td></tr>
    <tr><td>H HH</td><td>0..23</td><td>Часы (24 формат)</td></tr>
    <tr><td>h hh</td><td>1..12</td><td>Часы (12 формат совместно с "a A")</td></tr>
    <tr><td>a A</td><td>am pm</td><td>Маркер полудня</td></tr>
    <tr><td>m mm</td><td>0..59</td><td>Минуты</td></tr>
    <tr><td>s ss</td><td>0..59</td><td>Секунды</td></tr>
    <tr><td>S SS SSS</td><td>0..999</td><td>Миллисекунды</td></tr>
    <tr><td>Z ZZ</td><td>+3:00</td><td>Смещение часового пояса относительно UTC</td></tr>
  </tbody>
</table>	    	    	        									
	    	    	        												`
	    	    	        											}
	    	    	        										}
	    	    	        									}		
	    	        										}
	    	        									}
	    	        									
	    	        								}
	    	        							},
	    	        							rowHash: {
	    	        								name: 'Вычисление хэша',
	    	        								render: 'group',
	    	        								items: {
	    	        									hashColumns: {
	    	        										render: 'group',
	    	        										name: 'Дополнительные поля',
	    	        										multiple: true,
	    	        										collapsable: false,
	    	        										sortable: true,
	    	        										items: {
	    	        											oddField: {
	    	        												name: 'Поле',
	    	    	        	                                	render: 'dataBinding',
	    	    	        	                                	editor: 'scheme',
	    	    	        	                                	selectNodes: false,
	    	    	        	                                    linkTo: 'structure'
	    	        											}
	    	        										}
	    	        									}
	    	        								}
	    	        							},
	    	        							splitString: {
	    	        								name: 'Разделение строки',
	    	        								render: 'group',
	    	        								items: {
	    	        									splitDelimiter: {
	    	        										name: 'Разделитель',
	    	        										render: 'item',
	    	        										value: ','
	    	        									},
	    	        									splitTrim: {
	    	        										name: 'Обрезать пробелы',
	    	        										render: 'item',
	    	        										editor: 'none',
	    	        										optional: 'checked'
	    	        									},
	    	        									splitRemoveEmpty: {
	    	        										name: 'Удалять пустые элементы',
	    	        										render: 'item',
	    	        										editor: 'none',
	    	        										optional: 'checked'
	    	        									}
	    	        								}
	    	        							},
	    	        							unwindArray: {
	    	        								name: 'Разматывание массива',
	    	        								render: 'item'
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
	        			},
	        			
	        			additionalSettings: {
	        				render: 'group',
	        				name: 'Дополнительные настройки',
	        				collapsible: true,
	        				items: {
	    	        			unionWithTable: {
	    	        				render: 'select',
	    	    					name: 'Объединить с таблицей',
	    	    					optional: true,
	    	    					commonField: 'tableName'
	    	        			}
	        				}
	        			}/*,
	        			
	        			indices: {
	        				render: 'group',
	        				name: 'Индексы',
	        				collapsible: true,
	        				items: {}
	        			}*/

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
	        					databaseScheme: {
	        						render: 'item',
	        						name: 'Схема',
	        						value: 'public'
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
		           'JSB.Crypt.MD5',
		           'Moment'],
		           
		options: {
			treatEmptyStringsAsNull: false
		},
		
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
			this.lastProgress = -1;
			
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
				if($this.lastProgress != params.progress){
					$this.lastProgress = params.progress;
					$this.entry.publish('DataCube.Parser.progress', {status: 'Обработано ' + $this.lastProgress + '%', success: true}, {session: true});
				}
				
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
		
		executeConvertType: function(valDesc, targetType, pattern){
			var currentType = $this.detectValueTable(valDesc.value);
			switch(targetType){
			case 'string':
				switch(currentType){
				case 'null':
					break;
				case 'array':
				case 'object':
					valDesc.value = JSON.stringify(valDesc.value);
					break;
				case 'boolean':
					if(valDesc.value){
						valDesc.value = 'true';
					} else {
						valDesc.value = 'false';
					}
					break;
				case 'date':
					valDesc.value = valDesc.value.toString();
					break;
				default:
					valDesc.value = '' + valDesc.value;
				}
				break;
			case 'integer':
				switch(currentType){
				case 'null':
					break;
				case 'array':
					if(valDesc.value.length > 0){
						valDesc.value = valDesc.value[0];
						$this.executeConvertType(valDesc, targetType, pattern);
					} else {
						valDesc.value = null;
					}
					break;
				case 'object':
					valDesc.value = 0;
					break;
				case 'boolean':
					if(valDesc.value){
						valDesc.value = 1;
					} else {
						valDesc.value = 0;
					}
					break;
				case 'float':
					valDesc.value = Math.floor(valDesc.value);
					break;
				case 'string':
					valDesc.value = parseInt(valDesc.value);
					if(JSB.isNaN(valDesc.value)){
						valDesc.value = null;
					}
					break;
				case 'date':
					valDesc.value = valDesc.value.getTime();
					break;
				}
				break;
			case 'float':
				switch(currentType){
				case 'null':
					break;
				case 'array':
					if(valDesc.value.length > 0){
						valDesc.value = valDesc.value[0];
						$this.executeConvertType(valDesc, targetType, pattern);
					} else {
						valDesc.value = null;
					}
					break;
				case 'object':
					valDesc.value = 0.0;
					break;
				case 'boolean':
					if(valDesc.value){
						valDesc.value = 1.0;
					} else {
						valDesc.value = 0.0;
					}
					break;
				case 'integer':
					valDesc.value = parseFloat(valDesc.value);
					break;
				case 'string':
					valDesc.value = parseFloat(valDesc.value.trim().replace(/\,/g, '.'));
					if(JSB.isNaN(valDesc.value)){
						valDesc.value = null;
					}
					break;
				case 'date':
					valDesc.value = valDesc.value.getTime();
					break;

				}
				break;
			case 'boolean':
				switch(currentType){
				case 'array':
					if(valDesc.value.length > 0){
						valDesc.value = valDesc.value[0];
						$this.executeConvertType(valDesc, targetType, pattern);
					} else {
						valDesc.value = null;
					}
					break;
				default:
					if(valDesc.value){
						valDesc.value = true;
					} else {
						valDesc.value = false;
					}
				}
				break;
			case 'date':
				switch(currentType){
				case 'null':
					break;
				case 'array':
					if(valDesc.value.length > 0){
						valDesc.value = valDesc.value[0];
						$this.executeConvertType(valDesc, targetType, pattern);
					} else {
						valDesc.value = null;
					}
					break;
				case 'object':
				case 'boolean':
					valDesc.value = new Date();
					break;
				case 'integer':
				case 'float':
					valDesc.value = new Date(parseInt(valDesc.value));
					break;
				case 'string':
					var m = Moment.moment(valDesc.value, pattern);
					if(m.isValid()){
						valDesc.value = m.toDate();
					} else {
						valDesc.value = new Date(0);
					}
					break;
				}
				break;
			case 'array':
				switch(currentType){
				case 'null':
					valDesc.value = [];
					break;
				case 'array':
					// do nothing
					break;
				case 'object':
					var nArr = [];
					for(var k in valDesc.value){
						nArr.push(valDesc.value[k]);
					}
					valDesc.value = nArr;
					break;
				case 'string':
					try {
						var ss = JSON.parse(valDesc.value);
						if(JSB.isArray(ss)){
							valDesc.value = ss;
						} else {
							valDesc.value = [valDesc.value];
						}
					} catch(e){
						valDesc.value = [valDesc.value];
					}
					break;
				default:
					valDesc.value = [valDesc.value];
				}
				break;
			case 'object':
				switch(currentType){
				case 'null':
					valDesc.value = {};
					break;
				case 'object':
					// do nothing
					break;
				case 'array':
					var obj = {};
					for(var i = 0; i < valDesc.value.length; i++){
						obj[i] = valDesc.value[i];
					}
					valDesc.value = obj;
					break;
				case 'string':
					try {
						var ss = JSON.parse(valDesc.value);
						if(JSB.isObject(ss)){
							valDesc.value = ss;
						} else {
							valDesc.value = {0:valDesc.value};
						}
					} catch(e){
						valDesc.value = {0:valDesc.value};
					}
					break;
				default:
					valDesc.value = {0:valDesc.value};
				}
				break;
			}
			valDesc.type = targetType;
			return valDesc;
		},
		
		executeScript: function(valDesc, expression, vars, dataBindMap){
			// construct thisObj
			var thisObj = {value: valDesc.value};
			for(var vName in vars){
				var b = vars[vName].field;
				thisObj[vName] = dataBindMap[b];
			}
			var res = (function(){
				return eval('(' + expression + ')');
			}).call(thisObj);
			var type = $this.detectValueTable(res);
			valDesc.value = res;
			if(type != 'null'){
				valDesc.type = type;
			}
			return valDesc;
		},
		
		unwindArray: function(valDesc){
			if(JSB.isArray(valDesc.value)){
				var resDesc = [];
				for(var i = 0; i < valDesc.value.length; i++){
					resDesc.push({
						value: valDesc.value[i],
						type: $this.detectValueTable(valDesc.value[i])
					});
				}
				return resDesc;
			} else {
				return valDesc;
			}
		},
		
		splitString: function(valDesc, tDesc){
			if(JSB.isString(valDesc.value)){
				valDesc.value = valDesc.value.split(tDesc.splitDelimiter);
				valDesc.type = 'array';
				for(var i = valDesc.value.length - 1; i >= 0; i--){
					if(tDesc.splitTrim){
						valDesc.value[i] = valDesc.value[i].trim();
					}
					if(tDesc.splitRemoveEmpty && valDesc.value[i].length == 0){
						valDesc.value.splice(i, 1);
					}
				}
			}
			return valDesc;
		},
		
		rowHash: function(valDesc, tDesc, dataBindMap){
			var hashVal = JSON.stringify(valDesc.value);
			for(var i = 0; i < tDesc.oddFields.length; i++){
				hashVal += JSON.stringify(dataBindMap[tDesc.oddFields[i]]);
			}
			valDesc.value = MD5.md5(hashVal);
			valDesc.type = 'string';
			return valDesc;
		},
		
		emitTables: function(){
			function executeTransform(valDesc, tDesc, dataBindMap){
				if(JSB.isArray(valDesc)){
					var resDesc = [];
					for(var i = 0; i < valDesc.length; i++){
						resDesc.push(executeTransform(valDesc[i], tDesc, dataBindMap));
					}
					return resDesc;
				} else {
					switch(tDesc.op){
					case 'convertType':
						valDesc = $this.executeConvertType(valDesc, tDesc.targetType, tDesc.pattern);
						break;
					case 'scriptExpression':
						valDesc = $this.executeScript(valDesc, tDesc.expression, tDesc.vars, dataBindMap);
						break;
					case 'unwindArray':
						valDesc = $this.unwindArray(valDesc);
						break;
					case 'splitString':
						valDesc = $this.splitString(valDesc, tDesc);
						break;
					case 'rowHash':
						valDesc = $this.rowHash(valDesc, tDesc, dataBindMap);
						break;
					}
					return valDesc;
				}
			}
			
			function executeTransformChain(colDesc, valDesc, dataBindMap){
				for(var i = 0; i < colDesc.transforms.length; i++){
					valDesc = executeTransform(valDesc, colDesc.transforms[i], dataBindMap);
				}
				return valDesc;
			}
			
			function resolveCellType(bindingInfo){
				if(bindingInfo.type == 'array'){
					return resolveCellType(bindingInfo.arrayType);
				}
				return bindingInfo.type;
			}
			
			function resolveCellValue(colDesc, rootSel, dataBindMap){
				var val = dataBindMap[colDesc.field];
				var type = resolveCellType(colDesc.bindingInfo);
				return executeTransformChain(colDesc, {value: val, type: type}, dataBindMap);
			}
			
			for(var tableName in this.descriptors){
				var tableDesc = this.descriptors[tableName];
				
				
				var dataBindMap = {};
				tableDesc.bindingTree.setData(this.data, dataBindMap);
				do {
					// iterate over columns and construct record
					var records = [{}];
					var columns = {};
					
					function updateRecords(colName, cellInfo, records, colDesc){
						if(!JSB.isArray(cellInfo) || cellInfo.length == 1){
							if(JSB.isArray(cellInfo)){
								cellInfo = cellInfo[0];
							}
							if($this.options.treatEmptyStringsAsNull && JSB.isString(cellInfo.value) && cellInfo.value.length == 0){
								cellInfo.value = null;
							}
							if(!columns[colName]){
								columns[colName] = {type: cellInfo.type, comment: colDesc.comment};
							}
							
							if($this.typeOrder[columns[colName].type] < $this.typeOrder[cellInfo.type]){
								columns[colName].type = cellInfo.type;
							}
							
							for(var r = 0; r < records.length; r++){
								records[r][colName] = cellInfo.value;
							}
						} else if(cellInfo.length > 1) {
							var nRecords = [];
							for(var a = 0; a < cellInfo.length; a++){
								nRecords = nRecords.concat(updateRecords(colName, cellInfo[a], JSB.clone(records), colDesc));
							}
							return nRecords;
						}
						return records;
					}
					
					var mandatoryColumns = [];
					for(var colName in tableDesc.columns){
						var colDesc = tableDesc.columns[colName];
						if(colDesc.mandatory){
							mandatoryColumns.push(colName);
						}
						var cellInfo = resolveCellValue(colDesc, tableDesc.bindingTree, dataBindMap);
						records = updateRecords(colName, cellInfo, records, colDesc);
					}
					var targetTable = tableDesc.table;
					if(tableDesc.unionWithTable && this.descriptors[tableDesc.unionWithTable]){
						targetTable = tableDesc.unionWithTable;
					}
					for(var r = 0; r < records.length; r++){
						if(mandatoryColumns.length > 0){
							var bSkip = false;
							for(var m = 0; m < mandatoryColumns.length; m++){
								if(JSB.isNull(records[r][mandatoryColumns[m]])){
									bSkip = true;
									break;
								}
							}
							if(bSkip){
								continue;
							}
						}
						this.emitRecord({table: targetTable, columns: columns}, records[r]);	
					}
					
				} while(tableDesc.bindingTree.next(dataBindMap));
			}
		},
		
		emitRecord: function(tableDesc, record){
			if(this.rowCollback){
				this.rowCollback.call(this, tableDesc, record);
			}
		},
		
		translateField: function(field){
			if(!field || !JSB.isString(field)){
				return field;
			}
			return field.replace(/\./g, '\uff0e');
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
				field = $this.translateField(field);
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
				field = $this.translateField(field);
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
			if(JSB.isNull(value) || ($this.options.treatEmptyStringsAsNull && JSB.isString(value) && value.length == 0)){
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
			field = $this.translateField(field);
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
			
			this.descriptors = {};
			
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
				
				if(tableCtx.find('unionWithTable').checked()){
					var unionWithTable = tableCtx.find('unionWithTable').value();
					if(unionWithTable && unionWithTable != tableName){
						tableDesc.unionWithTable = unionWithTable;
					}
				}
				
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
						mandatory: columnCtx.find('mandatory').checked(),
						type: colType,
						bindingInfo: colBindingInfo,
						transforms: []
					};
					
					if(columnCtx.find('columnComment').checked()){
						colDesc.comment = columnCtx.find('columnComment').value();
					}
					
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
								}[tCtx.find('resultType').value()];
								if(transformDesc.targetType == 'date'){
									var patCtx = tCtx.find('datePattern');
									if(patCtx.checked()){
										transformDesc.pattern =	patCtx.value();
									}
								}
								 
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
							case 'splitString':
								transformDesc.splitDelimiter = tCtx.find('splitDelimiter').value();
								transformDesc.splitTrim = tCtx.find('splitTrim').checked();
								transformDesc.splitRemoveEmpty = tCtx.find('splitRemoveEmpty').checked();
								break;
							case 'rowHash':
								var valArrCtx = tCtx.find('hashColumns').values();
								transformDesc.oddFields = [];
								for(var v = 0; v < valArrCtx.length; v++){
									var valCtx = valArrCtx[v];
									var oddField = valCtx.find('oddField').binding();
									transformDesc.oddFields.push(oddField);
									if(oddField && oddField.length > 0 && !bindings[oddField]){
										bindings[oddField] = true;
									}
								}
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
				this.descriptors[tableDesc.table] = tableDesc;
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
							tDesc.columns[c] = tableDesc.columns[c];
							if(!tDesc.columns[c].type){
								// detect type
								var type = $this.detectValueTable(rowData[c]);
								if(type != 'null'){
									tDesc.columns[c].type = type;
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
			if(!this.importOpts){
				this.importOpts = {
					schema: this.getContext().find('databaseScheme').value() || 'public',
					treatEmptyStringsAsNull: $this.options.treatEmptyStringsAsNull
				};
			}
			for(var t in $this.importTables){
				var tDesc = $this.importTables[t];
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
						if(this.getContext().find('removeOldTable').checked()){
							this.logAppend('info', 'Удаление старой таблицы: ' + t);
							mInst.removeTable(t, $this.importOpts);
						}
						// create table in db
						this.logAppend('info', 'Создание таблицы: ' + t);
						var res = mInst.createTable(t, tDesc.columns, $this.importOpts);
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
				mInst.insert(tDesc.table, translatedRows, $this.importOpts);
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