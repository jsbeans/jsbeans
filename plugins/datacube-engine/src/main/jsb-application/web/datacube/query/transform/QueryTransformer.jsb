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
		        queryTask.times.pipeline.push({transform:(Date.now()-queryTask.times.last)/1000});
		        queryTask.times.last = Date.now();

                var times = {};
                for(var i = 0; i < transformers.length; i++) {
                    var startedTime = Date.now();
                    var conf = transformers[i];
                    var names = conf.split('~');
                    var transformerName = names[0];

                    var transformer = $this.ensureTransformer(transformerName);

                    dcQuery = transformer.transform(dcQuery, defaultCube, names.length > 1 ? names[1]:null);
                    times[i+':'+conf] = (Date.now()-startedTime)/1000;

                    if (!dcQuery) throw new Error('Failed transform ' + transformer.getJsb().$name);
                }
                queryTask.times.pipeline.push(times);
                queryTask.times.last = Date.now();

                return dcQuery;
            } finally {
                Console.message({
                    message: 'Query transformed',
                    params: {queryId:''+dcQuery.$id, times:queryTask.times}
                });
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