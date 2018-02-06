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

		    // для каждого запроса/констекста формируется:
		    $this.contextSourceViews = {};  // - вьюха источника любого типа
		    $this.contextViews = {};  // - вьюха текущего запроса/контекста (типа QueryView)
		},

		destroy: function(){
		    $this.cubeViewsBuilder.destroy();
		    $base();
		},

		build: function() {
		    // build pre-defined $views
		    for(var name in $this.query.$views) {
		        $this._buildQueryViews($this.query.$views[name]);
		    }
		    // build query views
            $this._buildQueryViews($this.query);

            $this._setIsolatedViews();
            return $this.contextViews[$this.query.$context];
		},

		getContextQueryViews: function(){
		    return $this.contextViews;
		},

		_setIsolatedViews: function(){
		    var notIsolatedContexts = {};
            for(var context in $this.contextViews) if ($this.contextViews.hasOwnProperty(context)) {
                var queryView = $this.contextViews[context];
                var linkedFields = queryView.listLinkedFields();
                for (var f in linkedFields) {
                    var linkedViews = queryView.getFieldLinkedViews(linkedFields[f]);
                    for(var linkedContext in linkedViews) if (linkedViews.hasOwnProperty(linkedContext)) {
                        notIsolatedContexts[linkedContext] = true;
                    }
                }
            }
            for(var context in notIsolatedContexts) if (notIsolatedContexts.hasOwnProperty(context)) {
                var queryView = $this.contextViews[context];
                queryView.setIsolated(false);
            }
        },

        _buildQueryViews: function(query) {
            // from leaf to root
            QueryUtils.walkSubQueries(query, function(subQuery, isFromQuery, isValueQuery){
                $this._buildContextView(subQuery);
            });
		},

		_buildContextView: function(query) {
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
                        ? $this.query.$views[query.$from]
                        : query.$from.$context;
                if (!$this.contextViews[fromContext]) {
                    throw new Error('$from view is undefined in ' + query.$context);
                }
                sourceView = $this.contextViews[fromContext];
            } else {
                // check if query without source or build cube

                var usedFields = {/**usages*/};
                QueryUtils.walkQueryFields(query, /**includeSubQueries=*/false,
                    function(field, context, curQuery){
                        if (!usedFields[field]) {
                            usedFields[field] = 0;
                        }
                        usedFields[field]++;
                    }
                );

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
                            $this.cube || $this.directProvider),
                    type: // TODO replace with cube types
                        QueryUtils.extractType(
                            query.$select[alias], query,
                            $this.cube || $this.directProvider),
                    expr: query.$select[alias],
                });
            }
            // collect linked fields in other contexts
            QueryUtils.walkQueryFields(query, /**includeSubQueries=*/false,
                function(field, context, curQuery){
                    // if current query field
                    if (context == query.$context){
                        // if use from other context
                        if (curQuery.$context != context) {
debugger;
                            var viewField = view.getField(field);
                            if (!viewField) throw new Error('Internal error: unknown foreign field ' + field);
                            var linkedView = $this.contextViews[curQuery.$context];
                            if (!linkedView) throw new Error('Internal error: unknown linked view ' + curQuery.$context);
                            view.linkField(field, linkedView);
                        }
                    }
                }
            );
            //collect subquery Views
            QueryUtils.walkSubQueries(query, function(subQuery, isFromQuery, isValueQuery){
                if (subQuery != query) {
                    var subView = $this.contextViews[subQuery.$context];
                    if (!subView) throw new Error('Internal error: unknown view context ' + subQuery.$context);
                    view.addSubView(subView);
                }
            });

            return view;
		},
	}
}