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
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

		transform: function(dcQuery, cube){
		    function getView(name){
		        return dcQuery.$views[name];
            }

		    QueryUtils.walkQueries(dcQuery, {},
		        function() { },
		        function(query){
                    if (query.$cube || !query.$from && !query.$provider && !query.$join && !query.$union) {
                        try {

                            var usedFields = QueryUtils.extractInputFields(query, cube, getView);

                            if (Object.keys(usedFields).length == 0) {
                                query.$from = {};
                                return;
                            }

                            var providers = QueryUtils.extractCubeProvidersInQuery(query, cube, getView);
                            var builder = new CubeViewsBuilder(cube, providers);
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