{
	$name: 'DataCube.Query.Transforms.PropagateGlobalFilter',
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
            // embed $globalFilter to $filter/$postFilter of root and sub queries
            QueryUtils.propagateGlobalFilter(dcQuery, cubeOrDataProvider);
		    return dcQuery;
		},
	}
}