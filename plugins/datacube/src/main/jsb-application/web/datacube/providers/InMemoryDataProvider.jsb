{
	$name: 'DataCube.Providers.InMemoryDataProvider',
	$parent: 'DataCube.Providers.DataProvider',
	
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
		
		extractFields: function(opts){
			var fields = {};
			for(var fName in this.fields){
				var fDesc = {};
				if(opts && Object.keys(opts).length > 0){
					if(opts.name){
						fDesc.name = fName;
					}
					if(opts.type){
						fDesc.type = this.fields[fName];
					}
					if(opts.nativeType){
						fDesc.nativeType = this.fields[fName];
					}
					if(opts.comment){
						fDesc.comment = '';
					}
				} else {
					fDesc.type = fDesc.nativeType = this.fields[fName];
				}
				fields[fName] = fDesc;

			}
			return fields;
		},
		
		addRecord: function(r){
			// flatten object fields
			var nr = {};
			
			function _translateObject(obj, prefix){
				prefix = prefix || '';
				for(var f in obj){
					if(JSB.isObject(obj[f])){
						_translateObject(obj[f], prefix + f + '_');
					} else {
						nr[prefix + f] = obj[f];
					}
				}
			}
			_translateObject(r);
			
			for(var f in nr){
				if(!f || f.length == 0){
					continue;
				}
				// detect field type
				if(!this.fields[f]){
					var fType = this.detectFieldType(nr[f]);
					if(fType){
						this.fields[f] = fType;
					}
				}
				
			}
			this.collection.insert(nr);

		},
		
		find: function(q){
			return this.collection.find(q);
		}
	}
}