{
	$name: 'DataCube.Query.Transforms.UnwrapPostFilter',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            $this.unwrapPostFilters(dcQuery);
            return dcQuery;
		},

        /** Разворачивает $postFilter:
        *  1) если фильтруется группировочное поле (оно же поле куба), то переносится в основной фильтр
        *  2) если фильтруется выходное поле, то создается запрос-обертка с $filter
        */
		unwrapPostFilters: function(dcQuery) {
		    function unwrapForQuery(query) {
		        function subFilter(post) {
		            return QueryUtils.filterFilterByFields(query.$postFilter, query, function isAccepted(field, expr, opPath){
		                if (field == null) return true;
		                if (!query.$groupBy || query.$groupBy.length === 0) {
		                    return post;
		                }
                        for(var i = 0; i < query.$groupBy.length; i++){
                            var g = query.$groupBy[i];
                            if (typeof g === 'string' || typeof g.$field === 'string' && (!g.$context || g.$context == query.$context)) {
                                if((g.$field || g) == field) {
                                    return post;
                                }
                            }
                        }
                        return !post;
                    });
		        }

		        // embed group fields to main filter
		        if (query.$postFilter && Object.keys(query.$postFilter).length > 0) {
                    var filter = subFilter(true);
                    if (filter) {
                        if (!query.$filter) query.$filter = {};
                        if (!query.$filter.$and) query.$filter.$and = [];
                        query.$filter.$and.push(filter);
                        query.$postFilter = subFilter(false);
                        if (!query.$postFilter) delete query.$postFilter;
                    }
		        }

		        // create wrap query for post filter
		        if (query.$postFilter && Object.keys(query.$postFilter).length > 0) {
    		        var queryFields = ['$context', '$select', '$filter', '$groupBy', '$from', '$distinct', '$sort', '$sql'];
    		        var postFilter = query.$postFilter;
                    delete query.$postFilter;
		            var subQuery = {};
		            // move query fields to subQuery
		            for (var i in queryFields) {
		                var field = queryFields[i];
		                if (typeof query[field] !== 'undefined') {
		                    subQuery[field] = query[field];
		                    delete query[field];
		                }

		            }
		            // build $select
		            query.$select = {};
                    for(var alias in subQuery.$select) if (typeof subQuery.$select[alias] !== 'undefined') {
                        query.$select[alias] = alias;
                    }

                    // build post filter query
                    query.$filter = postFilter;
                    query.$from = subQuery;
		        }
		    }

            QueryUtils.walkQueries(dcQuery, {}, null, function(query){
                unwrapForQuery(query);
            });
		},
	}
}