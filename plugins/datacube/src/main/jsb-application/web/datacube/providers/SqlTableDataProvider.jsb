{
	$name: 'DataCube.Providers.SqlTableDataProvider',
	$parent: 'DataCube.Providers.DataProvider',
	
	$client: {
		$constructor: function(){
			$base();
			this.loadCss('SqlTableDataProvider.css');
		}
	},
	
	$server: {
		$require: [
		    'DataCube.Providers.DataProviderRepository',
		    'JSB.Store.Sql.JDBC'
        ],
		
		$bootstrap: function(){
			DataProviderRepository.registerDataProvider(this, {
				accepts: 'DataCube.Model.SqlTable'
			});

            // try load all installed (in classpath)
			JDBC.loadDrivers(true);
		},
		
		$constructor: function(id, pEntry, cube, opts){
			$base(id, pEntry, cube, opts);
			this.name = pEntry.getName();
		},
		
		getTableDescriptor: function(){
			return this.entry.descriptor;
		},

		getTableFullName:function(){
		    return this.getTableDescriptor().schema
		            ? this.getTableDescriptor().schema + '.' + this.getTableDescriptor().name
		            : this.getTableDescriptor().name;
        },


		getStore: function(){
			var sourceEntry = this.entry.workspace.entry(this.entry.parent);
			return sourceEntry.getStore();
		},
		
		prepareName: function(name){
			name = name.trim();
			if(name.length == 0){
				return name;
			}
			if(name[0] == '\"' || name[0] == '\''){
				name = name.substr(1, name.length - 1);
			}
			if(name[name.length - 1] == '\"' || name[name.length - 1] == '\''){
				name = name.substr(0, name.length - 1);
			}

			return name;
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