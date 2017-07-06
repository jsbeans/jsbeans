{
	$name: 'JSB.DataCube.Query.Iterators.FinalizeIterator',
	$parent: 'JSB.DataCube.Query.Iterators.Iterator',

	$server: {
		$constructor: function(iterator, queryEngine){
		    $base();
		    this.iterator = iterator;
		    this.queryEngine = queryEngine;
		    this.cube = queryEngine.cube;
		},

		iterate: function(dcQuery, params){
		    this.iterator.iterate(dcQuery, params);
		    return this;
		},

		next: function(){
		    do {
		        var next = this.iterator.next();
		        if (JSB.isNull(next)) {
		            return null;
		        }
		        var value = dcQuery.$finalize.call(next, next);
		    } while (JSB.isNull(value));
		    return value;
		},

		close: function() {
		    this.iterator.close();
		},
	}
}