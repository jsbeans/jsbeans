{
	$name: 'DataCube.Query.Engine.Tests',
//	$singleton: true, /// uncomment for enable or comment for disable tests

	$server: {
		$require: [
		    'DataCube.Query.Engine.QueryExecutor',
		    'DataCube.Query.QueryUtils',
        ],


		$constructor: function(){
		    $this.test0();
		    $this.test1();
		},

		testQuery: function(query, expectedValues){
            debugger;
		    var exec = new QueryExecutor(null, null, query, {});

		    var it = exec.execute();
            QueryUtils.assert(it, 'Iterator is undefined');
            var values = [];
            try {
                do {
                    var obj = it.next();
                    obj && values.push(obj);
                } while(obj != null);
            } finally {
                it.close();
            }

            QueryUtils.assert(expectedValues.length == values.length, 'Unexpected values length');

            for(var i = 0; i < values.length; i++) {
                QueryUtils.assert(JSB.isEqual(expectedValues[i], values[i]), 'Unexpected value: {}', JSON.stringify(values[i]));
            }

        },

		test0: function(){
		    $this.testQuery(
		        {
                    $distinct: true,
                    $select: {
                        a: "a",
                        b: "b",
                    },
                    $filter: {$ne:["b", {$const:null}]},
                    $sort: ["a", "b"],
                },
                [
                    {a: 1, b: 'a'},
                    {a: 2, b: 'a'},
                    {a: 3, b: 'b'},
                    {a: 4, b: 'c'},
                    {a: 5, b: 'b'},
                ]
            );
        },

		test1: function(){
		    $this.testQuery(
		        {
                    $select: {
                        count: {$count:1},
                        sum: {$sum:"a"},
                        b: "b",
                    },
                    $filter: {$ne:["b", {$const:null}]},
                    $groupBy: ["b"],
                    $sort: ["sum"]
                },
                [
                   {b: "b", sum: 13, count:3},
                   {b: "c", sum: 4,  count:1},
                   {b: "a", sum: 3,  count:2},
                ]
            );
        },
	}
}