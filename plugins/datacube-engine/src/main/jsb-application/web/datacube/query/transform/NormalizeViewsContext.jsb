{
	$name: 'DataCube.Query.Transforms.NormalizeViewsContext',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(dcQuery, cube){
		    QueryUtils.walkQueries(dcQuery, {}, null, function(query){
                if (query.$views) {
                    for(var name in query.$views) {
                        QueryUtils.updateContext(query.$views[name], query.$views[name].$context, name);
                    }
                }
		    });
		    return dcQuery;
		},
	}
}