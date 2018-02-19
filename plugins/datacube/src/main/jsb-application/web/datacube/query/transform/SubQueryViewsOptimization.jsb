{
	$name: 'DataCube.Query.Transforms.SubQueryViewsOptimization',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
	        'DataCube.Query.Views.SubQueryViewsExtractor',
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            if (dcQuery.$views) {
                QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] $views defined - SubQueryViewsOptimization skipped');
                return dcQuery;
            }

            QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] Query before SubQueryViewsOptimization: ' + JSON.stringify(dcQuery, 0, 2));

		    try {
		        var extractor = new SubQueryViewsExtractor();
                var resultQuery = extractor.buildViews(dcQuery);
                return resultQuery;
		    } finally {
		        extractor  && extractor.destroy();
		    }
		},
	}
}