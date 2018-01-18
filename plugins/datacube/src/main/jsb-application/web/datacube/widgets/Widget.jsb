{
	$name: 'DataCube.Widgets.Widget',
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

		$require: ['JSB.Crypt.MD5'],
		
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
				find: function(key){
					// search for scheme selector via key anchor
					var foundArr = [];
					for(var i = 0; i < this.selector.length; i++){
						var obj = this.selector[i];
						traverse(obj, null, function(item, val, stop){
							if(item.type == 'widget'){
								stop();
							}
							if(item.key == key){
								foundArr.push(item);
							}
						});
					}
					return new $this.Selector(foundArr, this.ctxName);
				},
				
				get: function(idx){
					if(this.selector.length == 0){
						return null;
					}
					if(!JSB.isDefined(idx)){
						idx = 0;
					}
					if(idx >= this.selector.length){
						return null;
					}
					return new $this.Selector(this.selector[idx], this.ctxName);
				},
				
				length: function(){
					return this.selector.length;
				},
				
				each: function(callback){
					for(var i = 0; i < this.length(); i++){
						callback.call(this.get(i));
					}
				},
				
				used: function(){
					if(this.selector.length == 0){
						return false;
					}
					
					var item = this.selector[0];
					return item.used;
				},
				
				bound: function(){
					if(this.selector.length == 0){
						return false;
					}
					
					var item = this.selector[0];
					if(!item.used){
						return false;
					}
					if(item.type == 'group' || item.type == 'select'){
						if(!item.binding){
							return false;
						}
						return true;
					} else if(item.type == 'item'){
						var bArr = [];
						for(var i = 0; i < item.values.length; i++){
							bArr.push(item.values[i].binding ? true : false);
						}
						return bArr;
					} else if(item.type == 'widget'){
						if(item.widget && item.widget.jsb){
							return true;
						}
						return false;
					} else {
						return false;	
					}
					
				},
				
				binding: function(){
					if(this.selector.length == 0){
						return;
					}
					
					var item = this.selector[0];
					if(!item.used){
						return;
					}
					if(item.type == 'group' || item.type == 'select'){
						return item.binding;
					} else if(item.type == 'item'){
						var bArr = [];
						for(var i = 0; i < item.values.length; i++){
							bArr.push(item.values[i].binding);
						}
						return bArr;
					} else if(item.type == 'widget'){
						if(item.widget && item.widget.jsb){
							return item.widget;
						}
					}
				},

				bindingType: function(){
					if(this.selector.length == 0){
						return;
					}
					
					var item = this.selector[0];
					if(!item.used){
						return;
					}
					if(item.type == 'group' || item.type == 'select'){
						return item.bindingType;
					} else if(item.type == 'item'){
						var bArr = [];
						for(var i = 0; i < item.values.length; i++){
							bArr.push(item.values[i].bindingType);
						}
						return bArr;
					} else if(item.type == 'widget'){
						if(item.widget && item.widget.jsb){
							return item.widget;
						}
					}
				},

				name: function(){
					if(this.selector.length == 0){
						return null;
					}
					
					var item = this.selector[0];
					return item.name;
				},

				key: function(){
					if(this.selector.length == 0){
						return null;
					}
					
					var item = this.selector[0];
					return item.key;
				},

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
					if($this.getWrapper()){
						var filterDesc = null;
						if($this.sourceFilterMap && $this.sourceFilterMap[item.binding.source]){
							filterDesc = $this.getWrapper().constructFilterByLocal($this.sourceFilterMap[item.binding.source], $this.sources[item.binding.source]);
						} else {
							filterDesc = $this.getWrapper().constructFilterBySource($this.sources[item.binding.source]);
						}
						if(filterDesc){
							item.fetchOpts.filter = filterDesc.filter;
							item.fetchOpts.postFilter = filterDesc.postFilter;
						} else {
							item.fetchOpts.filter = null;
							item.fetchOpts.postFilter = null;
						}
					}
					item.fetchOpts.sort = $this.sort;
					if(Object.keys($this.contextFilter).length > 0){
						item.fetchOpts.contextFilter = $this.contextFilter;
					} else {
						item.fetchOpts.contextFilter = null;
					}
					item.fetchOpts.context = this.ctxName;

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
				
				values: function(){
					function resolveValue(itemType, valueDesc){
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
				
				value: function(){
					function resolveValue(item){
					    if(item.values[0].binding){
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
		
		ensureInitialized: function(callback){
			this.ensureTrigger('_widgetInitialized', callback);
		},
		
		setInitialized: function(){
			this.setTrigger('_widgetInitialized');
		},
		
		decompressData: function(dataObj){
			if(!dataObj){
				return null;
			}
			var data = [];
			for(var i = 0; i < dataObj.data.length; i++){
				var cItem = dataObj.data[i];
				var item = {};
				for(var fIdx in cItem){
					var fName = dataObj.dict[parseInt(fIdx)];
					item[fName] = cItem[fIdx];
				}
				data.push(item);
			}
			return data;
		},
		
		setWrapper: function(w, values, sourceDesc){
			this.wrapper = w;
			this.updateValues(values, sourceDesc);
		},
		
		getWrapper: function(){
			return this.wrapper;
		},
		
		getDashboard: function(){
			return $this.getWrapper().getDashboard();
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
		
		
		refresh: function(opts){
			// localize filters
			this.localizeFilters();
		},
		
		refreshAll: function(opts){
			$this.publish('DataCube.filterChanged', JSB.merge({initiator: this, dashboard: $this.getWrapper().getDashboard()}, opts || {}));
		},
		
		getSourceIds: function(){
			return Object.keys(this.sourceMap);
		},
		
		localizeFilters: function(){
			this.sourceFilterMap = {};
			for(var srcId in this.sources){
				var src = this.sources[srcId];
				this.sourceFilterMap[srcId] = $this.getWrapper().localizeFilter(src);
			}
		},
		
		getLocalFilters: function(){
			return this.sourceFilterMap;
		},

		
		clearFilters: function(){
			this.getWrapper().clearFilters(this);
		},
		
		hasFilter: function(fDesc){
			return this.getWrapper().hasFilter(fDesc);
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
		
		getFilters: function(){
			var fm = this.getFilterManager();
			if(fm){
				return fm.getFilters();	
			}
			return null;
		}, 
		
		getFilterManager: function(){
			if(this.getWrapper() && this.getWrapper().getFilterManager){
				return this.getWrapper().getFilterManager();	
			}
			return null;
		},
		
		setSort: function(q){
			this.sort = q;
		},
		
		setContextFilter: function(q){
			this.contextFilter = q;
		},
		
		getContextFilter: function(){
			return JSB.clone(this.contextFilter);
		},

		createFilterHash: function(filter){
            var str = '';
		    for(var i in filter){
		        str += '' + i;
		    }

		    return MD5.md5(str);
		},

		storeCache: function(data){
		    this._cache = data;
		},

		getCache: function(){
		    return this._cache;
		},

		refreshFromCache: function(){
		    // method must be overridden
		}
	},
	
	$server: {
		$require: 'DataCube.Widgets.WidgetExplorer',

		iterators: {},
		needBreak: false,
		completed: {},
		
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
				$base();
			}
		},
		
		compressData: function(data){
			var encoded = {
				data: [],
				dict: []
			};
			
			var encMap = {};
			var cIdx = 0;
			for(var i = 0; i < data.length; i++){
				var item = data[i];
				var cItem = {};
				for(var fName in item){
					if(!encMap[fName]){
						// generate encoded field name
						var cIdx = encoded.dict.length;
						encoded.dict.push(fName);
						encMap[fName] = '' + cIdx;
					}
					cItem[encMap[fName]] = item[fName];
				}
				encoded.data.push(cItem);
			}
			
			return encoded;
		},
		
		fetch: function(sourceId, dashboard, opts){
			var batchSize = opts.batchSize || 50;
			var source = dashboard.workspace.entry(sourceId);
			var data = [];
			var context = 'main';
			if(opts.reset){
				this.needBreak = true;
			}
			if(opts.context){
				context = opts.context;
			}
			var iteratorId = 'it_' + context + '_' + sourceId;
			JSB.getLocker().lock('fetch_' + $this.getId());
			this.needBreak = false;
			try {
				if(opts.reset && ($this.iterators[iteratorId] || $this.completed[iteratorId])){
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
				if(!$this.iterators[iteratorId] && !$this.completed[iteratorId]){
					// figure out data provider
					if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
						var extQuery = {};
						if(opts.filter){
							extQuery.$cubeFilter = opts.filter;
						}
						if(opts.postFilter){
							extQuery.$postFilter = opts.postFilter;
						}
						if(opts.contextFilter){
							if(extQuery.$postFilter && Object.keys(extQuery.$postFilter).length > 0){
								extQuery.$postFilter = {'$and':[extQuery.$postFilter, opts.contextFilter]};
							} else {
								extQuery.$postFilter = opts.contextFilter;
							}
						}
						if(opts.sort){
							extQuery.$sort = [opts.sort];
						}
						if(opts.select){
	                        extQuery.$select = opts.select;
	                    }
	                    if(opts.groupBy){
	                        extQuery.$groupBy = opts.groupBy;
	                    }
                    	$this.iterators[iteratorId] = source.executeQuery(extQuery, true);
						$this.completed[iteratorId] = false;
					} else {
						// TODO
					}
				}
			
				for(var i = 0; i < batchSize || opts.readAll; i++){
					if(this.needBreak){
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
					data.push(el);
				}
			} finally {
				JSB.getLocker().unlock('fetch_' + $this.getId());
			}
			
			return this.compressData(data);
		}
	}
}