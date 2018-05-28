{
	$name: 'DataCube.Query.Views.View',

	$server: {
		$constructor: function(name){
		    $this.name = name;
		},

        setField: function(field, desc) {
            throw new Error('Illegal operation');
		},

        listFields: function() {
		    return [/**names*/];
		},

        getField: function(name) {
            return null;
		},

		getContext: function(){
		    return $this.name;
		},

        isIsolated: function(){
            return true;
		},

		visitInternalViews: function(visitor/**function visitor(view)*/) {
		    visitor.call($this, $this);
		},

		info: function(){
		    // TODO: generate structure info
		    return {TODO:'TODO'};
		},

		getFromBody: function(){
		    throw new Error('Not implemented');
		},
	}
}