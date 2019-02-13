{
	$name: 'DataCube.Query.Engine.Clickhouse.ClickHouseRemoteQuery',
	$parent: 'DataCube.Query.Engine.RemoteQuery',

	$server: {
		$require: [
		    'Datacube.Query.Engine.Clickhouse.ClickHouseRemoteApi',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Console',
		    'DataCube.Query.Query',
        ],

        $constructor: function(cube){
            $this.cube = cube;
        },

		register: function(queryTask){
            var uid = $this.getId() + '/' + JSB.generateUid();
            ClickHouseRemoteApi.remoteQueries.put(uid, function(){
                return Query.execute(queryTask);
            });

            Console.message({
                message: 'Remote sub-query prepared',
                params: {type: $this.getJsb().$name, uid: uid, query: queryTask.query}
            });
            return uid;
		},

		destroy: function() {
            for(var it = ClickHouseRemoteApi.remoteQueries.entrySet().iterator(); it.hasNext();) {
                var entry = it.next();
                if (entry.getKey().startsWith($this.getId())) {
                    it.remove();
                    Console.message({
                        message: 'Remote sub-query destroyed',
                        params: {uid: ''+entry.getKey()}
                    });
                }
            }
		    $base();
		},
	}
}