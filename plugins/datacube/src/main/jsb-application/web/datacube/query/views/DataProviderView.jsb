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
            return $this.managedFields[name] ? JSB.merge({
//                provider: $this.provider,
//                providerId: $this.provider.id,
                context: $this.getContext(),
            }, $this.managedFields[name]) : null;
		},

        getProvider: function() {
            return $this.provider;
		},

		getFromBody: function(){
		    var from = {
		        $provider: $this.provider.id,
		        $select: {},
		        $context: $this.name,//'DataProvider:' + $this.provider.id,
		    };
		    var fields = $this.listFields();
            for(var i = 0; i < fields.length; i++){
                if (!$this.usedFields || $this.usedFields[fields[i]]/* && $this.usedFields[fields[i]] > 0*/) {
                    var field = $this.getField(fields[i]);
                    from.$select[fields[i]] = field.providerField;
                }
            }

		    return from;
		},
	}
}