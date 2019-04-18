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
        	if (Config.get('jsbeans.debug')) {
        	    $this.statistic(true);
        	}
        },

        statistic: function(start) {
            /// Enable: JSB.getInstance('DataCube.Query.Transforms.QueryTransformer').statistic(true);
            /// Disable: JSB.getInstance('DataCube.Query.Transforms.QueryTransformer').statistic(false);
            /// ...
            /// var stat = JSB.getInstance('DataCube.Query.Transforms.QueryTransformer').statistic();
            if (start) {
                $this.stat = {};
            } else if(start === false) {
                var s = $this.stat;
                delete $this.stat;
                return s;
            } else {
                return $this.stat;
            }
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
                    var time = totalTime += times[i+':'+conf] = (Date.now()-startedTime)/1000;
                    if ($this.stat) {
                        var ss = $this.stat[conf] = $this.stat[conf] || {};
                        ss.total = (ss.total||0) + time;
                        ss.count = (ss.count||0) + 1;
                        ss.avg = ss.total / ss.count;
                        ss.max = (ss.max||0) < time ? time : (ss.max||0);
                    }

                    if (!dcQuery) throw new Error('Failed transform ' + transformer.getJsb().$name);
                }
                if ($this.stat) {
                    var ss = $this.stat['TOTAL PIPES:' + transformers.length] = $this.stat['TOTAL PIPES:' + transformers.length] || {};
                    ss.total = (ss.total||0) + totalTime;
                    ss.count = (ss.count||0) + 1;
                    ss.avg = ss.total / ss.count;
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