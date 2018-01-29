{
	$name: 'DataCube.Query.Views.QueryViewsBuilder',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',

            'DataCube.Query.Views.CubeViewsBuilder'
		    'DataCube.Query.Views.NothingView',
		    'DataCube.Query.Views.QueryView',
		    'DataCube.Query.Views.SqlView',
        ],

		$constructor: function(query, cube, providers){
		    $this.query = query;
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
		    for(var name in dcQuery.$views) {
		        $this._buildQueryViews(name, dcQuery.$views[name]);
		    }
		    // build query views
            $this._buildQueryViews(dcQuery.$context, dcQuery);
            return $this.contextViews[dcQuery.$context];
		},

        _buildQueryViews: function(name, query) {
            // from leaf to root
            QueryUtils.walkSubQueries(query, function(subQuery, isFromQuery, isValueQuery){
                $this._buildContextView(name, subQuery);
            });
		},

		_buildContextView: function(name, query) {
		    var sourceView = $this.contextSourceViews[query.$context] = $this._buildContextSourceViews(name, query);
		    var resultView = $this.contextViews[query.$context] = $this._buildContextViews(name, query, sourceView);
		    if (!sourceView || !resultView) throw new Error('Internal error: result or source view for query is not defined');
		},

		_buildContextSourceViews: function(name, query) {
            var sourceView = null;
            if (query.$sql) {
                // is sql source
                sourceView = new SqlView(name, query.$sql);
            } else if(query.$from) {
                // is $from QueryView (query on query)
                var fromContext = JSB.isString(query.$from) ? query.$from : query.$from.$context;
                if (!$this.contextViews[fromContext]) {
                    throw new Error('Children $from view is undefined for context ' + fromContext);
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
                    sourceView = new NothingView(name);
                } else {
                    // is Cube/DataProvider source
                    sourceView = $this.cubeViewsBuilder.build();
                }
            }

            return sourceView;
		},

		_buildContextViews: function(name, query, sourceView) {
		    var view = new QueryView(name, query, sourceView);
		    for(var alias in query.$select) {
                view.setField(alias, {
                    type: QueryUtils.extractType(
                            query.$select[alias], query,
                            $this.cube || $this.singleProvider),
                    expr: query.$select[alias],
                });
            }
            return view;
		},
	}
}