{
	$name: 'DataCube.Query.Transforms.QueryTransformer',
	$singleton: true,

	$server: {
		$require: [
        ],

        transformerBeans: [],
        transformers: [],

		push: function(transformerJsb){
			if(!transformerJsb instanceof JSB){
			    throw new Error('Invalid transformer type');
			}
			Log.debug('Registered transformer ' + transformerJsb.$name);

			$this.transformerBeans.push(transformerJsb);
		},

		transform: function(dcQuery, cubeOrDataProvider){
		    $this.initialize();
		    for(var i in $this.transformers) {
		        dcQuery = $this.transformers[i].transform(dcQuery, cubeOrDataProvider);
		        if (!dcQuery) throw new Error('Failed transform ' + $this.transformers[i].getJsb().$name);
		    }
		    return dcQuery;
		},

		initialize: function(){
		    if ($this.transformers.length == 0) {
		        for(var i = 0; i< $this.transformerBeans.length; i++) {
		            var transformerJsb = $this.transformerBeans[i];
		            var transformer = new (transformerJsb.getClass())();
                    $this.transformers.push(transformer);
		        }
		    }
		},

		destroy: function(){
            for(var i in $this.transformers) {
                $this.transformers[i].destroy();
            }

		    $base();
		},
	}
}