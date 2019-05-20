{
	$name: 'DataCube.Query.Engine.IteratorSelector',
	$singleton: true,

	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Console',

		    'java:java.util.concurrent.atomic.AtomicReference',
		    'java:java.util.concurrent.ConcurrentLinkedQueue',
        ],

		selectFirst: function(its){
            return its[0];
		},

		selectRandom: function(its){
		    var idx = Math.floor(Math.random()*its.length);
            return its[idx];
		},

		selectBestEstimationTime: function(its){
		    its.sort(function(a,b){
                if (a.estimationTime > b.estimationTime) return 1;
                if (a.estimationTime < b.estimationTime) return -1;
                return 0;
            });
            return its[0];
		},

		selectByEnginePriority: function(its){
		    var enginesPriority = Config.get('datacube.query.engine.iteratorSelector.selectByEnginePriority_priorities');
		    var selectByEnginePriority_defaultPriority = 0+Config.get('datacube.query.engine.iteratorSelector.selectByEnginePriority_defaultPriority');
		    its.sort(function(a,b){
		        var ap = 0+enginesPriority[a.meta.engine.alias]||selectByEnginePriority_defaultPriority;
		        var bp = 0+enginesPriority[b.meta.engine.alias]||selectByEnginePriority_defaultPriority;
                if (ap > bp) return -1;
                if (ap < bp) return 1;
                return 0;
            });
            return its[0];
		},


		selectExecutedFirst: function(its){
            if (its.length == 1) {
                return its[0];
            }

		    var selectedIt = new AtomicReference();
		    var executedIts = new ConcurrentLinkedQueue();
		    // parallel get all next and select first
		    for(var i = 0; i < its.length; i++) {
		        (function(it) {
                    it.deferKey = JSB.generateUid();
                    JSB.defer(function(){
                        try {

                            var startedTime = Date.now();
                            var value = it.next();

                            if  (selectedIt.get()) {
                                it.close();
                            } else {
                                var oldNext = it.next;
                                it.next = function(){
                                    if(it._started) {
                                        return oldNext.call(this);
                                    }
                                    it._started = true;
                                    return value;
                                }
                                if  (!selectedIt.get()) {
                                    selectedIt.set(it);
                                }
                            }
                        } catch(e) {
                            it.error = e;
                            it.close();
                        } finally {
                            executedIts.add(it);
                        }
                    },1,it.deferKey);
                })(its[i]);
		    }

            /// wait it
            while(true){
                Kernel.sleep(10);
                if  (selectedIt.get() || executedIts.size() == its.length) {
                    break;
                }
            }

            if (selectedIt.get()) {
                return selectedIt.get();
            } else {
                var it = executedIts.peek();
                var oldNext = it.next;
                it.next = function(){
                    throw it.error;
                }
                return it;
            }
		},

		selectVendorsOrder: function(its){
		    var vendors = Config.get('datacube.query.engine.iteratorSelector.selectVendorsOrder_vendorsOrder');
		    for(var v = 0; v < vendors.length; v++) {
                for(var i = 0; i < its.length; i++) {
                    if(its[i].meta && its[i].meta.vendor == vendors[v]) {
                        return its[i];
                    }
                }
            }
            return its[0];
		},
	}
}