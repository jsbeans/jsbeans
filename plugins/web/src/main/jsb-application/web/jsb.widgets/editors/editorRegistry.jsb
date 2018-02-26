{
	$name:'JSB.Widgets.EditorRegistry',
	$singleton: true,
	
	editors: {},

	register: function(typeId, jso){
		var typeIdArr = [];
		if(JSB().isArray(typeId)){
			typeIdArr = typeId;
		} else {
			typeIdArr.push(typeId);
		}
		JSB.getLocker().lock('EditorRegistry.register');
		try {
			for(var j = 0; j < typeIdArr.length; j++){
				var t = typeIdArr[j];
				if(!this.editors[t]){
					this.editors[t] = [];
				}
				var arr = this.editors[t];
				for(var i = 0; i < arr.length; i++){
					if(arr[i] && arr[i] instanceof JSB && arr[i].name == jso.$name){
						// already registered, skip
						return;
					}
				}
				arr.push(jso);
			}
		} finally {
			JSB.getLocker().unlock('EditorRegistry.register');
		}
	},
	
	get: function(typeId){
		if(JSB().isNull( this.editors ) || JSB().isNull(this.editors[typeId]) || this.editors[typeId].length == 0){
			return null;
		}
		return this.editors[typeId][0]; // TODO: better selection logic
	},
	
	$client: {
		lookup: function(typeId, callback){
			var self = this;
			var jso = this.get(typeId);
			if(!JSB().isNull(jso)){
				if(callback){
					callback.call(this, jso);
				}
				return jso;
			}
			this.rpc('getInfo', typeId, function(jsoName){
				JSB().lookup(jsoName, function(cls){
					self.register(typeId, cls.jsb);
					if(callback){
						callback.call(self, cls.jsb);
					}
				})
			});
			return null;
		}
	},
	
	$server: {
		$constructor: function(){
			$base();
		},
		
		lookup: function(typeId, callback){
			var jso = this.get(typeId);
			if(!JSB().isNull(jso) && callback){
				callback.call(this, jso);
			}
			return jso;
		},
		
		getInfo: function(typeId){
			var ret = {};
			var jso = this.get(typeId);
			if(jso){
				return jso.$name;
			}
			
			// obtain type info
			var typeInfo = null;
			var lock = true;
			JSB().lookupSingleton('JSB.TypeInfoRegistry', function(obj){
				obj.lookup(typeId, function(desc){
					typeInfo = desc;
					lock = false;
				})
			});
			while(lock);

			if(!JSB().isNull(typeInfo)){
				if(typeInfo.isEnum){
					return 'JSB.Widgets.EnumEditor';
				}
			}
			
			return 'JSB.Widgets.ReflectionEditor';
		}
	}
}