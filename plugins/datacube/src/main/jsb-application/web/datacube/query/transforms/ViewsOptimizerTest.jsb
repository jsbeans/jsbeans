{
	$name: 'DataCube.Query.ViewsOptimizerTest',
	$singleton: true,

	$server: {
	    $require: [
	        'DataCube.Query.ViewsOptimizer',
        ],

		$constructor: function(){
			$this.startTests();
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
            var extr = new ViewsOptimizer();
            var resultQuery = extr.buildViews(inputQuery);
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
                $extractViews: true,
                $groupBy: ["f1"],
                $select: {
                    "a1": "f1",
                    "count": {"$count": "f2"},
                },
            },{
                $extractViews: true,
                $views: {
                    view1: {
                        $groupBy: ["f1"],
                        $select: {
                            "a1": "f1",
                            "count": {$count: "f2"},
                        },
                    },
                },
                $select: {
                    "a1": "a1",
                    "count": "count",
                },
                $from: "view1",
            }],

		    // test 2
		    [{
                $extractViews: true,
                $groupBy: ["f1"],
                $select: {
                    "a1": "f1",
                    "count": {"$count": "f2"},
                    "subq": {
                        $select: {
                            "subcount": {$max: "inner_count"},
                        },
                        $from: {
                            $groupBy: ["f1"],
                            $select: {
                                "inner_count": {$count: "f2"},
                            },
                        },
                    },
                },
            },{
                $extractViews: true,
                $views: {
                    view1: {
                        $groupBy: ["f1"],
                        $select: {
                            "a1": "f1",
                            "count": {$count: "f2"},
                        },
                    },
                },
                $select: {
                    "a1": "a1",
                    "count": "count",
                    "subq": {
                        $select: {
                            "subcount": {$max: "inner_count"},
                        },
                        $from: {
                            $select: {
                                "inner_count": "count",
                            },
                            $from: "view1",
                        },
                    },
                },
                $from: "view1",
            }],

		    // test 2
		    [{
                $extractViews: true,
                $groupBy: ["f1"],
                $select: {
                    "a1": "f1",
                    "count": {"$count": "f2"},
                    "subcount": {
                        $select: {
                            "subcount": {$max: "inner_count"},
                        },
                        $from: {
                            $groupBy: ["f1"],
                            $select: {
                                "inner_count": {$count: "f2"},
                                "f1": "f1",
                            },
                        },
                    },
                    "subname": {
                        $select: {
                            "subname": "f1",
                        },
                        $filter: {
                            $eq: ["inner_count", {
                                $select: {
                                    "subcount": {$max: "inner_count"},
                                },
                                $from: {
                                    $groupBy: ["f1"],
                                    $select: {
                                        "inner_count": {$count: "f2"},
                                    },
                                },
                            }],
                        },
                        $from: {
                            $groupBy: ["f1"],
                            $select: {
                                "inner_count": {$count: "f2"},
                                "f1": "f1",
                            },
                        },
                    },
                },
            },{
                $extractViews: true,
                $views: {
                    view1: {
                        $groupBy: ["f1"],
                        $select: {
                            "a1": "f1",
                            "count": {$count: "f2"},
                        },
                    },
                },
                $select: {
                    "a1": "a1",
                    "count": "count",
                    "subcount": {
                        $select: {
                            "subcount": {$max: "inner_count"},
                        },
                        $from: {
                            $select: {
                                "inner_count": "count",
                            },
                            $from: "view1",
                        },
                    },
                    "subname": {
                        $select: {
                            "subname": "f1"
                        },
                        $filter: {
                            $eq: ["inner_count", {
                                $select: {
                                    "subcount": {$max: "inner_count"}
                                },
                                $from: {
                                    $select: {
                                        "inner_count": "count",
                                    },
                                    $from: "view1",
                                },
                            }],
                        },
                        $from: {
                            $select: {
                                "inner_count": "count",
                                "f1": "a1",
                            },
                            $from: "view1",
                        },
                    },
                },
                $from: "view1",
            }],

		    // test 2
		    [{
                $extractViews: true,
                $groupBy: ["f1"],
                $select: {
                    "a1": "f1",
                    "count": {"$count": "f2"},
                    "subcount": {
                        $select: {
                            "subcount": {$max: "inner_count"},
                        },
                        $from: {
                            $groupBy: ["f1"],
                            $select: {
                                "inner_count": {$count: "f2"},
                                "f1": "f1",
                            },
                        },
                    },
                    "subname": {
                        $select: {
                            "subname": "f1",
                        },
                        $filter: {
                            $eq: ["inner_count", {
                                $select: {
                                    "subcount": {$max: "inner_count"},
                                },
                                $from: {
                                    $groupBy: ["f1"],
                                    $select: {
                                        "inner_count": {$count: "f2"},
                                    },
                                },
                            }],
                        },
                        $from: {
                            $groupBy: ["f1"],
                            $select: {
                                "inner_count": {$count: "f2"},
                                "f1": "f1",
                            },
                        },
                    },
                },
            },{
                $extractViews: {includeFrom:true},
                $views: {
                    view1: {
                        $groupBy: ["f1"],
                        $select: {
                            "a1": "f1",
                            "count": {$count: "f2"},
                        },
                    },
                    view2: {
                        $select: {
                            "inner_count": "count",
                            "f1": "a1",
                        },
                        $from: "view1",
                    },
                },
                $select: {
                    "a1": "a1",
                    "count": "count",
                    "subcount": {
                        $select: {
                            "subcount": {$max: "inner_count"},
                        },
                        $from: "view2",
                    },
                    "subname": {
                        $select: {
                            "subname": "f1"
                        },
                        $filter: {
                            $eq: ["inner_count", {
                                $select: {
                                    "subcount": {$max: "inner_count"}
                                },
                                $from: "view2",
                            }],
                        },
                        $from: "view2",
                    },
                },
                $from: "view1",
            }],

		    [],
		]
	}
}