{
	$name: 'JSB.DataCube.Query.Iterators.JoinIterator',
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

debugger;
		    // include join condition fields to $select
		    for (var i in this.iterators) {
                var fields = [];
                for (var field in this.cube.fields) if (this.cube.fields.hasOwnProperty(field)) {
                   var binding = this.cube.fields[field].binding;
                   for(var b in binding) {
                       if (binding[b].provider == leftProvider) {
                            if (!this.dcQuery.$select[field]){
                                this.dcQuery.$select[field] = binding[b].field;
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
            var leftCValues = this.getLeftConditionFieldValues(i);
            for (var f in leftCFValues) if (leftCFValues.hasOwnProperty(f)) {
                condition.query[f] = {$eq: '${joinParam_' + f + '}'};
                params['${joinParam_' + f + '}'] = leftCFValues[f];
                this.queryEngine.setParamType('joinParam_' + f, this.cube.fields[f].type);
            }

            if (Object.keys(condition.query).length > 0) {
                dcQuery.$filter = dcQuery.$filter || {};
                dcQuery.$filter.$and = dcQuery.$filter.$and || [];
                dcQuery.$filter.$and.push(condition.query);
            }

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

            // left to right fill values and right to left for get next
		    for (var i = this.values.length; i < this.iterators.length; ) {
		        var iterator = this.iterators[i];

		        // initialize other iterators if not and set extended query with condition of 'join'
		        if (i > 0 && !this.initialized[i]) {
                    this.restartIterator(i);
                }

                // get next matched value
		        var leftCFValues = $this.getLeftConditionFieldValues(i);
		        for (
		             values[i] = iterator.next();
		             !JSB.isNull(values[i]) && !checkCondition(i, leftCFValues);
		             values[i] = iterator.next()) {
		        }

		        if (JSB.isNull(values[i])) {
		            if (i > 0) {
		                this.restartIterator(i);
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
		    // return merged copy
		    return JSB.merge({}, JSB.merge.apply(null, values));
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
            var leftProvider = this.iterators[i-1];
            var leftCValues = {};
            for (var field in this.cube.fields) if (this.cube.fields.hasOwnProperty(field)) {
               var binding = this.cube.fields[field].binding;
               for(var b in binding) {
                   if (binding[b].provider == leftProvider) {
                        leftCValues[field] = this.values[i-1];
                        break;
                   }
               }
            }
		}
	}
}