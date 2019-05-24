/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Engine.ReturnQueryInterpreter',
	$parent: 'DataCube.Query.Engine.Interpreter',

	$singleton: true,

	$server: {
		$require: [
		    'DataCube.Query.Console',
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
                                message: 'query.executed.first_row',
                                params:{
                                    executor: executor.getId(),
                                    timestamp: Date.now(),
                                    iterator: this.meta.id,
                                    firstResultTime: (Date.now() - executor.startedTimestamp)/1000,
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