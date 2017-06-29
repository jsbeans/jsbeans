{
	$name: 'JSB.DataCube.Providers.SqlTableDataProvider',
	$parent: 'JSB.DataCube.Providers.DataProvider',
	
	$client: {
		$constructor: function(){
			$base();
			this.loadCss('SqlTableDataProvider.css');
		}
	},
	
	$server: {
		$require: 'JSB.DataCube.Providers.DataProviderRepository',
		
		$bootstrap: function(){
			DataProviderRepository.registerDataProvider(this, {
				accepts: 'JSB.DataCube.Model.SqlTable'
			});
		},
		
		$constructor: function(id, pEntry, cube, opts){
			$base(id, pEntry, cube, opts);
			this.name = pEntry.getName();
		},
		
		getTableDescriptor: function(){
			return this.entry.descriptor;
		},
		
		getStore: function(){
			var sourceEntry = this.workspace.entry(this.parent);
			return sourceEntry.getStore();
		},
		
		extractFields: function(){
			var desc = this.getTableDescriptor();
			var fields = {};
			for(var colName in desc.columns){
				var type = desc.columns[colName].datatypeName;
				fields[colName] = type;
			}
			return fields;
		}
	}
}