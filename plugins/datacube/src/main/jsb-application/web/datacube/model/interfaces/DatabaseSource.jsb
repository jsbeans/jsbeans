{
	$name: 'DataCube.Model.DatabaseSource',
	$parent: 'DataCube.Model.QueryableContainer',

	$server: {
		$require: ['DataCube.Query.Query'],
		
		getStore: function(){
			throw new Error('This method should be overriden');
		},
		
		load: function(){
			// called by Query.execute
		},
		
		getDimensions: function(){
			return {};	// no common dimensions for database source
		},
		
		executeQuery: function(query, params){
			return Query.execute({
	    	    query: query,
	    	    params: params,
	    	    cube: this,
	    	});
		},
	}
}