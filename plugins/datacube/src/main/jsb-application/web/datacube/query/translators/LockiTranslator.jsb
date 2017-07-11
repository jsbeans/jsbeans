{
	$name: 'JSB.DataCube.Query.Translators.LockiTranslator',
	$parent: 'JSB.DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'JSB.DataCube.Query.Translators.TranslatorRegistry',
		    'JSB.DataCube.Providers.InMemoryDataProvider'
        ],

		$bootstrap: function(){
			TranslatorRegistry.register(this, 'JSB.DataCube.Providers.InMemoryDataProvider');
			TranslatorRegistry.register(this, 'JSB.DataCube.Providers.JsonFileDataProvider');
		},

		$constructor: function(provider, cube){
		    $base(provider);
		    this.cube = cube;
		    this.queryEngine = cube.queryEngine;
		},

		translatedQueryIterator: function(dcQuery, params){
		    // TODO: translate query to loki
            var result = this.provider.find();
            var i = 0;
		    return {
		        next: function(){
                    if (i < result.length) {
                        return result[i++];
                    }
                    return null;
		        },
		        close: function(){

		        }
		    };
		},

		close: function() {
		},

	}
}