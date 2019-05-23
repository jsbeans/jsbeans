/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Cost.SliceCost',
	$singleton: true,

	$server: {
	    $require: [
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5',
        ],

        compareSlices: function(leftSlice, rightSlice) {
//debugger;
            // TODO временно отключено: починить и реализовать взвешивание
//            var leftCost = leftSlice.getQueryCost && leftSlice.getQueryCost
//                    ? leftSlice.getQueryCost()
//                    : $this.calculateQuery(leftSlice.getQuery(), leftSlice.getQuery());
//            var rightCost = rightSlice.getQueryCost && rightSlice.getQueryCost
//                    ? rightSlice.getQueryCost()
//                    : $this.calculateQuery(rightSlice.getQuery(), rightSlice.getQuery());
//            if (leftCost > rightCost) return 1;
//            if (leftCost < rightCost) return -1;
//
//            var leftDims  = QueryUtils.extractSliceDimensions(leftSlice, true);
//            var rightDims = QueryUtils.extractSliceDimensions(rightSlice, true);
//            if (leftDims > rightDims) return 1;
//            if (leftDims < rightDims) return -1;

            return 0;
        },

        calculateQuery: function(query, rootQuery) {

            if (JSB.isString(query)) {
                var name = query;
                query = QueryUtils.findView(name, rootQuery, rootQuery);
                if (!query) {
                    var slice = QueryUtils.getQuerySlice(name, null);
                    query = slice.getQuery();
                }

                QueryUtils.throwError(query, 'Calculate cost error: Query is undefined: ' + name);
            }

            var bodyFactor = 0;

            if (query.$filter) {
                bodyFactor += 0.5;
            }

            if (query.$groupBy) {
                bodyFactor += 1;
            }

            if (query.$sort) {
                bodyFactor += 0.5;
            }

            var sourceCost = $this.calculateSource(query, rootQuery);
            var nestedCost = $this.calculateNestedSubQueries(query, rootQuery);
            var queryCost = sourceCost + nestedCost + sourceCost*bodyFactor;

            return queryWeight;
        },
//
        calculateSource: function(query, rootQuery) {
            var sourceCost;
            if (query.$provider) {
                sourceCost = $this.calculateProvider(query.$provider, query, rootQuery);
            } else if (query.$from && JSB.isEqual({}, query.$from)) {
                sourceCost = 1.0;
            } else if (query.$from) {
                var sourceQuery = JSB.isString(query.$from) ? rootQuery.$views[query.$from] : query.$from;
                sourceCost = $this.calculateQuery(sourceQuery, rootQuery);
            } else if (query.$join) {
                sourceCost = $this.calculateJoin(query.$join, query, rootQuery);
            } else if (query.$union) {
                sourceCost = $this.calculateUnion(query.$join, query, rootQuery);
            } else if (query.$recursive) {
                sourceCost = $this.calculateRecursive(query.$recursive, query, rootQuery);
            } else {
                QueryUtils.throwError(0, 'QueryWeigher: Invalid source in query "{}"', query.$context);
            }
            return sourceCost;
        },

        calculateNestedSubQueries: function(query, rootQuery) {
            var cost = 0;
		    QueryUtils.walkQueries(query, {rootQuery:rootQuery},
		        function() { },
		        function(subQuery){
		            if (!this.inFrom && !this.inJoin && !this.inUnion && !this.inRecursive) {
                        // is nested query-expression
                        cost += $this.calculateQuery(subQuery, rootQuery);
                    }
                }
            );
            return cost;
        },

        calculateProvider: function (provider, query, rootQuery) {
            // TODO
            return 1000; // ???
        },

        calculateJoin: function (join, query, rootQuery) {
            var leftWeight = $this.calculateQuery(join.$left, rootQuery);
            var rightWeight = $this.calculateQuery(join.$right, rootQuery);
            return leftWeight * rightWeight;
        },
//
//        calculateUnion: function (union, query, rootQuery) {
//            var weight = 0;
//            for(var i = 0; i < union.length; i++) {
//                weight += $this.calculateQuery(union[i], rootQuery); // ???
//            }
//            return weight;
//        },
//
//        calculateRecursive: function(recursive, query, rootQuery) {
//            var startWeight = $this.calculateQuery(recursive.$start, rootQuery);
//            var nextWeight = $this.calculateQuery(recursive.$joinedNext, rootQuery);
//            return startWeight * nextWeight; // ???
//        },

	}
}