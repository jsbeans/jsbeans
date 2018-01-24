{
	$name: 'DataCube.Query.Views.NothingView',

	$server: {
		$require: [
        ],

		$constructor: function(name){
		    $base(name);
		},

        setField: function(field, desc) {
            throw new Error('Unsupported operation: add field to NothingView');
		},

        listFields: function() {
		    return [];
		},

        getField: function(name) {
            return null;
		},
	}
}