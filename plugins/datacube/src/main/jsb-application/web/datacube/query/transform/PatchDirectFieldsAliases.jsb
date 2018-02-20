{
	$name: 'DataCube.Query.Transforms.PatchDirectFieldsAliases',
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
		    // patch links to aliases if alias is cube field
		    QueryUtils.patchSimpleFieldAliases(dcQuery, cubeOrDataProvider);
		    return dcQuery;
		},
	}
}