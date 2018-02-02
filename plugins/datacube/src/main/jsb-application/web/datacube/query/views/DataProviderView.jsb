{
	$name: 'DataCube.Query.Views.DataProviderView',
	$parent: 'DataCube.Query.Views.View',

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
        ],

		$constructor: function(name, provider){
		    $base(name);
		    $this.provider = provider;
		},

		managedFields: {},

        setField: function(field, desc) {
            $this.managedFields[field] = desc;
		},

        listFields: function() {
		    return Object.keys($this.managedFields);
		},

        getField: function(name) {
            return JSB.merge({
                provider: $this.provider,
                ownerView: $this,
                context: $this.getContext(),
            }, $this.managedFields[name]);
		},

        getProvider: function() {
            return $this.provider;
		},
	}
}