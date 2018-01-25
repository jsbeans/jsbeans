{
	$name: 'DataCube.Query.Views.UnionsView',
	$parent: 'DataCube.Query.Views.MultiView',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name){
		    $base(name);
		},

		views: [],

        listViews: function() {
            return this.views;
		},

		addView: function(view) {
		    this.views.push(view);
		},
	}
}