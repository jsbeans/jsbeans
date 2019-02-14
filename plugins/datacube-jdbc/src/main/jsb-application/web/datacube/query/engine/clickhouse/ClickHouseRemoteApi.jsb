{
	$name:'Datacube.Query.Engine.Clickhouse.ClickHouseRemoteApi',

	$http: true,
	$singleton: true,

	$server:{
		$require: [
		    'DataCube.Query.Console',

            'java:java.lang.StringBuilder',
            'java:java.util.concurrent.ConcurrentHashMap'
        ],

        remoteQueries: null,

        $constructor: function(){
            $this.remoteQueries = new ConcurrentHashMap();
        },

        /** Returns query result objects with ClickHouse JSONEachRow format*/
		get: function(params){
debugger;
            if(!params.uid) throw 'Query uid is not defined';
            var callback = remoteQueries.get(params.uid);
            if(!callback) throw 'Remote query ' + params.uid + ' is not defined';

            var it = callback();
            try {
                var str = new StringBuilder();
                for(var obj = it.next(); !!obj; ) {
                    str.append(JSON.stringify(obj)).append('\n');
                    obj = it.next();
                }
                return str.toString();
            } finally{
                it.close();
            }
		},
	}
}