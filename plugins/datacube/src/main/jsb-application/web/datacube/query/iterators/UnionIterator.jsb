{
	$name: 'DataCube.Query.Iterators.UnionIterator',
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

            // restart
		    this.currentIteratorIdx = 0;
		    for (var i in this.iterators) {
		        this.iterators[i].iterate(dcQuery, params);
		    }

		    return this;
		},

		next: function(){
		    while (this.currentIteratorIdx < this.iterators.length) {
		        var value = this.iterators[this.currentIteratorIdx].next();
		        if (value == null) {
		            this.currentIteratorIdx++;
		        } else {
		            return this._fillNullFields(value);
                }
		    }

		    return null;
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

		_fillNullFields: function(value) {
		    for (var alias in this.dcQuery.$select) {
		        if (value[alias] == null) {
		            value[alias] = null;
		        }
		    }
		    return value;
		}
	}
}