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
		    $this.startedTimestamp = Date.now();
		},

		execute: function(){
            var startEngine = $this.queryTask.startEngine || Config.get('datacube.query.engine.start');

            Console.message({
                message: 'query.started',
                params:{
                    executor: $this.getId(),
                    timestamp: Date.now(),
                    query: $this.queryTask.query,
                    startEngine: startEngine,
                },
            });

            try {

                if ($this.query.$analyze) {
                    $this.analyze = {
                        engines: {},
                        inputQuery: $this.queryTask.query,
                        startEngine: $this.queryTask.startEngine,
                    };
                }

                var it = $this.executeEngine(startEngine, {
                    cube: $this.cube,
                    query: $this.query,
                    params: $this.params,
                });
                if (!it) {
                    var it = $this.awaitIterator();
                }
                return it;

            } catch(e) {
                Console.message({
                    message: 'query.error',
                    params:{
                        executor: $this.getId(),
                        timestamp: Date.now(),
                        error: JSB.stringifyError(e),
                    },
                });
                throw e;
            }
		},

        /** Асинхронный/синхронный запуск движка по имени конфигурации
        */
		executeEngine: function(name, queryTask) {
		    var engineConfig = $this.getEngineConfig(name);
		    var engine = $this.getEngine(name,engineConfig);

		    if(!engine.acceptable(name, $this, queryTask)) {
		        // skip not acceptable
		        return;
		    }

		    if ($this.analyze) {
		        $this.analyze.engines[name] = {
		            name: name,
		            async: engineConfig.async,
		            input: {
		                query: JSB.clone(queryTask.query),
		            },
		            startedTimestamp: Date.now(),
		        };
		    }

		    if (engineConfig.async == true) {
		        /// async
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
                            task.iterator.meta.engine = JSB.merge({}, engineConfig, {alias:name});
                        }
                        if($this.analyze) {
                            $this.analyze.engines[name].output = {
                                iterator: task.iterator
                            };
                        }
                    } catch(e) {
                        if($this.analyze) {
                            $this.analyze.engines[name].output = {
                                error: JSB.stringifyError(e),
                            }
                        }
                        task.error = e;
                    } finally {
                        task.status = 'completed';
                        if ($this.analyze) {
                            $this.analyze.engines[name].engineTime = (Date.now() - $this.analyze.engines[name].startedTimestamp)/1000;
                        }
                    }
                }, 1, key);
		    } else {
		        try {
                    /// sync
                    var it = engine.execute(name, $this, queryTask);
//                    if (it) {
//                        it.meta.engine = JSB.merge({}, engineConfig, {alias:name});
//                        if($this.analyze) {
//                            $this.analyze.engines[name].output = {
//                                iterator: it,
//                            };
//                            return $this.generateAnalyzeIterator($this.analyze.engines[name]);
//                        }
//                    }
                    if (it) {
                        throw new Error('Internal error: Invalid configuration: Execution engine is not async');
                    }
                } catch(e) {
                    if($this.analyze) {
                        $this.analyze.engines[name].output = {
                            error: e
                        };
                        /// при включенном анализаторе ошибка проглатывается
                        return $this.generateAnalyzeIterator($this.analyze.engines[name]);
                    }
                    throw e;
                } finally {
                    if ($this.analyze) {
                        $this.analyze.engines[name].engineTime = (Date.now() - $this.analyze.engines[name].startedTimestamp) / 1000;
                    }
                }
		    }
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
                        message: 'query.iterator',
                        params:{
                            executor: $this.getId(),
                            timestamp: Date.now(),
                            iterator: task.iterator.meta.id,
                            meta: task.iterator.meta,
                        },
                    });
                    if (task.iterator.meta.translatedQuery) {
                        Console.message({
                            message: 'query.translated',
                            params:{
                                executor: $this.getId(),
                                timestamp: Date.now(),
                                iterator: task.iterator.meta.id,
                                translatedQuery : (JSB.isString(task.iterator.meta.translatedQuery)
                                        ? task.iterator.meta.translatedQuery
                                        : JSON.stringify(task.iterator.meta.translatedQuery)),
                            },
                        });
                    }
                }
            }

            QueryUtils.throwError(its.length || errors.length > 0, 'Compatible query engine not found, all engines no return iterator');
            if (errors.length > 0) {
                if ($this.analyze) {
                    /// при анализе проглотить ошибки
                    return $this.generateAnalyzeIterator();
                }
                throw QueryUtils.mergeErrors.apply(QueryUtils, errors);
            }

            /// select iterator
            var jsb = Config.get('datacube.query.engine.iteratorSelector.jsb');
            var method = Config.get('datacube.query.engine.iteratorSelector.method');
            var IteratorSelector = JSB.getInstance(jsb);
            var it = IteratorSelector[method].call(IteratorSelector, its);
            it.meta.prepareTime = (Date.now() - $this.startedTimestamp) / 1000;

            Console.message({
                message: 'query.prepared',
                params:{
                    executor: $this.getId(),
                    timestamp: Date.now(),
                    prepareTime: it.meta.prepareTime,
                },
            });

            if ($this.analyze) {
                return $this.generateAnalyzeIterator(it);
            }
            return it;
		},

		setEngineMeta: function(name, result) {
		    if ($this.analyze) {
        	    $this.analyze.engines[name].meta = result;
            }
		},

		getEngineConfig: function(name){
		    var engine = Config.get('datacube.query.engines.' + name);
		    QueryUtils.throwError(engine, 'Unknown query engine configuration "{}"', name);
		    return engine;
		},

		getEngine: function(name, engineConfig) {
		    var engine = engineConfig || $this.getEngineConfig(name);
            var inst = JSB.getInstance(engine.jsb);
            QueryUtils.throwError(inst, 'Query engine "{}" instance is null', name);
            return inst;

		},

		generateAnalyzeIterator: function(iterator){
		    var iterator = iterator || {
		        close: function(){},
		    };

            //var result = analyzer;
            var result = $this.analyze;
            if (iterator && iterator.meta) {
                result.translatedQuery = iterator.meta.translatedQuery;
                result.translatorInputQuery = iterator.meta.translatorInputQuery;
                result.prepareTime = iterator.meta.prepareTime;
            }
            /// вместо объекта с данными вернуть анализ
            iterator.next = function() {
                try {
                    return result;
                } finally {
                    if (result) result = null;
                }
            };
            return iterator;
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