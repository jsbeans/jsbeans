{
	$name: 'DataCube.Providers.DataProviderRepository',
	$singleton: true,
	
	$sync: {
		updateCheckInterval: 0
	},
	
	dataProviderRegistry: {},
	
	queryDataProviderInfo: function(eType){
		if(eType instanceof JSB){
			eType = eType.$name;
		} else if(JSB.isBean(eType)){
			eType = eType.getJsb().$name;
		} else if(!JSB.isString(eType)){
			throw new Error('Invalid entry type');
		}
		return this.dataProviderRegistry[eType];
	},

	
	$client: {
		$constructor: function(){
			$base();
			this.doSync();
		}
	},
	
	$server: {
		registerDataProvider: function(dataProviderJsb, opts){
			var eTypes = [];
			if(!opts.accepts){
				throw new Error('Missing "accepts" field');
			}
			eTypes = opts.accepts;
			if(!JSB.isArray(eTypes)){
				eTypes = [eTypes];
			}
			var providerType = dataProviderJsb;
			if(!providerType){
				throw new Error('Missing provider to register');
			}
			if(providerType instanceof JSB){
				providerType = providerType.$name;
			} else if(JSB.isBean(providerType)){
				providerType = providerType.getJsb().$name;
			} else if(!JSB.isString(providerType)){
				throw new Error('Invalid provider type');
			}
			for(var i = 0; i < eTypes.length; i++){
				var eType = eTypes[i];
				if(this.dataProviderRegistry[eType]){
					JSB.getLogger().warn('Entry "' + eType + '" has been already associated with provider: ' + this.dataProviderRegistry[eType].pType);
					continue;
				}
				this.dataProviderRegistry[eType] = {
					pType: providerType,
					opts: opts.options
				};
			}
			this.doSync();
		}
		
	}
}