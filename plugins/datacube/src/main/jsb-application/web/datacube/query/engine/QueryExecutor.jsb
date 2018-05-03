{
	$name: 'DataCube.Query.Engine.QueryExecutor',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.Engine.QueryProfiler',
		    'DataCube.Query.Transforms.QueryTransformer',
//		    'DataCube.Query.Views.CubeViewsBuilder',
		    'DataCube.Query.Views.QueryViewsBuilder',
		    'DataCube.Query.Engine.ItBuilder',

		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
        ],

        doProfile: true,

		$constructor: function(queryEngine, cubeOrDataProvider, dcQuery, params){
		    $this.query = JSB.clone(dcQuery);
			$this.qid = $this.query.$id = $this.query.$id || JSB.generateUid();
			$this.queryEngine = queryEngine;
		    $this.params = params;

		    $this.profiler = $this.doProfile ? new QueryProfiler($this.qid) : null;
            $this.profiler && $this.profiler.start({
                query: $this.query,
                params: params
            });

            if (cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube') {
                $this.cube = cubeOrDataProvider;
                $this.providers = QueryUtils.extractQueryProviders(dcQuery, $this.cube);
                $this.profiler && $this.profiler.profile('cube query', $this.cube.id);
            } else {
                $this.providers = [cubeOrDataProvider];
            }

		    $this.contextQueries = QueryUtils.defineContextQueries($this.query);
		},

		execute: function(){
		    try {
		        $this.profiler && $this.profiler.profile('execute query started');

//                $this._optimizeProviders();

                $this._prepareQuery();

                $this.profiler && $this.profiler.profile('query prepared', $this.preparedQuery);

                var itBuilder = new ItBuilder($this);
                var it = itBuilder.build();
                $this.profiler && $this.profiler.profile('built iterator', it);

                return it;

            } catch(e) {
                $this.profiler && $this.profiler.failed('execute query failed', e);
                throw e;
            } finally {
                itBuilder && itBuilder.destroy();
            }
		},

		destroy: function() {
            $this.profiler && $this.profiler.complete('builder destroyed');
		    $this.profiler && $this.profiler.destroy();
		    $base();
		},

		getCubeOrDataProvider: function(){
		    return $this.cube || $this.providers[0];
		},

		_prepareQuery: function() {
		    $this.originalQuery = $this.query;
		    return $this.query = $this.preparedQuery = QueryTransformer.transform($this.query, $this.cube || $this.providers[0]);
		},


//        /** Собирает в коллекцию только провайдеры куба, использующиеся в запросе
//        */
//		_optimizeProviders: function(){
//            // optimize providers only for cube
//		    if (!$this.cube) {
//		        return;
//		    }
//
//            $this.profiler && $this.profiler.profile('ordered providers', $this.providers);
//
//		    // collect used providers by name and all used cube fields
//		    var providers = {}; // id: {provider, cubeFields}
//		    QueryUtils.walkCubeFields(
//		        $this.query, /**includeSubQueries=*/true, this.cube,
//		        function (field, context, query, binding){
//                    for (var i in binding) {
//                        var id = binding[i].provider.id;
//                        var prov = providers[id] = providers[id] || {
//                            provider: binding[i].provider,
//                            cubeFields: {}
//                        };
//                        var hasOtherBinding = binding.length > 1;
//                        prov.cubeFields[field] = hasOtherBinding;
//                    }
//                }
//            );
//
//		    /// NOTE в текущей версии все необходимые для пересечения провайдеры
//		    /// должны использоваться в запросе - в будущем необходимо добавить
//		    /// промежуточные провадеры, которые необходимы только для пересечения
//		    /// используемых в запросе
//
//            // filter redundant providers
//            QueryUtils.removeRedundantBindingProviders(providers, $this.cube);
//
//            // remove unused providers
//            for(var i = 0; i < $this.providers.length; i++) {
//                var provider = $this.providers[i];
//                if (providers[provider.id]) {
//                    providers[provider.id].matched = true;
//                } else {
//                    $this.providers.splice(i--, 1);
//                    $this.profiler && $this.profiler.profile('data provider removed', provider.getName());
//                }
//            }
//            $this.profiler && $this.profiler.profile('optimized data providers', providers);
//
//            for(var pid in providers) {
//                if(!providers[pid].matched) {
//                    throw new Error('QueryExecutor internal error: Unexpected DataProvider: ' + providers[pid].provider.getName());
//                }
//            }
//		},
	}
}