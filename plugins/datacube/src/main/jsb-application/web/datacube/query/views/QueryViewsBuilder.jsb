{
	$name: 'DataCube.Query.Views.QueryViewsBuilder',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',

            'DataCube.Query.Views.CubeViewsBuilder',
		    'DataCube.Query.Views.NothingView',
		    'DataCube.Query.Views.QueryView',
		    'DataCube.Query.Views.SqlView',
        ],

		$constructor: function(query, cube, providers){
		    $this.query = query;
		    $this.providers = providers;
		    $this.cube = cube;
		    $this.directProvider = !cube ? providers[0] : null;
		    $this.cubeViewsBuilder = new CubeViewsBuilder(cube, providers);
            $this.contextQueries = QueryUtils.defineContextQueries(query);

		    // для каждого запроса/констекста формируется:
		    $this.contextSourceViews = {};  // - вьюха источника любого типа
		    $this.contextViews = {};  // - вьюха текущего запроса/контекста (типа QueryView)
		},

		destroy: function(){
		    $this.cubeViewsBuilder.destroy();
		    $base();
		},

		build: function() {
		    // build query views
            $this._buildQueryViews($this.query);

            return $this.contextViews[$this.query.$context];
		},

		getContextQueryViews: function(){
		    return $this.contextViews;
		},

//		_setIsolatedViews: function(){
//		    var notIsolatedContexts = {};
//            for(var context in $this.contextViews) if ($this.contextViews.hasOwnProperty(context)) {
//                var queryView = $this.contextViews[context];
//                queryView.hasLinkedFields
////                queryView.walkLinkedFields(function(linkedField, linkedContext){
////                    if (!notIsolatedContexts[linkedContext]) {
////                        notIsolatedContexts[linkedContext] = true;
////                    }
////                });
//            }
//            for(var context in notIsolatedContexts) if (notIsolatedContexts.hasOwnProperty(context)) {
//                var queryView = $this.contextViews[context];
//                queryView.setIsolated(false);
//            }
//        },

        _buildQueryViews: function(query) {
debugger;
            QueryUtils.walkAllSubQueries(query, function(subQuery, isFromQuery, isValueQuery, isViewQuery){
                $this._buildContextView(subQuery, isValueQuery, isViewQuery);
            });
		},

		_buildContextView: function(query, isValueQuery, isViewQuery) {
		    var sourceView = $this.contextSourceViews[query.$context] = $this._buildContextSourceViews(query);
		    var resultView = $this.contextViews[query.$context] = $this._buildContextViews(query, sourceView);
		    if (!sourceView || !resultView) throw new Error('Internal error: result or source view for query is not defined');
		},

		_buildContextSourceViews: function(query) {
            var sourceView = null;
            if (query.$sql) {
                // is sql source
                sourceView = new SqlView(query.$context, query.$sql);
            } else if(query.$from) {
                // is $from QueryView (query on query)
                var fromContext = JSB.isString(query.$from)
                        ? query.$from
                        : query.$from.$context;
                if (!$this.contextViews[fromContext]) {
                    throw new Error('$from view is undefined in ' + query.$context);
                }
                sourceView = $this.contextViews[fromContext];
            } else {
                // check if query without source or build cube
                var usedFields = {/**usages*/};
                var query2 = JSB.merge({}, query, {$views: $this.query.$views});
                if($this.directProvider) {
                    QueryUtils.walkDataProviderFields(query2, /**includeSubQueries=*/false, $this.directProvider,
                        function(field, context, q){
                            if (!usedFields[field]) {
                                usedFields[field] = 0;
                            }
                            usedFields[field]++;
                        }
                    );
                } else {
                    QueryUtils.walkCubeFields(query2, /**includeSubQueries=*/false, $this.cube,
                        function(field, context, q, binding){
                            if (!usedFields[field]) {
                                usedFields[field] = 0;
                            }
                            usedFields[field]++;
                        }
                    );
                }

                if (Object.keys(usedFields).length == 0) {
                    // is NothingView
                    sourceView = new NothingView(query.$context);
                } else {
                    // is Cube/DataProvider source
                    sourceView = $this.cubeViewsBuilder.build(query.$context);
                }
            }

            return sourceView;
		},

		_buildContextViews: function(query, sourceView) {
		    var view = new QueryView(query.$context, query, sourceView);
		    for(var alias in query.$select) {
                view.setField(alias, {
                    field: alias,
                    nativeType: QueryUtils.extractType(
                            query.$select[alias], query,
                            $this.cube || $this.directProvider, function(ctx){
                                return $this.contextQueries[ctx];
                            }),
                    type: // TODO replace with cube types
                        QueryUtils.extractType(
                            query.$select[alias], query,
                            $this.cube || $this.directProvider, function(ctx){
                                return $this.contextQueries[ctx];
                            }),
                    expr: query.$select[alias],
                });
            }

            // collect linked fields in other contexts
            QueryUtils.walkQueryForeignFields(query,
                function(field, context, curQuery){
                    // на текущий момент вьюха внешнего поля не создана
                    view.linkForeignField(field, context);
                }
            );

            //collect subquery Views
            var query2 = JSB.merge({}, query, {$views:$this.query.$views});
            QueryUtils.walkSubQueries(query2, function(subQuery, isFromQuery, isValueQuery){
                if (subQuery != query2) {
                    var subView = $this.contextViews[subQuery.$context];
                    if (!subView) throw new Error('Internal error: unknown view context ' + subQuery.$context);
                    view.addSubView(subView);
                }
            });

            return view;
		},
	}
}