/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name:'Datacube.Query.Engine.ClickHouse.ClickHouseLoopbackApi',
	$parent: 'Datacube.Query.Engine.Postgres.Loopback.LoopbackApi',

	$http: true,
	$singleton: true,

	$server:{
		$require: [
		    'DataCube.Query.Console',
        ],

        $constructor: function(){
            $base('clickhouse');
        },

		writeOutput: function(it, out, params) {
            var count = 0;
            var length = 0;
            for(var obj = it.next(); !!obj; ++count) {
                var str = JSON.stringify(obj) + '\n';
                length += str.length;
                out.write(str);
                if (length > $this.maxsize) {
                    break;
                }
                obj = it.next();
            }
            Console.message({
                message: 'query.loopback.clickhouse.returned',
                params: {uid:params.uid, count: count, outputSize: length, limited: length > $this.maxsize }
            });
		},
	}
}