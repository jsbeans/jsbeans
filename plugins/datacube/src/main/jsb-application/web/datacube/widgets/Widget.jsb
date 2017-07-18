{
	$name: 'JSB.DataCube.Widgets.Widget',
	$parent: 'JSB.Widgets.Widget',
	$require: 'JSB.DataCube.Widgets.WidgetExplorer',
	
	$client: {
		wrapper: null,
		context: null,
		values: null,
		
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
								return;
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
					if(!item.used || !item.binding){
						return false;
					}
					return true;
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
					if(!item.binding || !item.binding.source){
						return false;
					}
					if(!item.fetchOpts){
						item.fetchOpts = {
							reset: true
						};
					}
					JSB.merge(item.fetchOpts, opts);
					$this.server().fetch(item.binding.source, $this.getWrapper().getDashboard(), item.fetchOpts, function(data){
						if(opts.reset){
							item.cursor = 0;
							if(item.data){
								delete item.data;
							}
						}
						if(!item.data){
							item.data = data;
						} else {
							item.data = item.data.concat(data);
						}
						if(callback){
							callback.call($this, data);
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
								curVal = curVal[parts[i]];
								if(!JSB.isDefined(curVal)){
									break;
								}
							}
							return curVal;
						}
						if(curItem.binding && JSB.isString(curItem.binding)){
							curItem.data = drillDownValue(val, curItem.binding);
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
					// returns current cursor position
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
						// TODO: construct embedded widget
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
						// TODO: construct embedded widget
						return null;
					}
				}
			};
		},
		
		setWrapper: function(w){
			this.wrapper = w;
			this.updateSelectors();
		},
		
		getWrapper: function(){
			return this.wrapper;
		},
		
		updateSelectors: function(){
			this.values = JSB.clone(this.wrapper.values);
			this.context = new this.Selector(this.values);
			this.refresh();
		},
		
		getContext: function(){
			return this.context;
		},
		
		refresh: function(){
//			throw new Error('This method should be overriden');
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
				if(JSB.isInstanceOf(source, 'JSB.DataCube.Model.Slice')){
					this.iterators[sourceId] = source.executeQuery();
				} else {
					// TODO
				}
			}
			
			var data = [];
			for(var i = 0; i < batchSize || opts.readAll; i++){
				var el = this.iterators[sourceId].next();
				if(!el){
					break;
				}
				data.push(el);
			}
			
			return data;
		}
	}
}