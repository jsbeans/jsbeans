{
	$name: 'DataCube.Query.Transforms.PatchDirectFieldsAliases',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

        /** patch links to aliases if alias is source field */
		transform: function(dcQuery, cube){
		    function getView(name){
		        return dcQuery.$views[name];
		    }

		    QueryUtils.walkQueries(dcQuery, {}, null, function (query){
                var directAliases = {};
                for(var alias in query.$select) {
                    var e = query.$select[alias];
                    if (e.$field && (!e.$context || e.$context == query.$context) || JSB.isString(e)) {
                        directAliases[alias] = e.$field || e;
                    }
                }

                var sourceFields = QueryUtils.extractSourceFields(query, cube, getView);
                var outputFields = QueryUtils.extractOutputFields(query, cube, getView);
                QueryUtils.walkInputFieldsCandidates(query, cube, getView, function (field, context, q, isExp) {
                    if (outputFields[field]/**isAlias*/ && directAliases[field] && directAliases[field] != field) {
                        var newField = {$field:directAliases[field]};
                        if (context != query.$context) {
                            newField.$context = context;
                        }
                        return newField; // replace
                    }

                    QueryUtils.throwError(sourceFields[field] || outputFields[field] || !isExp, 'Field "{}" is not defined in source or query', field);
                });
            });
		    return dcQuery;
		},
	}
}