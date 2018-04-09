{
	$name: 'DataCube.Query.Engine.ItBuilder',

	$server: {
		$require: [
		    'DataCube.Query.Translators.TranslatorRegistry',
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(queryExecutor){
			$this.queryExecutor = queryExecutor;
		},

        /** Build {next: function(){}, close: function(){}}
        */
		build: function(){
		    var lastCursor = null;
//		    var stack = [];
		    var executionStack = [];
		    var executionContexts = {};

		    QueryUtils.walkAll(
		        $this.queryExecutor.query, {},

		        /** Вход в запрос/подзапрос - предварительное построение курсоров */
		        function visitQuery(query){
		            // this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}

                    var currentExecutionContext = executionContexts[query.$context] = JSB.clone(this);
                    executionStack.push(currentExecutionContext);

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

//                /** Вход в выражение, которое возвращает:
//                 * - значение или
//                 * - итератор с одним (=значение) или
//                 * - нескольмими значениями (должно быть обязательно внутри аггрегатора
//                 */
//                function enterExpression(name) {
//                    var currentExecutionContext = JSB.merge({
//                            isExpression: true,
//                            name: name,
//                        }, this);
//
//                    stack.push(currentExecutionContext);
//                },
//
//                function leaveExpression(name) {
//                    var currentExecutionContext = executionStack[queryStack.length -1];
//                    var currentExecutionContext = stack.pop();
//                    QueryUtils.assert(currentExecutionContext.name != name, 'Wrong stack expression value');
//
//                    // build currentExecutionContext.cursor
//                },
//
//                function declareAlias(alias) {
//                    var currentExecutionContext = executionStack[queryStack.length -1];
//                    var currentExecutionContext = stack[queryStack.length -1]; // alias value
//
//                },

		        function leaveQuery(query){
		            // this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}
		            var currentExecutionContext = executionStack.pop();
                    QueryUtils.assert(currentExecutionContext.query != query, 'Wrong execution context query: ' + currentExecutionContext.query.$contect);

                    /// build query source cursor
                    if (!query.$from) {
                        /// from cube
                        currentExecutionContext.sourceCursor = $this._buildCubeCursor(currentExecutionContext);
                    } else if (query.$from && JSB.isEqual({}, query.$from)){
                        /// from empty (single empty object)
                        currentExecutionContext.sourceCursor = $this._buildEmptyCursor(currentExecutionContext);
                    } else if (query.$from){
                        /// from view by name
                        QueryUtils.throwError(executionContexts[query.$from], 'Undefined view query context: ' + query.$from);
                        var sourceName = JSB.isString(query.$from) ? query.$from : query.$from.$context;
                        currentExecutionContext.sourceCursor = executionContexts[sourceName].cursor;
                    }

                    /// defile parent context
                    if (!inFrom && query != $this.queryExecutor.query) {
                        var parentName = executionStack[executionStack.length-1];
                        currentExecutionContext.parent = executionContexts[parentName];
                        QueryUtils.assert(currentExecutionContext.parent, 'Parent execution context is undefined');
                    }

                    /// define child contexts
                    if (currentExecutionContext.parent) {
                        currentExecutionContext.parent.child = currentExecutionContext.parent.child || {};
                        currentExecutionContext.parent.child[currentExecutionContext.context] = currentExecutionContext;
                    }

                    /// build query cursor
                    lastCursor = $this._buildQueryCursor(currentExecutionContext);
                }
            );

            return {
                next: function() {
                    lastCursor.next();
                    return lastCursor.object;
                },
                close: function(){
                    lastCursor.close();
                },
            };
		},

		_buildEmptyCursor: function(currentExecutionContext){
		    var c = -1;
		    return $this._buildCursor(
                function _next(){return c===-1?(c=0,{}):null;},
                function _reset(){c = -1},
                function _close(){}
            );
		},

		_buildCursor: function(next, reset close){
		    var cursor = {
		        object:null,
		        next: next,
		        reset: reset,
		        close: close,
		    };
		    return cursor;
		},

		_buildCachedCursor: function(next, close){
		    var cursor = $this._buildCursor(
                function _next(){
                    QueryUtils.assert(!this.closed, 'Cursor closed');
                    if(this.cachedValues) {
                        this.object = cachedValues[++this.cachedPos];
                    } else {
                        this.object = next();
                        this.cachedValues.push(this.object);
                    }
                    return this.object;
                }, function _reset(){
                    if(this.cachedValues) {
                        this.cachedPos = -1;
                        this.object = null;
                        close();
                    }
                }, function _close(){
                   this.object = null;
                    this.cachedValues = null;
                    this.closed = true;
                    close();
                }
            );
		    cursor.cachedValues = null;
		    cursor.cachedPos = -1;
		    cursor.object = null;
		    return cursor;
		},

		_buildCubeCursor: function(currentExecutionContext) {
		    // TODO: this is test data
		    var testValues = [
		        {a: 1, b: 'a'},
		        {a: 2, b: 'a'},
		        {a: 3, b: 'b'},
		        {a: 4, b: 'c'},
		        {a: 5, b: 'b'},
		        {a: 5, b: 'b'},
		    ];
		    var cursor = $this._buildCachedCursor(
		        function(){
                    // TODO get next value from cube source
                    return testValues.pop();
                },
		        function(){
                    // TODO close cube cursor
                }
		    );
		    return cursor;
		},

		_buildQueryCursor: function(currentExecutionContext) {
		    currentExecutionContext.cursor = $this._buildCursor(
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
                }
            );

            // prepare context
            currentExecutionContext.JSB = JSB;
            currentExecutionContext.MD5 = MD5;
            currentExecutionContext.QueryUtils = QueryUtils;
            currentExecutionContext._ = CursorFunctions._;
            currentExecutionContext.__ = RuntimeFunctions.__;

            // build cursor functions
            currentExecutionContext._.query.call(currentExecutionContext);

            // finalize next()
            var nextValue = currentExecutionContext.cursor.next;
            currentExecutionContext.cursor.next = function(){
//                currentExecutionContext.cursor.values = {};
                return nextValue.call(this);
            };

		    var cachedCursor = $this._buildCachedCursor(cursor.next, cursor.close);
		    return cachedCursor;
		},
	}
}