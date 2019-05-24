/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Engine.SQL.SQLInterpreter',
	$parent: 'DataCube.Query.Engine.LazyBaseInterpreter',

	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.Sql.SQLStore',
		    'DataCube.Query.Visitors.SQLLoopbackTranslatorVisitor',
		    'DataCube.Query.Engine.Postgres.PostgresLoopbackProvider',
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

		    var times = [];
            for(var  i = 0; i < providers.length; i++) {
                var vendor = providers[i].getStore().getVendor();
                if (config.inMemory ||
                    providers[i].getStore() instanceof SQLStore &&
                    (config.vendor == vendor || config.excludeVendors && config.excludeVendors.indexOf(vendor) == -1)
                ){
                    try {
                        times.push(Date.now());
                        var translator = new SQLLoopbackTranslatorVisitor(query, params, cube, executor);
                        translator.vendor = config.inMemory ? config.vendor : vendor;
                        translator.mainDataProvider = config.inMemory ? $this.getInMemoryDataProvider() : providers[i];
                        translator.engineConfig = config;
                        switch (translator.vendor) {
                            case 'PostgreSQL':
                                translator.loopbackProvider = new PostgresLoopbackProvider(cube);
                                break;
                            case 'ClickHouse':
                                translator.loopbackProvider = new ClickHouseLoopbackProvider(cube);
                                break;
                            case 'H2':
                                translator.loopbackProvider = new H2InterpreterLoopbackProvider(cube);
                                break;
                        }
                        var translatedQuery = translator.translate();
                        if (translatedQuery) {
                            var it = $this.produceLazyIterator(query, translatedQuery, params, executor, translator.mainDataProvider);
                            var oldClose = it.close;
                            it.close = function(){
                                translator && translator.destroy();
                                oldClose.call(this);
                            };
                            it.meta.translateTimes = (function(){
                                for(var i=0,len=times.length;i<len-1;i++) {
                                    times[i] = (times[i+1] - times[i])/1000;
                                }
                                times[len-1] = (Date.now() - times[len-1])/1000;
                                return times;
                            })();
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