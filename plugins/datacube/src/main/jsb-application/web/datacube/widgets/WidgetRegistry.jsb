{
	$name: 'DataCube.Widgets.WidgetRegistry',
	$singleton: true,
	
	$client: {
		registry: {},
		registryByType: {},
		
		$constructor: function(opts){
			$base(opts);
		},
		
		lookupWidgets: function(callback){
			if(Object.keys(this.registry).length > 0){
				callback.call(this, this.registry);
				return;
			}
			this.server().getWidgets(function(r){
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
		
		lookupWidgetAttr: function(jsb, attr, callback){
			if(this.registryByType[jsb] && JSB.isDefined(this.registryByType[jsb][attr])){
				callback.call(this, this.registryByType[jsb][attr]);
				return;
			}
			this.server().getWidgetAttr(jsb, attr, function(val){
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
			JSB.onLoad(function(){
				if(this.isSubclassOf('DataCube.Widgets.Widget') && JSB.isDefined(this.$expose)){
					$this.register(this);
				}
			});
		},
		
		register: function(jsb){
			JSB.getLogger().info(jsb.$name);
			var expose = jsb.getDescriptor().$expose;
			if(!this.registry[expose.category]){
				this.registry[expose.category] = [];
			}
			var desc = {
				name: expose.name,
				description: expose.description,
				thumb: expose.thumb,
				icon: expose.icon,
				jsb: jsb.$name,
			};
			this.registry[expose.category].push(desc);
			this.registryByType[desc.jsb] = desc;
		},
		
		getWidgets: function(){
			return this.registry;
		},
		
		getWidgetAttr: function(jsb, attr){
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