{
	$name: 'JSB.DataCube.Query.Iterators.DataProviderIterator',
	$parent: 'JSB.DataCube.Query.Iterators.Iterator',

	$server: {
		$require: [
		    'JSB.DataCube.Query.Translators.TranslatorRegistry',

//		    'JSB.DataCube.Providers.SqlTableDataProvider',
//		    'JSB.DataCube.Providers.InMemoryDataProvider',

		    'JSB.DataCube.Query.Translators.MoSQLTranslator',
		    'JSB.DataCube.Query.Translators.LockiTranslator',
        ],

		$constructor: function(provider, queryEngine){
		    $base();
		    this.provider = provider;
		    this.queryEngine = queryEngine;
		    this.cube = queryEngine.cube;

		    this.translator = TranslatorRegistry.newTranslator(provider, this.cube);
//            // select compatible translator
//            if (provider instanceof SqlTableDataProvider) {
//                this.translator = new MoSQLTranslator(provider, this.cube);
//            } else if (provider instanceof InMemoryDataProvider) {
//                this.translator = new LockiTranslator(provider, this.cube);
//            } else {
//                throw new Error('Other translators not supported yet');
//            }
		},

		getDataProviders: function(){
		    return [this.provider];
		},

		iterate: function(dcQuery, params){
		    Log.debug('DataProviderIterator.iterate: ' + JSON.stringify(dcQuery,0,2));
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