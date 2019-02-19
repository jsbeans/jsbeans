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
debugger
            var uid = $this.getId() + '/' + JSB.generateUid();
            ClickHouseRemoteApi.remoteQueries.put(uid, function(offset, limit){
                if (offset != null) {
                    queryTask.query.$offset = offset;
                }
                if (limit != null) {
                    queryTask.query.$limit = limit;
                }
                return Query.execute(queryTask);
            });

            Console.message({
                message: 'ClickHouse remote sub-query prepared',
                params: {type: $this.getJsb().$name, uid: uid, query: queryTask.query, limit : queryTask.query.limit}
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
		destroy: function() {

		},
	}
}