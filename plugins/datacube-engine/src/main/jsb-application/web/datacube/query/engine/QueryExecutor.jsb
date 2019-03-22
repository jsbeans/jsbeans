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
		    'java:java.util.concurrent.atomic.AtomicReference',
		    'java:java.util.concurrent.ConcurrentLinkedDeque',
        ],

        pool: null,

		$constructor: function(queryTask){
		    $this.queryTask = queryTask;
            $this.cube = queryTask.cube;
		    $this.query = JSB.clone(queryTask.query);
		    $this.callback = queryTask.callback;
		    $this.params = queryTask.params || {};
		    $this.qid = $this.query.$id = $this.query.$id || JSB.generateUid();
		    $this.pool = new ConcurrentHashMap();
		    $this.iterators = new ConcurrentLinkedDeque();
		    $this.result = new AtomicReference();
		    $this.startedTimestamp = Date.now();
		    $this.resultReturned = false;
		},

		execute: function(){
            var startEngine = $this.queryTask.startEngine;

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

                $this.executeEngine(startEngine, {
                    cube: $this.cube,
                    query: $this.query,
                    params: $this.params,
                });
                $this.submitResult();

                /// wait result if sync
                if (!$this.callback) {
                    while(true) {
                        if($this.result.get()) {
                            var result = $this.result.get();
                            if (result.error) {
                                throw result.error;
                            }
                            return result.iterator;
                        }
                        Kernel.sleep(25);
                    }
                }
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
                        $this.submitResult(task.iterator);
                    }
                }, 1, key);
		    } else {
		        try {
                    /// sync
                    var key = $this.getId() + '/' + name;
                    var task = {
                        key: key,
                        queryTask: queryTask,
                        status: 'started',
                    };
                    $this.pool.put(key, task);
                    var it = engine.execute(name, $this, queryTask);
                    $this.submitResult(it);
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
                    task.status = 'completed';
                    if ($this.analyze) {
                        $this.analyze.engines[name].engineTime = (Date.now() - $this.analyze.engines[name].startedTimestamp) / 1000;
                    }
                }
		    }
		},

		submitResult: function(iterator) {
		    if ($this.resultReturned) {
		        return;
		    }

		    if(iterator) {
		        $this.iterators.add(iterator);
                Console.message({
                    message: 'query.iterator.created',
                    params:{
                        executor: $this.getId(),
                        timestamp: Date.now(),
                        iterator: iterator.meta.id,
                        meta: iterator.meta,
                    },
                });
                if (iterator.meta.translatedQuery) {
                    Console.message({
                        message: 'query.iterator.translated',
                        params:{
                            executor: $this.getId(),
                            timestamp: Date.now(),
                            iterator: iterator.meta.id,
                            translatorInputQuery: iterator.meta.translatorInputQuery,
                            translatedQuery : (JSB.isString(iterator.meta.translatedQuery)
                                    ? iterator.meta.translatedQuery
                                    : JSON.stringify(iterator.meta.translatedQuery)),
                        },
                    });
                }
		    }

		    /// check completed all async tasks
            for(var it = $this.pool.entrySet().iterator(); it.hasNext(); ) {
                var task = it.next().getValue();
                if(task.status !== 'completed') {
                    /// not completed
                    return;
                }
            }

            /// if completed

            function sendResult(iterator, error) {
                if (iterator) {
                    Console.message({
                        message: 'query.iterator.result',
                        params:{
                            executor: $this.getId(),
                            timestamp: Date.now(),
                            iterator: resultIterator.meta.id,
                            prepareTime: resultIterator.meta.prepareTime,
                        },
                    });
                }

                if ($this.callback) {
                    $this.callback.call(this, iterator, error);
                } else {
                    $this.result.set({iterator: iterator, error: error});
                }
                $this.resultReturned = true;
            }

            var its = [];
            var errors = [];
            for(var it = $this.iterators.iterator(); it.hasNext(); ) {
                var itt = it.next();
                its.push(itt);
            }
            QueryUtils.throwError(its.length || errors.length > 0, 'Compatible query engine not found, all engines no return iterator');
            if (errors.length > 0) {
                if ($this.analyze) {
                    /// при анализе проглотить ошибки
                    sendResult($this.generateAnalyzeIterator(), null);
                    return;
                }
                sendResult(null, QueryUtils.mergeErrors.apply(QueryUtils, errors));
            }

            /// select iterator
            var jsb = Config.get('datacube.query.engine.iteratorSelector.jsb');
            var method = Config.get('datacube.query.engine.iteratorSelector.method');
            var IteratorSelector = JSB.getInstance(jsb);
            var resultIterator = IteratorSelector[method].call(IteratorSelector, its);

            /// close other iterators
            for(var it = $this.iterators.iterator(); it.hasNext(); ) {
                var itt = it.next();
                if (itt != resultIterator) {
                    try {
                        itt.close();
                    } catch(e) {
                        /// ignore
                    }
                }
            }

            resultIterator.meta.prepareTime = (Date.now() - $this.startedTimestamp) / 1000;

            if ($this.analyze) {
                resultIterator = $this.generateAnalyzeIterator(resultIterator);
            }

            sendResult(resultIterator, null);
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
                    if (result) {
                        Console.message({
                            message: 'query.executed',
                            params:{
                                executor: $this.getId(),
                                timestamp: Date.now(),
                                iterator: this.meta.id,
                                firstResultTime: (Date.now() - $this.startedTimestamp)/1000,
                                //query: dcQuery,
                            },
                        });
                        result = null;
                    }
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