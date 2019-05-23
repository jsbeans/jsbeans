/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Engine.Loopback.LoopbackProvider',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Console',
		    'DataCube.Query.Query',
        ],

        $constructor: function(cube, loopbackTasksMap){
            $this.cube = cube;
            $this.loopbackTasksMap = loopbackTasksMap;
        },

		register: function(queryTask){
            var uid = $this.getId() + '/' + JSB.generateUid();
            $this.loopbackTasksMap.put(uid, $this.produceCallback(queryTask));

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

		produceCallback: function(queryTask){
		    return function(offset, limit){
                if (offset != null) {
                    queryTask.query.$offset = offset;
                }
                if (limit != null) {
                    queryTask.query.$limit = limit;
                }
                return Query.execute(queryTask);
            };
		},

		destroy: function() {
            for(var it = $this.loopbackTasksMap.entrySet().iterator(); it.hasNext();) {
                var entry = it.next();
                if (entry.getKey().startsWith($this.getId())) {
                    it.remove();
                }
            }
		    $base();
		},
	}
}