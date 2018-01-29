{
	$name: 'DataCube.Widgets2.Widget',
	$parent: 'JSB.Widgets.Widget',
	
	$client: {
		wrapper: null,
		context: {},
		values: null,
		sort: null,
		sourceMap: null,
		sources: null,
		sourceFilterMap: null,
		ready: false,
		initCallbacks: [],
		contextFilter: {},
		filterLayers: {
			main: true,
			back: false,
			hover: false
		},
		rowKeyColumns: [],

		$require: ['JSB.Crypt.MD5', 'DataCube.Export.Export', 'Unimap.ValueSelector'],
		
		$constructor: function(opts){
			$base(opts);

			function traverse(src, val, callback){
				if(!src.used){
					return;
				}
				var sCont = {bStop : false};
				var nVal = callback.call($this, src, val, function(){
					sCont.bStop = true;
				});

				if(sCont.bStop){
					return;
				}
				if(src.type == 'group'){
					for(var i = 0; i < src.groups.length; i++){
						var gDesc = src.groups[i];
						for(var j = 0; j < gDesc.items.length; j++){
							traverse(gDesc.items[j], nVal, callback);
						}
					}
				} else if(src.type == 'select'){
					var iDesc = src.items[src.chosenIdx];
					traverse(iDesc, nVal, callback);
				} else if(src.type == 'widget'){
					var wDesc = src.values;
					traverse(wDesc, nVal, callback);
				}
			}

			this.Selector = function(ref, ctxName){
				if(!ctxName){
					throw new Error('No selector context specified');
				}
				this.ctxName = ctxName;
				if(ref instanceof $this.Selector){
					this.selector = JSB.clone(ref.selector);
				} else {
					this.selector = ref;
					if(!JSB.isArray(this.selector)){
						this.selector = [this.selector];
					}
				}
			};

			
			this.Selector.prototype = {

				reset: function(){
					if(this.selector.length == 0){
						return;
					}
					
					var item = this.selector[0];
					if(!item.fetchOpts){
						item.fetchOpts = {};
					}
					item.fetchOpts.reset = true;
					if(item.data){
						delete item.data;
					}
				},
				
				isReset: function(){
					if(this.selector.length == 0){
						return;
					}
					
					var item = this.selector[0];
					if(item.fetchOpts && item.fetchOpts.reset){
						return true;
					}
					return false;
				},
				
				getFilters: function(){
					if(this.selector.length == 0){
						return null;
					}
					
					var item = this.selector[0];
					if(!item.binding || !item.binding.source){
						return null;
					}
					if($this.sourceFilterMap && $this.sourceFilterMap[item.binding.source]){
						return JSB().clone($this.sourceFilterMap[item.binding.source]);
					}
				},
				
				setFilters: function(filters){
					if(this.selector.length == 0){
						throw new Error('Wrong selector');
					}
					
					var item = this.selector[0];
					if(!item.binding || !item.binding.source){
						throw new Error('Missing source binding in selector');
					}
					if(!$this.sourceFilterMap){
						$this.sourceFilterMap = {};
					}
					$this.sourceFilterMap[item.binding.source] = filters;
				},
				
				fetch: function(opts, callback){
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
					// fulfills selector's buffer with server-side data
					if(this.selector.length == 0){
						return false;
					}
					
					var item = this.selector[0];
					if(!item.binding){
						return false;
					}
					
					if(!item.binding.source || item.binding.propagated){
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
						var backQuery = {};
						if(Object.keys($this.contextFilter).length > 0){
							backQuery.$postFilter = $this.contextFilter;
						}
						if(opts.select){
							backQuery.$select = opts.select;
						}
						if(opts.groupBy){
							backQuery.$groupBy = opts.groupBy;
						}
						if($this.sort){
							backQuery.$sort = [$this.sort];
						}
						item.fetchOpts.layers.back = backQuery;
					}
					
					// construct main layer
					var mainQuery = {};
					if($this.getWrapper()){
						var filterDesc = null;
						if($this.sourceFilterMap && $this.sourceFilterMap[item.binding.source]){
							filterDesc = $this.getWrapper().constructFilterByLocal($this.sourceFilterMap[item.binding.source], $this.sources[item.binding.source]);
						} else {
							filterDesc = $this.getWrapper().constructFilterBySource($this.sources[item.binding.source]);
						}
						if(filterDesc){
							if(filterDesc.filter){
								mainQuery.$cubeFilter = filterDesc.filter;
							}
							if(filterDesc.postFilter){
								mainQuery.$postFilter = filterDesc.postFilter;
							}
						}
					}
					if(Object.keys($this.contextFilter).length > 0){
						if(mainQuery.$postFilter){
							mainQuery.$postFilter = {'$and':[mainQuery.$postFilter, $this.contextFilter]};
						} else {
							mainQuery.$postFilter = $this.contextFilter;
						}
					}
					if(opts.select){
						mainQuery.$select = opts.select;
					}
					if(opts.groupBy){
						mainQuery.$groupBy = opts.groupBy;
					}
					if($this.sort){
						mainQuery.$sort = [$this.sort];
					}
					item.fetchOpts.layers.main = mainQuery;
					
					// TODO: construct hover filter

					
					item.fetchOpts.context = this.ctxName;
					item.fetchOpts.rowKeyColumns = $this.rowKeyColumns;
					$this.server().fetch(item.binding.source, $this.getWrapper().getDashboard(), item.fetchOpts, function(data, fail){
						if(fail && fail.message == 'Fetch broke'){
							return;
						}
						if(item.fetchOpts.reset){
							item.cursor = 0;
							if(item.data){
								delete item.data;
							}
						}
						item.fetchOpts.reset = false;
						if(data){
							data = $this.decompressData(data);
							if(!item.data){
								item.data = data;
							} else {
								item.data = item.data.concat(data);
							}
						}
						if(callback){
							if(fail){
								JSB.getLogger().error(fail);
							}
							callback.call($this, data, fail);
						}
					});
					return true; 
				},
				
				next: function(){
					if(this.selector.length == 0){
						return false;
					}
					var item = this.selector[0];
					if(!JSB.isDefined(item.cursor)){
						item.cursor = 0;
					}
					if(!item.data || (item.cursor > 0 && !JSB.isArray(item.data))){
						return false;
					}
					
					var dataEl = null;
					
					if(JSB.isArray(item.data)){
						if(item.cursor >= item.data.length){
							return false;
						}
						
						dataEl = item.data[item.cursor++];
					} else {
						dataEl = item.data;
						item.cursor++;
					}
					
					// fills descendant with values
					traverse(item, dataEl, function(curItem, val, stop){
						if(curItem == item){
							return val;
						}
						function drillDownValue(val, path){
							var parts = path.split(/[\.\/]/);
							var curVal = val;
							for(var i = 0; i < parts.length; i++){
							    if(JSB.isArray(curVal)){
							        var newVal = [];
							        for(var j = 0; j < curVal.length; j++){
							            if(JSB.isDefined(curVal[j][parts[i]])){
							                newVal.push(curVal[j][parts[i]]);
							            }
							        }
							        curVal = newVal;
							    } else {
								    curVal = curVal[parts[i]];
								}
								if(!JSB.isDefined(curVal)){
									break;
								}
							}
							return curVal;
						}
						if(curItem.binding){
							if(JSB.isString(curItem.binding)){
								curItem.data = drillDownValue(val, curItem.binding);
							} else {
								curItem.data = val;
							}
							return curItem.data;
						} else if(curItem.values && curItem.values.length > 0){
							for(var i = 0; i < curItem.values.length; i++){
								var valueDesc = curItem.values[i];
								if(valueDesc.binding && JSB.isString(valueDesc.binding)){
									valueDesc.value = drillDownValue(val, valueDesc.binding);
								}
							}
						}
						
						return val;
					});
					
					return true;
				},
				
				data: function(){
					if(this.selector.length == 0){
						return;
					}
					var item = this.selector[0];
					if(item.values){
						if(item.values.length > 0){
							return item.values[0].value;
						}
					} else if(item.data){
						return item.data;
					}
				},
				
				unwrap: function(){
					if(this.selector.length == 0){
						return;
					}
					return this.selector[0];
				},
				
				position: function(){
					if(this.selector.length == 0){
						return;
					}
					var item = this.selector[0];
					return item.cursor;
				},
				
				values: function(layer){
					layer = layer || 'main';
					function resolveValue(itemType, valueDesc){
						if(valueDesc.binding){
							if(JSB.isObject(valueDesc.value)){
								return valueDesc.value[layer];
							}
						}
					    return valueDesc.value;
					    /*
                        switch(itemType){
                            case 'number':
                                return Number(valueDesc.value);
                            case 'string':
                                if(valueDesc.value){
                                    return valueDesc.value;
                                } else {
                                    return;
                                }
                            default:
                                return valueDesc.value;
                        }
                        */
					}
					if(this.selector.length == 0){
						return null;
					}
					var item = this.selector[0];
					var vals = [];
					if(item.type == 'item'){
						if(item.values && item.values.length > 0){
							for(var i = 0; i < item.values.length; i++){
								vals.push(resolveValue(item.itemType, item.values[i]));
							}
						}
					} else if(item.type == 'group'){
						for(var i = 0; i < item.groups.length; i++){
							var gDesc = item.groups[i];
							var items = [];
							for(var j = 0; j < gDesc.items.length; j++){
								items.push(gDesc.items[j]);
							}
							vals.push(new $this.Selector(items, this.ctxName));
						}
					} else if(item.type == 'select'){
						vals.push(new $this.Selector(item.items[item.chosenIdx], this.ctxName));
					} else if(item.type == 'widget'){
						vals.push(new $this.Selector(item.values, this.ctxName));
					}
					return vals;
				},
				
				value: function(layer){
					layer = layer || 'main';
					function resolveValue(item){
					    if(item.values[0].binding){
					    	if(JSB.isObject(item.values[0].value)){
								return item.values[0].value[layer];
							}
					        return item.values[0].value;
					    }

                        switch(item.itemType){
                            case 'number':
                                if(item.values[0].value !== null){
                                    return Number(item.values[0].value);
                                } else {
                                    return item.defaultValue !== undefined ? item.defaultValue : undefined;
                                }
                            case 'string':
                                if(item.values[0].value){
                                    return item.values[0].value;
                                } else {
                                    return item.defaultValue !== undefined ? item.defaultValue : undefined;
                                }
                            case 'color':
                                if(item.values[0].value !== null){
                                    return item.values[0].value;
                                } else {
                                    return item.defaultValue !== undefined ? item.defaultValue : undefined;
                                }
                            default:
                                return item.values[0].value;
                        }
					}
					if(this.selector.length == 0){
						return null;
					}
					var item = this.selector[0];
					if(!item.used){
						return null;
					}
					if(item.type == 'item'){
						if(item.values && item.values.length > 0){
							return resolveValue(item);
						}
						return null;
					} else if(item.type == 'select'){
					    // return resolveValue(item.items[item.chosenIdx].values[0]);
						return new $this.Selector(item.items[item.chosenIdx], this.ctxName);
					} else if(item.type == 'group'){
						if(item.groups.length == 0){
							return null;
						}
						var gDesc = item.groups[0];
						var items = [];
						for(var j = 0; j < gDesc.items.length; j++){
							items.push(gDesc.items[j]);
						}
						return new $this.Selector(items, this.ctxName)
					} else if(item.type == 'widget'){
						return new $this.Selector(item.values, this.ctxName);
					}
				}
			};
		},

		addFilter: function(fDesc){
			if(!fDesc.sourceId){
				var sourceArr = this.getSourceIds();
				if(sourceArr && sourceArr.length > 0){
					fDesc.sourceId = sourceArr[0];
				}
			}
			if(fDesc.sourceId){
				if(!this.sourceMap[fDesc.sourceId] || !this.sources[fDesc.sourceId]){
					throw new Error('Invalid sourceId');
				}
				fDesc.source = this.sources[fDesc.sourceId];
				return this.getWrapper().addFilter(fDesc, this.sourceMap[fDesc.sourceId], this);
			}
			throw new Error('Missing sourceId');
		},

		clearFilters: function(){
			this.getWrapper().clearFilters(this);
		},

		createFilterHash: function(filter){
            var str = '';
		    for(var i in filter){
		        str += '' + i;
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
			this.ensureTrigger('_widgetInitialized', callback);
		},

		exportData: function(format){
            switch(format){
                case 'xls':
                case 'csv':
                    this.getBindingsData(function(data){
                        Export.exportData(format, data, $this.wrapper.title);
                    });
                    break;
                case 'png':
                    Export.exportData(format, this.getElement().get(0), this.wrapper.title);
            }
		},

		getBindingsData: function(callback){
		    var bindings = this.getContext('export').findBindings(),
		        bindingArray, bindingFields = {};

            for(var i = 0; i < bindings.selector.length; i++){
                if(bindings.selector[i].binding){
                    bindingArray = bindings.get(i);
                } else {
                    bindingFields[bindings.get(i).binding()] = bindings.get(i);
                }
            }

            bindingArray.fetch({readAll: true, reset: true}, function(){
                var results = [],
                    res = [];

                for(var i in bindingFields){
                    res.push(i);
                }
                results.push(res);

                while(bindingArray.next()){
                    res = [];

                    for(var i in bindingFields){
                        res.push(bindingFields[i].value());
                    }
                    results.push(res);
                }

                callback.call(this, results);
            });
		},

		getCache: function(){
		    return this._cache;
		},

		getContext: function(ctxName){
			if(!ctxName){
				ctxName = 'main';
			}
			if(!this.context[ctxName]){
				var ctxValues = JSB.clone(this.values);
				this.context[ctxName] = new this.Selector(ctxValues, ctxName);
			}

			return this.context[ctxName];
		},

		getContextFilter: function(){
			return JSB.clone(this.contextFilter);
		},

		getDashboard: function(){
			return $this.getWrapper().getDashboard();
		},

		getFilterManager: function(){
			if(this.getWrapper() && this.getWrapper().getFilterManager){
				return this.getWrapper().getFilterManager();
			}
			return null;
		},

		getFilters: function(){
			var fm = this.getFilterManager();
			if(fm){
				return fm.getFilters();
			}
			return null;
		},

		getLocalFilters: function(){
			return this.sourceFilterMap;
		},

		getSourceIds: function(){
			return Object.keys(this.sourceMap);
		},

		getWrapper: function(){
			return this.wrapper;
		},

		hasFilter: function(fDesc){
			return this.getWrapper().hasFilter(fDesc);
		},

		localizeFilters: function(){
			this.sourceFilterMap = {};
			for(var srcId in this.sources){
				var src = this.sources[srcId];
				this.sourceFilterMap[srcId] = $this.getWrapper().localizeFilter(src);
			}
		},

		refresh: function(opts){
			this.localizeFilters();
		},

		refreshAll: function(opts){
			$this.publish('DataCube.filterChanged', JSB.merge({initiator: this, dashboard: $this.getWrapper().getDashboard()}, opts || {}));
		},

		removeFilter: function(fItemId){
			// return this.getWrapper().removeFilter(fItemId, this);
			return this.getWrapper().removeFilter(fItemId);
		},

		removeAllFilters: function(){
            var fm = this.getFilterManager();
            if(fm){
                var filters = fm.getFilters();
                for(var i in filters){
                    this.removeFilter(i);
                }
            }
		},

		setContextFilter: function(q){
			this.contextFilter = q;
		},

		setInitialized: function(){
			this.setTrigger('_widgetInitialized');
		},

		setSort: function(q){
			this.sort = q;
		},

		setWrapper: function(w, values, sourceDesc){
			this.wrapper = w;
			this.updateValues(values, sourceDesc);
		},

		storeCache: function(data){
		    this._cache = data;
		},

		updateValues: function(values, sourceDesc){
			if(!values){
				values = JSB.clone(this.getWrapper().getValues());
			}
			this.values = values;
			if(this.values instanceof this.Selector){
				this.values = this.values.unwrap();
			}
			this.context = {};
			if(sourceDesc){
				this.sourceMap = sourceDesc.sourceMap;
				this.sources = sourceDesc.sources;
			} else {
				this.sourceMap = this.getWrapper().getWidgetEntry().getSourceMap();
				this.sources = this.getWrapper().getWidgetEntry().getSources();
			}
		},

// //
		
		setFilterLayer: function(layerOpts){
			if(JSB.isDefined(layerOpts.main) && !layerOpts.main){
				throw new Error('Main filter layer cannot be disabled');
			}
			JSB.merge(this.filterLayers, layerOpts);
		},
		
		setKeyColumns: function(rowKeyCols){
			if(JSB.isArray(rowKeyCols)){
				this.rowKeyColumns = JSB.clone(rowKeyCols);	
			} else {
				this.rowKeyColumns = [JSB.clone(rowKeyCols)];
			}
		}
	},
	
	$server: {
		$require: ['DataCube.Widgets.WidgetExplorer', 'JSB.Crypt.MD5'],

		iterators: {},
		needBreak: false,
		completed: {},
		buffers: {},
		layerDataMap: {},
		dataMap: {},
		cursor: {},
		
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
				$base();
			}
		},
		
		fetch: function(sourceId, dashboard, opts){
			var batchSize = opts.batchSize || 50;
			var source = dashboard.workspace.entry(sourceId);
			var data = [];
			if(opts.reset){
				this.needBreak = true;
			}
			
			var context = 'main';
			if(opts.context){
				context = opts.context;
			}

			JSB.getLocker().lock('fetch_' + $this.getId());
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
					var colParts = qColName.split(/[\.\/]/);
					var curScope = el;
					for(var j = 0; j < colParts.length; j++){
						curScope = curScope[colParts[j]];
					}
					if(JSB.isObject(curScope) || JSB.isArray(curScope) || JSB.isNull(curScope)){
						curScope = JSON.stringify(curScope);
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
						var extQuery = opts.layers[layerName];
                    	$this.iterators[iteratorId] = source.executeQuery(extQuery, true);
						$this.completed[iteratorId] = false;
					} else {
						// TODO
					}
				}
				var i = 0;
				for(; i < batchSize || opts.readAll; i++){
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
					if(contextLayerDataMap[layerName] && JSB.isDefined(contextLayerDataMap[layerName][rId])){
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
			
			try {
				for(var i = 0; i < batchSize || opts.readAll; i++){
					if($this.needBreak){
						throw new Error('Fetch broke');
					}
					var el = nextData();
					if(!el){
						break;
					}
					data.push(el);
				}
				
			
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
				if($this.needBreak){
					throw new Error('Fetch broke');
				}
			} finally {
				JSB.getLocker().unlock('fetch_' + $this.getId());
			}

/*			
			Log.debug(JSON.stringify(data));
			Log.debug(JSON.stringify(encoded));
*/			
			return encoded;
		}
	}
}