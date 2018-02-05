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
			TranslatorRegistry.register(
			    JSB.get('DataCube.Query.Translators.LockiTranslator'),
			    'DataCube.Providers.InMemoryDataProvider');
			TranslatorRegistry.register(
			    JSB.get('DataCube.Query.Translators.LockiTranslator'),
			    'DataCube.Providers.JsonFileDataProvider');

            if (/**old=true*/true) {
                TranslatorRegistry.register(
                    JSB.get('DataCube.Query.Translators.SQLTranslator'),
                    'DataCube.Providers.SqlTableDataProvider');
            } else {
                TranslatorRegistry.register(
                    JSB.get('DataCube.Query.Translators.SQLViewsTranslator'),
                    'DataCube.Providers.SqlTableDataProvider');
            }
		},
	}
}