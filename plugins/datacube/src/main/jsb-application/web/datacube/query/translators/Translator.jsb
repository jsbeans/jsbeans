{
	$name: 'DataCube.Query.Translators.Translator',

	$server: {
		$require: [
        ],

		$constructor: function(provider){
		    $base();
		    this.provider = provider;
		},

		translateQuery: function(dcQuery, params){
		    throw new Error('Not implemented');
		},

		translatedQueryIterator: function(dcQuery, params){
		    throw new Error('Not implemented');
		},

		close: function() {
		    throw new Error('Not implemented');
		},
	}
}