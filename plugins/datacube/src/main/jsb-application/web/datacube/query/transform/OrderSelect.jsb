{
	$name: 'DataCube.Query.Transforms.OrderSelect',
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
            // move top fields that used in other
            QueryUtils.upperGeneralFields(dcQuery);
            if (!dcQuery.$groupBy || dcQuery.$groupBy.length == 0) {
                for(var alias in dcQuery.$select) {
                    var e = dcQuery.$select[alias];
                    if (QueryUtils.isAggregatedExpression(e)) {
                        dcQuery.$groupBy = [{$const:1}];
                        break;
                    }
                }
            }
		    return dcQuery;
		},
	}
}