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
            $this.maxsize = 0+Config.get('datacube.query.engine.remoteQuery.clickhouse.api.maxsize');
        },

        /** Returns query result objects with ClickHouse JSONEachRow format*/
		get: function(params){
debugger;
			var scope = (function(){return this;}).call(null);
			var request = scope['__request'];
			var response = scope['__response'];

            if(!params.uid) throw 'Query uid is not defined';
            var callback = $this.remoteQueries.get(params.uid);
            if(!callback) throw 'Remote query ' + params.uid + ' is not defined';

            try {
                var it = callback(params.offset||null, params.limit||null);
                var StreamClass = JSB().get('JSB.IO.TextStream').getClass();
                var oStream = new StreamClass(response.getOutputStream(), {charset: 'UTF-8'});
                var count = 0;
                var length = 0;
                for(var obj = it.next(); !!obj; ++count) {
                    var str = JSON.stringify(obj) + '\n';
                    length += str.length;
                    oStream.write(str);
                    if (length > $this.maxsize) {
                        break;
                    }
                    obj = it.next();
                }
                Console.message({
                    message: 'ClickHouse remote sub-query output',
                    params: {uid:params.uid, count: count, outputSize: length, limited: length > $this.maxsize }
                });
                return;
            } finally {
                it && it.close();
                oStream && oStream.close();
            }

//            var count = 0;
//            try {
//                var buff = new StringBuilder();
//                for(var obj = it.next(); !!obj; ++count) {
//                    buff.append(JSON.stringify(obj)).append('\n');
//                    if (buff.length() > $this.maxsize) {
//                        break;
//                    }
//                    obj = it.next();
//                }
//
//                Console.message({
//                    message: 'ClickHouse remote sub-query output',
//                    params: {uid:params.uid, count: count, outputSize: buff.length(), limited: buff.length() > $this.maxsize }
//                });
//                return buff.toString();
//            } finally{
//                it.close();
//            }
		},
	}
}