{
	$name: 'DataCube.Query.Views.CubeView',
	$parent: 'DataCube.Query.Views.View',

	$server: {
		$require: [
		    'DataCube.Query.Views.NothingView',
        ],

		$constructor: function(name, cube, providers){
		    $base(name);
		    $this.cube = cube;
		    $this.providers = providers;
		},

		destroy: function(){
		    $this.view && $this.view.destroy();
		    $base();
		},

		getView: function() {
		    return $this.view;
		},

		setView: function(view) {
		    $this.view = view;
		},

        listFields: function() {
		    return $this.view.listFields();
		},

        getField: function(name) {
		    return $this.view.getField(name);
		},

        getOriginalField: function(name) {
            return $this.view.getOriginalField(name)
		},

//		getContext: function(){
//		    return $this.view.getContext();
//		},

		visitInternalViews: function(visitor/**function visitor(view)*/) {
            $base(visitor);
            $this.view && $this.view.visitInternalViews(visitor);
		},

		getFromBody: function(){
		    if ($this.view instanceof NothingView) {
		        return {};
		    }
		    var from = $this.view.getFromBody();
//		    from.$cube = $this.cube.id;
		    return from;
		},
	}
}