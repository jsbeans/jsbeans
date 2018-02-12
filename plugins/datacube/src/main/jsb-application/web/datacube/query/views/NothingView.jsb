{
	$name: 'DataCube.Query.Views.NothingView',
	$parent: 'DataCube.Query.Views.View',

	$server: {
		$constructor: function(name){
		    $base(name);
		},

        listFields: function() {
		    return [];
		},

        getField: function(name) {
            return null;
		},
	}
}