{
	$name: 'DataCube.Query.Transforms.NormalizeSort',
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
            // standardize $sort
            QueryUtils.unwrapSort(dcQuery);
		    return dcQuery;
		},
	}
}