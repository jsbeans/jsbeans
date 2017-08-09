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
		    this.cube = queryEngine.cube;
		    this.translator = TranslatorRegistry.newTranslator(providerOrProviders, this.cube || this.queryEngine);
		},

		matchDataProvider: function(dataProvider){
		    return this.providers.indexOf(dataProvider) != -1;
		},

		getDataProviders: function(){
            return this.providers;
        },

		iterate: function(dcQuery, params){
//		    Log.debug('DataProviderIterator.iterate: ' + JSON.stringify(dcQuery,0,2));
            this.iterator = this.translator.translatedQueryIterator(dcQuery, params);
		    return this;
		},

		close: function() {
		    this.iterator.close();
		},

		next: function(){
		    return this.iterator.next();
		},
	}
}