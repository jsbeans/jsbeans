{
	$name: 'DataCube.Query.Renders.Param',
	$parent: 'DataCube.Query.Renders.TextValue',

	$alias: '$param',

	$client: {
	    $constructor: function(opts) {
	        $base(opts);

	        this.addClass('textValue');
	    },

	    createValue: function() {
	        var regexp = /\{(.*?)\}/;

	        this.append(this.getScope().match(regexp)[1]);
	    }
	}
}