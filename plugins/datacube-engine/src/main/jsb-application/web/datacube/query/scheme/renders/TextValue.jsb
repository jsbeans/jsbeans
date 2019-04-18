{
	$name: 'DataCube.Query.Renders.TextValue',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$text',

	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('textValue');

	        this.append(this.getScope());

            this.installMenuEvents({
                element: this.getElement(),
                edit: true,
                wrap: true
            });
	    }
	}
}