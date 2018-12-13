{
	$name: 'DataCube.Widgets.Widget',
	$parent: 'JSB.Widgets.Widget',

	$scheme: {
		common: {
			name: 'Разное',
			render: 'group',
			priority: 0,
			items: {
				showFilters: {
			        render: 'item',
			        name: 'Отображать фильтры',
			        priority: 0,
			        optional: 'checked',
			        editor: 'none'
			    },
			}
		}
	},
	
	$client: {
		wrapper: null,
		widgetEntry: null,
		context: {},
		values: null,
		sort: null,
		sources: null,
		sourceFilterMap: null,
		initCallbacks: [],
		contextFilter: {},
		filterLayers: {
			main: true,
			back: false,
			hover: false
		},
		rowKeyColumns: [],

		$require: ['JSB.Crypt.MD5', 
		           'DataCube.Export.Export', 
		           'JQuery.UI.Loader', 
		           'Unimap.ValueSelector',
		           'Datacube.Unimap.Bootstrap',
		           'JSB.Widgets.ToolBar',
		           'css:Widget.css'],

		$constructor: function(opts){
		    $base();

		    this.addClass('datacubeWidget');
		    
		    this.messageBox = this.$('<div class="message hidden"></div>');
			this.append(this.messageBox);

		    if(opts){   // not embedded widget
                this.widgetEntry = opts.widgetEntry;
                this.wrapper = opts.widgetWrapper;
                this.filterManager = opts.filterManager;

                this.widgetEntry.getData(function(res){
                    if(!res) { return ;}

                    $this.updateValues(res, function(){
                    	$this.setTrigger('_valuesLoaded');
                    });
                });
		    }
		    
		    var UpdateDispatcher = function(){
		        var status = 'ready',
		            needRefresh = false,
		            refreshOpts;

		        this.addTask = function(opts){
		            if(status === 'ready'){
		                status = 'refreshing';
		                $this.onRefresh(opts);
		            } else {
		                refreshOpts = opts;
		                needRefresh = true;
		            }
		        }

		        this.isNeedRefresh = function(){
		            return needRefresh;
		        }

		        this.ready = function(){
		            if(needRefresh){
		                needRefresh = false;
		                $this.onRefresh(refreshOpts);
		            } else {
		                status = 'ready';
		            }
		        }
            }
		    
		    this.updateDispatcher = new UpdateDispatcher();
		    
		    function Selection(){
		    	this.selMap = {};
		    	this.lastKey = null;
		    }
		    Selection.prototype = {
		    	clear: function(){
		    		if(!this.selMap || Object.keys(this.selMap).length == 0){
		    			return;
		    		}
		    		this.selMap = {};
		    		this.lastKey = null;
		    		$this.showToolbar(false);
		    		$this.publish('DataCube.Widgets.Widget.selection', {type:'clear'});
		    	},
		    	
		    	add: function(key, desc){
		    		this.selMap[key] = desc;
		    		this.lastKey = key;
		    		$this.showToolbar(true);
		    		$this.publish('DataCube.Widgets.Widget.selection', {type:'add', item: key, params: desc});
		    	},
		    	
		    	remove: function(key){
		    		if(!this.isSelected(key)){
		    			return;
		    		}
		    		delete this.selMap[key];
		    		if(this.lastKey == key){
		    			this.lastKey = null;
		    		}
		    		if(this.count() == 0){
		    			$this.showToolbar(false);
		    		}
		    		$this.publish('DataCube.Widgets.Widget.selection', {type:'remove', item: key});
		    	},
		    	
		    	count: function(){
		    		return Object.keys(this.selMap).length;
		    	},
		    	
		    	isSelected: function(key){
		    		return this.selMap[key];
		    	},
		    	
		    	getLastSelectedKey: function(){
		    		return this.lastKey;
		    	},
		    	
		    	get: function(key){
		    		return this.selMap[key];
		    	},
		    	
		    	keys: function(){
		    		return Object.keys(this.selMap);
		    	},
		    	
		    	each: function(callback){
		    		for(var key in this.selMap){
		    			callback.call(this, key, this.selMap[key]);
		    		}
		    	}
		    };

		    this.selection = new Selection();
		},
		
		getSelection: function(){
			return this.selection;
		},
		
		ensureToolbar: function(){
			if(this.toolbar){
				return this.toolbar;
			}
			this.toolbar = new ToolBar();
		    this.append(this.toolbar);
		    this.toolbar.getElement().resize(function(){
		    	var height = $this.toolbar.getElement().outerHeight();
		    	var width = $this.toolbar.getElement().outerWidth();
		    	$this.toolbar.getElement().css({
		    		'margin-left': '-' + Math.floor(width / 2) + 'px',
		    		'bottom': '-' + Math.floor(height) + 'px'
		    	});
		    });
		    
		    this.toolbar.addItem({
		    	key: 'selectedCount',
		    	allowHover: false,
		    	element: '<div class="count"></div>'
		    });
		    
		    this.toolbar.addSeparator({key: 'selectionInfo'});
		    
		    // add tool buttons
/*		    
		    this.toolbar.addItem({
		    	key: 'selectAll',
		    	tooltip: 'Выделить все',
		    	element: '<div class="icon"></div>'
		    });
		    
		    this.toolbar.addItem({
		    	key: 'inverseSelection',
		    	tooltip: 'Инвертировать выделение',
		    	element: '<div class="icon"></div>'
		    });
*/		    
		    this.toolbar.addItem({
		    	key: 'unselectAll',
		    	tooltip: 'Снять выделение',
		    	element: '<div class="icon"></div>',
		    	onClick: function(){
		    		$this.getSelection().clear();
		    	}
		    });
		    
		    this.toolbar.addSeparator({key: 'selectionButtons'});
		    
		    this.toolbar.addItem({
		    	key: 'filterAnd',
		    	tooltip: 'Фильтровать группу по И',
		    	element: '<div class="filter and">И</div>',
		    	onClick: function(){
		    		$this.addSelectedToFilter('$and');
		    	}
		    });

		    this.toolbar.addItem({
		    	key: 'filterOr',
		    	tooltip: 'Фильтровать группу по ИЛИ',
		    	element: '<div class="filter or">ИЛИ</div>',
		    	onClick: function(){
		    		$this.addSelectedToFilter('$or');
		    	}
		    });

		    this.toolbar.addItem({
		    	key: 'filterNot',
		    	tooltip: 'Фильтровать группу по НЕ',
		    	element: '<div class="filter not">НЕ</div>',
		    	onClick: function(){
		    		$this.addSelectedToFilter('$not');
		    	}
		    });

		    this.subscribe('DataCube.Widgets.Widget.selection', function(sender, msg, params){
		    	if(sender != $this){
		    		return;
		    	}
		    	$this.toolbar.find('._dwp_toolBarItem[key="selectedCount"] > .count').text($this.getSelection().count());
		    });
		    
		    return this.toolbar;
		},
		
		showToolbar: function(bShow){
			if(bShow){
				this.ensureToolbar();
				if(this.hasClass('toolbar')){
					return;
				}
				this.addClass('toolbar');
				this.publish('DataCube.Widgets.Widget.toolbar', true);
			} else {
				if(!this.hasClass('toolbar')){
					return;
				}
				this.removeClass('toolbar');
				this.publish('DataCube.Widgets.Widget.toolbar', false);
			}
			
		},
		
		showMessage: function(txt){
			this.messageBox.empty();
			this.messageBox.append(txt);
			this.messageBox.removeClass('hidden');
		},
		
		hideMessage: function(){
			this.messageBox.addClass('hidden');
		},

		addDrilldownElement: function(opts){
		    this.wrapper.addDrilldownElement(opts);
		},
		
		addSelectedToFilter: function(type){
			// proceed only $eq ops
			var groupItems = [];
			$this.getSelection().each(function(key, selDesc){
				if(!selDesc.filter || !JSB.isArray(selDesc.filter) || selDesc.filter.length == 0){
					return;
				}
				if(selDesc.filter.length == 1){
					var fDesc = selDesc.filter[0];
					fDesc.type = '$or';
					groupItems.push(fDesc);
				} else {
					var innerItems = [];
					for(var i = 0; i < selDesc.filter.length; i++){
						var fDesc = selDesc.filter[i];
						fDesc.type = '$and';
						innerItems.push(fDesc);
					}
					groupItems.push({
						op: '$group',
						type: '$or',
						items: innerItems
					});
				}
/*				
				for(var i = 0; i < selDesc.filter.length; i++){
					var fDesc = selDesc.filter[i];
					groupFilters.push();
					if(fDesc.op != '$eq'){
						continue;
					}
					if(!filterFields[fDesc.field]){
						filterFields[fDesc.field] = {
							sourceId: fDesc.sourceId,
							values: []
						};
					}
					filterFields[fDesc.field].values.push(fDesc.value);
				}
*/				
			});
			
			if(groupItems.length > 0){
				// add filters
				this.addFilter({
					type: type,
					op: '$group',
					items: groupItems
				});
				
				$this.getSelection().clear();
				$this.refreshAll();
			}
/*			
			if(type == '$and'){
				for(var fName in filterFields){
					var fDesc = filterFields[fName];
					this.addFilter({
						sourceId: fDesc.sourceId,
						field: fName,
						type: '$and',
						op: '$in',
						value: fDesc.values
					})
				}
			} else if(type == '$or') {
				for(var fName in filterFields){
					var fDesc = filterFields[fName];
					this.addFilter({
						sourceId: fDesc.sourceId,
						field: fName,
						type: '$or',
						op: '$in',
						value: fDesc.values
					})
				}
			} else if(type == '$not') {
				for(var fName in filterFields){
					var fDesc = filterFields[fName];
					this.addFilter({
						sourceId: fDesc.sourceId,
						field: fName,
						type: '$and',
						op: '$nin',
						value: fDesc.values
					})
				}
				
			} else {
				return;
			}
*/			
		},

		addFilter: function(fDesc){
		    if(!this.filterManager){
		        return;
            }
		    fDesc.sender = this.getEntry();
			var filterId = this.filterManager.addFilter(this.translateFilter(fDesc));
			this.getWrapper().addFilter(filterId);
			return filterId;
		},
		
		getFilter: function(fId){
			if(!this.filterManager){ return; }
			return this.filterManager.getFilters()[fId];
		},
		
		removeFilter: function(fItemId, dontPublish){
		    if(!this.filterManager){ return; }
			this.filterManager.removeFilter(fItemId, dontPublish);
			this.getWrapper().updateFilters();
		},
		
		hasFilter: function(fDesc){
		    if(!this.filterManager){ return; }
		    fDesc.sender = this.getEntry();
			return this.filterManager.hasFilter(this.translateFilter(fDesc));
		},

		localizeFilters: function(){
		    if(!this.filterManager){ return; }
			this.sourceFilterMap = {};
			for(var srcId in this.sources){
				var src = this.sources[srcId];
				
				this.sourceFilterMap[srcId] = this.filterManager.getFiltersBySource(src);
			}
		},


		removeAllFilters: function(){
            var fm = this.getFilterManager();
            if(fm){
                var filters = fm.getFilters();
                for(var i in filters){
                    this.removeFilter(i);
                }
                this.getWrapper().updateFilters();
            }
		},

		
		getCubeField: function(field){
			var sourceArr = this.getSourceIds();
			if(!sourceArr || sourceArr.length == 0){
				return;
			}
			var sourceId = sourceArr[0];
			var source = this.sources[sourceId];
			return this.filterManager && this.filterManager.extractCubeField(source, field);
		},

		clearFilters: function(){
		    if(!this.filterManager){ return; }

			this.filterManager.clearFilters();
			this.getWrapper().updateFilters();
		},

		createFilterHash: function(filter){
            var str = '';
		    for(var i in filter){
		        str += '' + i + filter[i].type;
		    }

		    return MD5.md5(str);
		},

		decompressData: function(dataObj){
			if(!dataObj){
				return null;
			}
			var data = [];
			for(var i = 0; i < dataObj.data.length; i++){
				var cItem = dataObj.data[i];
				var item = {};
				for(var lIdx in cItem){
					var lItem = cItem[lIdx];
					var layer = dataObj.layers[parseInt(lIdx)];
					for(var fIdx in lItem){
						var fName = dataObj.dict[parseInt(fIdx)];
						item[fName] = item[fName] || {};
						item[fName][layer] = lItem[fIdx];
					}
				}
				data.push(item);
			}
			return data;
		},

		ensureInitialized: function(callback){
			this.ensureTrigger(['_widgetInitialized', '_valuesLoaded'], callback);
		},

		exportData: function(format){
			if(format == 'png'){
				Export.exportData(format, this.getElement().get(0), this.getWrapper().getTitle());
			} else {
				var sourceBindings = this.getContext('export').findRendersByName('sourceBinding');
    			var item = sourceBindings[0].binding();
    			$this.server().doExport(format, this.getWrapper().getTitle(), $this.getEntry(), item.source, $this.getLayerQuery('main', item.source), function(dh, fail){
    				dh.download();
    			});
			}
		},

        fetch: function(selector, opts, callback){
            if(selector.isEmbeddedBinding()){
                callback.call(this);
                return;
            }

            if(arguments.length == 1 && JSB.isFunction(opts)){
                callback = opts;
                opts = {};
            }
            if(JSB.isFunction(opts)){
                opts = opts.call($this);
            }
            if(!opts){
                opts = {};
            }

            var item = selector.binding();
            if(!item){
                return false;
            }

            if(!item.source || item.propagated){
                if(item.data){
                    if(opts.reset){
                        item.cursor = 0;
                    }
                    if(callback){
                        callback.call($this, item.data);
                    }
                    return true;
                } else {
                    return false;
                }
            }

            if(!item.fetchOpts){
                item.fetchOpts = {
                    reset: true
                };
            }

            JSB.merge(item.fetchOpts, opts);
            item.fetchOpts.layers = {};

            // construct back filter
            if($this.filterLayers.back){
                item.fetchOpts.layers.back = $this.getLayerQuery('back', item.source);
                if(opts.select){
                    item.fetchOpts.layers.back.$select = opts.select;
                }
                if(opts.groupBy){
                    item.fetchOpts.layers.back.$groupBy = opts.groupBy;
                }
            }

            // construct main layer
            item.fetchOpts.layers.main = $this.getLayerQuery('main', item.source);
            
            if(opts.select){
                item.fetchOpts.layers.main.$select = opts.select;
            }
            if(opts.groupBy){
                item.fetchOpts.layers.main.$groupBy = opts.groupBy;
            }

            if(opts.wrapQuery){
                item.fetchOpts.wrapQuery = opts.wrapQuery;
            }

            // construct hover layer
/*					if($this.filterLayers.hover){
                item.fetchOpts.layers.hover = $this.getLayerQuery('hover', item.source);
                if(opts.select){
                    item.fetchOpts.layers.hover.$select = opts.select;
                }
                if(opts.groupBy){
                    item.fetchOpts.layers.hover.$groupBy = opts.groupBy;
                }
            }*/

            item.fetchOpts.context = selector.getContext();
            item.fetchOpts.rowKeyColumns = $this.rowKeyColumns;
            if(!JSB.isDefined(item.fetchOpts.compress)){
            	item.fetchOpts.compress = true;
            }
            this.server().fetch(item.source, $this.getEntry(), item.fetchOpts, function(serverData, fail){
                if($this.updateDispatcher.isNeedRefresh()){
                    $this.ready();
                    return;
                }

                if(item.fetchOpts.reset){
                    item.cursor = 0;
                    if(item.data){
                        delete item.data;
                    }
                }
                item.fetchOpts.reset = false;

                var data = null;

                if(serverData){
                	if(item.fetchOpts.compress){
                		data = $this.decompressData(serverData);
                	} else {
                		data = serverData;
                	}
                    if(!item.data){
                        item.data = data;
                    } else {
                        item.data = item.data.concat(data);
                    }
                }
                
                if(fail){
                    JSB.getLogger().error(fail);
                    $this.showMessage('<strong>Ошибка!</strong><br /> ' + fail.message);
                } else {
                	$this.hideMessage();
                }
                
                if(callback){
                    if(fail){
                        callback.call($this, null, fail);
                    } else {
                    	callback.call($this, data, fail, serverData.widgetOpts);
                    }
                }
            });
            return true;
        },

		getBindingsData: function(callback){
            var sourceBindings = this.getContext('export').findRendersByName('sourceBinding'),
                result = [];

            function fetch(isReset){
                $this.fetch(sourceBindings[0], { batchSize: 100, reset: isReset }, function(data, fail){
                	if(fail){
                		if(callback){
                			callback.call($this, null, fail);
                		}
                		return;
                	}
                    if(data.length === 0){
                        callback.call($this, result);
                        $this.getElement().loader('hide');
                        return;
                    }

                    if(result.length === 0){
                        result.push(Object.keys(data[0]));
                    }

                    var res;

                    for(var i = 0; i < data.length; i++){
                        res = [];

                        for(var j in data[i]){
                            if(JSB.isObject(data[i][j])){
                                res.push(data[i][j].main);
                            } else {
                                res.push(data[i][j]);
                            }
                        }

                        result.push(res);
                    }

                    fetch();
                });
            }

            this.getElement().loader();
            fetch(true);
		},
		
		getContext: function(ctxName){
			if(!ctxName){
				ctxName = 'main';
			}

			if(!this.context[ctxName]){
				this.context[ctxName] = new ValueSelector({
				    context: ctxName,
				    values: JSB.clone(this.values),
				    bootstrap: 'Datacube.Unimap.Bootstrap'
				});
			}

			return this.context[ctxName];
		},

		getContextFilter: function(){
			return JSB.clone(this.contextFilter);
		},

		getDashboard: function(){
			return this.getWrapper().getDashboard();
		},

		getEntry: function(){
		    return this.widgetEntry;
		},

		getFilterManager: function(){
			return this.filterManager;
		},

		getFilters: function(){
			var fm = this.getFilterManager();
			if(fm){
				return fm.getFilters();
			}
			return null;
		},
		
		translateContextFilter: function(sourceId){
			var postFilter = {};
			var cubeFilter = {};
			if(Object.keys($this.contextFilter).length > 0){
				var source = this.sources[sourceId];
				if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
					var q = source.getQuery();
					for(var fName in $this.contextFilter){
						if(q.$select && q.$select[fName]){
							postFilter[fName] = $this.contextFilter[fName];
						} else {
							cubeFilter[fName] = $this.contextFilter[fName];
						}
					}
					
				}
			}
			return {
				postFilter: postFilter,
				cubeFilter: cubeFilter
			}
		},

		getLayerQuery: function(layerName, sourceId){
			var query = {};
			
			if(layerName == 'back'){
				if(Object.keys($this.contextFilter).length > 0){
					var contextFilterDesc = $this.translateContextFilter(sourceId);
					if(contextFilterDesc.postFilter && Object.keys(contextFilterDesc.postFilter).length > 0){
						query.$postFilter = contextFilterDesc.postFilter;
					}
					if(contextFilterDesc.cubeFilter && Object.keys(contextFilterDesc.cubeFilter).length > 0){
						query.$cubeFilter = contextFilterDesc.cubeFilter;
					}
				}
				if($this.sort){
					query.$sort = [$this.sort];
				}
			} else if(layerName == 'main' || layerName == 'hover'){
				if($this.getWrapper()){
					var filterDesc = null;
					if($this.sourceFilterMap && $this.sourceFilterMap[sourceId]){
					    if($this.filterManager){
						    filterDesc = $this.filterManager.constructFilterByLocal($this.sourceFilterMap[sourceId], $this.sources[sourceId]);
                        }
					} else {
					    if($this.filterManager){
						    filterDesc = $this.filterManager.constructFilterBySource($this.sources[sourceId]);
                        }
					}
					
					if(filterDesc){
						if(filterDesc.filter){
							query.$cubeFilter = filterDesc.filter;
						}
						if(filterDesc.postFilter){
							query.$postFilter = filterDesc.postFilter;
						}
					}
				}
				if(Object.keys($this.contextFilter).length > 0){
					var contextFilterDesc = $this.translateContextFilter(sourceId);
					if(contextFilterDesc.postFilter && Object.keys(contextFilterDesc.postFilter).length > 0){
						if(query.$postFilter){
							query.$postFilter = {'$and':[query.$postFilter, contextFilterDesc.postFilter]};
						} else {
							query.$postFilter = contextFilterDesc.postFilter;
						}
					}
					if(contextFilterDesc.cubeFilter && Object.keys(contextFilterDesc.cubeFilter).length > 0){
						if(query.$cubeFilter){
							query.$cubeFilter = {'$and':[query.$cubeFilter, contextFilterDesc.cubeFilter]};
						} else {
							query.$cubeFilter = contextFilterDesc.cubeFilter;
						}
					}
				}
				if($this.sort){
					query.$sort = [$this.sort];
				}
			} else {
				throw new Error('Layer ' + layerName + ' is not supported');
			}

			return query;
		},

		getLocalFilters: function(){
			if(!this.filterManager){ return; }
			return this.sourceFilterMap;
		},

		getSourceIds: function(){
			return Object.keys(this.sources);
		},

		getSourceFilters: function(selector){
		    if(selector.getRenderName() !== 'sourceBinding'){
		        return;
		    }

		    var source = selector.binding().source;
		    
            if(this.sourceFilterMap && this.sourceFilterMap[source]){
                return JSB().clone($this.sourceFilterMap[source]);
            }
            
		},

		getValues: function(){
            return this.values;
		},

		getWrapper: function(){
			return this.wrapper;
		},
		
		translateFilter: function(fDesc){
			if(!this.filterManager){ return; }
			var source = null;
		    var sourceArr = this.getSourceIds();
			if(sourceArr && sourceArr.length > 0){
				source = this.sources[sourceArr[0]];
			}
		    
			if(source){
				fDesc = this.filterManager.translateFilter(fDesc, source);
			}
			return fDesc;
		},

		parseFormatterData: function(bindings, dataArr, res){
            if(bindings.length > 0){
                for(var j = 0; j < res.length; j++){
                    var item = {};

                    for(var i = 0; i < bindings.length; i++){
                        item[bindings[i]] = res[j][bindings[i]].main;
                    }

                    dataArr.push(item);
                }
            }
		},

		ready: function(){
		    this.updateDispatcher.ready();
		},

		refresh: function(opts){
		    this.updateDispatcher.addTask(opts);
		},

		onRefresh: function(opts){
			this.localizeFilters();
		},

		refreshAll: function(opts){
			$this.publish('DataCube.filterChanged', JSB.merge({initiator: this, manager: $this.filterManager}, opts || {}));
		},

		setContextFilter: function(q){
			this.contextFilter = q;
		},

		setInitialized: function(){
            this.setTrigger('_widgetInitialized');
		},

		setFilterLayer: function(layerOpts){
			if(JSB.isDefined(layerOpts.main) && !layerOpts.main){
				throw new Error('Main filter layer cannot be disabled');
			}
			JSB.merge(this.filterLayers, layerOpts);
		},
		
		hasFilterLayer: function(lName){
			return this.filterLayers[lName];
		},

		setFilterManager: function(filterManager){
		    this.filterManager = filterManager;
		},

		setKeyColumns: function(rowKeyCols){
			if(JSB.isArray(rowKeyCols)){
				this.rowKeyColumns = JSB.clone(rowKeyCols);
			} else {
				this.rowKeyColumns = [JSB.clone(rowKeyCols)];
			}
		},

		setSort: function(q){
			this.sort = q;
		},

		setSourceFilters: function(selector, filters){
		    if(selector.getRenderName() !== 'sourceBinding'){
		        return;
		    }

		    var source = selector.binding().source;

            if(!this.sourceFilterMap){
                this.sourceFilterMap = {};
            }

            this.sourceFilterMap[source] = filters;
		},

		setStyles: function(styles){
		    return new ValueSelector({
                values: { values: styles },
                bootstrap: 'Datacube.Unimap.Bootstrap'
            });
		},

		setWrapper: function(w, valuesOpts, sourceDesc){
			this.wrapper = w;
			this.widgetEntry = w.getWidgetEntry();
			this.updateValues(valuesOpts, sourceDesc);
		},

		updateValues: function(opts, readyCallback){
			this.values = opts.values;

			this.context = {};

			// todo
			this.sources = opts.sources;

            if(readyCallback){
                readyCallback.call($this);
            }
			/*
			if(opts.sources){
				this.sources = opts.sources;
				
				if($this.sources && Object.keys($this.sources).length > 0 && $this.filterManager){
                	JSB.chain(Object.keys($this.sources), function(srcId, callback){
                		$this.filterManager.registerSource($this, $this.sources[srcId], function(){
                			callback();
                		})
                	}, function(){
                		if(readyCallback){
                			readyCallback.call($this);
                		}
                	});
                } else {
                	if(readyCallback){
            			readyCallback.call($this);
            		}
                }
			} else {
				if(readyCallback){
        			readyCallback.call($this);
        		}
			}
			*/
		}
	},

	$server: {
		$require: ['DataCube.Widgets.WidgetRegistry', 
		           'JSB.Crypt.MD5', 
		           'JSB.Workspace.WorkspaceController', 
		           'Unimap.ValueSelector',
		           'JSB.Web.Download',
		           'DataCube.Export.ExportManager'],

		iterators: {},
		needBreak: false,
		completed: {},
		buffers: {},
		layerDataMap: {},
		dataMap: {},
		cursor: {},
		sourceIds: {},
		
		$constructor: function(){
			$base();
			this.subscribe('DataCube.Model.Slice.updated', function(sender){
				if($this.sourceIds[sender.getId()]){
					$this.client().refresh();
				}
			});
		},

		destroy: function(){
			if(!this.isDestroyed()){
				for(var it in this.iterators){
					try {
						if(this.iterators[it]){
							this.iterators[it].close();
						}
					}catch(e){
						JSB.getLogger().error(e);
					}
				}
				this.iterators = {};
				this.completed = {};
				this.buffers = {};
				this.layerDataMap = {};
				this.dataMap = {};
				this.cursor = {};
				this.sourceIds = {};
				$base();
			}
		},

		fetch: function(sourceId, widgetEntry, opts){
			var mtx = 'fetch_' + $this.getId();
			JSB.getLocker().lock(mtx);
			try {
				var batchSize = opts.batchSize || 50;
				var source = widgetEntry.getWorkspace().entry(sourceId);
				$this.sourceIds[sourceId] = true;
				var data = [];
				if(opts.reset){
					this.needBreak = true;
				}
	
				var context = 'main';
				if(opts.context){
					context = opts.context;
				}
				var useCache = true;
				if(JSB.isDefined(opts.useCache)){
					useCache = opts.useCache;
				}
	
				this.needBreak = false;
	
				function clearLayerIterators(layerName){
					var iteratorId = 'it_' + context + '_' + layerName + '_' + sourceId;
					if($this.iterators[iteratorId]){
						try {
							$this.iterators[iteratorId].close();
						}catch(e){}
						delete $this.iterators[iteratorId];
					}
					if($this.completed[iteratorId]){
						delete $this.completed[iteratorId];
					}
				}
	
				// generate cursor
				if(opts.reset || !this.cursor[context]){
					this.cursor[context] = {
						position: 0,
						layer: 0,
						layers: ['main']
					};
	
					if(opts.rowKeyColumns && opts.rowKeyColumns.length > 0){
						if(opts.layers.back){
							this.cursor[context].layers.push('back');
						}
						if(opts.layers.hover){
							this.cursor[context].layers.push('hover');
						}
					}
					$this.dataMap[context] = {}
					clearLayerIterators('main');
					clearLayerIterators('back');
					clearLayerIterators('hover');
				}
	
				var contextBuffers = $this.buffers[context];
				if(!contextBuffers || opts.reset){
					contextBuffers = $this.buffers[context] = {};
				}
				var contextLayerDataMap = $this.layerDataMap[context];
				if(!contextLayerDataMap || opts.reset){
					contextLayerDataMap = $this.layerDataMap[context] = {};
				}
	
				function buildId(el){
					var id = '';
					if(!opts.rowKeyColumns || opts.rowKeyColumns.length == 0){
						return JSB.generateUid();
					}
					for(var i = 0; i < opts.rowKeyColumns.length; i++){
						var qColName = opts.rowKeyColumns[i];
						var curScope = el;
						if(qColName.indexOf('.') >= 0 || qColName.indexOf('/') >= 0){
							var colParts = qColName.split(/[\.\/]/);
							for(var j = 0; j < colParts.length; j++){
								curScope = curScope[colParts[j]];
							}
							if(JSB.isObject(curScope) || JSB.isArray(curScope) || JSB.isNull(curScope)){
								curScope = JSON.stringify(curScope);
							}
						} else {
							curScope = el[qColName];
						}
						id += MD5.md5('' + curScope);
					}
					return id;
				}
	
				function fillLayerBuffer(layerName){
					if(!contextBuffers[layerName]){
						contextBuffers[layerName] = [];
					}
					if(!contextLayerDataMap[layerName]){
						contextLayerDataMap[layerName] = {};
					}
					var iteratorId = 'it_' + context + '_' + layerName + '_' + sourceId;
	
					if(!$this.iterators[iteratorId] && !$this.completed[iteratorId]){
						// figure out data provider
						if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
							var extQuery = opts.layers[layerName],
							    wrapQuery = opts.wrapQuery;

	                    	$this.iterators[iteratorId] = source.executeQuery({extQuery: extQuery, wrapQuery: wrapQuery, useCache: useCache});
							$this.completed[iteratorId] = false;
						} else {
							// TODO
						}
					}
					var i = 0;
					for(; i < batchSize /*|| opts.readAll*/; i++){
						if($this.needBreak){
							throw new Error('Fetch broke');
						}
						if($this.completed[iteratorId]){
							break;
						}
						var el = null;
						try {
							el = $this.iterators[iteratorId].next();
						}catch(e){
							el = null;
						}
						if(!el){
							if($this.iterators[iteratorId]){
								try {
									$this.iterators[iteratorId].close();
								}catch(e){}
								delete $this.iterators[iteratorId];
							}
							$this.completed[iteratorId] = true;
							break;
						}
						var item = {id: buildId(el), data:el};
						contextBuffers[layerName].push(item);
						contextLayerDataMap[layerName][item.id] = el;
					}
	
					return i;
				}
	
				function findLayerRecord(layerName, rId){
					while(true){
						if(contextLayerDataMap[layerName] && contextLayerDataMap[layerName][rId]){
							return contextLayerDataMap[layerName][rId];
						}
						if(!fillLayerBuffer(layerName)){
							return null;
						}
					}
				}
	
				function nextData(){
					var cursor = $this.cursor[context];
					if(cursor.layer >= cursor.layers.length){
						return null;
					}
					var layerName = cursor.layers[cursor.layer];
					var item = null;
	
					while(true){
						while(!contextBuffers[layerName] || contextBuffers[layerName].length <= cursor.position){
							fillLayerBuffer(layerName);
							if(contextBuffers[layerName].length <= cursor.position){
								// reaches end of buffer
								cursor.position = 0;
								cursor.layer++;
								if(cursor.layer >= cursor.layers.length){
									return null;
								}
								layerName = cursor.layers[cursor.layer]
								continue;
							}
							break;
						}
	
						item = contextBuffers[layerName][cursor.position++];
						if(!$this.dataMap[context][item.id]){
							break;
						}
					}
	
					$this.dataMap[context][item.id] = true;
					// prepare element
					var el = {};
					el[layerName] = {};
					for(var f in item.data){
						el[layerName][f] = item.data[f];
					}
	
					// append right layers
					for(var i = cursor.layer + 1; i < cursor.layers.length; i++){
						var rightLayer = cursor.layers[i];
						var rVal = findLayerRecord(rightLayer, item.id);
						if(!rVal){
							continue;
						}
						// write values
						el[rightLayer] = {};
						for(var f in rVal){
							el[rightLayer][f] = rVal[f];
						}
					}
	
					return el;
				}

				for(var i = 0; i < batchSize /*|| opts.readAll*/; i++){
					if($this.needBreak){
						throw new Error('Fetch broke');
					}
					var el = nextData();
					if(!el){
						break;
					}
					data.push(el);
				}

				if(opts.compress){
					// compress data
					var encoded = $this.compressData(data);
					encoded.widgetOpts = this.extendWidgetOpts(opts.widgetOpts);
	
					if($this.needBreak){
						throw new Error('Fetch broke');
					}
					
					return encoded;
				} else {
					return data;
				}
			} finally {
				JSB.getLocker().unlock(mtx);
			}
		},
		
		compressData: function(data){
			// compress data
			var encoded = {
				layers: [],
				data: [],
				dict: []
			};

			var encMap = {};
			var lMap = {};
			var cIdx = 0;
			for(var i = 0; i < data.length; i++){
				var item = data[i];
				var cItem = {};
				for(var l in item){
					var lItem = item[l];
					if(!lMap[l]){
						var lIdx = encoded.layers.length;
						encoded.layers.push(l);
						lMap[l] = '' + lIdx;
					}
					var pItem = cItem[lMap[l]] = {};
					for(var fName in lItem){
						if(!encMap[fName]){
							// generate encoded field name
							var cIdx = encoded.dict.length;
							encoded.dict.push(fName);
							encMap[fName] = '' + cIdx;
						}
						pItem[encMap[fName]] = lItem[fName];
					}
				}
				encoded.data.push(cItem);
			}
			
			return encoded;
		},

		extendWidgetOpts: function(opts){
		    var widgetOpts = {};

		    if(!opts){
		        return;
		    }

		    if(opts.styleScheme){
                var valueSelector = new ValueSelector({
                    values: { values: WorkspaceController.getWorkspace(opts.styleScheme.workspaceId).entry(opts.styleScheme.entryId).getStyles() }
                });

                widgetOpts.styleScheme = valueSelector.find('widgetSettings colorScheme').values();
		    }

		    return widgetOpts;
		},
		
		executeQuery: function(sourceId, widgetEntry, opts){
			var it = null;
			var data = [];
			var mtx = 'executeQuery_' + $this.getId();
			JSB.getLocker().lock(mtx);
			try {
				var extQuery = (opts && opts.extQuery) || {};
				var wrapQuery = (opts && opts.wrapQuery) || {};
				var batchSize = opts.batchSize || 50;
				var source = widgetEntry.getWorkspace().entry(sourceId);
				if(opts.reset){
					this.needBreak = true;
				}
				var useCache = true;
				if(JSB.isDefined(opts.useCache)){
					useCache = opts.useCache;
				}
				
				this.needBreak = false;
				if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
	            	it = source.executeQuery({extQuery: extQuery, wrapQuery: wrapQuery, useCache: useCache});
				} else {
					// TODO
				}
				while(it){
					var el = null;
					try {
						el = it.next();
					}catch(e){
						el = null;
					}
					if(!el){
						break;
					}
					if(opts.rowCallback){
						opts.rowCallback.call(this, el);
					} else {
						data.push(el);
					}
				}
			} finally {
				if(it){
					try { it.close(); } catch(e){}
				}
				JSB.getLocker().unlock(mtx);
			}
			
			return data;
		},
		
		doExport: function(format, name, entry, sourceId, query){
			var fileName = ExportManager.getExportFileName(format, name);
			var ct = ExportManager.getContentType(format);
			var mode = ExportManager.getContentMode(format);
			var encoding = ExportManager.getEncoding(format);
			var dh = new Download(fileName, {mode: mode, contentType: ct, encoding: encoding}, function(stream){
				var exporter = ExportManager.createExporter(format, stream, {name: name, file: fileName});
				// write into download stream
				try {
					exporter.begin();
					$this.executeQuery(sourceId, entry, {
						extQuery: query || {},
						useCache: false,
						rowCallback: function(item){
							exporter.write(item);
						}
					});
					exporter.end();
				} finally {
					exporter.destroy();
				}
			});
			
			return dh;
		}
	}
}