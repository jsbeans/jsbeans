{
	$name: 'DataCube.Query.QueryEngine',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.Engine.QueryExecutor',
        ],

		$constructor: function(cube){
		    this.cube = cube;
		    this.paramTypes = {};
		},

		query: function(dcQuery, params){
		    $this.cube.load();
			var executor = new QueryExecutor($this, $this.cube, dcQuery, params);
            try {
                var it = executor.execute();
                var oldClose = it.close;
                it.close = function(){
                    oldClose.call(this);
                    executor.destroy();
                };
                return it;
            } catch(e) {
                executor.destroy();
                throw e;
            }
		},
	}
}