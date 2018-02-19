{
	$name: 'DataCube.Query.Transforms.PropagateGlobalFilter',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            // embed $globalFilter to $filter/$postFilter of root and sub queries
            QueryUtils.propagateGlobalFilter(dcQuery, cubeOrDataProvider);
		    return dcQuery;
		},
	}
}