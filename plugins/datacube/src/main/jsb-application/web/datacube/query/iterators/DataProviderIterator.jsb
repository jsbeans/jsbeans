{
	$name: 'JSB.DataCube.Query.Iterators.DataProviderIterator',
	$parent: 'JSB.DataCube.Query.Iterators.Iterator',

	$server: {
		$require: [
		    'JSB.DataCube.Providers.SqlTableDataProvider',
		    'JSB.DataCube.Query.Translators.MoSQLTranslator',
        ],

		$constructor: function(provider, cube){
		    $base();
		    this.provider = provider;
		    this.cube = cube;

            // select compatible translator
            if (provider instanceof SqlTableDataProvider) {
                this.translator = new MoSQLTranslator(provider, cube);
            } else {
                throw new Error('Other translators not supported yet');
            }
		},

		iterate: function(dcQuery, params){
            this.iterator = translator.translatedQueryIterator(dcQuery, params);
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