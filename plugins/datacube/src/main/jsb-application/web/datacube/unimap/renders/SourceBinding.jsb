{
	$name: 'Unimap.Render.SourceBinding',
	$parent: 'Unimap.Render.Item',

	$alias: 'sourceBinding',

	$client: {
	    $require: ['JSB.Controls.Editor', 
	               'DataCube.Providers.DataProviderRepository', 
	               'JSB.Widgets.RendererRepository', 
	               'JSB.Controls.Button', 
	               'Unimap.Render.DataBindingCache',
	               'css:SourceBinding.css'],

	    _beans: [],
	    _dataList: [],
	    _bindingsInfo: {},
	    _fields: [],
	    _render: null,
	    _resolvedFields: {},
	    _disabled: false,
	    _items: [],

	    construct: function(){
	        this.addClass('sourceBindingRender');

	        this.createDataList();

	        $base();
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        var item = this.$('<div class="item"></div>');

	        this.setEditor(item);

            item.droppable({
                accept: function(d){
                    if(d && d.length > 0 && d.get(0).draggingItems){
                        for(var i in d.get(0).draggingItems){
                            var obj = d.get(0).draggingItems[i].obj;

                            if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
                                continue;
                            }

                            var entry = obj.getTargetEntry();
                            if(JSB.isInstanceOf(entry,'DataCube.Model.Slice')){
                                return true;
                            }

                            var dpInfo = DataProviderRepository.queryDataProviderInfo(entry);
                            if(dpInfo){
                                return true;
                            }
                        }
                    }
                    return false;
                },
                tolerance: 'pointer',
                greedy: true,
                activeClass : 'acceptDraggable',
                hoverClass: 'hoverDraggable',
                drop: function(evt, ui){
                    var d = ui.draggable;

                    for(var i in d.get(0).draggingItems){
                        $this.setBinding(d.get(0).draggingItems[i].obj.getTargetEntry(), itemIndex);
                        break;
                    }
                }
            });

	        if(this._scheme.multiple){
	            item.addClass('.multipleItem');

	            if(!itemIndex){
	                itemIndex = this.multipleContainer.find('.multipleItem').length;
	            }
	            item.attr('idx', itemIndex);

	            this.multipleBtn.before(item);
	        } else {
	            this.append(item);
	        }

            if(values.binding){
                this.setDataScheme(values.binding, null, itemIndex);
            }
	    },

	    createDataList: function(){
	        function collectSliceFields(desc, items, path){
	        	if(!desc){
	        		return;
	        	}
	        	if(desc.type == 'array'){
	        		collectSliceFields(desc.arrayType, items, path);
	        	} else if(desc.type == 'object'){
	        		var fieldArr = Object.keys(desc.record);
	        		fieldArr.sort(function(a, b){
	        			return a.toLowerCase().localeCompare(b.toLowerCase());
	        		});
	        		for(var i = 0; i < fieldArr.length; i++){
	        			var f = fieldArr[i];
	        			var rf = desc.record[f];
	        			var curPath = (path ? path + '.' : '') + f;
	        			var schemeRef = JSB.merge({field: f}, rf);
	        			var item = {
                            key: curPath,
                            value: $this.$('<div class="sliceRender">' + f + '</div>'),
                            child: [],
                            scheme: schemeRef
                        };
                        $this._fields.push(schemeRef);
	        			$this._bindingsInfo[curPath] = schemeRef;
	        			items.push(item);
	        			collectSliceFields(rf, item.child, curPath);
	        		}
	        	}
	        }
	        
	        function collectCubeFields(desc, items){
	        	if(!desc || !desc.cubeFields || Object.keys(desc.cubeFields).length == 0){
	        		return;
	        	}
	        	for(var cubeField in desc.cubeFields){
	        		var cubeFieldType = desc.cubeFields[cubeField].type;
	        		var key = '__$cube.' + cubeField;
	        		var item = {
	        			key: key, 
	        			value: $this.$('<div class="cubeFieldRender">' + cubeField + '</div>'),
	        			scheme: {
	        				type: cubeFieldType,
	        				field: cubeField,
	        				cubeField: true
	        			}
	        		};
	        		$this._bindingsInfo[key] = item.scheme;
        			items.push(item);
	        	}
	        }

	        this._fields = [];
	        this._dataList = [];
	        this._cubeFieldList = [];
	        this._bindingsInfo = {};

	        if(!this._values.values || !this._values.values[0]){
	            return;
	        }

			collectSliceFields(this._values.values[0].binding, this._dataList, '');
			collectCubeFields(this._values.values[0].binding, this._cubeFieldList);

            DataBindingCache.put(this.getContext(), this.getKey(), 'DataBinding_dataList', this._dataList);
            DataBindingCache.put(this.getContext(), this.getKey(), 'DataBinding_cubeFieldList', this._cubeFieldList);
            DataBindingCache.put(this.getContext(), this.getKey(), 'DataBinding_bindingsInfo', this._bindingsInfo);
	    },

	    destroy: function(){
            if(this._render){
                this._render.destroy();
            }

	        for(var i = 0; i < this._beans.length; i++){
	            this._beans[i].destroy();
	        }

	        $base();
	    },

	    disable: function(){
	        if(this._disabled){
	            return;
	        }

	        if(this._scheme.multiple){
	            this.multipleContainer.find('.multipleItem').append('<div class="disableBlock"></div>');
	        } else {
	            this.find('> .item').append('<div class="disableBlock"></div>');
	        }

	        this._disabled = true;
	    },

	    enable: function(){
            if(!this._disabled){
                return;
            }

	        if(this._scheme.multiple){
	            this.multipleContainer.find('.multipleItem > .disableBlock').remove();
	        } else {
	            this.find('> .item > .disableBlock').remove();
	        }

            this._disabled = false;
	    },

	    getDataSchemes: function(){
	        var dataSchemes = [];

	        for(var i = 0; i < this._values.values.length; i++){
	            dataSchemes.push(this._values.values[i].binding);
	        }

	        return dataSchemes;
	    },

	    getField: function(key){
	        return this._resolvedFields[key];
	    },

	    getFields: function(){
	        return this._fields;
	    },

	    resolveLinkedFields: function(){
	        function getField(type){
                for(var i = 0; i < $this._fields.length; i++){
                    if(!$this._fields[i].used){
                        if(type){
                            var fieldType = null;

                            switch($this._fields[i].type){
                                case 'float':
                                case 'integer':
                                    fieldType = 'number';
                                    break;
                                default:
                                    fieldType = $this._fields[i].type;
                            }

                            if(fieldType === type){
                                $this._fields[i].used = true;
                                return $this._fields[i];
                            }
                        } else {
                            $this._fields[i].used = true;
                            return $this._fields[i];
                        }
                    }
                }
	        }

	        var linkedRenders = this.getLinkedRenders(),
	            excludeKeys = [];

	        for(var i = 0; i < linkedRenders.length; i++){
	            if(JSB.isInstanceOf(linkedRenders[i], 'Unimap.Render.AutocompleteGroup')){
	                excludeKeys = excludeKeys.concat(Object.keys(linkedRenders[i].getScheme().linkedFields));
	                continue;
	            }

	            if(JSB.isInstanceOf(linkedRenders[i], 'Unimap.Render.DataBinding') && excludeKeys.indexOf(linkedRenders[i].getKey()) < 0){
	                var autocomplete = linkedRenders[i].getScheme().autocomplete;

	                if(!autocomplete){
	                    continue;
	                }

	                var val = getField(autocomplete.type);

                    if(val){
                        this._resolvedFields[linkedRenders[i].getKey()] = val.field;
                    }
	            }
	        }
	    },

	    setBinding: function(entry, itemIndex){
			var source = null;
			if(JSB.isInstanceOf(entry, 'DataCube.Model.Slice')){
				source = entry;
			} else {
				var dpInfo = DataProviderRepository.queryDataProviderInfo(entry);
				if(dpInfo){
					source = entry;
				}
			}

            var item;
            if(this._scheme.multiple){
                item = this.find('.multipleItem[idx=' + itemIndex + ']');
            } else {
                item = this.find('.item');
            }

			item.addClass('refreshing');
			this.server().combineDataScheme(source, function(dataScheme, fail){
			    item.removeClass('refreshing');
				if(!fail){
					$this.setDataScheme(dataScheme, source, itemIndex, function(){
					    $this.changeBinding(itemIndex);
					});
				}
			});
	    },

		setDataScheme: function(ds, source, itemIndex, callback){
		    this._items[itemIndex] = {
		        dataScheme: ds
		    };

			function setupSource(source){
			    if(!source){
			        return; // todo: error
			    }

			    $this._items[itemIndex].source = source;

				var item;
				if($this._scheme.multiple){
				    item = $this.find('.multipleItem[idx=' + itemIndex + ']');
				} else {
				    item = $this.find('.item');
				}

				if($this._render){
				    $this._render.destroy();
				}
				$this._render = RendererRepository.createRendererFor(source, {showCube: true});
				item.empty().append($this._render.getElement());

                var refreshButton = $this.$('<i class="btn btnRefresh fas fa-sync-alt" title="Обновить схему данных"></i>');
                refreshButton.click(function(evt){
                    evt.stopPropagation();
                    $this.setBinding(source, itemIndex);
                });
                item.append(refreshButton);

                var removeButton = $this.$('<i class="btn btnDelete fas fa-times-circle" title="Удалить"></i>');
                removeButton.click(function(evt){
                    evt.stopPropagation();
                    $this.removeBinding(item, itemIndex);
                });
                item.append(removeButton);

				item.addClass('filled');
			}

			if(source){
				setupSource(source);
				if(callback){
					callback.call($this);
				}
			} else {
				this.server().getDataSchemeSource(ds, function(source, fail){
				    if(fail){
				        return;
				    }

					setupSource(source);
					if(callback){
						callback.call($this);
					}
				});
			}
		},

		setEditor: function(item){
            switch(this._scheme.options && this._scheme.options.editor){
                case 'input':
                    var editor = new Editor({
                        onchange: function(){
                            values.value = this.getValue();
                        }
                    });
                    item.append(editor.getElement());

                    $this._beans.push(editor);
                    break;
                default:
                    item.addClass('bindingItem');
                    item.text('Перетащите источник');
                    break;
            }

            if(editor){
                editor.setPlaceholder('Введите значение или перетащите источник');
            }
		},

		changeBinding: function(itemIndex){
		    var needResolve = false;
		    if(!this._values.values[0].binding){
		        needResolve = true;
		    }

		    this._values.values[itemIndex] = {
		        binding: this._items[itemIndex].dataScheme,
		    }
		    DataBindingCache.remove(this.getContext(), this.getKey());
		    this.createDataList();

		    if(needResolve){
		        this.resolveLinkedFields();
		    }
		    this.updateId = JSB.generateUid();
		    this.onchange();
		},

		removeBinding: function(item, itemIndex){
            this._items[itemIndex] = {};

            if(itemIndex > 0){
                item.remove();
            } else {
                item.removeClass('filled');
                item.empty();
                this.setEditor(item);
            }

            this.changeBinding(itemIndex);
		}
	},

	$server: {
	    $require: ['JSB.Workspace.WorkspaceController'],

	    combineDataScheme: function(source){
			var iterator = null;
			var recordTypes = {};

			try {
                if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
                    iterator = source.executeQuery({useCache: true});
                } else {
                    // TODO
                    var dpInfo = DataProviderRepository.queryDataProviderInfo(source);
                    var ProviderClass = JSB.get(dpInfo.pType).getClass();
                    var provider = new ProviderClass(JSB.generateUid(), source, null);
                    provider.extractFields();

                    var buffer = provider.find();
                    iterator = {
                        buffer: buffer,
                        total: buffer.length,
                        pos: 0,
                        next: function(){
                            if(this.pos >= this.total){
                                return null;
                            }
                            return this.buffer[this.pos++];
                        },
                        close: function(){
                            this.buffer = [];
                            this.total = 0;
                            this.pos = 0;
                        }
                    }
                }
                if(!iterator){
                    return null;
                }
                function processElement(val, path){
                    if(JSB.isNull(val)){
                        return {};
                    } else if(JSB.isObject(val)){
                        var rDesc = {type: 'object', record: {}};
                        for(var f in val){
                            var cVal = val[f];
                            var curPath = path;
                            if(curPath){
                                curPath = curPath + '.' + f;
                            } else {
                                curPath = f;
                            }
                            var r = processElement(cVal, curPath);
                            rDesc.record[f] = JSB.merge(true, rDesc.record[f] || {}, r);
                            rDesc.record[f].field = f;
                            if(path){
                                rDesc.record[f].path = path;
                            }
                        }
                        return rDesc;
                    } else if(JSB.isArray(val)){
                        var rDesc = {type:'array', arrayType: {}};
                        for(var i = 0; i < val.length; i++){
                            var r = processElement(val[i], path);
                            if(r && Object.keys(r).length > 0){
                                rDesc.arrayType = r;
                            }
                        }
                        return rDesc;
                    } else if(JSB.isString(val)){
                        return {type: 'string'};
                    } else if(JSB.isFloat(val)){
                        return {type: 'float'};
                    } else if(JSB.isInteger(val)){
                        return {type: 'integer'};
                    } else if(JSB.isBoolean(val)){
                        return {type: 'boolean'};
                    } else if(JSB.isDate(val)){
                        return {type: 'date'};
                    }
                }
                for(var j = 0; j < 50; j++){
                    var el = iterator.next();
                    if(!el){
                        break;
                    }
                    var r = processElement(el);
                    JSB.merge(true, recordTypes, r);
                }
			} finally {
                if(iterator){
                    try {iterator.close();} catch(e){}
                }
			}

			return {
				type: 'array',
				source: source.getId(),
				arrayType: recordTypes,
				workspaceId: source.getWorkspace().getId(),
				cubeFields: source.getCube().getDimensions()
			}
	    },

        getDataSchemeSource: function(ds){
            if(!ds || !ds.source || !ds.workspaceId){
                throw new Error('Invalid datascheme passed');
            }

            return WorkspaceController.getWorkspace(ds.workspaceId).entry(ds.source);
        }
	}
}