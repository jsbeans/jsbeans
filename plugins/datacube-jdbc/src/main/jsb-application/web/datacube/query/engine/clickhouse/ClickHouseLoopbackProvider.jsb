{
	$name: 'DataCube.Query.Engine.ClickHouse.ClickHouseLoopbackProvider',
	$parent: 'DataCube.Query.Engine.LoopbackProvider',

	$server: {
		$require: [
		    'Datacube.Query.Engine.ClickHouse.ClickHouseLoopbackApi',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Console',
		    'DataCube.Query.Query',
        ],

        $constructor: function(cube){
            $this.cube = cube;
        },

		register: function(queryTask){
            var uid = $this.getId() + '/' + JSB.generateUid();
            ClickHouseLoopbackApi.remoteQueries.put(uid, function(offset, limit){
                if (offset != null) {
                    queryTask.query.$offset = offset;
                }
                if (limit != null) {
                    queryTask.query.$limit = limit;
                }
                return Query.execute(queryTask);
            });

            Console.message({
                message: 'query.loopback.prepared',
                params: {
                    timestamp: Date.now(),
                    type: $this.getJsb().$name,
                    uid: uid,
                    query: queryTask.query,
                    limit : queryTask.query.limit
                },
            });
            return uid;
		},

		destroy: function() {
            for(var it = ClickHouseLoopbackApi.remoteQueries.entrySet().iterator(); it.hasNext();) {
                var entry = it.next();
                if (entry.getKey().startsWith($this.getId())) {
                    it.remove();
                }
            }
		    $base();
		},
		destroy: function() {

		},
	}
}