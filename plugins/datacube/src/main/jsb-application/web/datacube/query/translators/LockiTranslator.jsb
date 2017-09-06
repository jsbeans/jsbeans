{
	$name: 'DataCube.Query.Translators.LockiTranslator',
	$parent: 'DataCube.Query.Translators.Translator',

	$server: {
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Providers.InMemoryDataProvider'
        ],

		$bootstrap: function(){
			TranslatorRegistry.register(this, 'DataCube.Providers.InMemoryDataProvider');
			TranslatorRegistry.register(this, 'DataCube.Providers.JsonFileDataProvider');
		},

		$constructor: function(provider, cube){
		    $base(provider, cube);
		    this.cube = cube;
		    this.queryEngine = cube.queryEngine;
		},

		translatedQueryIterator: function(dcQuery, params){
		    // TODO: translate query to loki
            var result = this.providers[0].find();
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
		    this.destroy();
		}
	}
}