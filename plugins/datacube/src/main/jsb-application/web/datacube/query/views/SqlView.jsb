{
	$name: 'DataCube.Query.Views.SqlView',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name, sql){
		    $base(name);
		    this.sql = sql;
		},

        setField: function(field, desc) {
		},

        listFields: function() {
		    return [];
		},

        getField: function(name) {
            return null;
		},
	}
}