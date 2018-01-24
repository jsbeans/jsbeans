{
	$name: 'DataCube.Query.Views.View',

	$server: {
		$require: [
        ],

		$constructor: function(name){
		    this.name = name;
		},

        setField: function(field, desc) {
		},

        listFields: function() {
		    return [/**names*/];
		},

        getField: function(name) {
            return null;
		},
	}
}