{
	$name: 'DataCube.Query.Views.QueryView',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name, query, sourceView){
		    $base(name);
		    this.query = query;
		    this.sourceView = sourceView;
		},

		getSourceView: function() {
		    return this.sourceView;
		},
	}
}