{
	$name: 'DataCube.Query.Engine.QueryExecutor',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.Engine.QueryProfiler',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.Views.QueryViewsBuilder',
		    'DataCube.Query.Engine.Cursors.CursorBuilder',

		    'DataCube.Providers.SqlTableDataProvider',

		    'DataCube.Query.Translators.TranslatorRegistry',

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

            $this.builder = new CursorBuilder($this);
		},

		execute: function(){
		    try {
		        $this.profiler && $this.profiler.profile('execute query started');

                $this._prepareQuery();
		        $this.contextQueries = QueryUtils.defineContextQueries($this.query);
                $this.profiler && $this.profiler.profile('query prepared', $this.preparedQuery);
debugger;

                var rootCursor = $this.builder.buildAnyCursor($this.query, $this.params, null);
                $this.profiler && $this.profiler.profile('root cursor created');
                rootCursor.analyze();
                var it =  rootCursor.asIterator();
                var oldNext = it.next;
                it.next = function(){
debugger;
                    try {
                        return oldNext.apply(this, arguments);
                    }catch(e){
                        $this.profiler && $this.profiler.failed('execute query next failed', e);
                        this.close();
                    }
                };
                return it;

            } catch(e) {
                $this.profiler && $this.profiler.failed('execute query failed', e);
                throw e;
            }
		},

		destroy: function() {
		    $this.builder.destroy();
            $this.profiler && $this.profiler.complete('builder destroyed');
		    $this.profiler && $this.profiler.destroy();
		    $base();
		},

		getCubeOrDataProvider: function(){
		    return $this.cube || $this.providers[0];
		},

		tryTranslateQuery: function(query, params) {
		    var providers = $this._extractProviders(query);
		    var providersGroups = $this._groupSameProviders(providers);
            if (providers.length == 1 || providersGroups.length == 1) {
                if (TranslatorRegistry.hasTranslator(providers[0])) {
                    try {
                        var translator = TranslatorRegistry.newTranslator(
                                providers,
                                $this.queryEngine
                        );
                        var it = translator.translatedQueryIterator(query, params);
                        return it;
                    } finally {
                        if(translator) translator.close();
                    }
                }
            }
            return null;
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

        _extractProviders: function(query){
            if (query.$context == $this.query.$context) {
                return $this.providers;
            }

            var allProvidersMap = {};
            for(var i = 0; i < $this.providers.length; i++) {
                var provider = $this.providers[i];
                allProvidersMap[provider.id] = provider;
            }

            var providers = [];
            var providersMap = {};
            QueryUtils.walkSubQueries(query, function(query){
                if (query.$provider) {
                    if(!providersMap[query.$provider]) {
                        var provider = allProvidersMap[query.$provider];
                        providersMap[query.$provider] = provider;
                        providers.push(provider);
                    }
                }
            });
            return providers;
        },

        /** Объединяет провайдеры в группы по типам
        */
		_groupSameProviders: function(providers){
		    var groupsMap = {/**key:[provider]*/}; //

            for(var i = 0; i < providers.length; i++) {
                var provider = providers[i];
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

		_initContextFields: function(ctx){
            ctx.fields = {};
            QueryUtils.walkQueryFields(ctx.query, /**includeSubQueries=*/false, function (field, context, query){
                var id = (context||query.$context) + '/' + field;
                ctx.fields[id] = ctx.fields[id] || {
                    id: id,
                    name: field,
                    context: context,
//                            isOutput: !!query.$select[field] || !query.$groupBy, /// если нет группировки - к выходным добавляются все входные поля
                    usages: 0,
                };
                ctx.fields[id].usages++;
                ctx.fields[id].type = QueryUtils.extractType(
                        field, query,
                        $this.getCubeOrDataProvider(),
                        function (c) {
                            return $this.contextQueries[c];
                        }
                );
            });

		},
	}
}