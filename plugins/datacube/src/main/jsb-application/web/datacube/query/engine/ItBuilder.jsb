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

		    'DataCube.Query.Engine.QueryBodyItBuilder',

		    'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5',
        ],

		$constructor: function(queryExecutor){
			$this.queryExecutor = queryExecutor;
			$this.profiler = queryExecutor.profiler;
			$this.qid = queryExecutor.qid;

			$this.ExecutionContext = function ExecutionContext(desc){
			    this.id = desc.id;
			    this.query = desc.query;
			    this.parent = desc.parent;
			    this.child = desc.child;
			    this.source = desc.source;
			    this.cursor = desc.cursor;
			    this.closed = false;

			    this.close = function(){
                    if (this.source) this.source.close();
                    if (this.child)  for(var c in this.child) this.child[c].close();
                    this.cursor.destroy();
                    this.closed = true;
                    $this.profiler && $this.profiler.profile($this.qid, 'context closed: ' + this.id);
			    };
			};
		},

        /** Build iterator: {next: function(){}, close: function(){}}
        */
		build: function(){
		    var parentStack = [];
		    var fullStack = [];
		    var cursors = {}; // by $context
		    var lastContext= null;
		    var lastFromContext = null;

debugger;
		    QueryUtils.walkQueries(
		        $this.queryExecutor.query, {},

		        /** Вход в запрос/подзапрос - предварительное построение курсоров */
		        function _enterQuery(query){
		            /// this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}

                    var ctx = new $this.ExecutionContext({
                        id: parentStack.length > 0
                                ? parentStack[parentStack.length - 1].id + '/' + query.$context
                                : query.$context,
                        query: query,
                    });

                    fullStack.push(ctx);
                    !this.inFrom && parentStack.push(ctx);

                    /// если курсор ранее был создан - в целях оптимизации его можно использовать повторно, а не создавать новый
                    if(cursors[query.$context]) {
                        ctx.cursor = cursors[query.$context].clone();
                    }

                    /// Если запрос целиком транслируется в БД, то создается курсор БД и на этом заканчиваем обходить текущий запрос
                    if($this._tryQueryTranslateDB(ctx)) {
                        $this.profiler && $this.profiler.profile($this.qid, 'DB cursor created at {}', ctx.id);
                        cursors[query.$context] = ctx.cursor;
                        lastContext = ctx;
                        if (this.inFrom) {
                            lastFromContext = ctx;
                        }
                        return false; // skip this query
                    };

                    $this._initContextFields(ctx);
                },

		        function _leaveQuery(query){
		            /// this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}
		            var ctx = fullStack.pop();
                    QueryUtils.assert(ctx.query.$context == query.$context, 'Wrong execution context query: {}', ctx.query.$context);
                    QueryUtils.assert(!ctx.cursor, 'Cursor exists: ' + ctx.id);

                    /// build query source
                    if (!query.$from) {
                        /// from cube (leaf query)
                        ctx.source = new $this.ExecutionContext({
                            id: ctx.id + '/' + 'cube',
                            cursor: $this._buildCubeCursorFor(ctx),
                        });
                    } else if (query.$from && JSB.isEqual({}, query.$from)) {
                        /// from empty (return single object)
                        ctx.source = new $this.ExecutionContext({
                            id: ctx.id + '/' + 'empty',
                            cursor: new EmptyCursor(ctx)
                        });
                    } else if (query.$from) {
                        /// from view by name
                        ctx.source = lastFromContext;
                    }
                    $this.profiler && $this.profiler.profile($this.qid, 'Source cursor created for {}', ctx.id);

                    /// defile parent context
                    if (query != $this.queryExecutor.query) {
                        ctx.parent = parentStack[parentStack.length-1];
                        QueryUtils.assert(!!ctx.parent, 'Parent execution context is undefined');
                    }

                    /// define child contexts
                    if (ctx.parent) {
                        ctx.parent.child = ctx.parent.child || {};
                        ctx.parent.child[ctx.context] = ctx;
                    }

                    if (cursors[query.$context]) {
                        /// use created early cursor for this query
                        ctx.cursor = cursors[query.$context].clone();
                    } else {
                        /// build query cursor for current execution context
                        cursors[query.$context] = $this._buildQueryCursor(ctx);
                    }

                    $this.profiler && $this.profiler.profile($this.qid, 'Query cursor created at {}', ctx.id);
                    if (this.inFrom) {
                        lastFromContext = ctx;
                    }
                    lastContext = ctx;
                }
            );

            var rootExecutionContext = lastContext;
            /// create iterator for root cursor
            $this.profiler && $this.profiler.profile($this.qid, 'main iterator created');
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
                            $this.queryExecutor.contextQueries);
                });

//                    for(var alias in query.$select) {
//                        ctx.fields[alias].$isDirectAlias = query.$select[alias] == alias ||
//                                query.$select[alias].$field == alias && (
//                                    !query.$select[alias].$context ||
//                                    query.$select[alias].$context == query.$context
//                                );
//                    }

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
                    ctx.cursor = new IteratorCursor(ctx, function(){
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


		_buildCubeCursorFor: function(ctx) {
debugger;
		    function anyView(view) {
		        if(view instanceof CubeView) {
                    var subIt = anyView(view.getView());
                    var fields = view.listFields();
                    return {
                        next: function(){
                            var inp = subIt.next();
                            if (inp == null) return null;
                            var out = {};
                            for(var i = 0; i < fields.length++; i++) {
                                var field = fields[i];
                                var desc = view.getField(field);
                                out[field] = inp[field]; // TODO map field name
                            }
                            return out;
                        },
                        close: function(){
                            subIt.close();
                        }
                    };
                } else if(view instanceof UnionsView) {

                } else if(view instanceof JoinView) {

                } else if(view instanceof DataProviderView) {
                    QueryUtils.assert(
                        view.getProvider().getJsb().$name == 'DataCube.Providers.InMemoryDataProvider' ||
                        view.getProvider().getJsb().$name == 'DataCube.Providers.JsonFileDataProvider',
                        'Unsupported data provider: ' + view.getProvider().getJsb());

                    var fields = view.listFields();
                    var rows = view.getProvider().find();
                    var pos = -1;
                    return {
                        next: function(){
                            var inp = rows[++pos];
                            if (inp == null) return null;
                            var out = {};
                            for(var i = 0; i < fields.length++; i++) {
                                var field = fields[i];
                                out[field] = inp[field];
                            }
                            return out;
                        },
                        close: function(){
                            rows = [];
                        }
                    };
                } else {
                    throw new Error('Unexpected view type ' + view.getJsb().$name);
                }
		    }

            // TODO: optimize cube cursor for query - filtered joins by used fields
		    var cursor = new IteratorCursor(ctx, function() {
		        return anyView($this.queryExecutor.cubeView);
		    });

		    if ($this.useCache) {
		        return new CachedCursor(cursor);
		    } else {
                return cursor;
		    }
		},

		_buildQueryCursor: function(ctx) {
		    ctx.params = $this.queryExecutor.params;
            ctx.cursor = new QueryCursor(ctx);
            if ($this.useCache) {
                return ctx.cursor = new CachedCursor(ctx.cursor);
            } else {
                return ctx.cursor;

            }
		},
	}
}