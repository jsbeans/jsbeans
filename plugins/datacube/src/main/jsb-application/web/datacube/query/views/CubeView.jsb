{
	$name: 'DataCube.Query.Views.CubeView',
	$parent: 'DataCube.Query.Views.View',

	$server: {
		$require: [
        ],

		$constructor: function(name){
		    $base(name);
		},

		destroy: function(){
		    this.view.destroy();
		    $base();
		},

		setView: function(view) {
		    return this.view;
		},

        listFields: function() {
		    return this.view.listFields();
		},

        getField: function(name) {
		    return this.view.getField(name);
		},
	}
}