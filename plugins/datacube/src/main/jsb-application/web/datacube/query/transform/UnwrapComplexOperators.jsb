{
	$name: 'DataCube.Query.Transforms.UnwrapComplexOperators',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
        ],

		transform: function(dcQuery, cubeOrDataProvider){
		    // unwrap macros and $grmax* to complex expressions
		    QuerySyntax.unwrapMacros(dcQuery);
		    QueryUtils.unwrapGOperators(dcQuery);
		    QueryUtils.unwrapPostFilters(dcQuery);
		    return dcQuery;
		},
	}
}