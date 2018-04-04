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

		query: function(dcQuery, params, dataProvider){
debugger;
		    $this.cube.load();
			var executor = new QueryExecutor($this, dataProvider || $this.cube, dcQuery, params);
            try {
                var it = executor.execute();
                return it;
            } catch(e) {
                executor.destroy();
                throw e;
            }
		},
	}
}