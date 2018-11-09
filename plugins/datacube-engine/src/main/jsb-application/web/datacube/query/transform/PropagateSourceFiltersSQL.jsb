{
	$name: 'DataCube.Query.Transforms.PropagateSourceFiltersSQL',
	$parent: 'DataCube.Query.Transforms.PropagateSourceFilters',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		_checkTargetQuery: function(query){
		    // TODO return false if join providers
		    return true;
		},
	}
}