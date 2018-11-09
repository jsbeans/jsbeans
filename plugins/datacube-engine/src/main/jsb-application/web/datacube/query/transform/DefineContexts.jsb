{
	$name: 'DataCube.Query.Transforms.DefineContexts',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            // ensure queries has defined $context
            var newQuery = JSB.clone(dcQuery);
            QueryUtils.defineContextQueries(newQuery);
		    return newQuery;
		},
	}
}