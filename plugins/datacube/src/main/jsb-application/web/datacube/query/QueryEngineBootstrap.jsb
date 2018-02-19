{
	$name: 'DataCube.Query.QueryEngineBootstrap',

	$server: {
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Query.Transforms.QueryTransformer',

		    'DataCube.Query.Translators.LockiTranslator',
		    'DataCube.Query.Translators.SQLTranslator',
		    'DataCube.Query.Translators.SQLViewsTranslator',
        ],

		$bootstrap: function(){
            var translators = Config.get('datacube.query.translators');
            for(var providerType in translators) if(translators.hasOwnProperty(providerType)) {
                var translatorType = translators[providerType];
                var translatorJsb = JSB.get(translatorType);
                if(!translatorJsb) {
                    // TODO: limit tries count and throw error
                    (function(translatorType){
                        JSB.deferUntil(function(){
                            var translatorJsb = JSB.get(translatorType);
                            TranslatorRegistry.register(translatorJsb, providerType);
                        }, function(){
                            return JSB.get(translatorType);
                        });
                    })(translatorType);
                    continue;
                } else {
                    TranslatorRegistry.register(translatorJsb, providerType);
                }
            }


            var transformers = Config.get('datacube.query.transformers');
            for(var t in transformers) {
                var transformerType = transformers[t];
                var transformerJsb = JSB.get(transformerType);
                if(!transformerJsb) {
                    throw new Error("InternalError: Invalid transformer " + transformerType);
                } else {
                    QueryTransformer.push(transformerJsb);
                }
            }
		},
	}
}