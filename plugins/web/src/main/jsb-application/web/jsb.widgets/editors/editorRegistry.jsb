{
	$name:'JSB.Widgets.EditorRegistry',
	
	register: function(typeId, jso){
		if( JSB().isNull( this.editors ) ){
			this.editors = {};
		}
		var typeIdArr = [];
		if(JSB().isArray(typeId)){
			typeIdArr = typeId;
		} else {
			typeIdArr[typeIdArr.length] = typeId;
		}
		for(var j in typeIdArr){
			var t = typeIdArr[j];
			if(JSB().isNull(this.editors[t])){
				this.editors[t] = [];
			}
			var arr = this.editors[t];
			for(var i in arr){
				if(arr[i] && arr[i] instanceof JSB && arr[i].name == jso.$name){
					// already registered, skip
					return;
				}
			}
			arr[arr.length] = jso;
		}
	},
	
	get: function(typeId){
		if(JSB().isNull( this.editors ) || JSB().isNull(this.editors[typeId]) || this.editors[typeId].length == 0){
			return null;
		}
		return this.editors[typeId][0]; // TODO: better selection logic
	},
	
	$client: {
		$singleton: true,
		
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
		$singleton: true,
		$constructor: function(){
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