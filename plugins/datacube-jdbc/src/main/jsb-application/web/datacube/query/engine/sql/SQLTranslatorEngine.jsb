{
	$name: 'DataCube.Query.Engine.SQL.SQLTranslatorEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.Sql.SQLStore',
		    'DataCube.Query.Engine.SQL.SQLTranslator',
		    'DataCube.Query.Engine.Clickhouse.ClickHouseRemoteQuery',
		    'DataCube.Query.Engine.H2Interpreter.H2InterpreterRemoteQuery',
		    'DataCube.Query.QueryUtils',
        ],

		execute: function(name, executor, queryTask){
		    var query = queryTask.query;
		    var cube = queryTask.cube;
		    var params = queryTask.params;
		    var config = $this.getLocalConfig(name);

		    var providers = QueryUtils.extractProviders(query, cube);
            for(var  i = 0; i < providers.length; i++) {
                if(providers[i].getStore() instanceof SQLStore
                        && config.vendor == providers[i].getStore().getVendor())
                {
                    // set vendor provider as first/main
                    providers = [providers[i]].concat(providers.splice(i,0));
                    var translator = new SQLTranslator(providers, cube);
                    translator.vendor = config.vendor;
                    switch (config.vendor) {
                        case 'ClickHouse':
                            translator.remoteQuery = new ClickHouseRemoteQuery(cube);
                            break;
                        case 'H2':
                            translator.remoteQuery = new H2InterpreterRemoteQuery(cube);
                            break;
                    }

                    return translator.translatedQueryIterator(query, params);
                }
            }
            return null; // has no compatible provider
		},
	}
}