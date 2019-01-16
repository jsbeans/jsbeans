{
	$name: 'JSB.Widgets.Registry',
	
	$client: {
		registry: {},
		registryByType: {},
		
		$constructor: function(opts){
			$base(opts);
		},
		
		lookupItems: function(callback){
			if(Object.keys(this.registry).length > 0){
				callback.call(this, this.registry);
				return;
			}
			this.server().getItems(function(r){
				$this.registry = r;
				// fill registryByType
				for(var cat in $this.registry){
					var arr = $this.registry[cat];
					for(var i = 0; i < arr.length; i++){
						var desc = arr[i];
						$this.registryByType[desc.jsb] = desc;
					}
				}
				
				callback.call($this, $this.registry);
			});
		},
		
		lookupItemAttr: function(jsb, attr, callback){
			if(this.registryByType[jsb] && JSB.isDefined(this.registryByType[jsb][attr])){
				callback.call(this, this.registryByType[jsb][attr]);
				return;
			}
			this.server().getItemAttr(jsb, attr, function(val){
				if(!$this.registryByType[jsb]){
					$this.registryByType[jsb] = {};
				}
				$this.registryByType[jsb][attr] = val;
				callback.call($this, $this.registryByType[jsb][attr]);
			});
		}
	},
	
	$server: {
		registry: {},
		registryByType: {},
		
		$constructor: function(){
			$base();
		},
		
		register: function(jsb){
			JSB.getLogger().debug('Registered: ' + jsb.$name);
			var expose = jsb.getDescriptor().$expose;
			if(!this.registry[expose.category]){
				this.registry[expose.category] = [];
			}
			var desc = JSB.merge({}, expose, {jsb: jsb.$name});
			this.registry[expose.category].push(desc);
			this.registryByType[desc.jsb] = desc;
		},
		
		getItems: function(){
			return this.registry;
		},
		
		getItemtAttr: function(jsb, attr){
			var desc = this.registryByType[jsb];
			if(!desc){
				return;
			}
			if(attr){
				if(JSB.isDefined(desc[attr])){
					return desc[attr];
				}
			}
			return desc;
		}
	}
}