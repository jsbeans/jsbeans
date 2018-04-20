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
		    'DataCube.Query.Engine.Cursors.PipeCursor',

		    'DataCube.Query.Engine.QueryBodyItBuilder',
		    'DataCube.Query.Engine.RuntimeFunctions',

		    'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5',
        ],

		$constructor: function(queryExecutor){
			$this.queryExecutor = queryExecutor;
			$this.profiler = queryExecutor.profiler;
			$this.qid = queryExecutor.qid;
		},

        /** Build iterator: {next: function(){}, close: function(){}}
        */
		build: function(){
		    var lastContext= null;
		    var lastFromContext = null;
		    var executionStack = [];
		    var fullStack = [];
		    var executionContexts = {};
		    var cursors = {};
		    var ictx = {};
debugger;
		    QueryUtils.walkQueries(
		        $this.queryExecutor.query, {},

		        /** Вход в запрос/подзапрос - предварительное построение курсоров */
		        function _enterQuery(query){
		            /// this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}

                    var currentExecutionContext = JSB.clone(this);
                    currentExecutionContext.id = query.$context + '/' + (ictx[query.$context] = (ictx[query.$context]||0)+1);
                    executionContexts[currentExecutionContext.id] = currentExecutionContext;
                    fullStack.push(currentExecutionContext);
                    if (!this.inFrom) {
                        executionStack.push(currentExecutionContext);
                    }

                    $this._initContextFields(currentExecutionContext);

                    /// если курсор ранее был создан - в целях оптимизации его можно использовать повторно, а не создавать новый
                    if(cursors[query.$context]) {
                        currentExecutionContext.cursor = cursors[query.$context].clone();
                    }
                    /// Если запрос целиком транслируется в БД, то создается курсор БД и на этом заканчиваем
                    if($this._tryQueryTranslateDB(currentExecutionContext)) {
                        $this.profiler && $this.profiler.profile($this.qid, 'DB cursor created at {}', currentExecutionContext.id);
                        cursors[query.$context] = currentExecutionContext.cursor;
                        if (this.inFrom) {
                            lastFromContext = currentExecutionContext;
                        }
                        lastContext = currentExecutionContext;
                        return false; /// skip query
                    };
                },

		        function _leaveQuery(query){
		            /// this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}
		            var currentExecutionContext = fullStack.pop();
                    QueryUtils.assert(currentExecutionContext.query.$context == query.$context, 'Wrong execution context query: {}', currentExecutionContext.query.$context);
                    QueryUtils.assert(!currentExecutionContext.cursor, 'Cursor exist');

                    /// build query source
                    if (!query.$from) {
                        /// from cube (leaf query)
                        currentExecutionContext.source = {
                            cursor: $this._buildCubeCursor(currentExecutionContext)
                        };
                    } else if (query.$from && JSB.isEqual({}, query.$from)) {
                        /// from empty (return single object)
                        currentExecutionContext.source = {
                            cursor: new EmptyCursor(currentExecutionContext)
                        };
                    } else if (query.$from) {
                        /// from view by name
                        currentExecutionContext.source = lastFromContext;
                    }
                    $this.profiler && $this.profiler.profile($this.qid, 'Source cursor created for {}', currentExecutionContext.id);

//                    /// defile parent context
                    if (query != $this.queryExecutor.query) {
                        currentExecutionContext.parent = executionStack[executionStack.length-1];
                        QueryUtils.assert(!!currentExecutionContext.parent, 'Parent execution context is undefined');
                    }

                    /// define child contexts
                    if (currentExecutionContext.parent) {
                        currentExecutionContext.parent.child = currentExecutionContext.parent.child || {};
                        currentExecutionContext.parent.child[currentExecutionContext.context] = currentExecutionContext;
                    }

                    /// get created early cursor
                    if (cursors[query.$context]) {
                        currentExecutionContext.cursor = cursors[query.$context].clone();
                    }

                    /// build query cursor is not built early
                    cursors[query.$context] = $this._buildQueryCursor(currentExecutionContext);
                    $this.profiler && $this.profiler.profile($this.qid, 'Query cursor created at {}', currentExecutionContext.id);
                    if (this.inFrom) {
                        lastFromContext = currentExecutionContext;
                    }
                    lastContext = currentExecutionContext;
                }
            );

            /// create iterator for root cursor
            $this.profiler && $this.profiler.profile($this.qid, 'main iterator created');
            return {
                next: function() {
                    lastContext.cursor.next.call(lastContext);
                    return lastContext.cursor.object;
                },
                close: function(){
                    lastContext.cursor.close.call(lastContext);
                },
            };
		},

		_initContextFields: function(currentExecutionContext){
                currentExecutionContext.fields = {};
                QueryUtils.walkQueryFields(currentExecutionContext.query, /**includeSubQueries=*/false, function (field, context, query){
                    currentExecutionContext.fields[field] = currentExecutionContext.fields[field] || {
                        name: field,
                        context: context,
//                            isOutput: !!query.$select[field] || !query.$groupBy, /// если нет группировки - к выходным добавляются все входные поля
                        usages: 0,
                    };
                    currentExecutionContext.fields[field].usages++;
                    currentExecutionContext.type = QueryUtils.extractType(
                            field, query,
                            $this.queryExecutor.getCubeOrDataProvider(),
                            $this.queryExecutor.contextQueries);
                });

//                    for(var alias in query.$select) {
//                        currentExecutionContext.fields[alias].$isDirectAlias = query.$select[alias] == alias ||
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

		_tryQueryTranslateDB: function(currentExecutionContext) {
		    var providersGroups = $this._groupSameProviders();
            if (providersGroups.length == 1) {
                if (TranslatorRegistry.hasTranslator($this.queryExecutor.providers)) {
                    currentExecutionContext.cursor = new IteratorCursor(currentExecutionContext, function(){
                        try {
                            var translator = TranslatorRegistry.newTranslator(
                                    $this.queryExecutor.providers,
                                    $this.queryExecutor.cube || $this.queryExecutor.queryEngine
                            );
                            return translator.translatedQueryIterator(currentExecutionContext.query, $this.queryExecutor.params);
                        } finally {
                            if(translator) translator.close();
                        }
                    });
                    return true;
                }
            }
		},


		_buildCubeCursor: function(currentExecutionContext) {
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
		    var cursor = new IteratorCursor(currentExecutionContext, function() {
		        return anyView($this.queryExecutor.cubeView);
		    });

		    if ($this.useCache) {
		        return new CachedCursor(cursor);
		    } else {
                return cursor;
		    }
		},

		_buildQueryCursor: function(currentExecutionContext) {
            // prepare context
            currentExecutionContext.JSB = JSB;
            currentExecutionContext.MD5 = MD5;
            currentExecutionContext.QueryUtils = QueryUtils;
            currentExecutionContext.EmptyCursor = EmptyCursor;
            currentExecutionContext.CachedCursor = CachedCursor;
            currentExecutionContext.PipeCursor = PipeCursor;
            currentExecutionContext.IteratorCursor = IteratorCursor;
            currentExecutionContext.__ = RuntimeFunctions.__;

debugger;
            currentExecutionContext.cursor = new IteratorCursor(currentExecutionContext, function(){
                try {
                    var builder = new QueryBodyItBuilder(currentExecutionContext);
                    builder.query();
                    return builder.it;
                } finally {
                    builder && builder.destroy();
                }
            });

            CursorFunctions._.query.call(currentExecutionContext);

            if ($this.useCache) {
                return currentExecutionContext.cursor = new CachedCursor(currentExecutionContext.cursor);
            } else {
                return currentExecutionContext.cursor;

            }
		},
	}
}