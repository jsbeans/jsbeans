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
            QueryUtils.walkQueries(dcQuery, {}, null, function(query){
                if (query.$postFilter && Object.keys(query.$postFilter).length > 0) {
                    $this._unwrapForQuery(query);
                }
            });
            return dcQuery;
		},

		_unwrapForQuery: function(query) {
		    var postFilter = query.$postFilter;
            var complexFields = {};

            /// 1) если фильтруется обычное выходное поле - вставляется в текущий $filter с заменой field на $select[field]
            var queryFilter = QueryUtils.rebuildFilter(postFilter,
                function fieldsCallback(field, context, opPath) {
                    var exp = query.$select[field];
                    QueryUtils.throwError(exp, '$postFilter использует поле "{}", которое отсутствует в запросе "{}"', field, query.$context);
                    if (QueryUtils.isSubQueryExpression(exp) || QueryUtils.isAggregatedExpression(exp)){
                        complexFields[field] = true;
                        return null;
                    }
                    return JSB.clone(exp);
                },
                function expressionCallback(expr, opPath) {
                }
            );
            query.$filter = QueryUtils.mergeFilters(query.$filter, queryFilter);
            if (!query.$filter) delete query.$filter;
            delete query.$postFilter;

            /// 2) если в $select[field] подзапрос или агрегация - создается запрос-обертка, для вьюх производится замена контекстов
            if (Object.keys(complexFields).length > 0) {
                var queryFilter = QueryUtils.rebuildFilter(postFilter,
                    function fieldsCallback(field, context, opPath) {
                        if (complexFields[field]){
                             return {$field: field};
                        }
                        return null;
                    },
                    function expressionCallback(expr, opPath) {
                    }
                );

                var wrapQuery = {
                    $context: query.$context,
                    $select: {},
                    $filter: queryFilter,
                    $from: JSB.clone(query)
                };
                if (query.$id) {
                    wrapQuery.$id = query.$id;
                     delete wrapQuery.$from.$id;
                }
                QueryUtils.updateContext(wrapQuery.$from, query.$context, 'wrapped_'+query.$context);
                for (var alias in query.$select) {
                    wrapQuery.$select[alias] = {$field: alias};
                }

                QueryUtils.jsonReplaceBody(query, wrapQuery);
            }

		},
	}
}