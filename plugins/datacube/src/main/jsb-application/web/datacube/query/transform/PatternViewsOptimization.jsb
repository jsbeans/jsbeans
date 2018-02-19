{
	$name: 'DataCube.Query.Transforms.PatternViewsOptimization',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
	        'DataCube.Query.Views.PatternViewsExtractor',
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            if (dcQuery.$views) {
                QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] $views defined - PatternViewsOptimization skipped');
                return dcQuery;
            }

		    QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] Query before PatternViewsOptimization: ' + JSON.stringify(dcQuery, 0, 2));
		    try {
		        var extractor = new PatternViewsExtractor();
                var resultQuery = extractor.buildViews(dcQuery);
                return resultQuery;
		    } finally {
		        extractor  && extractor.destroy();
		    }
		},
	}
}