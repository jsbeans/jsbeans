{
	$name: 'DataCube.Query.Engine.SQL.SQLStoreEngine',
	$parent: 'DataCube.Query.Engine.SQL.StoreEngine',

	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.Sql.SQLStore',
		    'DataCube.Query.Visitors.SQLLoopbackTranslatorVisitor',
		    'DataCube.Query.Engine.ClickHouse.ClickHouseLoopbackProvider',
		    'DataCube.Query.Engine.H2Interpreter.H2InterpreterLoopbackProvider',
		    'DataCube.Query.QueryUtils',
        ],

		acceptable: function(name, executor, queryTask){
		    return true;
		},

		execute: function(name, executor, queryTask){
		    var query = queryTask.query;
		    var cube = queryTask.cube;
		    var params = queryTask.params;
		    var config = $this.getLocalConfig(name);
		    var providers = queryTask.providers || QueryUtils.extractProviders(query, cube);

            for(var  i = 0; i < providers.length; i++) {
                var vendor = providers[i].getStore().getVendor();
                if (config.inMemory ||
                    providers[i].getStore() instanceof SQLStore &&
                    (config.vendor == vendor || config.excludeVendors && config.excludeVendors.indexOf(vendor) == -1)
                ){
                    try {
                        var translator = new SQLLoopbackTranslatorVisitor(query, params, cube, executor);
                        translator.vendor = config.inMemory ? config.vendor : vendor;
                        translator.mainDataProvider = config.inMemory ? $this.getInMemoryDataProvider() : providers[i];
                        translator.engineConfig = config;
                        switch (translator.vendor) {
                            case 'ClickHouse':
                                translator.loopbackProvider = new ClickHouseLoopbackProvider(cube);
                                break;
                            case 'H2':
                                translator.loopbackProvider = new H2InterpreterLoopbackProvider(cube);
                                break;
                        }
                        translator.translate();
                        var translatedQuery = translator.getSQL();
                        if (translatedQuery) {
                            var it = $this.produceLazyIterator(translatedQuery, params, executor, translator.mainDataProvider);
                            var oldClose = it.close;
                            it.close = function(){
                                translator && translator.destroy();
                                oldClose.call(this);
                            };
                            return it;
                        } else {
                            translator.destroy();
                        }
                        if (config.inMemory) {
                            return null;
                        }
                    } catch(e) {
                        throw e;
                    }
                }
            }
            return null; // has no compatible provider
		},

		executeQuery: function(translatedQuery, params, mainProvider) {
		    var store = mainProvider.getStore();
		    var iterator = store.asSQL().iteratedParametrizedQuery2(
		        translatedQuery,
		        function getValue(param) {
		            return params[param];
		        },
		        function getType(param) {
		            return null;
		        }
		    );
		    return iterator;
        },
	}
}