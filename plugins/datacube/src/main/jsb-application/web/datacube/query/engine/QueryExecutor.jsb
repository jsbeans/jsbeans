{
	$name: 'DataCube.Query.Engine.QueryExecutor',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.Engine.QueryProfiler',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.Views.QueryViewsBuilder',
		    'DataCube.Query.Iterators.DataProviderIterator',
		    'DataCube.Query.Engine.ItBuilder',

		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
        ],

        doProfile: true,

		$constructor: function(queryEngine, cubeOrDataProvider, dcQuery, params){
		    $this.query = JSB.cone($this.query);
			$this.qid = $this.query.$id = $this.query.$id || JSB.generateUid();
			$this.queryEngine = queryEngine;
		    $this.params = params;

		    $this.profiler = $this.doProfile ? new QueryProfiler() : null;
            $this.profiler && $this.profiler.start($this.qid, {
                query: $this.query,
                params: params
            });

		    if (cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube') {
		        $this.cube = cubeOrDataProvider;
		        $this.providers = $this.cube.getOrderedDataProviders();
		    } else {
		        $this.providers = [cubeOrDataProvider];
		        $this.profiler && $this.profiler.profile($this.qid, 'directProvider', $this.providers[0].getName());
		    }
		    $this.profiler && $this.profiler.profile($this.qid, 'providers', $this.providers.length);
		    
		    $this.contextQueries = QueryUtils.defineContextQueries($this.query);
		},

		execute: function(){
debugger;
		    try {
		        $this.profiler && $this.profiler.profile($this.qid, 'execute');

                $this._optimizeProviders();
                $this._prepareQuery();
                $this.profiler && $this.profiler.profile($this.qid, 'preparedQuery', $this.preparedQuery);

                $this._buildViews();
                $this.profiler && $this.profiler.profile($this.qid, 'views', $this.queryView.info());

                var itBuilder = new ItBuilder($this);
                var it = itBuilder.build();
                $this.profiler && $this.profiler.profile($this.qid, 'iterator', $this.queryView.info());
                return it;
            } catch(e) {
                $this.profiler && $this.profiler.failed($this.qid, e);
                throw e;
            } finally {
                itBuilder && itBuilder.destroy();
            }
		},

		destroy: function() {
            $this.profiler && $this.profiler.profile($this.qid, 'destroy', $this.queryView.info());
		    $this.profiler && $this.profiler.destroy();
		    for(var c in $this.contextQueryViews) {
		        $this.contextQueryViews[c].destroy();
		        delete $this.contextQueryViews[c];
		    }
		    $base();
		},

		getCubeOrDataProvider(): function(){
		    return $this.cube || $this.providers[0];
		},

		_prepareQuery: function() {
		    $this.preparedQuery = QueryTransformer.transform($this.query, $this.cube || $this.providers[0]);
            return $this.preparedQuery;
		},

		_buildViews: function(){
            try {
                var builder = new QueryViewsBuilder($this.query, $this.cube, $this.providers);
                $this.queryView = builder.build();
                $this.contextQueryViews = builder.getContextQueryViews();
            } finally {
                builder && builder.destroy();
            }
		},

//		_produceIterator: function() {
//		    var it = null;
//            if ($this.providers.length == 0) {
//                // empty iterator
//                it = {
//                    next: function(){
//                        return {};
//                    },
//                    close: function(){}
//                };
//            } else {
//                var providersGroups = $this._groupSameProviders();
//                if (providersGroups.length == 1) {
//                    it = new DataProviderIterator($this.providers, $this.queryEngine);
//                } else {
//                    it = new JsQueryIterator($this); // TODO
//                }
//            }
//            it.iterate($this.query, $this.params);
//
//		    $this.profiler && $this.profiler.profile($this.qid, 'iterator-created');
//		    return {
//		        next: function(){
//		            var next = it.next();
//		            return next;
//		        },
//		        close: function(){
//		            it.close();
//		            $this.profiler && $this.profiler.complete($this.qid);
//		        }
//		    };
//		},

        /** Собирает в коллекцию только провайдеры куба, использующиеся в запросе
        */
		_optimizeProviders: function(){
		    if (!$this.cube) {
		        return;
		    }
            var orderedProviders = $this.cube.getOrderedDataProviders();

		    // collect used providers by name and all used cube fields
		    var providers = {}; // id: {provider, cubeFields}
		    QueryUtils.walkCubeFields(
		        $this.query, /**includeSubQueries=*/true, this.cube,
		        function (field, context, query, binding){
                    for (var i in binding) {
                        var id = binding[i].provider.id;
                        var prov = providers[id] = providers[id] || {
                            provider: binding[i].provider,
                            cubeFields: {}
                        };
                        var hasOtherBinding = binding.length > 1;
                        prov.cubeFields[field] = hasOtherBinding;
                    }
                }
            );

		    /// NOTE в текущей версии все необходимые для пересечения провайдеры
		    /// должны использоваться в запросе - в будущем необходимо добавить
		    /// промежуточные провадеры, которые необходимы только для пересечения
		    /// используемых в запросе

            // filter redundant providers
            QueryUtils.removeRedundantBindingProviders(providers, $this.cube);

            // remove unused providers
            for(var i = 0; i < $this.providers.length; i++) {
                var provider = $this.providers[i];
                if (providers[provider.id]) {
                    providers[provider.id].matched = true;
                    $this.profiler && $this.profiler.profile($this.qid, 'usedProvider', provider.getName());
                } else {
                    $this.providers[i].splice(i--, 1);
                    $this.profiler && $this.profiler.profile($this.qid, 'removedProvider', provider.getName());
                }
            }

            for(var pid in providers) {
                if(!providers[pid].matched) {
                    throw new Error('QueryExecutor internal error: Unexpected DataProvider: ' + providers[pid].provider.getName());
                }
            }
		},
	}
}