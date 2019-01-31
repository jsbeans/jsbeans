{
	$name: 'DataCube.Query.Query',
	$singleton: true,

	$server: {
		$require: [
            'DataCube.Query.Engine.QueryExecutor'
        ],

		execute: function(queryDescriptor){
		    queryDescriptor.cube && queryDescriptor.cube.load();
			var executor = new QueryExecutor(queryDescriptor);
            try {
                var it = executor.execute(); // new ver
                var oldClose = it.close;
                it.close = function(){
                    oldClose.call(this);
                    executor.destroy();
                };
                return it;
            } finally {
                executor.destroy();
            }
		},
	}
}