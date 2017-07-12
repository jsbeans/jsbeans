{
	$name: 'JSB.DataCube.Query.Translators.TranslatorRegistry',
	$singleton: true,

	$server: {
		$require: [
        ],

        _dataProviderTranslator: {},

		register: function(translatorJsb, dataProviderName){
			if(translatorJsb instanceof JSB){
				translatorJsb = translatorJsb.$name;
			} else if(JSB.isBean(translatorJsb)){
				translatorJsb = translatorJsb.getJsb().$name;
			} else if(!JSB.isString(translatorJsb)){
				throw new Error('Invalid translator type');
			}
			Log.debug('Registered translator ' + translatorJsb + ' for ' + dataProviderName);
		    this._dataProviderTranslator[dataProviderName] = translatorJsb;
		},

		newTranslator: function(providerOrProviders, cube){
		    var dataProvider = JSB.isArray(providerOrProviders) ? providerOrProviders[0] : providerOrProviders;
		    var translatorName = this._dataProviderTranslator[dataProvider.getJsb().$name];
		    if (!translatorName) {
		        throw new Error('Translator not found for ' + dataProvider.getJsb().$name);
		    }
		    var Translator = JSB.get(translatorName).getClass();
		    return new Translator(providerOrProviders, cube);
		}
	}
}