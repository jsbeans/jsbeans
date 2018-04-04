{
	$name: 'DataCube.Query.Engine.QueryExecutor',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.Engine.QueryProfiler',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.Views.QueryViewsBuilder',
		    'DataCube.Providers.SqlTableDataProvider',
		    'DataCube.Query.Iterators.DataProviderIterator',
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(queryEngine, cubeOrDataProvider, dcQuery, params){
			$this.qid = dcQuery.$id = dcQuery.$id || JSB.generateUid();
			$this.queryEngine = queryEngine;
		    $this.dcQuery = dcQuery;
		    $this.params = params;

		    $this.profiler = new QueryProfiler();
            $this.profiler.start($this.qid, {
                dcQuery: dcQuery,
                params: params
            });

		    if (cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube') {
		        $this.cube = cubeOrDataProvider;
		        $this.providers = $this.cube.getOrderedDataProviders();
		    } else {
		        $this.providers = [cubeOrDataProvider];
		        $this.profiler.profile($this.qid, 'directProvider', $this.providers[0].getName());
		    }
		    $this.profiler.profile($this.qid, 'providers', $this.providers.length);
		},

		execute: function(){
debugger;
		    try {
		        $this.profiler.profile($this.qid, 'execute');

                $this._optimizeProviders();
                $this._prepareQuery();
                $this.profiler.profile($this.qid, 'preparedQuery', $this.preparedQuery);

                $this._buildViews();
                $this.profiler.profile($this.qid, 'views', $this.queryView.info());

                var it = $this._produceIterator();
                return it;
            } catch(e) {
                $this.profiler.failed($this.qid, e);
                throw e;
            }
		},

		destroy: function(){
		    $this.profiler.destroy();
		    $base();
		},

		_prepareQuery: function() {
		    var query = JSB.merge(true, {}, $this.dcQuery);
		    $this.preparedQuery = QueryTransformer.transform(query, $this.cube || $this.providers[0]);
            return $this.preparedQuery;
		},

		_buildViews: function(){
            try {
                var builder = new QueryViewsBuilder($this.dcQuery, $this.cube, $this.providers);
                $this.queryView = builder.build();
                $this.contextQueryViews = builder.getContextQueryViews();
            } finally {
                builder && builder.destroy();
            }
		},

		_produceIterator: function() {
		    var it = null;
            if ($this.providers.length == 0) {
                // empty iterator
                it = {
                    next: function(){
                        return {};
                    },
                    close: function(){}
                };
            } else {
                var providersGroups = $this._groupSameProviders();
                if (providersGroups.length == 1) {
                    it = new DataProviderIterator($this.providers, $this.queryEngine);
                } else {
                    it = new JsQueryIterator($this); // TODO
                }
            }
            it.iterate($this.dcQuery, $this.params);

		    $this.profiler.profile($this.qid, 'iterator-created');
		    return {
		        next: function(){
		            var next = it.next();
		            return next;
		        },
		        close: function(){
		            it.close();
		            $this.profiler.complete($this.qid);
		        }
		    };
		},

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
		        $this.dcQuery, /**includeSubQueries=*/true, this.cube,
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
                    $this.profiler.profile($this.qid, 'usedProvider', provider.getName());
                } else {
                    $this.providers[i].splice(i--, 1);
                    $this.profiler.profile($this.qid, 'removedProvider', provider.getName());
                }
            }

            for(var pid in providers) {
                if(!providers[pid].matched) {
                    throw new Error('QueryExecutor internal error: Unexpected DataProvider: ' + providers[pid].provider.getName());
                }
            }
		},

		_getProviderGroupKey: function (provider) {
		    // store key for SQL or unique for other
            return provider instanceof SqlTableDataProvider
                ? provider.getJsb().$name + '/' + provider.getStore().getName()
                : provider.id;
        },

        /** Объединяет провайдеры в группы по типам
        */
		_groupSameProviders: function(){
		    var groupsMap = {/**key:[provider]*/}; //

            for(var i = 0; i < $this.providers.length; i++) {
                var provider = $this.providers[i];
                var key = $this._getProviderGroupKey(provider);
                groupsMap[key] = groupsMap[key] || [];
                groupsMap[key].push(provider);
            }
		    var groups = []; // [[]]
		    for (var k in groupsMap) if (groupsMap.hasOwnProperty(k)) {
		        groups.push(groupsMap[k]);
		    }
		    return groups;
		},
	}
}