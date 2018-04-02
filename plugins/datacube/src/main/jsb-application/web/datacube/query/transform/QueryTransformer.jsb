{
	$name: 'DataCube.Query.Transforms.QueryTransformer',
	$singleton: true,

	$server: {
		$require: ['JSB.System.Config'],

        transformerBeans: [],
        transformers: [],
        
        $constructor: function(){
        	$base();
        	
        	this.transformersCfg = Config.get('datacube.query.transformers');
        },
        
        register: function(transformerJsb){
        	if(!transformerJsb instanceof JSB){
			    throw new Error('Invalid transformer type');
			}
        	for(var i = 0; i < this.transformersCfg.length; i++){
        		if(this.transformersCfg[i] == transformerJsb.$name){
        			$this.transformerBeans[i] = transformerJsb;
        			JSB.getLogger().debug('Registered transformer ' + transformerJsb.$name + ' with order: ' + i);
        		}
        	}
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
		        for(var i = 0; i < $this.transformersCfg.length; i++) {
		            var transformerJsb = $this.transformerBeans[i];
		            if(!transformerJsb){
		            	throw new Error('Missing transformer: ' + $this.transformersCfg[i]);
		            }
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