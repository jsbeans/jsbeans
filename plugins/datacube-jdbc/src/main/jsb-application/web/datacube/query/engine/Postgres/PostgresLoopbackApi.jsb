{
	$name:'Datacube.Query.Engine.Postgres.PostgresLoopbackApi',
	$parent: 'Datacube.Query.Engine.Postgres.Loopback.LoopbackApi',

	$http: true,
	$singleton: true,

	$server:{
		$require: [
		    'DataCube.Query.Console',
        ],

        $constructor: function(){
            $base('postgresql');
        },

		writeOutput: function(it, out, params) {
            var count = 0;
            var length = 0;
            out.write('[\n');
            for(var obj = it.next(); !!obj; ++count) {
                if (length != 0) {
                    out.write(',\n');
                }
                var str = JSON.stringify(obj);
                length += str.length;
                out.write(str);
                if (length > $this.maxsize) {
                    break;
                }
                obj = it.next();
            }
            out.write('\n]');
            Console.message({
                message: 'query.loopback.postgresql.returned',
                params: {uid:params.uid, count: count, outputSize: length, limited: length > $this.maxsize }
            });
		},
	}
}