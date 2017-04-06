{
	$name:'JSB.TypeInfoRegistry',
	
	register: function(typeId, desc){
		if(JSB().isNull(this.types)){
			this.types = {};
		}
		this.types[typeId] = desc;
	},
	
	get: function(typeId){
		if(JSB().isNull(this.types)){
			return null;
		}
		var res = this.types[typeId];
		if(JSB().isNull(res)){
			return null;
		}
		return res;
	},

	$client: {
		$singleton: true,
		lookup: function(typeId, callback){
			var self = this;
			var desc = this.get(typeId);
			if(!JSB().isNull(desc)){
				callback.call(this, desc);
				return;
			}
			this.rpc('getInfo', [typeId], function(desc){
				self.register(typeId, desc);
				if(!JSB().isNull(callback)){
					callback.call(self, desc);
				}
			});
		}
	},
	
	$server: {
		$singleton: true,
		$constructor: function(){
		},
		
		setProvider: function(p){
			this.provider = p;
		},
		
		lookup: function(typeId, callback){
			var self = this;
			var desc = this.get(typeId);
			if(!JSB().isNull(desc)){
				callback.call(this, desc);
				return;
			}
			desc = this.getInfo(typeId);
			callback.call(this, desc);
		},
		
		getInfo: function(typeId){
			var desc = this.get(typeId);
			if(!JSB().isNull(desc)){
				return desc; 
			}
			
			if(JSB().isNull(this.provider)){
				return null;
			}
			desc = this.provider.getDescriptorFor(typeId);
			this.register(typeId, desc);
			return desc; 
		}
	}
}