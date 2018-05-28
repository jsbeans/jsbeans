{
	$name: 'DataCube.Query.Views.SqlView',
	$parent: 'DataCube.Query.Views.View',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name, sql){
		    $base(name);
		    $this.sql = sql;
		},

        setField: function(field, desc) {
		},

        listFields: function() {
		    return [];
		},

        getField: function(name) {
            return null;
		},

        getOriginalField: function(name) {
            return null;
		},

        getSql: function() {
            return $this.sql;
		},
	}
}