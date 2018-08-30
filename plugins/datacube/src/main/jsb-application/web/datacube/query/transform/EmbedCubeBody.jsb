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

		transform: function(dcQuery, cubeOrDataProvider){
            var cube = cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube' && cubeOrDataProvider;
		    dcQuery = JSB.clone(dcQuery);
		    QueryUtils.walkAllSubQueries(dcQuery, function(query){
		        if (!query.$from && !query.$provider && !query.$join && !query.$union  || query.$cube) {
		            try {
                        var query2 = JSB.merge({}, query, {$views: dcQuery.$views});
                        var usedFields = /**{field:usages};*/ QueryUtils.extractUsedFields(query2, cubeOrDataProvider);
                        if (Object.keys(usedFields).length == 0) {
                            query.$from = {};
                            return;
                        }

		                var providers = cube
		                        ? QueryUtils.extractQueryProviders(dcQuery, cube)
		                        : [cubeOrDataProvider];
		                var builder = new CubeViewsBuilder(cube, providers);

                        var view = builder.build(query.$context, usedFields);
                        query.$from = JSB.clone(view.getFromBody());
		            } finally {
		                builder && builder.destroy();
		                view && view.destroy();
		            }

                }
		    });

		    QueryUtils.defineContextQueries(dcQuery);

		    return dcQuery;
		},
	}
}