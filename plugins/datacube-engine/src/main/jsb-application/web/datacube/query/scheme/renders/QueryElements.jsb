{
	$name: 'DataCube.Query.Renders.QueryElements',
	$parent: 'DataCube.Query.Renders.Default',

	$alias: '$queryElements',

	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('queryElements');
	    },

	    constructHead: function(){
	        this.createHeader(true);
	    },

	    remove: function(){
	        this.getParent().addMenuItem(JSB.merge({}, this.getScheme(), {key: this.getKey()}));

	        $base();
	    }
	}
}