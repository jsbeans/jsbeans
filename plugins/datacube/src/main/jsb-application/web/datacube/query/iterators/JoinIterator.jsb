{
	$name: 'JSB.DataCube.Query.Iterators.JoinIterator',
	$parent: 'JSB.DataCube.Query.Iterators.Iterator',

	$server: {
		$constructor: function(iterators, cube){
		    $base();
		    this.iterators = iterators;
		    this.cube = cube;
		},

		iterate: function(dcQuery, params){
		    this.dcQuery = dcQuery;
		    this.params = params;

            // start first iterators
		    this.iterators[0].iterate(dcQuery, params);

		    // reset joiner
		    this.values = [];
		    this.initialized = [true];
		    return this;
		},

		restartIterator: function(i) {
		    var condition = {
                query: {}, // todo add join condition from this.values[i-1]
                params: {}
            };

		    // merge query condition for left value
		    var dcQuery = JSB.merge(true, {}, this.dcQuery);
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
		    function checkCondition(i) {
		        // TODO control programmatically check join condition values[i-1] ?=? values[i]
		        return true;
		    }

            // left to right fill values and right to left for get next
		    for (var i = this.values.length; i < this.iterators.length; ) {
		        var iterator = this.iterators[i];
		        // initialize
		        if (i > 0 && !this.initialized[i]) {
                    this.restartIterator(i);
                }

                // get next matched value
		        for (values[i] = iterator.next();
		             !JSB.isNull(values[i]) && !checkCondition(i);
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
		    // close inner iterators
		    JSB.array(this.iterators).forEach(function(iterator){
                try {
                    iterator.close();
                } catch (e) {
                    Log.error('Close Iterator failed', e);
                }
		    });
		},
	}
}