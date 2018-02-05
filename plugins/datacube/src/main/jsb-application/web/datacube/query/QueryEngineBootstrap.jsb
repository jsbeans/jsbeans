{
	$name: 'DataCube.Query.QueryEngineBootstrap',

	$server: {
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',

		    'DataCube.Query.Translators.LockiTranslator',
		    'DataCube.Query.Translators.SQLTranslator',
		    'DataCube.Query.Translators.SQLViewsTranslator',
        ],

		$bootstrap: function(){
            var translators = Config.get('datacube.translators');
            for(var providerType in translators) if(translators.hasOwnProperty(providerType)) {
                var translatorJsb = JSB.get(translators[providerType]);
                if (!translatorJsb) throw new Error('Configuration error: Unknown translator ' + translators[providerType] + ' for provider ' + providerType);
                TranslatorRegistry.register(translatorJsb, providerType);
            }

            // default bindings: workaround for old config
            // TODO remove
            if (!translators) {
                TranslatorRegistry.register(
                    JSB.get('DataCube.Query.Translators.LockiTranslator'),
                    'DataCube.Providers.InMemoryDataProvider');
                TranslatorRegistry.register(
                    JSB.get('DataCube.Query.Translators.LockiTranslator'),
                    'DataCube.Providers.JsonFileDataProvider');
                TranslatorRegistry.register(
                    JSB.get('DataCube.Query.Translators.SQLTranslator'),
                    'DataCube.Providers.SqlTableDataProvider');
            }
		},
	}
}