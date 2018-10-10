{
	$name: 'DataCube.Providers.JsonFileDataProvider',
	$parent: 'DataCube.Providers.InMemoryDataProvider',
	
	$client: {
		$constructor: function(){
			$base();
			$jsb.loadCss('JsonFileDataProvider.css');
		}
	},
	
	$server: {
		$require: 'DataCube.Providers.DataProviderRepository',
		
		$bootstrap: function(){
			DataProviderRepository.registerDataProvider(this, {
				accepts: 'DataCube.Model.JsonFile'
			});
		},
		
		$constructor: function(id, pEntry, cube, opts){
			$base(id, pEntry, cube, opts);
			this.name = pEntry.getName();
		},
		
		filled: false,
		
		detectRows: function(json){
			if(!json){
				json = this.entry.read();
			}
			function processJsonObject(json){
				// lookup for the longest array
				var maxLength = -1;
				var maxArr = null;
				for(var f in json){
					if(JSB.isObject(json[f])){
						var arr = processJsonObject(json[f]);
						if(arr && arr.length > maxLength){
							maxArr = arr;
							maxLength = arr.length;
						}
					} else if(JSB.isArray(json[f])){
						if(json[f].length > maxLength){
							maxArr = json[f];
							maxLength = json[f].length;
						}
					}
				}
				return maxArr;
			}
			var arr = null;
			if(JSB.isObject(json)){
				arr = processJsonObject(json);
			} else if(JSB.isArray(json)){
				arr = json;
			}
			return arr;
		},
		
		fill: function(){
			var rows = this.detectRows();
			if(rows){
				for(var i = 0; i < rows.length; i++){
					this.addRecord(rows[i]);
				}
				this.filled = true;
			}
		},
		
		extractFields: function(opts){
			if(!this.filled){
				this.fill();
			}
			return $base(opts);
		},
		
		find: function(q){
			if(!this.filled){
				this.fill();
			}
			return $base(q);
		}
	}
}