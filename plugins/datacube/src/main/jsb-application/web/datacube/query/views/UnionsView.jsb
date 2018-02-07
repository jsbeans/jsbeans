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
            var desc = $base(name);
            if (desc) {
                desc.fieldContext = desc.context;
                desc.context = $this.getContext();
            }
            return desc;
		},

		getContext: function(){
		    return $this.name;
		},
	}
}