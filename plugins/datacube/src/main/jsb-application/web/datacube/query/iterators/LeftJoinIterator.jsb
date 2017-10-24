{
	$name: 'DataCube.Query.Iterators.LeftJoinIterator',
	$parent: 'DataCube.Query.Iterators.Iterator',

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

		    // store fields
		    this.fields = {};
            var managedFields = this.cube.getManagedFields();
            for (var field in managedFields) if (managedFields.hasOwnProperty(field)) {
                this.fields[field] = true;
            }

		    // include join condition fields to $select
		    var managedFields = this.cube.getManagedFields();
		    for (var i in this.iterators) {
                var fields = [];
                for (var field in managedFields) if (managedFields.hasOwnProperty(field)) {
                   var binding = managedFields[field].binding;
                   if (binding.length > 1) {
                       for(var b in binding) {
                           if (this.iterators[i].matchDataProvider(binding[b].provider)) {
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
            var managedFields = this.cube.getManagedFields();
            for (var f in leftCFValues) if (leftCFValues.hasOwnProperty(f)) {
                var paramName = 'joinParam_' + f;
                condition.query[f] = {$eq: '${' + paramName + '}'};
                condition.params[paramName] = leftCFValues[f];
                this.queryEngine.setParamType(paramName, managedFields[f].type);
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
            // clear nulls and last value
            while(this.values.length > 0 && this.values[this.values.length - 1] == null) {
                this.values.pop();
            }
            this.values.pop();

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
		             if (this.values[i] == null) break;
		             // test value for join
		             if (leftCFValues && !checkCondition(i, leftCFValues)) {
		                // next value
		                continue;
		             }
		             break;
		        }

		        if ($this.values[i] == null) {
		            if (i > 0) {
                        this.initialized[i] = false;
//		                 // INNER JOIN: jump to prev iterator and next value
//                        i--;
//                        continue;
		            } else {
		                // complete
                        return null;
		            }
		        }
                i++;
		    }

		    // merge and copy
		    var value = JSB.merge.apply(null, [{}].concat(this.values));

            // fill empty fields
            for (var field in this.fields) if (this.fields.hasOwnProperty(field)) {
                if (typeof value[field] === 'undefined') {
                    value[field] = null;
                }
            }
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
		    this.destroy();
		},

		getLeftConditionFieldValues: function(i) {
            var rightIt = this.iterators[i];
            var leftCValues = {};
            var managedFields = this.cube.getManagedFields();
            for (var field in managedFields) if (managedFields.hasOwnProperty(field)) {
                for (var ii = i-1; ii >= 0; ii--) {
                    var leftIt = this.iterators[ii];
                    var binding = managedFields[field].binding;
                    var leftMatched = false;
                    var rightMatched = false;
                    for(var b in binding) {
                        leftMatched = leftMatched || leftIt.matchDataProvider(binding[b].provider);
                        rightMatched = rightMatched || rightIt.matchDataProvider(binding[b].provider);
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