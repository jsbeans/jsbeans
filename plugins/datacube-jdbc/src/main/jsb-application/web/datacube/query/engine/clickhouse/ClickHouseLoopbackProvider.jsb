{
	$name: 'DataCube.Query.Engine.ClickHouse.ClickHouseLoopbackProvider',
	$parent: 'DataCube.Query.Engine.Loopback.LoopbackProvider',

	$server: {
		$require: [
		    'Datacube.Query.Engine.ClickHouse.ClickHouseLoopbackApi',
        ],

        $constructor: function(cube){
            $base(cube, ClickHouseLoopbackApi.remoteQueries);
        },
	}
}