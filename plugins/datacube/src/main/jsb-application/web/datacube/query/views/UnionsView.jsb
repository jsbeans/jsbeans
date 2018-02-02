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
            return $this.views;
		},

		addView: function(view) {
		    $this.views.push(view);
		},

        getField: function(name) {
            var field = $base(name);
            if (field) {
                return JSB.merge({}, field, { context: getContext() });
            }
            return null;
		},

		getContext: function(){
		    return 'unions_'+$this.name;
		},
	}
}