{
	$name: 'JSB.DataCube.Providers.InMemoryDataProvider',
	$parent: 'JSB.DataCube.Providers.DataProvider',
	
	$server: {
		fields: {},
		
		$bootstrap: function(){
		},
		
		$constructor: function(id, pEntry, cube, opts){
			$base(id, pEntry, cube, opts);
			
			(function(){
				`#include 'loki.js'`;
			}).call(this);
			var Loki = this.loki;
			this.db = new Loki(id, {env:'BROWSER'});
			this.collection = this.db.addCollection('coll');
		},
		
		detectFieldType: function(obj){
			if(JSB.isNull(obj)){
				return null;
			} else if(JSB.isString(obj)){
				return 'string';
			} else if(JSB.isBoolean(obj)){
				return 'boolean';
			} else if(JSB.isFloat(obj)){
				return 'float';
			} else if(JSB.isInteger(obj) || JSB.isNumber(obj)){
				return 'integer';
			} else if(JSB.isDate(obj)){
				return 'date';
			} else if(JSB.isObject(obj)){
				return 'object';
			} else if(JSB.isArray(obj)){
				return 'array';
			} 
			return null;
		},
		
		extractFields: function(){
			return this.fields;
		},
		
		addRecord: function(r){
			for(var f in r){
				if(!f || f.length == 0){
					continue;
				}
				// detect field type
				if(!this.fields[f]){
					var fType = this.detectFieldType(r[f]);
					if(fType){
						this.fields[f] = fType;
					}
				}
				
			}
			this.collection.insert(r);

		},
		
		find: function(q){
			return this.collection.find(q);
		}
	}
}