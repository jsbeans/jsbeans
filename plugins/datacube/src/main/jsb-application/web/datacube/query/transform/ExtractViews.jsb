{
	$name: 'DataCube.Query.Transforms.DefineContexts',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.Views.PatternViewsExtractor'
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            // ensure queries has defined $context
            QueryUtils.defineContextQueries(dcQuery);
		    return dcQuery;
		},
	}
}