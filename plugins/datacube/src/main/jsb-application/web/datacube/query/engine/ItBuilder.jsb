{
	$name: 'DataCube.Query.Engine.ItBuilder',

	$server: {
		$require: [
		    'DataCube.Providers.SqlTableDataProvider',

		    'DataCube.Query.Translators.TranslatorRegistry',

		    'DataCube.Query.Views.CubeView',
		    'DataCube.Query.Views.DataProviderView',
		    'DataCube.Query.Views.JoinView',
		    'DataCube.Query.Views.UnionsView',

		    'DataCube.Query.Engine.Cursors.EmptyCursor',
		    'DataCube.Query.Engine.Cursors.CachedCursor',
		    'DataCube.Query.Engine.Cursors.IteratorCursor',
		    'DataCube.Query.Engine.Cursors.QueryCursor',
		    'DataCube.Query.Engine.Cursors.PipeCursor',
		    'DataCube.Query.Engine.Cursors.UnionsCursor',
		    'DataCube.Query.Engine.Cursors.JoinCursor',

		    'DataCube.Query.Engine.RuntimeFunctions',

		    'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5',

            'java:java.util.HashMap'
        ],

		$constructor: function(queryExecutor){
			$this.queryExecutor = queryExecutor;
			$this.profiler = queryExecutor.profiler;
			$this.qid = queryExecutor.qid;
			$this.translateOnlyProviders = /*true; //*/Config.has('datacube.queryengine.translateOnlyProviders') && Config.get('datacube.queryengine.translateOnlyProviders');

			$this.ExecutionContext = function ExecutionContext(desc){
			    JSB.merge(this, desc);
			    this.closed = false;


			    this.close = function(){
                    if(this.closed) return;
                    this.closed = true;
                    if (this.source) this.source.close();
                    if (this.nested)  for(var c = 0; c < this.nested.length; c++) this.nested[c].close();
                    if (this.child)   for(var c in this.child) this.child[c].close();
                    this.cursor.destroy();
                    $this.profiler && $this.profiler.profile('Context closed: {}', this.id);
			    };
            };
		},

        /** Build root iterator: {next: function(){}, close: function(){}}
        */
		build: function(){
		    var parentStack = [];
		    var lookupStack = [];
		    var backStack = [];
//		    var cursors = {}; // by $context
            var rootExecutionContext = null;
		    var lastFromSource = null;

		    function initializeQueryExecutionContext(query){
                var ctx = new $this.ExecutionContext({
                    id: parentStack.length > 0
                            ? parentStack[parentStack.length - 1].id + '/' + query.$context
                            : query.$context,

                    query: query,
                    params: $this.queryExecutor.params,

                    root: rootExecutionContext
                            ? rootExecutionContext
                            : (rootExecutionContext = ctx, null),
                    parent: parentStack[parentStack.length-1],
                    parents: parentStack.slice(),
                    path: parentStack.slice(),
                });
                if (rootExecutionContext) {
                    ctx.root = rootExecutionContext;
                } else {
                    ctx.root = rootExecutionContext = ctx;
                }
                $this.profiler && $this.profiler.profile( 'Execution context created: {}', ctx.id);

                /// register child
                if (ctx.parent) {
                    ctx.parent.child = ctx.parent.child || {};
                    ctx.parent.child[ctx.context] = ctx;
                }

                $this._initContextFields(ctx);

                /// store context

                if (this.inFrom) {
                    parentStack.push(ctx);
                }
                $this.profiler && $this.profiler.profile( 'Execution context initialized: {} <- {} ', ctx.id, ctx.parent?ctx.parent.id:null);
                return ctx;
		    }

debugger;
		    QueryUtils.walkQueries(
		        $this.queryExecutor.query, {},

		        /** Вход в запрос/подзапрос - предварительное построение курсоров */
		        function _enterQuery(query){
                    $this.profiler && $this.profiler.profile( 'Enter query context {}', query.$context);
		            /// this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}
		            var ctx = initializeQueryExecutionContext.call(this, query);

                    /// try translate whole query as-is
                    if (
                        (!$this.translateOnlyProviders || query.$provider)
                        && $this._tryQueryTranslateDB(ctx)
                    ) {
                        $this.profiler && $this.profiler.profile( 'DB cursor created at {}', ctx.id);
//                        cursors[query.$context] = ctx.cursor;
                        return false; // end for this query
                    };

                    lookupStack.push(ctx);
                },

		        function _leaveQuery(query){
		            $this.profiler && $this.profiler.profile( 'Leave query context {}', query.$context);
		            /// this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}
		            var ctx = lookupStack.pop();
                    QueryUtils.assert(ctx.query.$context == query.$context, 'Wrong execution context query: {}', ctx.query.$context);

                    /// define execution context source with cursor
                    if (query.$from) {
                        if (JSB.isEqual(query.$from, {})) {
                            /// from empty (return single object)
                            ctx.source = new $this.ExecutionContext({
                                id: ctx.id + '/' + 'empty',
                            });
                            ctx.source.cursor = new EmptyCursor();
                        } else if (query.$from.$context || JSB.isString(query.$from)) {
                            /// stored source
                            ctx.source = lastFromSource;
                        }
                        QueryUtils.throwError(ctx.source, 'Source is undefined at {}', ctx.id);
                    }


                    if(!ctx.$cursor) {
                        function createCursor(q) {
                            ctx.cursor = cursors[q.$context].clone();
                            $this.profiler && $this.profiler.profile('Union source cursor is undefined at {}', ctx.id);
                            return ctx.cursor;
                        }
                        if (query.$union) {
                            $this.profiler && $this.profiler.profile('Create union cursor at {}', ctx.id);
                            ctx.cursor = cursors[query.$context] = new UnionsCursor(query.$union, createCursor);
                        } else if (query.$join) {
                            $this.profiler && $this.profiler.profile('Create join cursor at {}', ctx.id);
                            ctx.cursor = cursors[query.$context] = new JoinCursor(
                                    query.$join.$filter, query.$join.$joinType
                                    createCursor(query.$join.$left),
                                    createCursor
                            );
                            $this.profiler && $this.profiler.profile('Union cursor created at {}', ctx.id)
                        }
                        ctx.cursor = cursors[query.$context] = $this._buildQueryCursor(ctx);
                    }

                    QueryUtils.throwError(ctx.cursor, 'Context cursor is undefined at {}', ctx.id);

                    /// store as source
                    if (this.inFrom) {
                        lastFromSource = ctx;
                    }

                    // define nested store back stack
                    ctx.nested = backStack.slice(); // TODO exclude transitive contexts
                    backStack.push(ctx);
                }
            );
            /// create iterator for root cursor
            $this.profiler && $this.profiler.profile('root iterator created');
            return {
                next: function() {
                    return rootExecutionContext.cursor.next();
                },
                close: function(){
                    rootExecutionContext.close();
                },
            };
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
                        $this.queryExecutor.getCubeOrDataProvider(),
                        function (c) {
                            return $this.queryExecutor.contextQueries[c];
                        }
                );
            });

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

            for(var i = 0; i < $this.queryExecutor.providers.length; i++) {
                var provider = $this.queryExecutor.providers[i];
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
                var translator = TranslatorRegistry.newTranslator(providers, $this.queryExecutor.cube || $this.queryExecutor.queryEngine);
                return translator.translatedQueryIterator(query, $this.queryExecutor.params);
            } finally {
                if(translator) translator.close();
            }
		},

		_tryQueryTranslateDB: function(ctx) {
		    var providersGroups = $this._groupSameProviders();
            if (providersGroups.length == 1) {
                if (TranslatorRegistry.hasTranslator($this.queryExecutor.providers)) {
                    ctx.cursor = new IteratorCursor(function(){
                        try {
                            var translator = TranslatorRegistry.newTranslator(
                                    $this.queryExecutor.providers,
                                    $this.queryExecutor.cube || $this.queryExecutor.queryEngine
                            );
                            return translator.translatedQueryIterator(ctx.query, $this.queryExecutor.params);
                        } finally {
                            if(translator) translator.close();
                        }
                    });
                    return true;
                }
            }
		},

//		buildCubeCursorFor: function(ctx) {
//            function createCursor(from) {
//                if (from.$union) {
//                    return new UnionsCursor(ctx, from.$union, createCursor);
//                } else if (from.$join) {
//                    return new JoinCursor(
//                            ctx, from.$join.on,
//                            createCursor(from.$join.$left),
//                            function (query) {
//                                return createCursor(JSB.merge(query||{}, from.$join.$right));
//                            }
//                    );
//                } else if (from.$provider) {
//                    var providerContext = $this.ExecutionContext({
//                        id: ctx.id + '/' + from.$provider,
//                        query: from,
//                        params: from.$params
//                    });
//
//                    $this._tryQueryTranslateDB(providerContext) || QueryUtils.throwError(failse, 'Cannot translate: {}', JSON.stringify(from));
//                    $this.profiler && $this.profiler.profile('DB cursor created at {}', ctx.id);
//
//                    var baseClose = providerContext.cursor.close;
//                    providerContext.cursor.close = function(){
//                        if (providerContext.closed) return;
//                        providerContext.close();
//                        baseClose.call(this);
//                    };
//                    return providerContext.cursor;
//                } else {
//                    QueryUtils.throwError(false, "Unexpected source in $from: {}", JSON.stringify(from));
//                }
//            }
//
//            var cubeCursor = createCursor(ctx.query.$from);
//		},

		_buildQueryCursor: function(ctx) {
		    ctx.JSB = JSB;
		    ctx.Common = RuntimeFunctions.Common;
		    ctx.Aggregate = RuntimeFunctions.Aggregate;
		    ctx.Operators = RuntimeFunctions.Operators;
		    ctx.HashMap = HashMap;

            ctx.cursor = new QueryCursor(ctx.query);
            $this.profiler && $this.profiler.profile( 'Query cursor created at {}', ctx.id);
            if ($this.useCache) {
                return ctx.cursor = new CachedCursor(ctx.cursor);
            } else {
                return ctx.cursor;
            }
		},
	}
}