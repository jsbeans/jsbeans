{
	$name: 'DataCube.Query.Engine.Cursors.CursorBuilder',

	$server: {
		$require: [
		    'DataCube.Query.Engine.Cursors.TranslatedCursor',
		    'DataCube.Query.Engine.Cursors.QueryCursor',
		    'DataCube.Query.Engine.Cursors.JoinCursor',
		    'DataCube.Query.Engine.Cursors.UnionCursor',
		    'DataCube.Query.Engine.Cursors.EmptyCursor',

		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(executor, dcQuery){
		    $this.executor = executor;
		    $this.tracer = $this.executor.tracer;
		    $this.query = dcQuery;

            $this._translatorSkipQueries =
                    Config.has('query.translator.skipQueries.enabled')
                    && Config.get('query.translator.skipQueries.enabled');

            /// # задает нужно ли транслировать запросы к датапровайдру (использутется в JOIN для получения только склеиваемых записей)
            $this._translateQueriesFromProviders = true
        },

        buildAnyCursor:function(query, params, parent, caller) {
//debugger;
            // is empty
            if (query == null || JSB.isEqual(query, {})) {
                return $this.buildEmptyCursor(parent, caller);
            }
//            if ($this.executor.providers.length == 0) {
//                return $this.buildQueryCursor(query, params, parent, caller);
//            }
            // is translatable: provider or translate whole query
            var cursor = $this.tryBuildTranslatedCursor(query, params, parent, caller);
            if (cursor) {
                return cursor;
            }
//            if (query.$provider
//
//                    || !$this._translatorSkipQueries
//
//                    || $this._translateQueriesFromProviders
//                        && query.$from
//                        && (query.$from.$provider || $this.query.$views && $this.query.$views[query.$from])
//                        && true // TODO filter provider-queries by fields
//            ) {
//                var cursor = $this.tryBuildTranslatedCursor(query, params, parent, caller);
//                if (cursor) {
//                    return cursor;
//                }
//
//                if (query.$provider || $this._translatorSkipQueries) {
//                    QueryUtils.throwError(0, 'Compatible translator does not exist for query "{}"', query.$context);
//                }
//            }
            // is union
            if (query.$union) {
                return $this.buildUnionCursor(query, params, parent, caller);
            }
            // is join
            if (query.$join) {
                return $this.buildJoinCursor(query, params, parent, caller);
            }
            // is recursive
            if (query.$recursive) {
                return $this.buildRecursiveCursor(query, params, parent, caller);
            }
            // query
            return $this.buildQueryCursor(query, params, parent, caller);
        },

        tryBuildTranslatedCursor: function(query, params, parent, caller) {
            // try translate query as-is
            var it = $this.executor.tryTranslateQuery(query, params);
            if (it) {
                try {
                    var cursor = new TranslatedCursor($this.executor, query, parent, caller, function(){
                        if(it) {
                            // use pre-created
                            var curIt = it;
                            it = null;
                            return curIt;
                        } else {
                            // create new
                            return $this.executor.tryTranslateQuery(query, params);
                        }
                    });
                    $this._fillOutputFields(cursor);
                    return cursor;
                } catch(e) {
                    it && it.close();
                    cursor && cursor.destroy();
                    throw e;
                }
            }
            return null;
        },

        buildQueryCursor: function(query, params, parent, caller){
            try {
                var cursor = new QueryCursor($this.executor, query, params, parent, caller);
                if (typeof query.$from === 'string') {
                    var sourceQuery = $this.query.$views[query.$from];
                } else {
                    var sourceQuery = query.$from;
                }
                QueryUtils.throwError(sourceQuery, 'Query source/$from is undefined in context {}', query.$context);

                /// build source
                cursor.source = $this.buildAnyCursor(sourceQuery, params, parent, cursor);

                /// build nested sub-queries in expressions
                QueryUtils.walkQueries(
                    JSB.merge({}, query, {$from:null}),
                    {
                        depth : 1,
                        findView: function(context){
                            return $this.executor.contextQueries[context];
                        }
                    },
                    function enterCallback(subQuery){
                    },
                    function leaveCallback(subQuery){
                        if (!this.inFrom) {
                            // if has not external fields then store as nested global query
                            if (!QueryUtils.extractParentForeignFields(subQuery, $this.query)) {
                                cursor.globalSubQueries[subQuery.$context] = subQuery;
                            }
//                            else {
//                                // if expression subquery has foreign fields
//                                subQuery = $this._replaceForeignFieldsWithVars(subQuery);
//                            }
                        }
                        // build nested queries
                        if (subQuery.$context != query.$context) {
                            cursor.setNestedQueryFactory(
                                subQuery.$context,
                                function createNestedSubQuery (subQuery, localParams){
                                    var localParams = localParams ? JSB.merge(localParams, params, localParams) : params;
                                    return $this.buildAnyCursor(subQuery, localParams, cursor, cursor);
                                }
                            );
                        }
                    }
                );

                $this._fillOutputFields(cursor);

                cursor.buildQueryBody();
                return cursor;
            } catch(e) {
                cursor && cursor.destroy();
                throw e;
            }
        },

        buildEmptyCursor: function(parent, caller){
            return new EmptyCursor($this.executor, parent, caller);
        },

        buildUnionCursor: function(unionQuery, params, parent, caller){
            $this.tracer && $this.tracer.profile('Create union source cursor at {}', unionQuery.$context);

            var unionsCursor = new UnionCursor($this.executor, unionQuery, params, parent, caller);

            for(var i = 0; i < unionQuery.$union.length; i++) {
                var subQuery = unionQuery.$union[i];
                QueryUtils.throwError(subQuery, 'Union {} contains undefined subquery', unionQuery.$context);

                unionsCursor.addUnion(
                    $this.buildAnyCursor(subQuery, params, parent, unionsCursor)
                );
            }

            $this._fillOutputFields(unionsCursor);

            return unionsCursor;
        },

        buildJoinCursor: function(joinQuery, params, parent, caller){
            $this.tracer && $this.tracer.profile('Create join cursor at {}', joinQuery.$context);

            var joinCursor = new JoinCursor($this.executor, joinQuery, params, parent);

            QueryUtils.throwError(joinQuery.$join.$left, 'Join {} contains undefined left query', joinQuery.$context);
            QueryUtils.throwError(joinQuery.$join.$right, 'Join {} contains undefined right query', joinQuery.$context);

            $this.tracer && $this.tracer.profile('Create left join cursor at {}', joinQuery.$join.$left);
            joinCursor.setLeft(
                $this.buildAnyCursor(joinQuery.$join.$left, params, parent, joinCursor)
            );
            $this.tracer && $this.tracer.profile('Create right join cursor at {}', joinQuery.$join.$right);
            joinCursor.setRight(
                $this.buildAnyCursor(joinQuery.$join.$right, params, parent, joinCursor)
            );
            joinCursor.setCreateRight(function (localFilter, localParams){
                /// построение правого запроса - добавление доп.условий
                var localParams = localParams ? JSB.merge({}, params, localParams) : params;
                var query = JSB.clone(joinQuery.$join.$right);
                if(localFilter) {
                    if(query.$filter) {
                        localFilter.$and.push(query.$filter);
                    }
                    query.$filter = localFilter;
                }
                return $this.buildAnyCursor(query, localParams, parent, joinCursor);
            });

            $this._fillOutputFields(joinCursor);

            return joinCursor;
        },

        buildRecursiveCursor: function (query, params, parent, caller) {
            // TODO interpreted $recursive cursor
            QueryUtils.throwError('$recursive cursor is not implemented');
        },

        _fillOutputFields: function(viewCursor){
            viewCursor.fields = {};
            for(var alias in viewCursor.query.$select) {

                var field = viewCursor.fields[alias] = {
                    name: alias,
                    field: viewCursor.query.$select[alias]
                };
//                if (viewCursor.query.$provider) {
//                    field.type = // TODO ...
//                } else {
//                    field.type = QueryUtils.extractExpressionType(
//                            viewCursor.query.$select[alias],
//                            function _getFieldType(field, context) {
//                                // is current
//                                if (context == null || context == viewCursor.query.$context) {
//                                    var field = viewCursor.source.fields[field];
//                                    if (field) {
//                                        return field.type;
//                                    }
//                                }
//                                // is in parents
//                                for(var parent = viewCursor.parent; parent; parent = parent.parent) {
//                                    var field = parent.fields[field];
//                                    if (field) {
//                                        return field.type;
//                                    }
//                                }
//                                // is nested (for joins and unions)
//                                for(var c in viewCursor.nested){
//                                    var field = viewCursor.nested[c].fields[field];
//                                    if (field) {
//                                        return field.type;
//                                    }
//                                }
//                                QueryUtils.throwError(false, 'Field {} is undefined in context {} ', field, context);
//                            }
//                    );
//                }
            }

        },

//        _replaceForeignFieldsWithVars: function(query) {
//debugger;
//            var outerContexts = {};
//            // collect outer contexts
//            QueryUtils.walkQueries($this.query, {},
//                function(q){
//                    if (query.$context == q.$context) {
//                        for (var i = this.path.length - 1; i >= 0; i--) {
//                            if (this.path[i].$context != q.$context) {
//                                outerContexts[this.path[i].$context] = this.path[i];
//                            }
//                        }
//                        return false; // stop
//                    }
//                },
//                null
//            );
//
//            var outerFields = {};
//            var clonedQuery = JSB.clone(query);
//            // lookup fields from outer context
//            QueryUtils.walkQueries(clonedQuery, {
//                    findView: function(name){
//                        return $this.query.$views[name];
//                    }
//                }, null,
//                function(query){
//                    QueryUtils.walkQueryForeignFields(query, function (field, context, q){
//                        if (outerContexts[context||q.$context]) {
//                            return '${'+context+'/'+field+'}';
//                        }
//                    });
//                }
//            );
//            return clonedQuery;
//
//        },
    }
}