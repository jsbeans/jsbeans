{
	$name: 'JSB.DataCube.Model.Cube',
	$parent: 'JSB.Workspace.Entry',
	
	sourceCount: 0,
	fieldCount: 0,
	sliceCount: 0,
	
	getSourceCount: function(){
		return this.sourceCount;
	},
	
	getFieldCount: function(){
		return this.fieldCount;
	},

	getSliceCount: function(){
		return this.sliceCount;
	},

	$server: {
		$require: ['JSB.Workspace.WorkspaceController',
		           'JSB.DataCube.Providers.DataProviderRepository'],
		
		$bootstrap: function(){
			WorkspaceController.registerExplorerNode('datacube', this, 0.5, 'JSB.DataCube.CubeNode');
		},
		
		dataProviders: {},
		fields: {},

		$constructor: function(id, workspace, opts){
			$base(id, workspace);
			if(opts){
			} else {
				
			}
		},
		
		load: function(){},
		
		store: function(){},
		
		addDataProvider: function(providerEntry){
			var providerDesc = DataProviderRepository.queryDataProviderInfo(providerEntry);
			var providerJsb = JSB.get(providerDesc.pType);
			if(!providerJsb){
				throw new Error('Unable to find provider bean: ' + providerDesc.pType);
			}
			var ProviderCls = providerJsb.getClass();
			var pId = this.getId() + '|dp_' + JSB.generateUid();
			var provider = new ProviderCls(pId, providerEntry, this, providerDesc.opts);
			this.dataProviders[pId] = provider;
			this.sourceCount = Object.keys(this.dataProviders).length;
			this.store();
			this.doSync();
			return provider;
		},
		
		addField: function(provider, pField, pType){
			var nameCandidate = pField;
			if(this.fields[nameCandidate]){
				// lookup appropriate name
				for(var cnt = 2; ; cnt++){
					nameCandidate = pField + cnt;
					if(!this.fields[nameCandidate]){
						break;
					}
				}
			}
			this.fields[nameCandidate] = {
				field: nameCandidate,
				type: pType,
				binding: [],
				link: false
			};
			this.fields[nameCandidate].binding.push({
				provider: provider,
				field: pField,
				type: pType
			});
			this.fieldCount = Object.keys(this.fields).length;
			this.store();
			this.doSync();
			return this.fields[nameCandidate];
		},
		
		linkField: function(field, provider, pField, pType){
			if(!this.fields[field]){
				throw new Error('Field not existed: ' + field);
			}
			// check if binding already existed
			for(var i = 0; i < this.fields[field].binding.length; i++){
				if(this.fields[field].binding[i].field == pField && this.fields[field].binding[i].provider == provider){
					return this.fields[field];
				}
			}
			
			this.fields[field].binding.push({
				provider: provider,
				field: pField,
				type: pType
			});
			this.fields[field].link = this.fields[field].binding.length > 0;
			this.store();
			this.doSync();
			return this.fields[field];
		},

		renameField: function(oldName, newName){
			if(!this.fields[oldName]){
				throw new Error('Field not existed: ' + oldName);
			}
			if(oldName == newName){
				return this.fields[oldName];	
			}
			var n = newName.trim();
			if(n.length == 0){
				return false;
			}
			if(/\s/.test(n)){
				return false;
			}
			if(/$\d/.test(n)){
				return false;
			}
			if(this.fields[n]){
				return false;
			}
			this.fields[n] = this.fields[oldName];
			delete this.fields[oldName];
			this.fields[n].field = n;
			this.store();
			this.doSync();
			return this.fields[n];
		},
		
		removeField: function(field){
			if(!this.fields[field]){
				return false;
			}
			delete this.fields[field];
			this.fieldCount = Object.keys(this.fields).length;
			this.store();
			this.doSync();
			return true;
		}
	}
}