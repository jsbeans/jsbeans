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
                queryTask.times = {
                    started:Date.now(),
                    last: Date.now(),
                    pipeline: [],
                };
    			var executor = new QueryExecutor(queryTask);
                var it = executor.execute(); // new ver
                queryTask.times.executed = (Date.now() - queryTask.times.started)/1000;
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