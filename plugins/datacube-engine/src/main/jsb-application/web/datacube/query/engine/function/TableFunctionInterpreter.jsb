{
	$name: 'DataCube.Query.Engine.Function.TableFunctionInterpreter',
	$parent: 'DataCube.Query.Engine.LazyBaseInterpreter',

	$singleton: true,

	$server: {
		$require: [
		    'JSB.Store.Sql.SQLStore',
		    'DataCube.Query.Visitors.SQLLoopbackTranslatorVisitor',
		    'DataCube.Query.Engine.ClickHouse.ClickHouseLoopbackProvider',
		    'DataCube.Query.Engine.H2Interpreter.H2InterpreterLoopbackProvider',
		    'DataCube.Query.Extractors.ExtractUtils',
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

		    if (QueryUtils.queryHasBody(query, ['$offset', '$limit'])) {
		        return null;
		    }

		    var providers = queryTask.providers = queryTask.providers || QueryUtils.extractProviders(query, cube);
		    if (providers.length != 1) {
		        return null;
		    }

		    var provider = providers[0];
		    if (JSB.isInstanceOf(provider, config.provider)) {
		        $this._setQueryExtractedParams(query, params, provider);
		        var it = $this.produceLazyIterator(query, null, params, executor, provider);
		        if (it) {
		            return it;
		        }
		    }
            return null; // has no compatible provider
		},

		executeQuery: function(query, params, provider) {
            params = QueryUtils.copyParams(params, true);
		    var iterator = provider.executeQuery({params:params});
		    return iterator;
        },

        _setQueryExtractedParams: function(query, params, provider) {
		    var extractedParams = provider.extractParams();
            for(var param in extractedParams) {
                var desc = extractedParams[param];
                var name = !param.startsWith('${') ? '${' + param + '}' : param;
                if (desc.isLimit) {
                    if (query.hasOwnProperty('$limit')) {
                        params[name] = query.$limit;
                    }
                } else if (desc.isOffset) {
                    if (query.hasOwnProperty('$offset')) {
                        params[name] = query.$offset;
                    }
                }
            }
        },
	}
}