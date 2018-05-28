{
	$name: 'DataCube.Widgets.Widget',
	$parent: 'JSB.Widgets.Widget',

	$client: {
		wrapper: null,
		widgetEntry: null,
		context: {},
		values: null,
		sort: null,
		sourceMap: null,
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

		$require: ['JSB.Crypt.MD5', 'DataCube.Export.Export', 'JQuery.UI.Loader', 'Unimap.ValueSelector', 'Datacube.Unimap.Bootstrap'],

		$constructor: function(opts){
		    $base();

		    this.addClass('datacubeWidget');

		    if(opts){   // not embedded widget
                this.widgetEntry = opts.widgetEntry;
                this.wrapper = opts.widgetWrapper;
                this.filterManager = opts.filterManager;

                this.widgetEntry.getData(function(res){
                    if(!res) { return ;}

                    $this.updateValues(res);

                    $this.setTrigger('_dataLoaded');
                });
		    }
		},

		addDrilldownElement: function(opts){
		    this.wrapper.addDrilldownElement(opts);
		},

		addFilter: function(fDesc){
		    if(!this.filterManager){ return; }

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

				return this.filterManager.addFilter(fDesc, this.sourceMap[fDesc.sourceId], this);
			}

			throw new Error('Missing sourceId');
		},
		
		getCubeField: function(field){
			function extractCubeField(rValue){
				if(JSB.isString(rValue)){
					return rValue;
				} else if(JSB.isObject(rValue)){
					if(JSB.isDefined(rValue.$field) && JSB.isString(rValue.$field)){
						return rValue.$field;
					}
					return null;
				} else {
					return null;
				}
			}
			var sourceArr = this.getSourceIds();
			if(!sourceArr || sourceArr.length == 0){
				return;
			}
			var sourceId = sourceArr[0];
			var source = this.sources[sourceId];
			
			if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
				var q = source.getQuery();
				if(q.$select && q.$select[field]){
					var cubeField = extractCubeField(q.$select[field]);
					if(cubeField){
						return cubeField;
					}
				}
			}
			
		},

		clearFilters: function(){
		    if(!this.filterManager){ return; }

			this.filterManager.clearFilters(this);
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
			this.ensureTrigger(['_widgetInitialized', '_dataLoaded'], callback);
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

		// old selector.fetch
        fetchBinding: function(selector, opts, callback){
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
            this.server().fetch(item.source, $this.getWrapper().getDashboard(), item.fetchOpts, function(serverData, fail){
                if(fail){
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
                    data = $this.decompressData(serverData);
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
                    callback.call($this, data, fail, serverData.widgetOpts);
                }
            });
            return true;
        },

		getBindingsData: function(callback){
            var sourceBindings = this.getContext('export').findRendersByName('sourceBinding');

            this.fetchBinding(sourceBindings[0], {readAll: true, reset: true}, function(data){
                var result = [],
                    res;

                result.push(Object.keys(data[0]));

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

                callback.call(this, result);
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
				this.context[ctxName] = new ValueSelector({
				    context: ctxName,
				    values: JSB.clone(this.values),
				    bootstrap: 'Datacube.Unimap.Bootstrap',
				    //scheme: this.widgetEntry.extractWidgetScheme()
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
			return this.sourceFilterMap;
		},

		getSourceIds: function(){
			return Object.keys(this.sourceMap);
		},

		// old selector.getFilters
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

		hasFilter: function(fDesc){
		    if(!this.filterManager){ return; }
			return this.filterManager.hasFilter(fDesc);
		},

		localizeFilters: function(){
		    if(!this.filterManager){ return; }
			this.sourceFilterMap = {};
			for(var srcId in this.sources){
				var src = this.sources[srcId];
				this.sourceFilterMap[srcId] = this.filterManager.localizeFilter(src);
			}
		},

		refresh: function(opts){
			this.localizeFilters();
		},

		refreshAll: function(opts){
			$this.publish('DataCube.filterChanged', JSB.merge({initiator: this, dashboard: $this.getWrapper().getDashboard()}, opts || {}));
		},

		removeFilter: function(fItemId, dontPublish){
		    if(!this.filterManager){ return; }
			return this.filterManager.removeFilter(fItemId, dontPublish);
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

		setFilterLayer: function(layerOpts){
			if(JSB.isDefined(layerOpts.main) && !layerOpts.main){
				throw new Error('Main filter layer cannot be disabled');
			}
			JSB.merge(this.filterLayers, layerOpts);
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

		storeCache: function(data){
		    this._cache = data;
		},

		updateValues: function(opts){
			this.values = opts.values;

			this.context = {};
			if(opts.sourceMap && opts.sources){
				this.sourceMap = opts.sourceMap;
				this.sources = opts.sources;
			}
		}
	},

	$server: {
		$require: ['DataCube.Widgets.WidgetRegistry', 'JSB.Crypt.MD5', 'JSB.Workspace.WorkspaceController', 'Unimap.ValueSelector'],

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

		fetch: function(sourceId, dashboard, opts){
			var mtx = 'fetch_' + $this.getId();
			JSB.getLocker().lock(mtx);
			try {
				var batchSize = opts.batchSize || 50;
				var source = dashboard.getWorkspace().entry(sourceId);
				$this.sourceIds[sourceId] = true;
				var data = [];
				if(opts.reset){
					this.needBreak = true;
				}
	
				var context = 'main';
				if(opts.context){
					context = opts.context;
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
							var extQuery = opts.layers[layerName];
	                    	$this.iterators[iteratorId] = source.executeQuery({extQuery: extQuery, useCache: true});
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

				// compress data
				var encoded = {
					layers: [],
					data: [],
					dict: [],
					widgetOpts: this.extendWidgetOpts(opts.widgetOpts)
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
				
				return encoded;
			} finally {
				JSB.getLocker().unlock(mtx);
			}
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
		
		executeQuery: function(sourceId, dashboard, opts){
			var it = null;
			var data = [];
			var mtx = 'executeQuery_' + $this.getId();
			JSB.getLocker().lock(mtx);
			try {
				var extQuery = (opts && opts.extQuery) || {};
				var wrapQuery = (opts && opts.wrapQuery) || {};
				var batchSize = opts.batchSize || 50;
				var source = dashboard.getWorkspace().entry(sourceId);
				if(opts.reset){
					this.needBreak = true;
				}
				
				this.needBreak = false;
				if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
	            	it = source.executeQuery({extQuery: extQuery, wrapQuery: wrapQuery, useCache: true});
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
					data.push(el);
				}
			} finally {
				if(it){
					try { it.close(); } catch(e){}
				}
				JSB.getLocker().unlock(mtx);
			}
			
			return data;
		}
	}
}