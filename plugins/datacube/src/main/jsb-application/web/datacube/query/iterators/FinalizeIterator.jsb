{
	$name: 'JSB.DataCube.Query.Iterators.FinalizeIterator',
	$parent: 'JSB.DataCube.Query.Iterators.Iterator',

	$server: {
		$constructor: function(iterator){
		    $base();
		    this.iterator = iterator;
		},

		iterate: function(dcQuery, params){
		    this.iterator.iterate(dcQuery, params);
		    return this;
		},

		next: function(){
		    for (var next = this.iterator.next(); !!next; next = this.iterator.next()) {
		        if (JSB.isFunction(dcQuery.$finalize)) {
		            var value = dcQuery.$finalize.call(next, next);
		            if (!JSB.isNull(value)) {
		                return value;
		            }
		        } else {
		            throw new Error('Invalid $finalize expression');
		        }
		    }
		    return null;
		},

		close: function() {
		    this.iterator.close();
		},
	}
}