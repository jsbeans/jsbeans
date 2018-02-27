{
	$name: 'DataCube.Query.Views.PatternViewsExtractorTest',
	$singleton: true,

	$server: {
	    $require: [
	        'DataCube.Query.Views.PatternViewsExtractor',
        ],

		$constructor: function(){
		    return; // comment for test
		    var debug = Config.get('kernel.jshub.openDebugger');
		    var repeat = true;
		    for(;repeat;){
		        try {
			        $this.startTests();
			        return;
                } catch(e) {
		            Log.error(e);
                    debugger;
                    repeat = debug;
                }
            }
		},

		startTests: function(){
		    for(var i in $this.tests) {
		        var test = $this.tests[i];
		        if (test.length != 3) continue;
		        var name = test[0];
		        var inputQuery = test[1];
		        var expectedQuery = test[2];
		        $this.startTest(inputQuery, expectedQuery, name);
		        Log.debug("Test completed: " + name);
		    }
		},

		startTest: function(inputQuery, expectedQuery, name){
            var extr = new PatternViewsExtractor();
            var inputQueryClone = JSB.merge(true,{}, inputQuery);
            var resultQuery = extr.buildViews(inputQuery);
            // Log.debug(JSON.stringify(resultQuery,0,2));
            if (!JSB.isEqual(inputQuery, inputQueryClone)) {
                throw new Error('Broken input query');
            }
            if (!JSB.isEqual(expectedQuery, resultQuery)) {
                Log.error('ViewsExtractor test "' + name + '" failed:\n' +
                            'inputQuery=' + JSB.stringify(inputQuery,null,null,true) + '\n' +
                            'expectedQuery=' + JSB.stringify(expectedQuery,null,null,true) + '\n' +
                            'resultQuery=' + JSB.stringify(resultQuery,null,null,true) + '\n')
                throw new Error('PatternViewsExtractorTest test "' + name + '" failed');
            }
		},

		tests: [
		    ["Test 1",
		    {
                $extractViews: {minCount: 1},
                $groupBy: ["f1"],
                $select: {
                    "a1": "f1",
                    "count": {"$count": "f2"},
                },
            },{
                $views: {
                    view1: {
                        $groupBy: ["f1"],
                        $select: {
                            "vf_a1": "f1",
                            "vf_count": {$count: "f2"},
                        },
                    },
                },
                $select: {
                    "a1": "vf_a1",
                    "count": "vf_count",
                },
                $from: "view1",
            }],

		    ["Test 2",
            {
                $extractViews: {minCount: 2},
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
                $views: {
                    view1: {
                        $groupBy: ["f1"],
                        $select: {
                            "vf_a1": "f1",
                            "vf_count": {$count: "f2"},
                        },
                    },
                },
                $select: {
                    "a1": "vf_a1",
                    "count": "vf_count",
                    "subq": {
                        $select: {
                            "subcount": {$max: "inner_count"},
                        },
                        $from: {
                            $select: {
                                "inner_count": "vf_count",
                            },
                            $from: "view1",
                        },
                    },
                },
                $from: "view1",
            }],

		    ["Test 3",
		    {
                $extractViews: {minCount: 2},
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
                $views: {
                    view1: {
                        $groupBy: ["f1"],
                        $select: {
                            "vf_a1": "f1",
                            "vf_count": {$count: "f2"},
                        },
                    },
                },
                $select: {
                    "a1": "vf_a1",
                    "count": "vf_count",
                    "subcount": {
                        $select: {
                            "subcount": {$max: "inner_count"},
                        },
                        $from: {
                            $select: {
                                "inner_count": "vf_count",
                                "f1": "vf_a1",
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
                                        "inner_count": "vf_count",
                                    },
                                    $from: "view1",
                                },
                            }],
                        },
                        $from: {
                            $select: {
                                "inner_count": "vf_count",
                                "f1": "vf_a1",
                            },
                            $from: "view1",
                        },
                    },
                },
                $from: "view1",
            }],

//		    ["Test 4",
//            {
//                $extractViews: {includeFrom:true, minCount: 1},
//                $groupBy: ["f1"],
//                $select: {
//                    "a1": "f1",
//                    "count": {"$count": "f2"},
//                    "subcount": {
//                        $select: {
//                            "subcount": {$max: "inner_count"},
//                        },
//                        $from: {
//                            $groupBy: ["f1"],
//                            $select: {
//                                "inner_count": {$count: "f2"},
//                                "f1": "f1",
//                            },
//                        },
//                    },
//                    "subname": {
//                        $select: {
//                            "subname": "f1",
//                        },
//                        $filter: {
//                            $eq: ["inner_count", {
//                                $select: {
//                                    "subcount": {$max: "inner_count"},
//                                },
//                                $from: {
//                                    $groupBy: ["f1"],
//                                    $select: {
//                                        "inner_count": {$count: "f2"},
//                                    },
//                                },
//                            }],
//                        },
//                        $from: {
//                            $groupBy: ["f1"],
//                            $select: {
//                                "inner_count": {$count: "f2"},
//                                "f1": "f1",
//                            },
//                        },
//                    },
//                },
//            },{
//                $views: {
//                    view1: {
//                        $groupBy: ["f1"],
//                        $select: {
//                            "vf_a1": "f1",
//                            "vf_count": {$count: "f2"},
//                        },
//                    },
//                    view2: {
//                        $select: {
//                            "inner_count": "vf_count",
//                            "f1": "vf_a1",
//                        },
//                        $from: "view1",
//                    },
//                },
//                $select: {
//                    "a1": "vf_a1",
//                    "count": "vf_count",
//                    "subcount": {
//                        $select: {
//                            "subcount": {$max: "inner_count"},
//                            "f1": "vf_a1",
//                        },
//                        $from: "view2",
//                    },
//                    "subname": {
//                        $select: {
//                            "subname": "f1"
//                        },
//                        $filter: {
//                            $eq: ["inner_count", {
//                                $select: {
//                                    "subcount": {$max: "inner_count"}
//                                },
//                                $from: "view2",
//                            }],
//                        },
//                        $from: "view2",
//                    },
//                },
//                $from: "view1",
//            }],

		    [],
		]
	}
}