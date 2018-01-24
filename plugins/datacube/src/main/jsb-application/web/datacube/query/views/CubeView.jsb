{
	$name: 'DataCube.Query.Views.CubeView',

	$server: {
		$require: [
        ],

		$constructor: function(name){
		    $base(name);
		},

		setView: function(view) {
		    return this.view;
		},

        setField: function(field, desc) {
            throw new Error();
		},

        listFields: function() {
		    return this.view.listFields();
		},

        getField: function(name) {
		    return this.view.getField(name);
		},
	}
}