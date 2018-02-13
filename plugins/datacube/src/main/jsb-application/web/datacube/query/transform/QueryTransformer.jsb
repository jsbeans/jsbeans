{
	$name: 'DataCube.Query.Transforms.QueryTransformer',
	$singleton: true,

	$server: {
		$require: [
        ],

        transformers: [],

		push: function(transformerJsb){
			if(!transformerJsb instanceof JSB){
			    throw new Error('Invalid transformer type');
			}
			Log.debug('Registered transformer ' + transformerJsb.$name);
			var transformer = new (transformerJsb.getClass())();
		    $this.transformers.push(transformer);
		},

		transform: function(dcQuery, cubeOrDataProvider){
		    for(var i in $this.transformers) {
		        dcQuery = $this.transformers[i].transform(dcQuery, cubeOrDataProvider);
		        if (!dcQuery) throw new Error('Failed transform ' + $this.transformers[i].getJsb().$name);
		    }
		    return dcQuery;
		},

		destroy: function(){
            for(var i in $this.transformers) {
                $this.transformers[i].destroy();
            }

		    $base();
		},
	}
}