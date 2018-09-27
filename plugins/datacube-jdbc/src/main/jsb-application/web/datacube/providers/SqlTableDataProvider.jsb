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
			
			this.subscribe('DataCube.Model.SqlTable.updated', function(sender){
				if($this.entry != sender){
					return;
				}
				$this.getCube().invalidate();
			});
			
			this.subscribe('DataCube.Model.SqlTable.updateCache', function(sender){
				if($this.entry != sender){
					return;
				}
				$this.getCube().updateCache();
			});
		},
		
		getTableDescriptor: function(){
			return this.entry.getDescriptor();
		},

		getTableFullName:function(){
		    return this.getTableDescriptor().schema
		            ? '"' + this.getTableDescriptor().schema + '"."' + this.getTableDescriptor().name + '"'
		            : '"' + this.getTableDescriptor().name + '"';
        },


		getStore: function(){
			var sourceEntry = this.entry.getWorkspace().entry(this.entry.getParentId());
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
		
		extractFields: function(opts){
			var desc = this.getTableDescriptor(),
			    fields = {},
			    isIdProps = opts && opts.idProps;

			for(var colName in desc.columns){
				var nativeType = desc.columns[colName].datatypeName,
				    type = JDBC.toJsonType(nativeType),
				    colId = desc.id + '_' + colName;

				var fDesc = {
				    id: colId,
				    name: colName
				};
				if(opts && Object.keys(opts).length > 0){
					if(opts.type){
						fDesc.type = type;
					}
					if(opts.nativeType){
						fDesc.nativeType = nativeType;
					}
					if(opts.comment){
					    var comment = desc.columns[colName].comment,
					        jsonComment;

					    try{
					        jsonComment = JSON.parse(comment);
					    } catch(e){}

					    if(jsonComment){
					        fDesc.comment = jsonComment;
					    } else {
					        fDesc.comment = comment;
					    }
					}
					if(opts.name){
						fDesc.name = desc.columns[colName].name;
					}
				} else {
					fDesc.type = type;
					fDesc.nativeType = nativeType;
				}
				fields[isIdProps ? colId : colName] = fDesc;
			}
			return fields;
		}
	}
}