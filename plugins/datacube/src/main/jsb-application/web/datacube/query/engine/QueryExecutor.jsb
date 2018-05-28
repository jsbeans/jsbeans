{
	$name: 'DataCube.Query.Engine.QueryExecutor',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.Engine.QueryProfiler',
		    'DataCube.Query.Transforms.QueryTransformer',
//		    'DataCube.Query.Views.CubeViewsBuilder',
		    'DataCube.Query.Views.QueryViewsBuilder',
//		    'DataCube.Query.Engine.ItBuilder',
		    'DataCube.Query.Engine.Cursors.CursorBuilder',

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
		},

		execute: function(){
		    try {
		        $this.profiler && $this.profiler.profile('execute query started');

//                $this._optimizeProviders();

                $this._prepareQuery();
		        $this.contextQueries = QueryUtils.defineContextQueries($this.query);

                $this.profiler && $this.profiler.profile('query prepared', $this.preparedQuery);

                var builder = new CursorBuilder($this);
                var it = builder.build().asIterator();
                var oldClose = it.close;
                it.close = function(){
                    oldClose.call(this);
                    builder.destroy();
                };
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

		_createTranslator: function(providers) {
            try {
                var translator = TranslatorRegistry.newTranslator(providers, $this.cube || $this.queryEngine);
                return translator.translatedQueryIterator(query, $this.params);
            } finally {
                if(translator) translator.close();
            }
		},

		tryTranslateQuery: function(query) {
		    var providersGroups = $this._groupSameProviders();
            if (providersGroups.length == 1) {
                if (TranslatorRegistry.hasTranslator($this.providers)) {
                    try {
                        var translator = TranslatorRegistry.newTranslator(
                                $this.providers,
                                $this.cube || $this.queryEngine
                        );
                        var it = translator.translatedQueryIterator(query, $this.params);
                        return it;
                    } finally {
                        if(translator) translator.close();
                    }
                }
            }
            return null;
		},
	}
}