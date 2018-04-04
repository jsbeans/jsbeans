{
	$name: 'DataCube.Query.Iterators.Iterator',

	$server: {
		$constructor: function(){
		    $base();
		},

		iterate: function(dcQuery, params){
		    // always must return this
		    return this;
		},

		matchDataProvider: function(dataProvider){
		    return false;
		},

		next: function(){
		    throw new Error('Not implemented');
		},

		close: function() {
		    throw new Error('Not implemented');
		}
	}
}