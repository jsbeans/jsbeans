{
	$name: 'DataCube.Query.Transforms.OrderSelect',
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
            // move top fields that used in other
            QueryUtils.upperGeneralFields(dcQuery);
		    return dcQuery;
		},
	}
}