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

		$constructor: function(queryTask){
		    $this.queryTask = queryTask;
            $this.cube = queryTask.cube;
		    $this.query = JSB.clone(queryTask.query);
		    $this.params = queryTask.params || {};
		    $this.qid = $this.query.$id = $this.query.$id || JSB.generateUid();
		    $this.pool = new ConcurrentHashMap();
		},

		execute: function(){
            var startEngine = $this.queryTask.startEngine || Config.get('datacube.query.engine.start');

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
		executeEngine: function(name, queryTask) {

		    var engine = $this.getEngine(name);

		    var key = $this.getId() + '/' + name;
		    $this.pool.put(key, {
		        key: key,
		        queryTask: queryTask,
		        status: 'prepared',
		    });
		    JSB.defer(function(){
		        try {
		            var task = $this.pool.get(key);
    		        task.status = 'started';
		            task.iterator = engine.execute(name, $this, queryTask);
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
            var errors = [];
            for(var it = $this.pool.entrySet().iterator(); it.hasNext(); ) {
                var task = it.next().getValue();
                if(task.iterator) {
                    its.push(task.iterator);
                    Console.message({
                        message: 'Iterator created',
                        params:{executor: $this.getId(), iteratorId: task.iterator.meta.id, meta: task.iterator.meta},
                    });
                    if (task.iterator.meta.translatedQuery) {
                        Console.message({
                            message: 'Translated query',
                            params:{
                                executor: $this.getId(),
                                iteratorId: task.iterator.meta.id,
                                translatedQuery : (JSB.isString(task.iterator.meta.translatedQuery)
                                        ? task.iterator.meta.translatedQuery
                                        : JSON.stringify(task.iterator.meta.translatedQuery))
                            },
                        });
                    }
                }
                if (task.error) {
                    Console.message({
                        message: 'Query execution error',
                        error: task.error,
                        params: {executor: $this.getId()}
                    });
                    errors.push(task.error);
                }
            }

            QueryUtils.throwError(its.length || errors.length > 0, 'Compatible query engine not found, all engines no return iterator');
            if (errors.length > 0) throw QueryUtils.mergeErrors.apply(QueryUtils, errors);

            /// select iterator
            var jsb = Config.get('datacube.query.engine.iteratorSelector.jsb');
            var method = Config.get('datacube.query.engine.iteratorSelector.method');
            var IteratorSelector = JSB.getInstance(jsb);
            var it = IteratorSelector[method].call(IteratorSelector, its);
            Console.message({
                message: 'Iterator selected',
                params:{executor: $this.getId(), iteratorId: it.meta.id, meta: it.meta},
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