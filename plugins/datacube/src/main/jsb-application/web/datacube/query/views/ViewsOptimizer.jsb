{
	$name: 'DataCube.Query.Views.ViewsOptimizer',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(view){
		    $this.view = view;
		},

		optimize: function() {
		    // TODO remove providers/joins/unions without used fields
            return view;
		},
	}
}