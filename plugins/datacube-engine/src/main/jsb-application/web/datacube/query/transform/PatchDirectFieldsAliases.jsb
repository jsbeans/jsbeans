{
	$name: 'DataCube.Query.Transforms.PatchDirectFieldsAliases',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

        /** Производит замену
        */
		transform: function(rootQuery, cube){

		    QueryUtils.walkQueries(rootQuery, {}, null, function (query){
                var directAliases = {};
                for(var alias in query.$select) {
                    var e = query.$select[alias];
                    if (e.$field && (!e.$context || e.$context == query.$context) || JSB.isString(e)) {
                        directAliases[alias] = JSB.isString(e) ? {$field: e} : JSB.clone(e);
                    }
                }

                QueryUtils.walkFields(query, function fieldsCallback(field, context, q, path){
                    if (directAliases[field] && (!context || context == query.$context)) {
                        return directAliases[field];
                    }
                });

//                var sourceFields = QueryUtils.extractSourceFields(query, cube, rootQuery);
//                var outputFields = QueryUtils.extractOutputFields(query);
//                QueryUtils.walkInputFieldsCandidates(query, cube, {rootQuery:rootQuery}, function (field, context, q, isExp) {
//                    if (outputFields[field]/**isAlias*/ && directAliases[field] && directAliases[field] != field) {
//                        var newField = {$field:directAliases[field]};
//                        if (context != query.$context) {
//                            newField.$context = context;
//                        }
//                        return newField; // replace
//                    }
//
//                    QueryUtils.throwError(sourceFields[field] || outputFields[field] || !isExp, 'Field "{}" is not defined in source or query', field);
//                });
            });
		    return rootQuery;
		},
	}
}