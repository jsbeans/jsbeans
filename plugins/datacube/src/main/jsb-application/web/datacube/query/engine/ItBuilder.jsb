{
	$name: 'DataCube.Query.Engine.ItBuilder',

	$server: {
		$require: [
		    'DataCube.Providers.SqlTableDataProvider',

		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(queryExecutor){
			$this.queryExecutor = queryExecutor;
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
		    var ictx = [];
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
                    if($this.tryQueryTranslateDB()) {
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
                    QueryUtils.assert(currentExecutionContext.query == query, 'Wrong execution context query: {}', currentExecutionContext.query.$context);
                    QueryUtils.assert(!currentExecutionContext.cursor, 'Cursor exist');

                    /// build query source cursor
                    if (!query.$from) {
                        /// from cube (leaf query)
                        currentExecutionContext.sourceCursor = $this._buildCubeCursor(currentExecutionContext);
                    } else if (query.$from && JSB.isEqual({}, query.$from)) {
                        /// from empty (return single object)
                        currentExecutionContext.sourceCursor = $this._buildEmptyCursor(currentExecutionContext);
                    } else if (query.$from) {
                        /// from view by name
//                        var sourceName = JSB.isString(query.$from) ? query.$from : query.$from.$context;
//                        QueryUtils.throwError(!!executionContexts[sourceName], 'Undefined view query context: {}', sourceName);
                        currentExecutionContext.sourceCursor = lastFromContext.cursor;
                    }

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
                    if (this.inFrom) {
                        lastFromContext = currentExecutionContext;
                    }
                    lastContext = currentExecutionContext;
                }
            );

            /// create iterator for root cursor
            return {
                next: function() {
                    lastContext.cursor.next.call(lastContext);
                    return lastContext.cursor.object;
                },
                close: function(){
                    lastContext.cursor.close();
                },
            };
		},

		_initContextFields: function(currentExecutionContext){
                currentExecutionContext.fields = {};
                QueryUtils.walkQueryFields(query, /**includeSubQueries=*/false, function (field, context, query){
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

		tryQueryTranslateDB: function(query, callback) {
            var providersGroups = $this._groupSameProviders();
            if (providersGroups.length == 1) {
                try {
                    var translator = TranslatorRegistry.newTranslator(
                            $this.queryExecutor.providers,
                            $this.queryExecutor.cube || $this.queryExecutor.queryEngine
                    );
                    var it = translator.translatedQueryIterator(query, $this.queryExecutor.params);
                    currentExecutionContext.cursor = $this._buildCursor(
                        function _next(){
                            return it.next();
                        },
                        function _reset(){
                            it && it.close();
                            it = translator.translatedQueryIterator(query, $this.queryExecutor.params);
                        },
                        function _close(){
                            it && it.close();
                        }
                    );
                    return true;
                } finally {
                    if(translator) translator.close();
                }
            }
		},

		_buildEmptyCursor: function(currentExecutionContext){
		    var c = -1;
		    var cursor = $this._buildCursor(
                function _next(){return c===-1?(c=0,{}):null;},
                function _reset(){c = -1},
                function _close(){},
                function _clone(){
                    return $this._buildEmptyCursor(currentExecutionContext);
                }
            );
            return cursor;
		},

		_buildCursor: function(next, reset close, clone){
		    var cursor = {
		        object:null,
		        next: next,
		        reset: reset,
		        close: close,
		        clone: clone,
		    };
		    return cursor;
		},

        /** Курсор, все инстансы которого используют общий буффер и используют единственный итератор
        */
		_buildCachedCursor: function(next, close){
            var fully = false;
		    var cache = {
		        values: [],
		        pos :-1,
		    };
		    var currentPos = -1;
		    var object = null;

            function _next(){
                currentPos++;
                if(cache.values[currentPos] !== undefined) {
                    object = cache.values[currentPos];
                } else {
                    object = cache.values[source.pos++] = next.call(this);
                }
                if (object == null) {
                    fully = true;
                    close.call(this); // close source
                }
                return object;
            }
            function _reset(){
                if (!fully) {
                    // complete and close
                    while(_next.call(this));
                }
                currentPos = -1;
                object = null;
            }
            function _close(){
                object = null;
                cachedValues = null;
                if (!fully) {
                    close.call(this);
                }
            }
            function _clone(){
                var cloned = $this._buildCachedCursor(next, close, null);
                cloned.cache = cache;
                return cloned;
            }

		    return $this._buildCursor(_next, _reset, _close, _clone);
		},

		_buildCubeCursor: function(currentExecutionContext) {
		    // TODO: this is test data - need build Cube/DataProvider cursor
		    var testValues = [
		        {a: 1, b: null},
		        {a: 1, b: 'a'},
		        {a: 2, b: 'a'},
		        {a: 3, b: 'b'},
		        {a: 4, b: 'c'},
		        {a: 5, b: 'b'},
		        {a: 5, b: 'b'},
		    ];
		    var cursor = $this._buildCachedCursor(
		        function(){
                    return testValues.pop();
                },
		        function(){
                }
		    );
		    return cursor;
		},

		_buildQueryCursor: function(currentExecutionContext) {
		    = $this._buildCursor(
                function _next(){
                    currentExecutionContext.sourceCursor().next();
                    var object = currentExecutionContext.sourceCursor().object;
                    return object;
                }, function _reset(){
                    currentExecutionContext.sourceCursor.reset();
                    for(var c in currentExecutionContext.child) {
                        currentExecutionContext.child[c].reset();
                    }
                }, function _close(){
                   currentExecutionContext.sourceCursor.close();
                    for(var c in currentExecutionContext.child) {
                        currentExecutionContext.child[c].close();
                    }
                }, function _clone(){
                    // TODO
                }
            );

            // prepare context
            currentExecutionContext.JSB = JSB;
            currentExecutionContext.MD5 = MD5;
            currentExecutionContext.QueryUtils = QueryUtils;
            currentExecutionContext._ = CursorFunctions._;
            currentExecutionContext.__ = RuntimeFunctions.__;

            currentExecutionContext.cursor = {
                next: function next(){
                    currentExecutionContext.QueryUtils.assert(this != currentExecutionContext, 'Wrong execution context');
                    return this.object = this.source.cursor.next.call(this.source);
                },
                close: function close(){
                    currentExecutionContext.QueryUtils.assert(this != currentExecutionContext, 'Wrong execution context');
                    return this.source.cursor.close.call(this.source);
                }
            };

            // build cursor functions
            currentExecutionContext._.query.call(currentExecutionContext);

		    return currentExecutionContext.cursor =
		        $this._buildCachedCursor(
		            currentExecutionContext.cursor.next,
		            currentExecutionContext.cursor.close
                );
		},
	}
}