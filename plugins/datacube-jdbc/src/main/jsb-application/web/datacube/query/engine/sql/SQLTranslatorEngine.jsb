{
	$name: 'DataCube.Query.Engine.SQL.SQLTranslatorEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.Sql.SQLStore',
		    'DataCube.Query.Engine.SQL.SQLTranslator',
		    'DataCube.Query.Engine.ClickHouse.ClickHouseLoopbackProvider',
		    'DataCube.Query.Engine.H2Interpreter.H2InterpreterLoopbackProvider',
		    'DataCube.Query.QueryUtils',
        ],

		acceptable: function(name, executor, queryTask){
		    var query = queryTask.query;
		    var cube = queryTask.cube;
		    var config = $this.getLocalConfig(name);
		    var providers = queryTask.providers = queryTask.providers || QueryUtils.extractProviders(query, cube);
            for(var  i = 0; i < providers.length; i++) {
                if(providers[i].getStore() instanceof SQLStore
                        && config.vendor == providers[i].getStore().getVendor())
                {
                    return true;
                }
            }
            return false; // has no compatible provider
		},

		execute: function(name, executor, queryTask){
		    var query = queryTask.query;
		    var cube = queryTask.cube;
		    var params = queryTask.params;
		    var config = $this.getLocalConfig(name);
		    var providers = queryTask.providers || QueryUtils.extractProviders(query, cube);
            for(var  i = 0; i < providers.length; i++) {
                if(providers[i].getStore() instanceof SQLStore
                        && config.vendor == providers[i].getStore().getVendor())
                {
                    // set vendor provider as first/main
                    providers = [providers[i]].concat(providers.splice(i,0));
                    var translator = new SQLTranslator(providers, cube, executor);
                    translator.vendor = config.vendor;
                    switch (config.vendor) {
                        case 'ClickHouse':
                            translator.remoteQuery = new ClickHouseLoopbackProvider(cube);
                            break;
                        case 'H2':
                            translator.remoteQuery = new H2InterpreterLoopbackProvider(cube);
                            break;
                    }

                    var it = translator.translatedQueryIterator(query, params);
                    if(it) {
                        return it;
                    }
                }
            }
            return null; // has no compatible provider
		},
	}
}