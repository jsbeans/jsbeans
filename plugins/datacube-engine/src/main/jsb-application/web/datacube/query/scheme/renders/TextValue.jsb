/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Renders.TextValue',
	$parent: 'DataCube.Query.Renders.Basic',

	$alias: '$text',

	$client: {
	    $constructor: function(opts){
	        $base(opts);

	        this.addClass('textValue');

	        this.createValue();

            this.installMenuEvents({
                element: this.getElement(),
                edit: true,
                wrap: true
            });
	    },

	    createValue: function() {
	        this.append(this.getScope());
	    },

	    changeValue: function() {
	        var value = this.getValues();

	        this.getParent().setValues(value);

	        this.setScope(value)
	    },

	    setScope: function(scope) {
	        this._scope = scope;
	    }
	}
}