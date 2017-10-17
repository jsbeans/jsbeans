{
	$name: 'DataCube.Query.Iterators.DataProviderIterator',
	$parent: 'DataCube.Query.Iterators.Iterator',

	$server: {
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',

//		    'DataCube.Providers.SqlTableDataProvider',
//		    'DataCube.Providers.InMemoryDataProvider',

		    'DataCube.Query.Translators.SQLTranslator',
		    'DataCube.Query.Translators.LockiTranslator',
        ],

		$constructor: function(providerOrProviders, queryEngine){
		    $base();
		    this.providers = JSB.isArray(providerOrProviders) ? providerOrProviders : [providerOrProviders];
		    this.queryEngine = queryEngine;
		    this.cube = JSB.isArray(providerOrProviders) ? queryEngine.cube : null;
		},

		matchDataProvider: function(dataProvider){
		    return this.providers.indexOf(dataProvider) != -1;
		},

		getDataProviders: function(){
            return this.providers;
        },

		iterate: function(dcQuery, params){
		    try {
                var translator = TranslatorRegistry.newTranslator(this.providers, this.cube || this.queryEngine);
                this.iterator = translator.translatedQueryIterator(dcQuery, params);
                return this;
		    } finally {
		        if(translator) translator.close();
		    }
		},

		close: function() {
		    this.iterator.close();
		    this.destroy();
		},

		next: function(){
		    return this.iterator.next();
		},
	}
}