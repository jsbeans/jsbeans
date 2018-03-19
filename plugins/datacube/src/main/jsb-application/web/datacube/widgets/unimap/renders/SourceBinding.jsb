{
	$name: 'Unimap.Render.SourceBinding',
	$parent: 'Unimap.Render.Item',
	$require: ['JSB.Controls.Editor', 'DataCube.Providers.DataProviderRepository', 'JSB.Widgets.RendererRepository', 'JSB.Controls.Button'],
	$client: {
	    _beans: [],
	    _disabled: false,
	    _items: [],

	    construct: function(){
	        this.addClass('sourceBindingRender');
	        this.loadCss('SourceBinding.css');
	        $base();
	    },

	    addItem: function(values, itemIndex){
	        if(!values){
	            values = {};
	            this._values.values.push(values);
	        }

	        var item = this.$('<div class="item"></div>');

	        this.setEditor(item);

            if(values.binding){
                this.setDataScheme(values.binding, null, itemIndex);
            }

            item.droppable({
                accept: function(d){
                    if(d && d.length > 0 && d.get(0).draggingItems){
                        for(var i in d.get(0).draggingItems){
                            var obj = d.get(0).draggingItems[i].obj;

                            if(!JSB.isInstanceOf(obj, 'JSB.Workspace.ExplorerNode')){
                                continue;
                            }

                            var entry = obj.getEntry();
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
                over: function(evt, ui){
                    if( !ui.helper.hasClass('accepted') ){
                        ui.helper.addClass('accepted');
                    }
                    item.addClass('acceptDraggable');
                },
                out: function(evt, ui){
                    if( ui.helper.hasClass('accepted') ){
                        ui.helper.removeClass('accepted');
                    }
                    item.removeClass('acceptDraggable');
                },
                drop: function(evt, ui){
                    var d = ui.draggable;
                    item.removeClass('acceptDraggable');
                    for(var i in d.get(0).draggingItems){
                        $this.setBinding(d.get(0).draggingItems[i].obj.getEntry(), itemIndex);
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
	    },

	    destroy: function(){
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

				item.empty().append(RendererRepository.createRendererFor(source, {showCube: true}).getElement());

                var refreshButton = new Button({
                    hasIcon: true,
                    hasCaption: false,
                    cssClass: 'btnRefresh',
                    tooltip: 'Обновить схему данных',
                    onclick: function(evt){
                        evt.stopPropagation();
                        $this.setBinding(source);
                    }
                });
                item.append(refreshButton.getElement());

                $this._beans.push(refreshButton);

                var removeButton = new Button({
                    hasIcon: true,
                    hasCaption: false,
                    cssClass: 'btnDelete',
                    tooltip: 'Удалить',
                    onclick: function(evt){
                        evt.stopPropagation();
                        $this.removeBinding(item, itemIndex);
                    }
                });
                item.append(removeButton.getElement());

                $this._beans.push(removeButton);

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
		    this._values.values[itemIndex] = {
		        binding: this._items[itemIndex].dataScheme,
		    }

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
			if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
				iterator = source.executeQuery();
			} else {
				// todo
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

			var recordTypes = {};
			for(var j = 0; j < 100; j++){
				var el = iterator.next();
				if(!el){
					break;
				}
				var r = processElement(el);
				JSB.merge(true, recordTypes, r);
			}

			iterator.close();

			return {
				type: 'array',
				source: source.getId(),
				arrayType: recordTypes,
				workspaceId: source.getWorkspace().getId()
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