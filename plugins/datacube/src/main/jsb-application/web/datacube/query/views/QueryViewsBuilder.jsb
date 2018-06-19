{
	$name: 'DataCube.Query.Views.QueryViewsBuilder',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',

            'DataCube.Query.Views.CubeViewsBuilder',
		    'DataCube.Query.Views.DataProviderView',
		    'DataCube.Query.Views.NothingView',
		    'DataCube.Query.Views.QueryView',
		    'DataCube.Query.Views.JoinView',
		    'DataCube.Query.Views.UnionsView',
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
            QueryUtils.walkAllSubQueries(query, function(subQuery, isFromQuery, isValueQuery, isViewQuery){
                $this._buildContextView(subQuery, isValueQuery, isViewQuery);
            });
		},

		_buildContextView: function(query, isValueQuery, isViewQuery) {
            if (query.$provider) {
                var dataProvider = $this._getProviderById(query.$provider);
                QueryUtils.throwError(dataProvider, 'Undefined data provider {}', query.$provider);

                var resultView = $this._buildDataProviderQuery(query.$context, dataProvider, query);
            } else if (query.$union) {
                var resultView = new UnionsView("unions_"+name);
                resultView.usedFields = query.$select;
                for(var i = 0; i < query.$union.length; i++) {
                    var innerView = $this.contextViews[query.$union[i].$context];
                    QueryUtils.throwError(innerView, 'Undefined union inner view {}', query.$union[i].$context);
                    resultView.addView(innerView);
                }
            } else if (query.$join) {
                var leftView = $this.contextViews[query.$join.$left.$context];
                var rightView = $this.contextViews[query.$join.$right.$context];
                QueryUtils.throwError(leftView, 'Undefined join left view {}', query.$join.$left.$context);
                QueryUtils.throwError(rightView, 'Undefined join right view {}', query.$join.$right.$context);

                var joinName = 'left outer join:(' + leftView.name + ') X (' + rightView.name + ')';;
                var resultView = new JoinView(joinName, leftView, 'left outer');
                resultView.query = query;
                resultView.filter = query.$join.$filter;
                resultView.usedFields = query.$select;
                resultView.setRightView(rightView);
            } else if (query.$cube) {
                var query2 = JSB.merge({}, query, {$views: $this.query.$views});
                var usedFields = {}; // TODO usedFields
                //QueryUtils.extractUsedFields(query2, $this.cube || $this.directProvider);
                var resultView = $this.cubeViewsBuilder.build(query.$context, usedFields);
            } else {
                var sourceView = $this.contextSourceViews[query.$context] = $this._buildContextSourceViews(query);
                QueryUtils.throwError(sourceView, 'Undefined source view for {}', query.$context);
                var resultView = $this._buildContextViews(query, sourceView);

            }

            QueryUtils.throwError(resultView, 'Undefined view {}', query.$context);
            return $this.contextViews[query.$context] = resultView;
		},

		_buildDataProviderQuery: function(name, dataProvider, query) {
//if (name =='DataProvider[0#1]:d5f2c471d705fe580f141f9a62ecdc78|dp_d2bb4f5b74d9e2ff52e2284d02a89aee') debugger;
		    var view = new DataProviderView(name, dataProvider);
		    view.usedFields = query.$select;
		    var managedFields = dataProvider.extractFields({type:true, nativeType:true});
            for(var alias in query.$select) {
                QueryUtils.throwError(typeof query.$select[alias] === 'string', 'Query with $provider does not support select expressions: {}', query.$context);

                var providerField = query.$select[alias];
                view.setField(alias, {
                    type: managedFields[providerField].type,
                    nativeType: managedFields[providerField].nativeType || managedFields[providerField].type,
                    field: alias,
                    providerField: providerField,
                });
            }

		    return view;
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
                var query2 = JSB.merge({}, query, {$views: $this.query.$views});
                var usedFields = /**{field:usages};*/ QueryUtils.extractUsedFields(query2, $this.cube || $this.directProvider);

                if (Object.keys(usedFields).length == 0) {
                    // is NothingView
                    sourceView = new NothingView(query.$context);
                } else {
                    // is Cube/DataProvider source
                    sourceView = $this.cubeViewsBuilder.build(query.$context, usedFields);
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

		_getProviderById: function(id) {
		    if ($this.directProvider && $this.directProvider.id === id) {
		        return $this.directProvider;
		    }

		    for(var i = 0; i < $this.providers.length; i++) {
		        if ($this.providers[i].id === id) {
		            return $this.providers[i];
		        }
		    }
		    QueryUtils.throwError(false, 'DataProvider is undefined: {}', id);
		},
	}
}