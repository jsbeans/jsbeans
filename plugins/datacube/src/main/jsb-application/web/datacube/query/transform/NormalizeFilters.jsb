{
	$name: 'DataCube.Query.Transforms.NormalizeFilters',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

		transform: function(dcQuery, cubeOrDataProvider){
            // standardize $filter
            QueryUtils.unwrapFilters(dcQuery, true);
		    return dcQuery;
		},
	}
}