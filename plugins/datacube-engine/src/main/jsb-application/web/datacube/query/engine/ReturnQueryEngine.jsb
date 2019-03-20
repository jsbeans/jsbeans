{
	$name: 'DataCube.Query.Engine.ReturnQueryEngine',
	$parent: 'DataCube.Query.Engine.Engine',

	$singleton: true,

	$server: {
		$require: [
        ],

		execute: function(name, executor, queryTask){
		    var result = queryTask.query;
		    return {
		        next: function(){
                    try {
                        return result;
                    } finally {
                        if (result) {
                            Console.message({
                                message: 'query.executed',
                                params:{
                                    executor: $this.executor.getId(),
                                    timestamp: Date.now(),
                                    iterator: this.meta.id,
                                    firstResultTime: (Date.now() - $this.executor.startedTimestamp)/1000,
                                    //query: dcQuery,
                                },
                            });
                            result = null;
                        }
                    }
		        },
		        close: function(){
		        },
		        meta: {
		        }
		    };
		},
	}
}