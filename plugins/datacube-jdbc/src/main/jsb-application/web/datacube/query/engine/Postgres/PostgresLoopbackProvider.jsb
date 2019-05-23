/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Engine.Postgres.PostgresLoopbackProvider',
	$parent: 'DataCube.Query.Engine.Loopback.LoopbackProvider',

	$server: {
		$require: [
		    'Datacube.Query.Engine.Postgres.PostgresLoopbackApi',
        ],

        $constructor: function(cube){
            $base(cube, PostgresLoopbackApi.remoteQueries);
        },
	}
}