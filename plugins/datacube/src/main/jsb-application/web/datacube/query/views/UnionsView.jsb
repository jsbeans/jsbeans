{
	$name: 'DataCube.Query.Views.UnionsView',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name){
		    $base(name);
		},

		views: [],

		addView: function(view) {
		    this.views.add(view);
		},

		managedFields: null,

        setField: function(field, desc) {
            throw new Error();
		},

        listFields: function() {
            var fields = {};
            for(var i in this.views) {
                var list = this.views[i].listFields();
                for(var j in list) {
                    fields[list[j]] = (fields[list[j]]||0) + 1;
                }
            }
		    return Object.keys(fields);
		},

        getField: function(name) {
            for(var i in this.views) {
                var desc = this.views[i].getField(name);
                if (desc) {
                    return desc;
                }
            }
            return null;
		},
	}
}