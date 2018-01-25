{
	$name: 'DataCube.Query.Views.QueryView',
	$parent: 'DataCube.Query.Views.View',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name, query, sourceView){
		    $base(name);
		    this.query = query;
		    this.sourceView = sourceView;
		},

		destroy: function(){
            this.sourceView.destroy();
		    $base();
		},

		managedFields: {},

        setField: function(field, desc) {
            this.managedFields[field] = desc;
		},

        listFields: function() {
		    return Object.keys(this.managedFields);
		},

        getField: function(name) {
            return this.managedFields[name];
		},

		getSourceView: function() {
		    return this.sourceView;
		},
	}
}