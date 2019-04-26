{
	$name: 'DataCube.Query.Engine.Function.FunctionEngine',
	$parent: 'DataCube.Query.Engine.LazyBaseEngine',

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
		    var providers = queryTask.providers = queryTask.providers || QueryUtils.extractProviders(query, cube);

		    if (providers.length != 1) {
		        return null;
		    }

		    var provider = providers[0];
		    if (JSB.isInstanceOf(provider.getStore(), config.store)) {
		        var it = $this.produceLazyIterator(query, null, params, executor, provider);
		        if (it) {
		            return it;
		        }
		    }
            return null; // has no compatible provider
		},

		executeQuery: function(translatedQuery, params, provider) {
		    var iterator = provider.executeQuery(params);
		    return iterator;
        },
	}
}