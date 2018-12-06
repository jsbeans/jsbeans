{
	$name: 'DataCube.Query.Weight.QueryWeigher',
	$singleton: true,

	$server: {
	    $require: [
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5',
        ],

        calculateSliceWeight: function(slice){
            // TODO
            return 1.0;
        },

        calculateQuery: function(query, rootQuery) {

            var queryWeight = $this.calculateSource(query, rootQuery);

            if (query.$filter) {
                //queryWeight = $this.calculateWithFilter(queryWeight, query.$filter, query);
                queryWeight = queryWeight / 2; // ???
            }

            queryWeight = $this.calculateNestedSubQueries(queryWeight, query, rootQuery);

            if (!query.$groupBy && !query.$sort) {
                queryWeight = Math.sqrt(queryWeight); // ???
            } else if (query.$groupBy && query.$sort) {
                queryWeight = queryWeight * 2; // ???
            }

            return queryWeight;
        },

        calculateSource: function(query, rootQuery) {
            var sourceWeight;
            if (query.$provider) {
                sourceWeight = $this.calculateProvider(query.$provider, query, rootQuery);
            } else if (query.$from && JSB.isEqual({}, query.$from)) {
                sourceWeight = 1.0;
            } else if (query.$from) {
                var sourceQuery = JSB.isString(query.$from) ? rootQuery.$views[query.$from] : query.$from;
                sourceWeight = $this.calculateQuery(sourceQuery, rootQuery);
            } else if (query.$join) {
                sourceWeight = $this.calculateJoin(query.$join, query, rootQuery);
            } else if (query.$union) {
                sourceWeight = $this.calculateUnion(query.$join, query, rootQuery);
            } else if (query.$recursive) {
                sourceWeight = $this.calculateRecursive(query.$recursive, query, rootQuery);
            } else {
                QueryUtils.throwError(0, 'QueryWeigher: Invalid source in query "{}"', query.$context);
            }
            return sourceWeight;
        },

        calculateNestedSubQueries: function(weight, query, rootQuery) {
            var subWeights = [];
		    QueryUtils.walkQueries(query, {rootQuery:rootQuery},
		        function() { },
		        function(subQuery){
		            if (!this.inFrom) {
                        // is nested query-expression
                        subWeights.push(
                            $this.calculateQuery(subQuery, rootQuery)
                        );
                    }
                }
            );
            if (subWeights.length > 0) {
                var sum = 0;
                for(var i = 0; i < subWeights.length; i++) {
                    sum += subWeights[i];
                }
                weight = weight * sum; // ???
            }
            return weight;
        },

        calculateProvider: function (provider, query, rootQuery) {
            // TODO
            return 1000; // ???
        },

        calculateJoin: function (join, query, rootQuery) {
            var leftWeight = $this.calculateQuery(join.$left, rootQuery);
            var rightWeight = $this.calculateQuery(join.$right, rootQuery);
            return leftWeight * rightWeight; // ???
        },

        calculateUnion: function (union, query, rootQuery) {
            var weight = 0;
            for(var i = 0; i < union.length; i++) {
                weight += $this.calculateQuery(union[i], rootQuery); // ???
            }
            return weight;
        },

        calculateRecursive: function(recursive, query, rootQuery) {
            var startWeight = $this.calculateQuery(recursive.$start, rootQuery);
            var nextWeight = $this.calculateQuery(recursive.$joinedNext, rootQuery);
            return startWeight * nextWeight; // ???
        },

	}
}