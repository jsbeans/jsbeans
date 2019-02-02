{
	$name: 'DataCube.Query.Engine.TransformEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.QueryUtils',
        ],

		execute: function(name, executor, queryDescriptor){
		    var query = queryDescriptor.query;
		    var cube = queryDescriptor.cube;
		    var params = queryDescriptor.params;

		    var config = $this.getLocalConfig(name);

		    var transformers = JSB.isString(config.transformers)
		        ? Config.get(config.transformers)
		        : config.transformers;

            var preparedQuery = QueryTransformer.transform(transformers||[], query, cube);

            for(var i = 0; i < config.next.length; i++) {
                var next = config.next[i];
                executor.executeEngine(next, {
                    cube: cube,
                    query: JSB.clone(preparedQuery),
                    params: JSB.clone(params),
                });
            }

            return null; // no iterator
		},
	}
}