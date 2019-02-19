{
	$name: 'DataCube.Query.QueryNavigator',
	// TODO: DataCube.Query.QueryRebuilder

	$server: {
		$require: [
		    'DataCube.Query.QuerySyntax',
		    'DataCube.Query.QueryUtils',
		    'DataCube.Model.Slice',
        ],

        $constructor: function(query, defaultCube, options){
            $this.cube = defaultCube;
            $this.query = query;
            $this.options = JSB.merge({
                    cached: false,
                }, options);

            if ($this.options.cached) {
                $this._installListedCache([

                    'getDescriptor',
                    'getQueriesByContext',
                    'getQuery',
                    'getCallerQuery',
                    'getParentQuery',
                    'getParentQuery',
                    'getPrentQueries',
                    'getSelfPrentQueries',
                    'getSingleSourceQuery',
                    'getSourceQueries',
                    'getNestedQueries',
                    'getSourceType',
                    /*methods  visit* - not cached! */
                ]);
            }
        },

        SourceType: {
            Cube : 'Cube',
            Slice : 'Clice',
            Empty : 'Empty',
            Query : 'Query',
            NamedQuery: 'NamedQuery',
            Join  : 'Join',
            Union : 'Union',
            Recursive: 'Recursive',
        },

        /** Формирует дескриптор текущего запроса.
        */
        getDescriptor: function(current) {
        },

        /** Находит по названию контекста все запросы
        */
        getQueriesByContext: function(context) {
        },

        /** Находит по названию контекста запрос в области видимости текущего.
        */
        getQuery: function(current, context) {
        },


        /** Находит запрос, в котором непосредственно используется/вызывается текущий запрос
            в качестве источника или вложенного в выражение подзапроса.
        */
        getCallerQuery: function(current) {
        },

        /** Находит первый родительский запрос,
            другими словами, первый запрос, поля которого видны в текущем запросе
        */
        getParentQuery: function(current) {
        },

        /** Находит всю цепочку родительских запросов,
            другими словами, все запросы, поля которых видны в текущем запросе
            в таком порядке, что каждый последующий запрос является родителем предыдущего
        */
        getPrentQueries: function(current) {
        },

        /** См. getPrentQueries, но массив с результатом начинается с текущего
        */
        getSelfPrentQueries: function(current) {
            return [current].concat($this.getPrentQueries(current));
        },

        /** Находит единственный источник текущего запроса только, если он один, иначе undefined.
        */
        getSingleSourceQuery: function(current) {
        },

        /** Находит все источники текущего запроса в порядке очередности использования/вызова.
        */
        getSourceQueries: function(current) {
        },

        /** Находит все запросы в выражениях текущго запроса в порядке использования/вызова.
        */
        getNestedQueries: function(current) {
        },

        /** Возвращает тип источника, одно из значений SourceType.
        */
        getSourceType: function(current) {
        },


        /** Методы виитеры - позволяют осуществлять обход подзапросов,
            выражений и полей в последовательности, соответствующей
            порядку использования/вызова. У всех калбеков this включает полезные
            свойства и дополнительную информацию об объекте (первом агрументе).
        */


        /** Обходит все родительские запросы, в порядке от дочернего к родительскому.
            Порядок обходя обратный в сравнении с #visitNested.
        */
        visitParents: function(opts, enterCallback, leaveCallback) {
            var opts = JSB.merge({
                    query: $this.query,
                }, opts);
            var query = opts.query;

        },

        /** Обходит все вложенные в выражения подзапросы в порядке от родителя к дочернему.
            Порядок обходя обратный в сравнении с #visitParents.
        */
        visitNested: function(opts, enterCallback, leaveCallback) {
            var opts = JSB.merge({
                    query: $this.query,
                }, opts);

        },

        /** Обходит запросы-источники, только текущего запроса или включая все источники источников.
        */
        visitSources: function(opts, enterCallback, leaveCallback) {
            var opts = JSB.merge({
                    query: $this.query,
                    onlyDirect: true,
                    transitiveAll: false,
                }, opts);
            var query = opts.query;
            var transitiveAll = opts.transitiveAll;
            var onlyDirect = !transitiveAll && opts.onlyDirect;

        },

        /** Обходит все подзапросы в порядке вызова:
            1 - источники в заданном порядке;
            2 - вложенные в выражения подзапросы в порядке использования/вызова,
                начиная с самого первого источника (первого листа дерева вызовов);
            3 -
        */
        visitQueries: function(opts, enterCallback, leaveCallback) {
            var opts = JSB.merge({
                    query: $this.query,
                    visitSources : true,
                    visitExpressionNested: true
                }, opts);
            var query = opts.query;
            var visitSources = opts.visitSources;
            var visitExpressionNested = opts.visitExpressionNested;
        },

        /* Обходит выражения в порядке использования/вызова.
           Если натыкается на вложенные запрос и visitExpressionNested=true, то
           входит в запрос и обходит выраения в его $select.
           Если натыкается на поле и visitFields=true, то
           находит выражение этого поля у источника, алиса текущего или родительского запроса
           и обходит его выражения вплоть до последнего поля (поля провайдера, среза или куба).
           Осуществляет наиболее полный и глубокий обход.
        */
        visitExpressions: function(opts, enterCallback, leaveCallback) {
debugger
            var opts = JSB.merge({
                    query: $this.query,
                    exp: null,
                    visitExpressionNested: true,
                    visitSources: false,
                    visitFields: false,
                    visitDuplicates : true,
                }, opts);
            var query = opts.query;
            var exp = opts.exp || query;
            var visitExpressionNested = opts.visitExpressionNested;
            var visitFields = opts.visitFields;
            var visitSources = opts.visitSources;
            var visitDuplicates = opts.visitDuplicates;
            var needBreak = false;

            function buildDescriptor() {
                JSB.merge(this, {
                    // TODO
                });
            }

            function findNamedQuery(name){
                // TODO:
                return {};
            }

            function visitQuery() {
                if (needBreak) return;

                /// visit sources: $from, $join, $union, $recursive, $cube, $provider
                if (this.exp.$from && JSB.isString(this.exp.$from)) {
                    var namedQuery = findNamedQuery.call(this, this.exp.$from);
                    visitExpression.call({
                        exp: namedQuery instanceof Slice ? namedQuery.getQuery() : namedQuery,
                        query: namedQuery instanceof Slice ? namedQuery.getQuery() : namedQuery,
                        parent: this.parent,
                        caller: this.query,
                        key: this.exp.$from,
                        path: this.path.slice().concat(['$from', this.exp.$from]),
                        queryPath: this.queryPath,
                        isInFrom: true,
                        viewName: this.exp.$from,
                    });
                } else if (this.exp.$from && JSB.isObject(this.exp.$from)) {
                    visitExpression.call({
                        exp: this.exp.$from,
                        query: this.exp.$from,
                        parent: this.parent,
                        caller: this.query,
                        key: '$from',
                        path: this.path.slice().concat(['$from']),
                        queryPath: this.queryPath,
                        isInFrom: true,
                    });
                } else if (this.exp.$provider) {
                    // TODO provider
                } else if (this.exp.$join) {
                    visitExpression.call({
                        path: this.path.slice().concat(['$join']),
                        exp: this.exp.$join,
                        key: '$join',
                    });
                } else if (this.exp.$union) {
                    for (var i = 0; i < this.exp.$union.length; i++) {
                        visitExpression.call({
                            path: this.path.slice().concat(['$union', i]),
                            exp: this.exp.$union[i],
                            key: '$union',
                        });
                    }
                } else if (this.exp.$recursive) {
                    visitExpression.call({
                        path: this.path.slice().concat(['$recursive']),
                        exp: this.exp.$recursive,
                        key: '$recursive',
                    });
                } else {
                    var cube = this.exp.$cube ? QueryUtils.getQueryCube(this.exp.$cube, $this.cube) : $this.cube;
                    // TODO cube
                }

                /// visit $filter
                visitExpression.call({
                    exp: this.exp.$filter,
                    key: '$filter',
                    path: this.path.slice().concat(['$filter']),
                    queryPath: this.queryPath,
                });

                /// visit $globalFilter
                visitExpression.call({
                    exp: this.exp.$globalFilter,
                    key: '$globalFilter',
                    path: this.path.slice().concat(['$globalFilter']),
                    queryPath: this.queryPath,
                });

                /// visit $groupBy
                visitExpression.call({
                    exp: this.exp.$groupBy,
                    key: '$groupBy',
                    path: this.path.slice().concat(['$groupBy']),
                    queryPath: this.queryPath,
                });

                /// visit $select
                visitExpression.call({
                    exp: this.exp.$select,
                    key: '$select',
                    path: this.path.slice().concat(['$select']),
                    queryPath: this.queryPath,
                });

                /// visit $sort
                visitExpression.call({
                    exp: this.exp.$sort,
                    key: '$sort',
                    path: this.path.slice().concat(['$sort']),
                    queryPath: this.queryPath,
                });

                /// visit $postFilter
                visitExpression.call({
                    exp: this.exp.$postFilter,
                    key: '$postFilter',
                    path: this.path.slice().concat(['$postFilter']),
                    queryPath: this.queryPath,
                });

            }

            function visitExpression(){
                if (needBreak || this.exp === null) return;

                if (JSB.isArray(this.exp) || JSB.isObject(this.exp)) {
                    this.path = this.path.slice().concat([this.exp]);
                }
                if (this.exp.$select) {
                    this.queryPath = this.queryPath.slice().concat([this.query]);
                    this.path = this.path.slice().concat([this.exp]);
                    this.query = this.exp;
                }

                buildDescriptor.call(this);

                var status = enterCallback ? enterCallback.call(this, this.exp) : null;
                needBreak = needBreak || status === false;
                if (status != null && status !== false) {
                    // TODO replace expression
                }


                if (JSB.isString(this.exp)){
debugger

                    // TODO visit named query

                } else if (JSB.isObject(this.exp)) {
                    if (this.exp.$select) {
                        if (this.exp != this.query) {
                            this.caller = this.query;
                        }
                        this.query = this.exp;
                        visitQuery.call(this);
                    } else {
                        for(var key in this.exp) if (!needBreak && typeof this.exp[key] !== 'undefined') {
                            visitExpression.call({
                                query: this.query,
                                parent: this.parent,
                                exp: this.exp[key],
                                key: key,
                                path: this.path.slice().concat([i]),
                                queryPath: this.queryPath,
                                isInJoin: this.key == '$join',
                                isInJoinAsLeft: this.key == '$join' && key == '$left',
                                isInJoinAsRight: this.key == '$join' && key == '$right',
                                isInRecursive: this.key == '$recursive',
                                isInRecursiveAsStart: this.key == '$recursive' && key == '$start',
                                isInRecursiveAsNext: this.key == '$recursive' && key == '$joinedNext',
                            });
                        }
                    }
                } else if (JSB.isArray(this.exp)) {
                    for (var i = 0; i < this.exp.length; i++) {
                        visitExpression.call({
                            query: this.query,
                            parent: this.parent,
                            exp: this.exp[i],
                            key: i,
                            path: this.path.slice().concat([i]),
                            queryPath: this.queryPath
                        });
                    }
                }

                var status = leaveCallback ? leaveCallback.call(this, this.query) : null;
                needBreak = needBreak || status === false;
                if (status != null && status !== false) {
                    // TODO replace query
                }
            }

            visitExpression.call({
                query: query,
                exp: exp,
                path: [],
                key: null,
                parent: null,
                queryPath: [],
            });
        },


        _installListedCache: function(opts, methods) {
            var cache = [];
            function cache(m, args, result) {
                cache.push({
                    keys: [m].concat(args),
                    result: result
                });
                return result;
            }

            function getCached(m, args) {
                var keys = [m].concat(args);
                CACHE:
                for(var c = 0; i < cache.length; c++) {
                    var box = cache[c];
                    if (keys.length != box.keys.length) continue CACHE;
                    for(var k = 0; k < keys.length; k++) {
                        if (keys[k] != box.keys[k]) continue CACHE;
                    }
                    return box.result;
                }
            }

            for(var i = 0; i < methods.length; i++) {
                (function(m){
debugger;
                    var func = $this[m];
                    $this[m] = function (){
                        return getCached(m, arguments) ||
                               cache(m, arguments,
                                     $this[m].apply(this, arguments));
                    };
                })(methods[i]);
            }
        },
	},
//
//        interpreterMode: false,
//		vendor: 'PostgreSQL',
//
//        path: [],
//        localPath:[],
//
//        $bootstrap: function(){
//        	TranslatorRegistry.register(this);
//        },
//
//		$constructor: function(providerOrProviders, cube){
//		    $base(providerOrProviders, cube);
//		    $this.config = {
//		    }
//		},
//
//		translatedQueryIterator: function(dcQuery, params){
//		    return $base(dcQuery, params);
//		},
//
//		executeQuery: function(translatedQuery){
//		    var store = this.providers[0].getStore();
//		    var iterator = store.asSQL().iteratedParametrizedQuery2(
//		        translatedQuery,
//		        function getValue(param) {
//		            return $this.params[param];
//		        },
//		        function getType(param) {
//		            var type = $this.getParamType(param);
//		            if (type) {
//		                return JDBC.toJdbcType(type);
//                    }
//		            return null;
//		        }
//		    );
//		    return iterator;
//        },
//
//		analyzeQuery: function(translatedQuery){
//		    var json = {
//		        translatedQuery: translatedQuery,
//		        preparedQuery: this.dcQuery,
//		        params: this.params
//		    };
//		    return {
//		        next: function(){
//                    try {
//                        return json;
//                    } finally {
//                        if (json) json = null;
//                    }
//		        },
//		        close: function(){
//		        }
//		    };
//		},
//
//		translatedQueryIterator: function(dcQuery, params){
//		    var it = $base(dcQuery, params);
//		    it.meta.id = $this.getJsb().$name+'/'+$this.vendor+'#'+JSB.generateUid();
//		    it.meta.vendor = $this.vendor;
//		    return it;
//		},
//		translateQuery: function(query) {
//
//		},
//
//		printQuery: function(query) {
//		    try {
//                $this.path.push(query);
//                $this.localPath = [];
//
//                var path = $this.path;
//
//                var info = {
//                    /// [query]
//                    isRoot: path.length == 1,
//                    /// [..., name]
//                    isAlias: !isRoot && JSB.isString(query),
//                    /// [.., name, $views, query]
//                    isView: !isRoot && path[path.length-2] == '$views' && JSB.isString(path[path.length-3],
//                    /// [.., $from, name, $views, query] or [.., $from, query]
//                    isInFrom: !isRoot && (isView ? path[path.length-4] == '$from' : path[path.length-2] == '$from'),
//                    /// [..., $union, name, $views, query] or [..., $union, query]
//                    isInUnion: !isRoot && (isView ? path[path.length-4] == '$union' : path[path.length-2] == '$union'),
//                    /// [..., $join, $left/$right, name, $views, query] or [..., $join, $left/$right, query]
//                    isInJoin: !isRoot && (isView ? path[path.length-5] == '$join': path[path.length-3] == '$join'),
//                    isLeft: isInJoin && (isView ? path[path.length-4] == '$left': path[path.length-2] == '$left'),
//                    isRight: isInJoin && (isView ? path[path.length-4] == '$right': path[path.length-2] == '$right'),
//                    /// [parentQuery, $select, ..., query]
//                    isExpression: (function(){
//                                for(var i = path.length-2; i--; i >= 0 && JSB.isString($this.path[i])) {
//                                    if (path[i] == '$select') {
//                                        return true
//                                    }
//                                }
//                            })(),
//                };
//
//                if (isAlias) {
//                    return $this.printViewName(query);
//                }
//
//                info.hasDistinct = !!query.$distinct;
//                info.hasWith     = query.$views && Object.keys(query.$views).length > 0;
//                info.hasGroupBy  = query.$groupBy && query.$groupBy.length > 0;
//                info.hasFilter   = query.$filter && Object.keys(query.$filter).length > 0 && !(query.$filter.$and && query.$filter.$and.length == 0);
//                info.hasHaving   = query.$groupBy && query.$groupBy.length > 0;
//                info.hasSort     = query.$sort && query.$sort.length > 0;
//                info.hasSort     = query.$sort && query.$sort.length > 0;
//
//
//                if (isRoot || isExpression) {
//                    return `#dot
//                    `;
//                }
//
//		    } finally {
//		        QueryUtils($this.path.pop() == query, 'Invalid query path');
//		    }
//		},
}