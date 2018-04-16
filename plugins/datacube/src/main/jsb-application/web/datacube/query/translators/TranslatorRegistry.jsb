{
	$name: 'DataCube.Query.Translators.TranslatorRegistry',
	$singleton: true,

	$server: {
		$require: ['JSB.System.Config'],

        _dataProviderTranslator: {},
        
        $constructor: function(){
        	$base();
        	
        	this.translatorsCfg = Config.get('datacube.query.translators');
        },

		register: function(translatorJsb, dataProviderName){
			if(translatorJsb instanceof JSB){
				translatorJsb = translatorJsb.$name;
			} else if(JSB.isBean(translatorJsb)){
				translatorJsb = translatorJsb.getJsb().$name;
			} else if(!JSB.isString(translatorJsb)){
				throw new Error('Invalid translator type');
			}
			if(dataProviderName){
				this._dataProviderTranslator[dataProviderName] = translatorJsb;
				JSB.getLogger().debug('Registered translator ' + translatorJsb + ' for ' + dataProviderName);
			} else {
				for(var dpName in this.translatorsCfg){
					if(translatorJsb == this.translatorsCfg[dpName]){
						this._dataProviderTranslator[dpName] = translatorJsb;
						JSB.getLogger().debug('Registered translator ' + translatorJsb + ' for ' + dpName);
					}
				}
			}
		},

		hasTranslator: function(providerOrProviders, cube){
		    var dataProvider = JSB.isArray(providerOrProviders) ? providerOrProviders[0] : providerOrProviders;
		    var translatorName = this._dataProviderTranslator[dataProvider.getJsb().$name];
		    return !!translatorName;
		},

		newTranslator: function(providerOrProviders, cube){
		    var dataProvider = JSB.isArray(providerOrProviders) ? providerOrProviders[0] : providerOrProviders;
		    var translatorName = this._dataProviderTranslator[dataProvider.getJsb().$name];
		    if (!translatorName) {
		        throw new Error('Translator not found for ' + dataProvider.getJsb().$name);
		    }
		    var Translator = JSB.get(translatorName).getClass();
		    return new Translator(providerOrProviders, cube);
		},
	}
}