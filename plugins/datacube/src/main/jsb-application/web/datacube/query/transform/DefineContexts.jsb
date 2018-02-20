{
	$name: 'DataCube.Query.Transforms.DefineContexts',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

		transform: function(dcQuery, cubeOrDataProvider){
            // ensure queries has defined $context
            QueryUtils.defineContextQueries(dcQuery);
		    return dcQuery;
		},
	}
}