{
	$name: 'DataCube.Query.ViewsExtractorTest',
	$singleton: true,

	$server: {
	    $require: [
	        'DataCube.Query.ViewsExtractor',
        ],

		$constructor: function(){
//			startTests();
		},

		startTests: function(){
		    for(var i in $this.tests) {
		        var test = $this.tests[i];
		        if (test.length != 2) continue;
		        var inputQuery = test[0];
		        var expectedQuery = test[1];
		        $this.startTest(inputQuery, expectedQuery);
		    }
		},

		startTest: function(inputQuery, expectedQuery){
            var extr = new ViewsExtractor();
            var resultQuery = extr.extractViews(inputQuery);
            if (JSB.isEqual(queryAfter, resultQuery)) {
                Log.error('ViewsExtractor test failed:\n' +
                            'inputQuery=' + JSON.stringify(inputQuery,0,2) + '\n' +
                            'expectedQuery=' + JSON.stringify(expectedQuery,0,2) + '\n' +
                            'resultQuery=' + JSON.stringify(resultQuery,0,2) + '\n')
                throw new Error('ViewsExtractor test failed');
            }
		},

		tests: [
		    // test 1
		    [{
                "$groupBy": ["f1"],
                "$select": {
                    "a1": "f1",
                    "count": {"$count": "f2"},
                }
            },{
                "$views": {
                    "view1": {
                        "$groupBy": ["f1"],
                        "$select": {
                            "a1": "f1",
                            "count": {"$count": "f2"},
                        },
                    }
                },
                "$select": {
                    "a1": "a1",
                    "count": "count",
                },
                "$from": "view1"
            }],

            // test 2
//		    [{
//		        $context : "top",
//                $groupBy: ["f1", "f2"],
//                $filter: {
//                    $and: [
//                        {$ne: [ "f2", {$const: 1}]}
//                    ]
//                },
//                $select: {
//                    "a1": "f1",
//                    "f2": "f2",
//                    "f3_subquery": {
//                        $context: "subqueryf3",
//                        $select: {
//                            "f3_subcount": {$count: "f3"}
//                        },
//                        $filter: {
//                            $and: [
//                                {$eq: [ "f1", {$field: "f2", $context: "top"} ]},
//                                {$eq: [ "f2", {$sub: [{$field: "f2", $context: "top"}, {$const: 1}]} ]}
//                            ]
//                        }
//                        $groupBy: ["f1", "f2"],
//                    },
//                    "f4_subquery": {
//                        $context: "subqueryf4",
//                        $select: {
//                            "f4_subcount": {$count: "f4"}
//                        },
//                        $filter: {
//                            $and: [
//                                {$eq: [ "f1", {$field: "f2", $context: "top"} ]},
//                                {$eq: [ "f2", {$sub: [{$field: "f2", $context: "top"}, {$const: 1}]} ]}
//                            ]
//                        }
//                        $groupBy: ["f1", "f2"],
//                    },
//                    "max_subquery": {
//                        $context: "subquery_with_from",
//                        $select: {
//                            "max": {$max: "subcount_f4"}
//                        },
//                        $from: {
//                           $context: "subquery_from",
//                           $select: {
//                               "subcount_f4": {$count: "f4"},
//                               "f1": "f1",
//                               "f2": "f2",
//                           },
//                           $groupBy: ["f1", "f2"]
//                       }
//                    },
//                },
//                $filter: {
//                    $and: [
//                        {$ne: [ "f1", {$const: null} ]}
//                    ]
//                },
//            },{
//                $views: {
//                    "view1": {
//                      $groupBy: ["f1", "f2"],
//                      $select: {
//                         "subcount_f4": {$count: "f4"},
//                         "f3_subcount": {$count: "f3"},
//                         "f1": "f1",
//                         "f2": "f2",
//                      }
//                    }
//                },
//                $from: "view1",
//                $context : "top",
//                $filter: {
//                    $and: [
//                        $ne: [ "f2", {$const: 1}]
//                    ]
//                },
//                $select: {
//                    "a1": "f1",
//                    "f2": "f2",
//                    "f3_subquery": {
//                        $from: "view1",
//                        $context: "subqueryf3",
//                        $select: {
//                            "f3_subcount": "f3_subcount"
//                        },
//                        $filter: {
//                            $and: [
//                                $eq: [ "f1", {$field: "f2", $context: "top"} ],
//                                $eq: [ "f2", {$sub: [{$field: "f2", $context: "top"}, {$const: 1}]} ]
//                            ]
//                        }
//                    },
//                    "f4_subquery": {
//                        $from: "view1",
//                        $context: "subqueryf4",
//                        $select: {
//                            "subcount_f4": "subcount_f4"
//                        },
//                        $filter: {
//                            $and: [
//                                $eq: [ "f1", {$field: "f2", $context: "top"} ],
//                                $eq: [ "f2", {$sub: [{$field: "f2", $context: "top"}, {$const: 1}]} ]
//                            ]
//                        }
//                    },
//                    "max_subquery": {
//                        $context: "subquery_with_from",
//                        $select: {
//                            "max": {$max: "subcount_f4"}
//                        },
//                        $from: {
//                           $from: "view1",
//                           $context: "subquery_from",
//                           $select: {
//                               "subcount_f4": "subcount_f4",
//                               "f1": "f1",
//                               "f2": "f2",
//                           }
//                       }
//                    },
//                },
//                $filter: {
//                    $and: [
//                        $ne: [ "f1", {$const: null} ]
//                    ]
//                },
//            }],

		    [],
		]
	}
}