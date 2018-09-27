{
	$name: 'DataCube.Providers.MongoDataProvider',
	$parent: 'DataCube.Providers.DataProvider',
	
	$client: {
		$constructor: function(){
			$base();
			this.loadCss('MongoDataProvider.css');
		}
	},
	
	$server: {
		$require: [
		    'DataCube.Providers.DataProviderRepository'
        ],
		
		$bootstrap: function(){
			DataProviderRepository.registerDataProvider(this, {
				accepts: 'DataCube.Model.MongoCollection'
			});
		},
		
		$constructor: function(id, pEntry, cube, opts){
			$base(id, pEntry, cube, opts);
			this.name = pEntry.getName();
			
			this.subscribe('DataCube.Model.MongoCollection.updated', function(sender){
				if($this.entry != sender){
					return;
				}
				$this.getCube().invalidate();
			});
			
			this.subscribe('DataCube.Model.MongoCollection.updateCache', function(sender){
				if($this.entry != sender){
					return;
				}
				$this.getCube().updateCache();
			});
		},
		
		fields: null,
		
		typeOrder: {
			'null': 0,
			'boolean': 1,
			'integer': 2,
			'float': 3,
			'string': 4,
			'object': 5,
			'array': 6
		},
		
		getDescriptor: function(){
			return this.getEntry().getDescriptor();
		},

		getStore: function(){
			var sourceEntry = this.getEntry().getWorkspace().entry(this.getEntry().getParentId());
			return sourceEntry.getStore();
		},

		getCollectionName: function(){
		    return this.getDescriptor().name;
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
		
		
		detectValueTable: function(value){
			var type = null;
			if(JSB.isNull(value)){
				type = 'null';
			} else if(JSB.isBoolean(value)){
				type = 'boolean';
			} else if(JSB.isString(value)){
				type = 'string';
			} else if(JSB.isFloat(value)){
				type = 'float';
			} else if(JSB.isInteger(value)){
				type = 'integer';
			} else if(JSB.isArray(value)) {
				type = 'array';
			} else if(JSB.isObject(value)) {
				type = 'object';
			} else if(JSB.isDate(value)) {
				type = 'date';
			} else {
				throw new Error('Unknown value type: ' + JSON.stringify(value));
			}
			return type;
		},
		
		combineRecord: function(record, fields){
			var bChanged = false;
			for(var f in record){
				// obtain record type
				var rType = this.detectValueTable(record[f]);
				if(!JSB.isDefined(fields[f])){
					fields[f] = {
						name: f,
						type: rType
					};
					bChanged = true;
				} else {
					var eType = fields[f].type;
					if(this.typeOrder[rType] > this.typeOrder[eType]){
						bChanged = true;
						fields[f].type = rType;
					}
				}
				if(rType == 'object'){
					if(!JSB.isDefined(fields[f].fields)){
						fields[f].fields = {};	
					}
					bChanged = this.combineRecord(record[f], fields[f].fields) || bChanged;
				} else if(rType == 'array'){
					for(var i = 0; i < record[f].length; i++){
						var iType = this.detectValueTable(record[f][i]);
						if(!JSB.isDefined(fields[f].itemType)){
							fields[f].itemType = iType;	
						} else {
							if(this.typeOrder[iType] > this.typeOrder[fields[f].itemType]){
								bChanged = true;
								fields[f].itemType = iType;	
							}
						}
						if(iType == 'object'){
							if(!JSB.isDefined(fields[f].fields)){
								fields[f].fields = {};	
							}
							bChanged = this.combineRecord(record[f][i], fields[f].fields) || bChanged;
						}
					}
				}
			}
			return bChanged;
		},
		
		extractFields: function(opts){
			if(this.fields && (!opts || !opts.refresh)){
				return this.fields;
			}
			var desc = this.getDescriptor(),
			    fields = {},
			    isIdProps = opts && opts.idProps;
			var collectionName = desc.name;
			
			var scheme = this.getStore().asMongodb().connected(function(conn){
				// extract columns by querying contents
				var fieldTree = {};
				var it = this.asMongodb().iteratedQuery({find:collectionName});
				try {
					var unChanged = 0, read = 0;
					while(true){
						var record = it.next();
						if(!record){
							break;
						}
						read++;
						if($this.combineRecord(record, fieldTree)){
							unChanged = 0;
						} else {
							unChanged++;
						}
						if(unChanged > 100 || read > 1000){
							break;
						}
					}
					return fieldTree;
				} finally {
					it.close();	
				}
			});
			
			// transform fieldTree into plain fields
			function transformTreeEntry(treeFields, parent){
				for(var f in treeFields){
					var e = treeFields[f];
					var key = parent && parent.length > 0 ? parent + '.' + e.name : e.name;
					fields[key] = {
						id: key,
						name: e.name,
						type: e.type,
						nativeType: e.type
					};
					if(parent && parent.length > 0){
						fields[key].parent = parent;
					}
					if(e.type == 'object' || (e.type == 'array' && e.itemType == 'object')){
						transformTreeEntry(e.fields, key);
					}
				}
			}
			
			transformTreeEntry(scheme, null);
			
/*
			for(var colName in desc.columns){
				var nativeType = desc.columns[colName].datatypeName;
				var type = JDBC.toJsonType(nativeType);
				var fDesc = {
				    id: desc.id + '.' + colName
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
				fields[isIdProps ? desc.id : colName] = fDesc;
			}
*/			
			this.fields = fields;
			return this.fields;
		}
	}
}