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

		$constructor: function(executor){
		    $this.executor = executor;
		    $this.profiler = $this.executor.profiler;

            $this._translateOnlyProviders        = Config.has('datacube.queryengine.translateOnlyProviders') && Config.get('datacube.queryengine.translateOnlyProviders');
            $this._translateQueriesFromProviders = Config.has('datacube.queryengine.translateQueriesFromProviders') && Config.get('datacube.queryengine.translateQueriesFromProviders');
        },

        buildAnyCursor:function(query, params, parent, caller) {
            // is empty
            if (query == null || JSB.isEqual(query, {})) {
                return $this.buildEmptyCursor(parent, caller);
            }
            // is provider or translate whole query
            if ($this._checkTranslateQuery(query)) {
                var cursor = $this.buildTranslatedCursor(query, params, parent, caller);
                if (cursor) {
                    return cursor;
                }
            }
            // is union
            if (query.$union) {
                return $this.buildUnionCursor(query, params, parent, caller);
            }
            // is join
            if (query.$join) {
                return $this.buildJoinCursor(query, params, parent, caller);
            }
            // query
            return $this.buildQueryCursor(query, params, parent, caller);
        },

        buildTranslatedCursor: function(query, params, parent, caller) {
            var it = $this.executor.tryTranslateQuery(query, params);
            if (it) {
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
                $this._buildViewFields(cursor);
                return cursor;
            }
            return null;
        },

        buildQueryCursor: function(query, params, parent, caller){
            QueryUtils.throwError(query.$from, 'Query source/$from is undefined in context {}', query.$context);

            var cursor = new QueryCursor($this.executor, query, params, parent, caller);

            cursor.source = $this.buildAnyCursor(query.$from, params, parent, cursor);

            QueryUtils.walkQueries(
                JSB.merge({},query,{$from:null}),
                {
                    depth : 1,
                    findView: function(context){
                        return $this.executor.contextQueries[context];
                    }
                },
                function enterCallback(subQuery){
                },
                function leaveCallback(subQuery){
                    if (subQuery.$context != query.$context) {
                        cursor.addNested(
                            subQuery.$context,
                            $this.buildAnyCursor(subQuery, params, cursor, cursor)
                        );
                    }
                }
            );

            $this._buildViewFields(cursor);

            cursor.buildQueryBody();

            return cursor;
        },

        buildEmptyCursor: function(parent, caller){
            return new EmptyCursor($this.executor, parent, caller);
        },

        buildUnionCursor: function(unionQuery, params, parent, caller){
            $this.profiler && $this.profiler.profile('Create union source cursor at {}', unionQuery.$context);

            var unionsCursor = new UnionCursor($this.executor, unionQuery, params, parent, caller);

            for(var i = 0; i < unionQuery.$union.length; i++) {
                var subQuery = unionQuery.$union[i];
                QueryUtils.throwError(subQuery, 'Union {} contains undefined subquery', unionQuery.$context);

                unionsCursor.addUnion(
                    $this.buildAnyCursor(subQuery, params, parent, unionsCursor)
                );
            }

            $this._buildViewFields(unionsCursor);

            return unionsCursor;
        },

        buildJoinCursor: function(joinQuery, params, parent, caller){
            $this.profiler && $this.profiler.profile('Create join cursor at {}', joinQuery.$context);

            var joinCursor = new JoinCursor($this.executor, joinQuery, params, parent);

            QueryUtils.throwError(joinQuery.$join.$left, 'Join {} contains undefined left query', joinQuery.$context);
            QueryUtils.throwError(joinQuery.$join.$right, 'Join {} contains undefined right query', joinQuery.$context);

            $this.profiler && $this.profiler.profile('Create left join cursor at {}', joinQuery.$join.$left);
            joinCursor.setLeft(
                $this.buildAnyCursor(joinQuery.$join.$left, params, parent, joinCursor)
            );
            $this.profiler && $this.profiler.profile('Create right join cursor at {}', joinQuery.$join.$right);
            joinCursor.setRight(
                $this.buildAnyCursor(joinQuery.$join.$right, params, parent, joinCursor)
            );
            joinCursor.setCreateRight(function (filter, params){
                /// построение правого запроса - добавление доп.условий
                if(params) {
                    params = JSB.merge({}, $this.params, params);
                }
                var query = JSB.clone(joinQuery.$join.$right);
                if(filter) {
                    if(query.$filter) {
                        filter.$and.push(query.$filter);
                    }
                    query.$filter = filter;
                }
                return $this.buildAnyCursor(query, params, parent, joinCursor);
            });

            $this._buildViewFields(joinCursor);

            return joinCursor;
        },

        _checkTranslateQuery: function(query) {
            return query.$provider
                || !$this._translateOnlyProviders
                || $this._translateQueriesFromProviders && query.$from && query.$from.$provider;
        },

        _buildViewFields: function(viewCursor){
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
    }
}