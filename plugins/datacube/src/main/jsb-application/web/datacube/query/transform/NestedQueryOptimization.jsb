{
	$name: 'DataCube.Query.Transforms.NestedQueryOptimization',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
	        'DataCube.Query.Views.SameNestedQueryExtractor',
	        'DataCube.Query.Transforms.QueryTransformer'
        ],
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

		transform: function(dcQuery, cubeOrDataProvider){
//            if (dcQuery.$views) {
//                QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] $views defined - NestedQueryOptimization skipped');
//                return dcQuery;
//            }

            QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] Query before NestedQueryOptimization: ' + JSON.stringify(dcQuery, 0, 2));

		    try {
		        var extractor = new SameNestedQueryExtractor();
                var resultQuery = extractor.buildViews(dcQuery);
                return resultQuery;
		    } finally {
		        extractor  && extractor.destroy();
		    }
		},
	}
}