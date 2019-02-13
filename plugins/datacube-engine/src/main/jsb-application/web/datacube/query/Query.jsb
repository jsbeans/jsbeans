{
	$name: 'DataCube.Query.Query',
	$singleton: true,

	$server: {
		$require: [
            'DataCube.Query.Engine.QueryExecutor'
        ],

		execute: function(queryTask){
		    queryTask.cube && queryTask.cube.load();
            try {
    			var executor = new QueryExecutor(queryTask);
                var it = executor.execute(); // new ver
                var oldClose = it.close;
                it.close = function(){
                    oldClose.call(this);
                    executor.destroy();
                };
                return it;
            } catch(e) {
                executor && executor.destroy();
                throw e;
            }
		},
	}
}