{
	$name: 'DataCube.Widgets.Widget',
	$parent: 'JSB.Widgets.Widget',
	$require: 'DataCube.Widgets.WidgetExplorer',
	
	$client: {
		wrapper: null,
		context: null,
		values: null,
		sort: null,
		
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

			this.Selector = function(ref){
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
					return new $this.Selector(foundArr);
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
					return new $this.Selector(this.selector[idx]);
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
					
					if(!item.binding.source){
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
					if($this.getWrapper() && $this.getWrapper().getOwner()){
						item.fetchOpts.filter = $this.getWrapper().getOwner().getFilterSelector().constructFilter(item.binding.source);
					}
					item.fetchOpts.sort = $this.sort;
					$this.server().fetch(item.binding.source, $this.getWrapper().getDashboard(), item.fetchOpts, function(data, fail){
						if(item.fetchOpts.reset){
							item.cursor = 0;
							if(item.data){
								delete item.data;
							}
						}
						item.fetchOpts.reset = false;
						if(data){
							if(!item.data){
								item.data = data;
							} else {
								item.data = item.data.concat(data);
							}
						}
						if(callback){
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
					if(!item.data || !JSB.isArray(item.data)){
						return false;
					}
					if(!JSB.isDefined(item.cursor)){
						item.cursor = 0;
					}
					if(item.cursor >= item.data.length){
						return false;
					}
					
					var dataEl = item.data[item.cursor++];
					
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
					function resolveValue(valueDesc){
						return valueDesc.value;
					}
					if(this.selector.length == 0){
						return null;
					}
					var item = this.selector[0];
					var vals = [];
					if(item.type == 'item'){
						if(item.values && item.values.length > 0){
							for(var i = 0; i < item.values.length; i++){
								vals.push(resolveValue(item.values[i]));
							}
						}
					} else if(item.type == 'group'){
						for(var i = 0; i < item.groups.length; i++){
							var gDesc = item.groups[i];
							var items = [];
							for(var j = 0; j < gDesc.items.length; j++){
								items.push(gDesc.items[j]);
							}
							vals.push(new $this.Selector(items));
						}
					} else if(item.type == 'select'){
						vals.push(new $this.Selector(item.items[item.chosenIdx]));
					} else if(item.type == 'widget'){
						vals.push(new $this.Selector(item.values));
					}
					return vals;
				},
				
				value: function(){
					function resolveValue(valueDesc){
						return valueDesc.value;
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
							return resolveValue(item.values[0]);
						}
						return null;
					} else if(item.type == 'select'){
						return new $this.Selector(item.items[item.chosenIdx]);
					} else if(item.type == 'group'){
						if(item.groups.length == 0){
							return null;
						}
						var gDesc = item.groups[0];
						var items = [];
						for(var j = 0; j < gDesc.items.length; j++){
							items.push(gDesc.items[j]);
						}
						return new $this.Selector(items)
					} else if(item.type == 'widget'){
						return new $this.Selector(item.values);
					}
				}
			};
		},
		
		setWrapper: function(w, values){
			this.wrapper = w;
			if(w.getOwner()){
				this.updateSelectors(values);
			} else {
				JSB.deferUntil(function(){
					$this.updateSelectors(values);
				}, function(){
					return $this.wrapper.getOwner();
				});
			}
		},
		
		getWrapper: function(){
			return this.wrapper;
		},
		
		updateSelectors: function(values){
			if(!values){
				values = JSB.clone(this.getWrapper().getValues());
			}
			this.values = values;
			if(this.values instanceof this.Selector){
				this.values = this.values.unwrap();
			}
			this.context = new this.Selector(this.values);
			this.refresh();
		},
		
		getContext: function(){
			return this.context;
		},
		
		refresh: function(opts){
//			throw new Error('This method should be overriden');
		},
		
		addFilter: function(srcId, type, items, removeFIds){
			var filterSelector = this.getWrapper().getOwner().getFilterSelector();
			return filterSelector.addFilter(srcId, type, items, this, removeFIds);
		},
		
		removeFilter: function(fItemId){
			var filterSelector = this.getWrapper().getOwner().getFilterSelector();
			return filterSelector.removeFilter(fItemId, this);
		},
		
		setSort: function(q){
			this.sort = q;
			this.refresh();
		}
	},
	
	$server: {
		iterators: {},
		
		destroy: function(){
			for(var it in this.iterators){
				this.iterators[it].close();
			}
			this.iterators = {};
			$base();
		},
		
		fetch: function(sourceId, dashboard, opts){
			var batchSize = opts.batchSize || 50;
			var source = dashboard.workspace.entry(sourceId);
			if(opts.reset && this.iterators[sourceId]){
				this.iterators[sourceId].close();
				delete this.iterators[sourceId];
			}
			if(!this.iterators[sourceId]){
				// figure out data provider
				if(JSB.isInstanceOf(source, 'DataCube.Model.Slice')){
					var extQuery = {};
					if(opts.filter){
						extQuery.$filter = opts.filter;
					}
					if(opts.sort){
						extQuery.$sort = [opts.sort];
					}
					this.iterators[sourceId] = source.executeQuery(extQuery);
				} else {
					// TODO
				}
			}
			
			var data = [];
			for(var i = 0; i < batchSize || opts.readAll; i++){
				var el = null;
				try {
					el = this.iterators[sourceId].next();
				}catch(e){
					el = null;
				}
				if(!el){
					break;
				}
				data.push(el);
			}
			
			return data;
		}
	}
}