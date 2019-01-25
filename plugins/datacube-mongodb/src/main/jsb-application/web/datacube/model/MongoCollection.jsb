{
	$name: 'DataCube.Model.MongoCollection',
	$parent: 'DataCube.Model.DatabaseTable',
	
	view: false,
	itemCount: 0,
	
	isView: function(){
		return this.view;
	},
	
	getItemCount: function(){
		return this.itemCount;
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController'],
		
		descriptor: null,
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

		$bootstrap: function(){
			WorkspaceController.registerExplorerNode(null, this, {
				priority:0.5, 
				nodeType:'DataCube.MongoCollectionNode',
				create: false,
				move: false,
				remove: false,
				share: false,
				rename: false
			});
		},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			
			if(opts){
				this.descriptor = opts;
				this.property('descriptor', this.descriptor);
				this.setName(this.descriptor.name);
				this.view = this.descriptor.isView || false;
				this.itemCount = this.descriptor.count || 0;
				$this.publish('DataCube.Model.SqlTable.updated');
			} else {
				this.descriptor = this.property('descriptor');
				this.missing = this.property('missing') || false;
				this.view = this.descriptor.isView || false;
				this.itemCount = this.descriptor.count || 0;
			}
			
			this.subscribe(['DataCube.Model.MongoSource.updateSettings','DataCube.Model.MongoSource.clearCache'], function(sender){
				if($this.getParent() != sender){
					return;
				}
				$this.publish('DataCube.Model.MongoCollection.updated');
			});
			
			this.subscribe('DataCube.Model.MongoSource.updateCache', function(sender){
				if($this.getParent() != sender){
					return;
				}
				$this.publish('DataCube.Model.MongoSource.updateCache');
			});

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

		extractFields: function(opts){
			if(this.fields && (!opts || !opts.refresh)){
				return this.fields;
			}
			var desc = this.getDescriptor(),
			    fields = {},
			    isIdProps = opts && opts.idProps;
			var collectionName = desc.name;

			var scheme = (function(conn){
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
			}).call(this.getStore());

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

			this.fields = fields;
			return this.fields;
		},

		getDescriptor: function(){
			return this.descriptor;
		},

		updateDescriptor: function(desc){
			this.descriptor = desc;
			this.property('descriptor', this.descriptor);
			this.view = this.descriptor.isView || false;
			this.itemCount = this.descriptor.count || 0;
			this.setName(this.descriptor.name);
			this.doSync();
			$this.publish('DataCube.Model.SqlTable.updated');
		}
	}
}