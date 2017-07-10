{
	$name: 'JSB.DataCube.Query.Iterators.InnerJoinIterator',
	$parent: 'JSB.DataCube.Query.Iterators.Iterator',

	$server: {
		$constructor: function(iterators, queryEngine){
		    $base();
		    this.iterators = iterators;
		    this.queryEngine = queryEngine;
		    this.cube = queryEngine.cube;
		},

        /** Start or restart iterator. Return this;
        */
		iterate: function(dcQuery, params){
		    this.dcQuery = dcQuery;
		    this.params = params;

		    // include join condition fields to $select
		    for (var i in this.iterators) {
                var fields = [];
                for (var field in this.cube.fields) if (this.cube.fields.hasOwnProperty(field)) {
                   var binding = this.cube.fields[field].binding;
                   if (binding.length > 1) {
                       for(var b in binding) {
                           if (binding[b].provider == this.iterators[i].getDataProvider()) {
                                if (!this.dcQuery.$select[field]){
                                    this.dcQuery.$select[field] = binding[b].field;
                                }
                           }
                       }
                   }
                }
		    }

            // start first/left iterator
		    this.iterators[0].iterate(dcQuery, params);

		    // reset joiner
		    this.values = [];
		    this.initialized = [true];
		    return this;
		},

		restartIterator: function(i) {
		    // merge query condition for left value
		    var dcQuery = JSB.merge(true, {}, this.dcQuery);

            var condition = {
                query: {},
                params: {}
            };
            var leftCFValues = this.getLeftConditionFieldValues(i);
            for (var f in leftCFValues) if (leftCFValues.hasOwnProperty(f)) {
                var paramName = 'joinParam_' + f;
                condition.query[f] = {$eq: '${' + paramName + '}'};
                condition.params[paramName] = leftCFValues[f];
                this.queryEngine.setParamType(paramName, this.cube.fields[f].type);
            }

            if (Object.keys(condition.query).length > 0) {
                dcQuery.$filter = dcQuery.$filter || {};
                dcQuery.$filter.$and = dcQuery.$filter.$and || [];
                dcQuery.$filter.$and.push(condition.query);
            }
//            Log.debug('Restart iterator [' + i + '] : ' + JSON.stringify(condition.query));

		    // merge params
		    var params = JSB.merge({}, this.params, condition.params);

            // restart iterator
        	this.iterators[i].iterate(dcQuery, params);
        	this.initialized[i] = true;
        },

		next: function(){
		    function checkCondition(i, leftCFValues) {
		        var rightValue = $this.values[i];
		        for (var f in leftCFValues) if (leftCFValues.hasOwnProperty(f)) {
                    if (leftCFValues[f] != rightValue[f]) {
                        return false;
                    }
                }
		        return true;
		    }
//debugger;
            // left to right fill values and right to left for get next
		    for (var i = this.values.length; i < this.iterators.length; ) {
		        var iterator = this.iterators[i];

		        // initialize other iterators if not and set extended query with condition of 'join'
		        if (i > 0 && !this.initialized[i]) {
                    this.restartIterator(i);
                }

                // get next matched value
		        var leftCFValues = i > 0 ? this.getLeftConditionFieldValues(i) : null;
		        for (;;) {
		             this.values[i] = iterator.next();
		             if (JSB.isNull(this.values[i])) break;
		             // test value for join
		             if (leftCFValues && !checkCondition(i, leftCFValues)) {
		                // next value
		                continue;
		             }
		             break;
		        }

		        if (JSB.isNull($this.values[i])) {
		            if (i > 0) {
                        this.initialized[i] = false;
		                // jump to prev iterator and next value
                        i--;
                        continue;
		            } else {
		                // complete
                        return null;
		            }
		        }
                i++;
		    }
//debugger;
		    // return merged copy
		    var value = JSB.merge.apply(null, [{}].concat(this.values));
		    this.values.pop();
		    return value;
		},

		close: function() {
		    for (var i in this.iterators) {
		        var iterator = this.iterators[i];
                try {
                    iterator.close();
                } catch (e) {
                    Log.error('Close Iterator failed', e);
                }
		    }
		},

		getLeftConditionFieldValues: function(i) {
            var rightProvider = this.iterators[i].getDataProvider();
            var leftCValues = {};
            for (var field in this.cube.fields) if (this.cube.fields.hasOwnProperty(field)) {
                for (var ii = i-1; ii >= 0; ii--) {
                    var leftProvider = this.iterators[ii].getDataProvider();
                    var binding = this.cube.fields[field].binding;
                    var leftMatched = false;
                    var rightMatched = false;
                    for(var b in binding) {
                        leftMatched = leftMatched || binding[b].provider == leftProvider;
                        rightMatched = rightMatched || binding[b].provider == rightProvider;
                    }
                    if (leftMatched && rightMatched) {
                        leftCValues[field] = this.values[ii][field];
                    }
                }
            }
            return leftCValues;
		}
	}
}