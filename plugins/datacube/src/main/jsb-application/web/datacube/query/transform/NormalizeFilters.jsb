{
	$name: 'DataCube.Query.Transforms.NormalizeFilters',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            // standardize $filter
            QueryUtils.unwrapFilters(dcQuery, true);
		    return dcQuery;
		},
	}
}