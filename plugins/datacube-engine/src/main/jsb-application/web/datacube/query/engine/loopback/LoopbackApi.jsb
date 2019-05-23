/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name:'Datacube.Query.Engine.Postgres.Loopback.LoopbackApi',

	$server:{
		$require: [
		    'DataCube.Query.Console',
            'java:java.lang.StringBuilder',
            'java:java.util.concurrent.ConcurrentHashMap'
        ],

        remoteQueries: null,

        $constructor: function(name){
            $this.remoteQueries = new ConcurrentHashMap();
            $this.maxsize = 0+Config.get('datacube.query.engine.loopback.'+name+'.api.maxsize');
        },

        /** Returns query result objects with ClickHouse JSONEachRow format*/
		get: function(params){
			var scope = (function(){return this;}).call(null);
			var request = scope['__request'];
			var response = scope['__response'];

            if(!params.test && !params.uid) throw 'Query uid is not defined';
            var callback = $this.remoteQueries.get(params.uid);
            if(!params.test && !callback) throw 'Remote query ' + params.uid + ' is not defined';

            try {
                if (params.test) {
                    var it = $this.generateTestIterator();
                } else {
                    var it = callback(params.offset||null, params.limit||null);
                }

                var StreamClass = JSB().get('JSB.IO.TextStream').getClass();
                var oStream = new StreamClass(response.getOutputStream(), {charset: 'UTF-8'});
                $this.writeOutput(it, oStream, params);
                return;
            } catch(e) {
                response && response.setStatus(500, JSB.stringifyError(e).substr(0,100));
                throw e;
            } finally {
                it && it.close();
                oStream && oStream.close();
            }
		},

		writeOutput: function(it, out, params) {
		    throw new JSB.Error('Not implemented');
		},

		generateTestIterator: function(){
		    var i = 0;
		    var data = [
		        {a:1,b:'bbb', c:'aaaa'},
		        {a:2,b:'bbb', c:'aaaa'},
		        {a:3,b:'bbb', c:'aaaa'},
		        {a:4,b:'bbb', c:'aaaa'},
		        {a:5,b:'bbb', c:'aaaa'},
		    ];
		    return {
		        next: function(){
		            return data.length > i ? data[i++] : null;
		        },
		        close: function(){
		        }
		    };
		},
	}
}