{
	$name: 'DataCube.Query.Views.DataProviderView',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name, provider){
		    $base(name);
		    this.provider = provider;
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
	}
}