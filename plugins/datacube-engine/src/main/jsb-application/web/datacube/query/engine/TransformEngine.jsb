{
	$name: 'DataCube.Query.Engine.TransformEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
		    'DataCube.Query.Transforms.QueryTransformer',
		    'DataCube.Query.QueryUtils',
        ],

		execute: function(name, executor, queryTask){
		    var query = queryTask.query;
		    var cube = queryTask.cube;
		    var params = queryTask.params;

            var started = Date.now();

		    var config = $this.getLocalConfig(name);

		    var transformers = JSB.isString(config.transformers)
		        ? Config.get(config.transformers)
		        : config.transformers;

            var result = QueryTransformer.transform(transformers||[], queryTask, executor);
            executor.setEngineMeta(name, result.meta);
            if (result.error) {
                throw result.error;
            }
            for(var i = 0; i < config.next.length; i++) {
                var next = config.next[i];
                var it = executor.executeEngine(next, {
                    cube: cube,
                    query: JSB.clone(result.query),
                    params: JSB.clone(params),
                });
                if(it) {
                    return it;
                }
            }
            return null; // no iterator
		},
	}
}