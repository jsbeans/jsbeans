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
			this.store();
			return provider;
		}

	}
}