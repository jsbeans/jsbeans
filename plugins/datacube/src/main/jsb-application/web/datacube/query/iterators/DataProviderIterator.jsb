{
	$name: 'JSB.DataCube.Query.Iterators.DataProviderIterator',
	$parent: 'JSB.DataCube.Query.Iterators.Iterator',

	$server: {
		$require: [
		    'JSB.DataCube.Providers.SqlTableDataProvider',
		    'JSB.DataCube.Query.Translators.MoSQLTranslator',
        ],

		$constructor: function(provider, queryEngine){
		    $base();
		    this.provider = provider;
		    this.queryEngine = queryEngine;
		    this.cube = queryEngine.cube;
            // select compatible translator
            if (provider instanceof SqlTableDataProvider) {
                this.translator = new MoSQLTranslator(provider, this.cube);
            } else {
                throw new Error('Other translators not supported yet');
            }
		},

		getDataProvider: function(){
		    return this.provider;
		},

		iterate: function(dcQuery, params){
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