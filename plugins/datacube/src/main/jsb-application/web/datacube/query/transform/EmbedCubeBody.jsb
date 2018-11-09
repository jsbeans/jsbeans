{
	$name: 'DataCube.Query.Transforms.EmbedCubeBody',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer',

		    'DataCube.Query.Views.CubeViewsBuilder',
        ],

		transform: function(dcQuery, cube){
		    function getView(name){
		        return dcQuery.$views[name];
            }

		    QueryUtils.walkQueries(dcQuery, {},
		        function() { },
		        function(query){
                    if (QueryUtils.hasDeclaredSource(query)) {
                        try {
                            var queryCube = query.$cube ? QueryUtils.getQueryCube(query.$cube, cube) : cube;

                            var usedFields = QueryUtils.extractInputFields(query, queryCube, getView);

                            if (Object.keys(usedFields).length == 0) {
                                query.$from = {};
                                return;
                            }

                            var providers = QueryUtils.extractCubeProvidersInQuery(query, queryCube, getView);
                            var builder = new CubeViewsBuilder(queryCube, providers);
                            var view = builder.build(query.$context, usedFields);
                            query.$from = view.getFromBody();
                        } finally {
                            builder && builder.destroy();
                            view && view.destroy();
                        }

                    }
                }
            );

		    QueryUtils.defineContextQueries(dcQuery);
		    return dcQuery;
		},
	}
}