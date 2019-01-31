{
	$name: 'DataCube.Query.Transforms.QueryTransformer',
	$singleton: true,

	$server: {
		$require: ['JSB.System.Config'],

        transformers: {},
        
        $constructor: function(){
        	$base();
        },

		transform: function(transformers, dcQuery, defaultCube){
		    for(var i = 0; i < transformers.length; i++) {
                var transformerName = transformers[i];
                var transformer = $this.ensureTransformer(transformerName);

                dcQuery = transformer.transform(dcQuery, defaultCube);
                if (!dcQuery) throw new Error('Failed transform ' + transformer.getJsb().$name);
            }
            return dcQuery;
		},

		ensureTransformer: function(transformerName) {
		    if(!$this.transformers[transformerName]) {
		        JSB.locked($this, function(){
		            if(!$this.transformers[transformerName]) {
		                var transformerJsb = JSB.get(transformerName);
		                if(!transformerJsb){
                            throw new Error('Missing transformer: ' + transformerName);
                        }

                        var transformer = new (transformerJsb.getClass())();
                        $this.transformers[transformerName] = transformer;
		            }
		        });
		    }
		    return $this.transformers[transformerName];
		},

		destroy: function(){
            for(var name in $this.transformers) {
                $this.transformers[name].destroy();
                delete $this.transformers[name];
            }

		    $base();
		},
	}
}