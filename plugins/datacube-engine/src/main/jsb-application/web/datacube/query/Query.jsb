{
	$name: 'DataCube.Query.Query',
	$singleton: true,

	$server: {
		$require: [
            'DataCube.Query.Engine.QueryExecutor'
        ],

		execute: function(queryTask){
            if (!queryTask.startEngine) {
//$this.prepare(JSB.merge({}, queryTask, {callback: function(q,er){
//    Log.debug(JSON.stringify(arguments));
//}}));
                queryTask.startEngine = Config.get('datacube.query.engine.start');
            }
		    queryTask.cube && queryTask.cube.load();
            try {
    			var executor = new QueryExecutor(queryTask);
                var it = executor.execute();
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

		prepare: function(queryTask){
		    queryTask.startEngine = Config.get('datacube.query.engine.prepare');
            return $this.execute(queryTask);
		},
	}
}