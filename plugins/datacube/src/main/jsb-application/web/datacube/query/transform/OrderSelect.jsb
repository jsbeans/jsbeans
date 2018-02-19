{
	$name: 'DataCube.Query.Transforms.OrderSelect',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            // move top fields that used in other
            QueryUtils.upperGeneralFields(dcQuery);
		    return dcQuery;
		},
	}
}