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
                desc.alias = name;
            }
            return desc;
		},

		getContext: function(){
		    return $this.name;
		},

		getFromBody: function(){
		    var from = {
		        $context: $this.name,
		        $union: [],
		        $select: {},
		    };
		    for(var i = 0; i < $this.views.length; i++) {
		        var inner = $this.views[i].getFromBody();
		        from.$union.push(inner);
		        for(var field in inner.$select) {
		            if (!from.$select[field]) {
		                from.$select[field] = inner.$select[field];
                    }
		        }
		    }
		    return from;
		},
	}
}