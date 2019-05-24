/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.PropagateGlobalFilter',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(dcQuery, cube){
            // embed $globalFilter to $filter/$postFilter of root and sub queries
            $this.propagateGlobalFilter(dcQuery, cube);
		    return dcQuery;
		},

        /** Встроить глобальный фильтр в фильры главного и дочерних запросов */
        propagateGlobalFilter: function(dcQuery, cube) {
            var cubeFilter = $this._collectCubeFilter(dcQuery);
            var cubeDimensions = QueryUtils.extractCubeDimensions(cube);
            if (cubeFilter.$and.length > 0) {
                var embeddedQueries = [];
                QueryUtils.walkQueries(dcQuery, {}, null,
                    function(subQuery){
                        if (embeddedQueries.indexOf(subQuery) == -1) {
                            var outputFields = QueryUtils.extractOutputFields(subQuery);
                            var queryFilter = $this._generateSubFilter(cubeFilter, outputFields, cubeDimensions, subQuery, dcQuery);
                            if (queryFilter) {
                                subQuery.$postFilter = QueryUtils.mergeFilters(subQuery.$postFilter, queryFilter);
                            }
                            embeddedQueries.push(subQuery);
                        }
                    }
                );
            }
        },

        _collectCubeFilter: function(dcQuery){
            var cubeFilter = {$and:[]};
            QueryUtils.walkQueries(dcQuery, {}, null, function(subQuery){
                if (subQuery.$cubeFilter && Object.keys(subQuery.$cubeFilter).length > 0){
                    if(cubeFilter.$and.indexOf(subQuery.$cubeFilter) == -1) {
                        cubeFilter.$and.push(subQuery.$cubeFilter);
                    }
                    delete subQuery.$cubeFilter;
                }
            });
            return cubeFilter;
        },

        _generateSubFilter: function(cubeFilter, queryFields, cubeDimensions, query, dcQuery) {
            var queryFilter = QueryUtils.rebuildFilter(cubeFilter,
                function fieldsCallback(field, context, opPath) {
                    if (cubeDimensions[field] && queryFields[field]) {
                        var e = {$field: field};
                        return e;
                    }
                    return null;
                },
                function expressionCallback(expr, opPath) {
                }
            );
            return queryFilter && Object.keys(queryFilter).length > 0 ? queryFilter : null;

        },
	}
}