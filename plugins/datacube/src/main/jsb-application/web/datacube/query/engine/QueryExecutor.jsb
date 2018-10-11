{
	$name: 'DataCube.Query.Engine.QueryExecutor',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.Engine.QueryTracer',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.Views.QueryViewsBuilder',
		    'DataCube.Query.Engine.Cursors.CursorBuilder',

		    'DataCube.Query.Translators.TranslatorRegistry',

		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

        traceEnabled: true,

		$constructor: function(queryEngine, cube, dcQuery, params){
		    $this.query = JSB.clone(dcQuery);
			$this.qid = $this.query.$id = $this.query.$id || JSB.generateUid();
			$this.queryEngine = queryEngine;
		    $this.params = params;

		    $this.tracer = $this.traceEnabled ? new QueryTracer($this.qid) : null;
            $this.tracer && $this.tracer.start({
                query: $this.query,
                params: params
            });

            $this.cube = cube;
            $this.tracer && $this.tracer.profile('cube query', $this.cube.id);
		},

		execute: function(){
		    try {
		        $this.tracer && $this.tracer.profile('execute query started');

                $this._prepareQuery();

                $this.providers = QueryUtils.extractProviders($this.query, $this.cube);
                $this.tracer && $this.tracer.profile('query providers extracted', Object.keys($this.providers).length);

		        $this.contextQueries = QueryUtils.indexContextQueries($this.query);
                $this.tracer && $this.tracer.profile('query prepared', $this.preparedQuery);

                $this.builder = new CursorBuilder($this, $this.query);
                var rootCursor = $this.builder.buildAnyCursor($this.query, $this.params, null);
                $this.tracer && $this.tracer.profile('root cursor created');
//                rootCursor.analyze();
                var it =  rootCursor.asIterator();
                var oldNext = it.next;
                it.next = function(){
                    try {
                        return oldNext.apply(this, arguments);
                    }catch(e){
                        $this.tracer && $this.tracer.failed('execute query next failed', e);
                        this.close();
                        throw e;
                    }
                };
                return it;

            } catch(e) {
                $this.tracer && $this.tracer.failed('execute query failed', e);
                throw e;
            }
		},

		destroy: function() {
		    $this.builder && $this.builder.destroy();
            $this.tracer  && $this.tracer.complete('builder destroyed');
		    $this.tracer  && $this.tracer.destroy();
		    $base();
		},

		tryTranslateQuery: function(query, params) {
		    var providers = QueryUtils.extractProviders(query, $this.cube);
		    var providersGroups = $this._groupSameProviders(providers);
            if (providers.length == 1 || providersGroups.length == 1) {
                if (TranslatorRegistry.hasTranslator(providers[0])) {
                    try {
                        var translator = TranslatorRegistry.newTranslator(
                                providers,
                                $this.cube
                        );
                        var it = translator.translatedQueryIterator(query, params);
                        if (it) {
                            return it;
                        }
                    } catch(e) {
                        if(translator) translator.close();
                        throw e;
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
//		    var jsbSqlTableDataProvider = JSB.get('DataCube.Providers.SqlTableDataProvider');
//		    if (jsbSqlTableDataProvider) {
//		        var SqlTableDataProvider = jsbSqlTableDataProvider.getClass();
//                // store key for SQL or unique for other
//                return provider instanceof SqlTableDataProvider
//                    ? provider.getJsb().$name + '/' + provider.getStore().getName()
//                    : provider.id;
//            }
//            return provider.id;
            return provider.getJsb().$name + '/' + provider.getStore().getName();
        },

//        _extractProviders: function(query){
//
//            if (query.$context == $this.query.$context) {
//                return $this.providers;
//            }
//
//            var allProvidersMap = {};
//            for(var i = 0; i < $this.providers.length; i++) {
//                var provider = $this.providers[i];
//                allProvidersMap[QueryUtils.getQueryProviderId(provider)] = provider;
//            }
//
//            var providers = [];
//            var providersMap = {};
//            QueryUtils.walkSubQueries(query, function(q){
//                if (q.$provider) {
//                    if(!providersMap[q.$provider]) {
//                        var provider = allProvidersMap[q.$provider];
//                        providersMap[q.$provider] = provider;
//                        providers.push(provider);
//                    }
//                }
//            });
//            return providers;
//        },

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
                        $this.cube,
                        function (c) {
                            return $this.contextQueries[c];
                        }
                );
            });

		},
	}
}