{
	$name: 'DataCube.Query.Transforms.UnwrapComplexOperators',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

		transform: function(dcQuery, cubeOrDataProvider){
            // unwrap macros and $grmax* to complex expressions
            QueryUtils.unwrapMacros(dcQuery);
            QueryUtils.unwrapGOperators(dcQuery);
            QueryUtils.unwrapPostFilters(dcQuery);
            return dcQuery;
		},
	}
}