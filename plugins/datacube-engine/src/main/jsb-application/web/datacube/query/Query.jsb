/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Query',
	$singleton: true,

	$server: {
		$require: [
            'DataCube.Query.Engine.QueryExecutor'
        ],

        a:0,
        test: function(){
            Log.debug(this.a);
            Log.debug($this.a);
        },

		execute: function(queryTask){
		    $this.test.call({a:1});
            if (!queryTask.startEngine) {
//debugger;
//$this.prepare({
//    query: JSB.clone(queryTask.query),
//    cube: queryTask.cube,
//    params: queryTask.params,
//    callback: function(q,er){
//        Log.debug(JSON.stringify(arguments));
//        Log.debug(JSON.stringify(q && q.next && q.next()));
//        q && q.close && q.close();
//    }
//});
                queryTask.startEngine = Config.get('datacube.query.engine.start');
            }
		    queryTask.cube && queryTask.cube.load();
            try {
    			var executor = new QueryExecutor(queryTask);
                var it = executor.execute();
                if (queryTask.callback) {
                    var oldCallback = queryTask.callback;
                    queryTask.callback = function(it,err) {
                        var oldClose = it.close;
                        it.close = function(){
                            oldClose.call(this);
                            executor.destroy();
                        };
                        oldCallback.call(this,it,err);
                    }
                } else {
                    var oldClose = it.close;
                    it.close = function(){
                        oldClose.call(this);
                        executor.destroy();
                    };
                    return it;
                }
            } catch(e) {
                executor && executor.destroy();
                throw e;
            }
		},

		prepare: function(queryTask){
//		    queryTask.startEngine = Config.get('datacube.query.engine.prepare');
//            return $this.execute(queryTask);
            return {
                next: function() {
                    return queryTask.query;
                },
                close:function(){}
            };
		},
	}
}