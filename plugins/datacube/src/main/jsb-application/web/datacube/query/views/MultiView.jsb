{
	$name: 'DataCube.Query.Views.MultiView',
	$parent: 'DataCube.Query.Views.View',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name){
		    $base(name);
		},

		destroy: function(){
            var views = $this.listViews();
            for(var i in views) {
                views[i].destroy();
            }
		    $base();
		},

        listViews: function() {
            throw new Error('Not implemented');
		},

        listFields: function() {
            var fields = {};
            var views = $this.listViews();
            for(var i in views) {
                var list = views[i].listFields();
                for(var j in list) {
                    fields[list[j]] = (fields[list[j]]||0) + 1;
                }
            }
		    return Object.keys(fields);
		},

        getField: function(name) {
            var desc = $this.getOriginalField(name);
            return desc;
		},

        getOriginalField: function(name) {
            var views = $this.listViews();
            for(var i in views) {
                var desc = views[i].getField(name);
                if (desc) {
                    return desc;
                }
            }
            return null;
		},

		visitInternalViews: function(visitor/**function visitor(view)*/) {
            $base(visitor);
            var views = $this.listViews();
            for(var i in views) {
                views[i].visitInternalViews(visitor);
            }
		},
	}
}