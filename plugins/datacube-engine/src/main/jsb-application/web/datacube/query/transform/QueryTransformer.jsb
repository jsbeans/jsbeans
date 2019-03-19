{
	$name: 'DataCube.Query.Transforms.QueryTransformer',
	$singleton: true,

	$server: {
		$require: [
		    'JSB.System.Config',
		    'DataCube.Query.Console',
        ],

        transformers: {},
        
        $constructor: function(){
        	$base();
        },

		transform: function(transformers, queryTask){
		    var dcQuery = queryTask.query;
		    var defaultCube = queryTask.cube;
		    try{
                var times = {};
                var totalTime = 0;
                var loggedQueries;// = {};
                for(var i = 0; i < transformers.length; i++) {
                    var startedTime = Date.now();
                    var conf = transformers[i];
                    var names = conf.split('~');
                    var transformerName = names[0];
                    if (loggedQueries) {
                        loggedQueries[i+':'+conf] = JSB.clone(dcQuery);
                    }

                    var transformer = $this.ensureTransformer(transformerName);

                    dcQuery = transformer.transform(dcQuery, defaultCube, names.length > 1 ? names[1]:null);
                    totalTime += times[i+':'+conf] = (Date.now()-startedTime)/1000;

                    if (!dcQuery) throw new Error('Failed transform ' + transformer.getJsb().$name);
                }
                return {
                    query: dcQuery,
                    meta: {
                        totalTime: totalTime,
                        times: times,
                    }
                };
            } catch(e) {
                return {
                    error: e,
                    query: dcQuery,
                    meta: {
                        totalTime: totalTime,
                        times: times,
                    }
                };
            }
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