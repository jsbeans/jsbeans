{
	$name: 'DataCube.Query.Engine.QueryExecutor',

	$server: {
		$require: [
		    'DataCube.Query.Engine.Engine',
		    'DataCube.Query.Console',
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5',

		    'java:java.util.concurrent.ConcurrentHashMap',
        ],

        pool: null,

		$constructor: function(queryDescriptor){
		    $this.queryDescriptor = queryDescriptor;
            $this.cube = queryDescriptor.cube;
		    $this.query = JSB.clone(queryDescriptor.query);
		    $this.params = queryDescriptor.params || {};
		    $this.qid = $this.query.$id = $this.query.$id || JSB.generateUid();
		    $this.pool = new ConcurrentHashMap();
		},

		execute: function(){
            var startEngine = $this.queryDescriptor.startEngine || Config.get('datacube.query.engine.start');

            $this.executeEngine(startEngine, {
                cube: $this.cube,
                query: $this.query,
                params: $this.params,
            });

            var it = $this.awaitIterator();
            return it;
		},

        /** Асинхронный запуск движка по имени, который регистрируется в пуле
        */
		executeEngine: function(name, queryDescriptor) {

		    var engine = $this.getEngine(name);

		    var key = $this.getId() + '/' + name;
		    $this.pool.put(key, {
		        key: key,
		        queryDescriptor: queryDescriptor,
		        status: 'prepared',
		    });
		    JSB.defer(function(){
		        try {
		            var task = $this.pool.get(key);
    		        task.status = 'started';
		            task.iterator = engine.execute(name, $this, queryDescriptor);
		            if (task.iterator) {
		                task.iterator.meta.engine = JSB.merge({}, $this.getEngineConfig(name), {alias:name});
		            }
		        } catch(e) {
		            task.error = e;
		        } finally {
		            task.status = 'completed';
		        }
		    }, 1, key);
		},

		getEngineConfig: function(name){
		    var engine = Config.get('datacube.query.engines.' + name);
		    QueryUtils.throwError(engine, 'Unknown query engine configuration "{}"', name);
		    return engine;
		},

		getEngine: function(name){
		    var engine = $this.getEngineConfig(name);
            var inst = JSB.getInstance(engine.jsb);
            QueryUtils.throwError(inst, 'Query engine "{}" instance is null', name);
            return inst;

		},

        /** Ожидает, пока все движки не закончат свою работу, и возвращает итератор с лучшим оценочным временем выполнения
        */
		awaitIterator: function(){

		    /// wait all completed
            W: while(true) {
                Kernel.sleep(10);
                for(var it = $this.pool.entrySet().iterator(); it.hasNext(); ) {
                    var task = it.next().getValue();
                    if(task.status !== 'completed') {
                        continue W;
                    }
                }
                break;
            }

            var its = [];
            var error;
            for(var it = $this.pool.entrySet().iterator(); it.hasNext(); ) {
                var task = it.next().getValue();
                if(task.iterator) {
                    its.push(task.iterator);
                    Console.message({
                        message: 'Iterator created [{}]: {}',
                        params:[task.iterator.meta.id, task.iterator.meta],
                    });
                    if (task.iterator.meta.translatedQuery) {
                        Console.message({
                            message: 'Translated query [{}]: {}',
                            params:[task.iterator.meta.id, '\n'+(
                                JSB.isString(task.iterator.meta.translatedQuery)
                                    ? task.iterator.meta.translatedQuery
                                    : JSON.stringify(task.iterator.meta.translatedQuery)
                            )],
                        });
                    }
                }
                if (task.error) {
                    Console.message({
                        message: 'Query execution error',
                        error: task.error
                    });
                    if (!error) {
                        error = task.error;
                    }
                }
            }

            QueryUtils.throwError(its.length || error, 'Compatible query engine not found, all engines no return iterator');
            if (its.length == 0 && error) throw error;

            /// select iterator
            var jsb = Config.get('datacube.query.engine.selector.jsb');
            var method = Config.get('datacube.query.engine.selector.method');
            var IteratorSelector = JSB.getInstance(jsb);
            var it = IteratorSelector[method].call(IteratorSelector, its);
            Console.message({
                message: 'Iterator selected [{}]: {}',
                params:[it.meta.id, it.meta],
            });
            return it;
		},

		destroy: function() {
            for(var it = $this.pool.entrySet().iterator(); it.hasNext(); ) {
                var key = it.next().getKey();
                JSB.cancelDefer(key);
                $this.pool.remove(key);
            }
		    $base();
		},
	}
}