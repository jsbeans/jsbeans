{
	$name: 'DataCube.Query.Transforms.QueryTransformer',
	$singleton: true,

	$server: {
		$require: ['JSB.System.Config'],

        transformers: null,
        
        $constructor: function(){
        	$base();
        	
        	this.mainTransformersConfig = Config.get('datacube.query.transformers');
        	this.translatorsTransformersConfig = Config.get('datacube.query.translators');
        },

		initialize: function(){
		    if (!$this.transformers) {
                JSB.locked($this, function(){
		            if (!$this.transformers) {
                        try {
                            $this.transformers = {};

                            for(var i = 0; i < $this.mainTransformersConfig.length; i++) {
                                var transformerName = $this.mainTransformersConfig[i];
                                var transformerJsb = JSB.get(transformerName);

                                if(!transformerJsb){
                                    throw new Error('Missing transformer: ' + transformerName);
                                }

                                var transformer = new (transformerJsb.getClass())();
                                $this.transformers[transformerName] = transformer;
                            }

                            for(var translator in $this.translatorsTransformersConfig) {
                                var transformers = $this.translatorsTransformersConfig[translator].transformers;

                                for(var i = 0; i < transformers.length; i++) {
                                    var transformerName = transformers[i];
                                    var transformerJsb = JSB.get(transformerName);

                                    if(!transformerJsb){
                                        throw new Error('Missing transformer: ' + transformerName);
                                    }

                                    var transformer = new (transformerJsb.getClass())();
                                    $this.transformers[transformerName] = transformer;
                                }
                            }
                        }catch(e) {
                            for(var name in $this.transformers) {
                                $this.transformers[name].destroy();
                                delete $this.transformers[name];
                            }
                            $this.transformers = {};
                            throw e;
                        }
                    }
                });
		    }
		},

		transform: function(dcQuery, defaultCube){
		    $this.initialize();
            for(var i = 0; i < $this.mainTransformersConfig.length; i++) {
                var transformerName = $this.mainTransformersConfig[i];
                var transformer = $this.transformers[transformerName];

                dcQuery = transformer.transform(dcQuery, defaultCube);
                if (!dcQuery) throw new Error('Failed transform ' + $this.transformers[i].getJsb().$name);
            }
            return dcQuery;
		},

		transformForTranslator: function(translatorName, dcQuery, defaultCube){
            var transformers = $this.translatorsTransformersConfig[translatorName].transformers;

            for(var i = 0; i < transformers.length; i++) {
                var transformerName = transformers[i];
                var transformer = $this.transformers[transformerName];

                dcQuery = transformer.transform(dcQuery, defaultCube);
                if (!dcQuery) throw new Error('Failed transform ' + $this.transformers[i].getJsb().$name);
            }
		    return dcQuery;
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