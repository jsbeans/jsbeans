{
	$name: 'DataCube.Query.QueryUtils',
	$singleton: true,

	$server: {
	    $require: [
	        'DataCube.Query.QuerySyntax',
		    'JSB.Crypt.MD5',

		    'java:java.util.HashMap'
        ],

        sformat: function(msg, arg0, arg1) {
            var pos = 0;
            var args = arguments;
            msg = msg.replace(/\{(\d{0,2})\}/g, function(s, n) {
                if (!n) {
                    n = pos ++;
                } else {
                    try {
                        n = parseInt(n);
                    } catch(e){
                        n = pos ++;
                    }
                }
                return args[n+1];
            });
            return msg;
        },

        logDebug: function(msg, a0, a1){
            if (Config.get('jsbeans.debug')) {
                Log.debug($this.sformat.apply(this, arguments));
            }
        },

        assert: function(isAssert, message, a0, a1){
            if (Config.get('jsbeans.debug') && !isAssert) {
                var args = Array.prototype.slice.call(arguments, 1);
                var msg = 'Assertion failed: ' + $this.sformat.apply(this, args);
                Log.debug(msg);
                throw new Error(msg);
            }
        },

        throwError: function(isAssert, message, a0, a1) {
            if (!isAssert) {
                var args = Array.prototype.slice.call(arguments, 1);
                var msg = 'Error: ' + $this.sformat.apply(this, args);
                Log.debug(msg);
                throw new Error(msg);
            }

        },

        /** Cube id in $cube:
        *  a) 'cubeId' - in workspace of defaultCube
        *  b) 'wsId/cubeId' - in custom workspace
        */
        getQueryCube: function(cubeId, defaultCube) {
            var ids = cubeId.split('/');
            if (ids.length == 2) {
                var wid = ids[0];
                var cid = ids[1];
                var ws = WorkspaceController.getWorkspace(wid);
                var cube = ws.entry(cid);
            } else {
                var cid = ids[0];
                var ws = defaultCube.getWorkspace();
                var cube = ws.entry(cid);
            }
            $this.throwError(cube, 'Cube with id "{}" is undefined', cubeId);
            return cube;

        },

        /** Provider id in $provider:
        *  a) 'providerId' - in defaultCube
        *  b) 'wsId/providerId' - in custom workspace
        */
        getQueryDataProvider: function(providerId, defaultCube) {
            var ids = providerId.split('/');
             if (ids.length == 2) {
                var wid = ids[0];
                var pid = ids[1];
                var ws = WorkspaceController.getWorkspace(wid);
                var provider = ws.entry(pid);
            } else {
                var pid = ids[0];
                var provider = defaultCube.getProviderById(pid);
            }
            $this.throwError(provider, 'Data provider with id "{}" is undefined', providerId);
            return provider;
        },

        hasDeclaredSource: function(query) {
            return query.$cube || !query.$provider
                && !query.$from
                && !query.$join && !query.$union
                && !query.$recursive;
        },

        walkQueries: function (dcQuery, options, enterCallback, leaveCallback/**false=break: callback(q) and this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}*/) {
            options = options || {depth:0, findView: null};
            var queryDepth = -1;
            var trace = options.trace || false;
            var visitedQueries = new HashMap();
            var path = [];

            if(trace) {
                var oldCallback = leaveCallback;
                $this.logDebug('\n\n[qid='+dcQuery.$id+'] Walk sub-queries start: ' + JSB.stringify(dcQuery));
                leaveCallback = function(q){
                    $this.logDebug('[qid='+dcQuery.$id+'] Sub-query: ' + q.$context +
                            ' (isInFrom=' + !!this.inFrom +
                            ', isValueQuery=' + this.isValueQuery +
                            ', isView=' + this.isView +
                            ', nestedPath.length=' + this.nestedPath.length +
                            ', fromPath.length=' + this.fromPath.length +
                            ') : ' + JSB.stringify(q));
                    return oldCallback ? oldCallback.apply(this, arguments) : true;
                }
            }

            var findView = options.findView || function(name) {
                var view = dcQuery.$views[name];
                $this.throwError(view, 'View "{} "is not defined', name);
                return view;
            };

            function walkQuery(query){
                function checkCircle(context){
                    for (var i = this.nestedPath.length -1; i >= 0; i--) {
                        if (this.nestedPath[i].$context == context) {
                            throw new Error('Cyclical nested query with context ' + context);
                        }
                    }
                    for (var i = this.fromPath.length -1; i >= 0; i--) {
                        if (this.fromPath[i].$context == context) {
                            throw new Error('Cyclical view query with context ' + context);
                        }
                    }
                }

                queryDepth++;
                path.push(query);
                try {

                    if (options.depth && queryDepth > options.depth) {
                        return;
                    }

                    // walk current query

                    var res = enterCallback ? enterCallback.call(this, query) : null;
                    if(res === false) return; /// stop and go back

                    // from
                    if (query.$from) {
                        if (typeof query.$from === 'string') {
                            checkCircle.call(this, query.$from);
                        }
                        var fromQuery = typeof query.$from === 'string'
                                ? findView.call(this, query.$from) : query.$from;

                        if (JSB.isEqual(fromQuery, {})) {
                            return true;
                        }
                        if (!JSB.isObject(fromQuery)) {
                            throw new Error('Invalid $from type ' + typeof query.$from);
                        }
                        var res = walkQuery.call(
                            {
                                query : fromQuery,
                                nestedPath: [],
                                fromPath: this.fromPath.concat([query]),
                                isView : typeof query.$from === 'string' ? query.$from : false,
                                isValueQuery: false,
                                inFrom : true,
                                path: path
                            },
                            fromQuery,
                            query
                        );
                        if (res === false) return false;
                    }

                    // query operators
                    var keys = ['$union', '$join', '$recursive', '$select', '$filter', '$globalFilter', '$groupBy', '$sort', '$postFilter'];
                    for (var i = 0; i < keys.length; i++) if (query[keys[i]] != null) {
                        var res = walkExpression.call(
                            {
                                nestedPath: this.nestedPath.concat([keys[i]]),
                                fromPath: this.fromPath,
                                inJoin: keys[i] == '$join',
                                inUnion: keys[i] == '$union',
                                inRecursive: keys[i] == '$recursive',
                                path: path
                            },
                            query[keys[i]],
                            keys[i],
                            query
                        );
                        if (res === false) return false;
                    }

                    // visit self query
                    if (!options.skipDuplicates || !visitedQueries.containsKey(query)){
                        visitedQueries.put(query, true);
                        var res = leaveCallback ? leaveCallback.call(this, query) : null;
                    }
                    return res === false ? false : true;
                } finally {
                    queryDepth--;
                    path.pop();
                }
            }

            function walkExpression(exp, key) {
                if (exp == null) {
                } else if (JSB.isObject(exp)) {
                    if (exp.$select) {
                        var res = walkQuery.call(
                            {
                                query : exp,
                                nestedPath: this.nestedPath.concat([key]),
                                fromPath: this.fromPath,
                                isView : false,
                                isValueQuery: this.isValueQuery,
                                inFrom : false,
                                inJoin: this.inJoin,
                                inUnion: this.inUnion,
                                inRecursive: this.inRecursive,
                                path: path
                            },
                            exp
                        );
                        if (res === false) return false;
                    } else {
                        for (var f in exp) if (typeof exp[f] !== 'undefined') {
                            var res = walkExpression.call(
                                {
                                    nestedPath: this.nestedPath.concat([f]),
                                    fromPath: this.fromPath,
                                    inJoin: this.inJoin && (f === '$left' || f === '$right'),
                                    path: path
                                },
                                exp[f],
                                f,
                                exp
                            );
                            if (res === false) return false;
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for (var i = 0; i < exp.length; i++) {
                        var res = walkExpression.call(
                            {
                                nestedPath: this.nestedPath.concat([i]),
                                fromPath: this.fromPath,
                                inUnion: this.inUnion,
                                path: path
                            },
                            exp[i],
                            i,
                             exp
                        );
                        if (res === false) return false;
                    }
                }
                return true;
            }

//debugger;
            var res = dcQuery.$select
                ? walkQuery.call(
                    {
                        query : dcQuery,
                        nestedPath: [dcQuery],
                        fromPath: [],
                        isView : false,
                        isValueQuery: false,
                        inFrom : false,
                        path: path
                    },
                    dcQuery,
                    null
                )
                : walkExpression.call(
                    {
                        nestedPath: [],
                        fromPath: [],
                        path: path
                    },
                    dcQuery,
                    null,
                    null
                );
            visitedQueries.clear();
            trace && $this.logDebug('[qid='+dcQuery.$id+'] Walk sub-queries complete');
            return res === false ? false : true;
        },

        /** Обходит все, что может являться используемым полем источника запроса. Если callback возвращает выражение, то производится замена старого выражения на новое.
        */
		walkInputFieldsCandidates: function(query, cube, getView, callback) {
            var sourceFields = $this.extractSourceFields(query, cube, getView);
		    $this.walkQueries(query, {findView:getView}, null, function (q){
                (function walkExpression(exp){
                    if (JSB.isObject(exp)) {
                        if (exp.$field) {
                            var context = exp.$context || q.$context;
                            if (context == query.$context) {
                                // is input field
                                var resultField = callback(exp.$field, context, q, true);
                                // is need replace field expression
                                if (resultField) {
                                    exp.$field = resultField.$field;
                                    if (resultField.$context) {
                                        exp.$context = resultField.$context;
                                    }
                                    return;
                                }
                            }
                        } else if (!exp.$select || exp == q) {
                            for(var i in exp) if (exp[i] != null) {
                                if (typeof exp[i] !== "string" || !QuerySyntax.constValueOperators[i]) {
                                    var resultField = walkExpression(exp[i]);
                                    if (resultField) {
                                        exp[i] = resultField;
                                    }
                                }
                            }
                        }
                    } else if (JSB.isArray(exp)) {
                        for (var i=0; i < exp.length; i++) if (exp[i] != null) {
                            var resultField = walkExpression(exp[i]);
                            if (resultField) {
                                exp[i] = resultField;
                            }
                        }
                    } else if (JSB.isString(exp) && !exp.startsWith('$')) {
                        if (q.$context == query.$context) {
                            // is input field
                            var resultField = callback(exp, q.$context, q);
                            if (resultField) {
                                return resultField;
                            }
                        }
                    }
                })(q);
            });
		},

        /** Возвращает выходные поля источника запроса.
        */
		extractSourceFields: function(query, cube, getView) {
		    if (query.$cube) {
		        var sourceFields = cube.getManagedFields();
		    } else if (query.$provider){
		        var provider = $this.getQueryDataProvider(query.$provider, cube);
		        var sourceFields = provider.extractFields();
		    } else if (query.$from) {
                if (JSB.isString(query.$from)) {
                    var fromQuery = getView(query.$from);
                    $this.throwError(!!fromQuery, 'View "{}" is not defined', query.$from);
                    var sourceFields = $this.extractOutputFields(fromQuery);
                } else if (Object.keys(query.$from).length > 0) {
                    var sourceFields = $this.extractOutputFields(query.$from);
                } else {
                    var sourceFields = {};
                }
		    } else if (query.$join) {
		        var sourceFields = $this.extractOutputFields(query.$join);
		        // TODO
		    } else if (query.$union) {
		        var sourceFields = $this.extractOutputFields(query.$union);
		        // TODO
            } else if (query.$recursive) {
                var sourceFields = $this.extractOutputFields(query.$recursive.$start);
            } else {
                var sourceFields = cube.getManagedFields();
            }
            return sourceFields;
		},

        /** {field: any}. Возвращает поля источника, которые используются в запросе или во вложенных запросах, привязанных к текущему.
        */
		extractInputFields: function(query, cube, getView) {
            var sourceFields = $this.extractSourceFields(query, cube, getView);
            var inputFields = {};
            $this.walkInputFieldsCandidates(query, cube, getView, function (field, context, q, isExp) {
                if (sourceFields[field]) {
                    inputFields[field] = true;
                }
                $this.throwError(sourceFields[field] || !isExp, 'Field "{}" is not defined in source', field);
            });
            return inputFields;
		},

        /** {field: expr}: Возвращает выходные поля запроса, по сути $select.
        */
		extractOutputFields: function(query) {
            return query.$select;
		},

        walkExpressionFields: function(valueExp, query, skipSubQuery, callback) {
            function collect(exp, fixedContext) {
                if (JSB.isString(exp) && !exp.startsWith('$')) {
                    if (!fixedContext) {
                        callback(exp, query.$context, query, false);
                    }
                } else if (JSB.isObject(exp) && exp.$field) {
                    $this.throwError(JSB.isString(exp.$field), 'Invalid $field value type "{}"', typeof exp.$field);
                    if (exp.$context && fixedContext && query.$context == exp.$context) {
                        callback(exp.$field, exp.$context, query, true);
                    } else if (!exp.$context && !fixedContext) {
                        callback(exp.$field, exp.$context, query, true);
                    }
                } else if (JSB.isObject(exp)) {
                    if (exp == query || !exp.$select) {
                        // if start query or any expression
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            collect(exp[f], fixedContext);
                        }
                    } else if(exp.$select && !skipSubQuery) {
                        // if enabled sub-query
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            collect(exp[f], true);
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for (var i = 0 ; i < exp.length; i++) {
                        collect(exp[i], fixedContext);
                    }
                }
            }

            collect(valueExp, false);
        },

        walkQueryForeignFields: function(query, callback /*(field, context, query)*/){
            function collect(exp) {
                if (JSB.isObject(exp) && exp.$field) {
                    if (exp.$context && query.$context != exp.$context) {
                        var res = callback.call(exp, exp.$field, exp.$context, query);
                        if (res) return res;
                    }
                } else if (JSB.isObject(exp)) {
                    if (exp == query || !exp.$select) {
                        // if start query or any expression
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            var res = collect(exp[f]);
                            if (res) {
                                exp[f] = res;
                            }
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for (var i = 0 ; i < exp.length; i++) {
                        var res = collect(exp[i]);
                        if (res) {
                            exp[i] = res;
                        }
                    }
                }
            }

            collect(query);
        },

        filterFilterByFields: function(filter, query, isAccepted /** boolean isAccepted(field, expr, opPath) */) {
            function filteredAndOr(array, isAccepted, path) {
                if (!JSB.isArray(array)) {
                    throw new Error('Unsupported expression type for operator $and/$or');
                }

                var resultArray = [];
                for (var i in array) {
                    var fil = filteredMultiFilter(array[i], isAccepted, path);
                    if (fil) {
                        resultArray.push(fil);
                    }
                }
                return resultArray.length > 0 ? resultArray : null;
            }

            function filteredBinaryCondition(op, args, isAccepted, path) {
                for (var i in args) {
                    var skipped = false;
                    $this.walkExpressionFields(args[i], query, false, function(f, c, isExp) {
                        if (!isAccepted(f, args[i], path)) {
                            skipped = true;
                        }
                    });
                    if (skipped) {
                        return null;
                    }
                }
                return args;
            }

            function filteredMultiFilter(exps, isAccepted, path) {
                if (!JSB.isObject(exps)) {
                    throw new Error('Unsupported expression type ' + exps);
                }

                var resultExps = {};
                for (var field in exps) if (exps[field] != null) {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                            case '$and':
                                resultExps[op] = filteredAndOr(exps[op], isAccepted, path.concat([op]));
                                if (!resultExps[op]) delete resultExps[op];
                                break;
                            case '$not':
                                resultExps[op] = filteredMultiFilter(exps[op], isAccepted, path.concat([op]));
                                if (!resultExps[op]) delete resultExps[op];
                                break;
                            default:
                                // $op: [left, right] expression
                                resultExps[op] = filteredBinaryCondition(op, exps[op], isAccepted, path.concat([op]));
                                if (!resultExps[op]) delete resultExps[op];
                        }
                    } else {
                        // field: {$eq: expr}
                        if (isAccepted(field, field)) {
                            var opp = Object.keys(exps[field])[0];
                            var rightExpr = exps[field][opp];

                            var skipped = false;
                            $this.walkExpressionFields(rightExpr, query, false, function(f, c, isExp) {
                                if (!isAccepted(f, rightExpr, path.concat([opp]))) {
                                    skipped = true;
                                }
                            });

                            if (!skipped) {
                                resultExps[field] = exps[field];
                            }
                        }
                    }
                }
                return Object.keys(resultExps).length > 0 ? resultExps : null;
            }

            var filtered = filteredMultiFilter(filter, isAccepted, ['$and']);
//Log.debug('\nfilterFilterByFields: \n' + JSON.stringify(filter) + '\n' + JSON.stringify(filtered));
            return filtered;
        },

		isAggregatedExpression: function(expr){
		    function findAggregated(e) {
                if (JSB.isPlainObject(e)) {
                    if (e.$select && e != expr) return;
                    for (var f in e) if (e.hasOwnProperty(f)) {
                        if (QuerySyntax.isAggregateOperator(f, true)) {
                            return true;
                        }
                        findAggregated(e[f]);
                    }
                } else if (JSB.isArray(e)) {
                    for (var i = 0; i < e.length; i++) {
                        findAggregated(e[i]);
                    }
                }
                return false;
		    }
		    return findAggregated(expr);
		},

        extractCubeProvidersInQuery: function(query, cube, getView) {
            $this.throwError(
                !query.$cube || query.$from || query.$provider || query.$join || query.$union || query.$recursive,
                'Query "{}" has not cube source', query.$context);


            var cubeFields = cube.getManagedFields();
            var provs = {}; // id: {provider, cubeFields}
            $this.walkInputFieldsCandidates(query, cube, getView, function (field, context, q, isExp) {
                var cubeField = cubeFields[field];
                if (!cubeField && query.$select[field]) {
                    // skip alias
                    return;
                }
                if (!cubeField) {
                    // TODO check and skip input fields
                    return;
                }
                var binding = cubeField.binding;
                for (var i in binding) {
                    var id = binding[i].provider.id;
                    if(!provs[id]) {
                        var prov = provs[id] = {
                            provider: binding[i].provider,
                            cubeFields: {},
                        };
                    } else {
                        var prov = provs[id];
                    }
                    prov.cubeFields[field] = /**hasOtherBinding*/ binding.length > 1;
                }
            });

            /// filter redundant providers
            $this.removeRedundantBindingProviders(provs, cube);
            var providers = [];
            for(var p in provs) {
                providers.push(provs[p].provider);
            }
            return providers;
        },

        indexContextQueries: function(dcQuery) {
            var queries = {};
            $this.walkQueries(dcQuery, {}, null, function(query){
                if (!queries[query.$context]) {
                    queries[query.$context] = query;
                }
            });
            return queries;
        },

        defineContextQueries: function(dcQuery, getContextName) {
            /// первым делом обойти и при встрече дублирующегося контекста (если один запрос - колонровать) переименовать
            /// считается, что при встрече неуникального контекста, то на него "сверху", кробе юниона и джоина, никто не ссылается
            /// следовательно переименовать надо все вложенное
            var idx = 0;
            var contextsMap = {};
            function getContextNameNumbered(oldName){
                if (!oldName) {
                    var context = 'Q' + idx++;
                    return contextsMap[context] = context;
                }
                if(!contextsMap[oldName]) {
                    contextsMap[oldName] = 'Q' + idx++;
                }

                return contextsMap[oldName];

            }
            function getContextNameUNumbered(oldName) {
                if (!oldName) {
                    oldName = JSB.generateUid();
                }
                if(!contextsMap[oldName]) {
                    if (this.path.length == 1) {
                        return contextsMap[oldName] = 'RootQuery';
                    }
                    if (!this.inFrom && !this.inJoin && !this.inUnion) {
                        var name = 'Expression';
                    }
                    if (this.query.$join) {
                        var name = (name||'') + 'JoinQuery';
                    } else if (this.query.$union) {
                        var name = (name||'') + 'UnionQuery';
                    } else if (this.query.$recursive) {
                        var name = (name||'') + 'RecursiveQuery';
                    } else if (!name) {
                        var name = 'Query';
                    }

                    if(!contextsMap[name]) contextsMap[name] = 0;
                    name += contextsMap[name]++;

                    if (this.inJoin) {
                        name += '-join-' + this.nestedPath[this.nestedPath.length -1].substring(1);
                    } else if (this.inUnion) {
                        name += '-union-' + this.nestedPath[this.nestedPath.length -1].substring(1);
                    }
                    return contextsMap[oldName] = name;
                }
                return contextsMap[oldName];
            }

            function walkExpression(exp, oldContext, newContext){
                if (JSB.isObject(exp)) {
                    if (exp.$from) {
                        var sourceQuery = JSB.isString(exp.$from) ? dcQuery.$views[exp.$from] : exp.$from;
                        walkExpression(sourceQuery, oldContext, newContext);
                    }
                    if (exp.$join || exp.$union || exp.$recursive) {
                        walkExpression(exp.$join || exp.$union || exp.$recursive, oldContext, newContext);
                    }
                    for(var i in exp) {
                        if (i !=='$from' && i !=='$join' && i !=='$union'
                                && typeof exp[i] === "object" && exp[i] != null
                        ) {
                            walkExpression(exp[i], oldContext, newContext);
                        }
                    }
                    if (exp.$context == oldContext) {
                        exp.$context = newContext;
                    }
                } else if (JSB.isArray(exp)) {
                    for(var i=0;i<exp.length;i++){
                        if (typeof exp[i] === "object" && exp[i] != null) {
                            walkExpression(exp[i], oldContext, newContext);
                        }
                    }
                }
            }

            var getContextName = getContextName || getContextNameUNumbered;
            var oldContexts = {};
            $this.walkQueries(dcQuery, {},
                function enterCallback(query){
                    /// на входе собрать названия контекстов и посчитать
                    if (!query.$context) {
                        query.$context = JSB.generateUid();
                    }

                    if (!oldContexts[query.$context]) {
                        oldContexts[query.$context] = 1;
                    } else if (!this.isView) {
                        oldContexts[query.$context] += 1;
                    }
                }
            );

            var contextQueriesMap = {};
//            var oldViews = {};
            var withFrom = {};
            $this.walkQueries(dcQuery, {}, null,
                function leaveCallback(query){
                    var startQuery = !this.inJoin ? query : this.path[this.path.length-2];

                    if (oldContexts[query.$context] > 1) {
                        var newContext = getContextName.call(this, null);
//                        oldViews[query.$context] = newContext;
                        walkExpression(startQuery, query.$context, newContext);
                    }

//                    if (!this.isView || !oldViews[query.$context]) {
//                        var newContext = oldContexts[query.$context] > 1
//                                ? getContextName.call(this, query.$context)
//                                : getContextName.call(this, null);
//                        if (this.isView) {
//                            oldViews[query.$context] = newContext;
//                        }
//                        walkExpression(startQuery, query.$context, newContext);
//
//                        contextQueriesMap[query.$context] = query;
//                    }

                    if (typeof query.$from === 'string') {
                        withFrom[query.$context] = query;
                    }
                }
            );


            var names = Object.keys(dcQuery.$views||{});
            for(var i = 0; i < names.length; i++) {
                var query = dcQuery.$views[names[i]];
                delete dcQuery.$views[names[i]];
                dcQuery.$views[query.$context] = query;
                for(var ctx in withFrom) {
                    if (withFrom[ctx].$from == names[i]) {
                        withFrom[ctx].$from = query.$context;
                    }
                }
            }

            return contextQueriesMap;
        },

        /** Удаляет провайдеры, все поля которых есть в других JOIN провайдерах, исключает лишние JOIN и UNION.
        Если поле есть и в UNION и в JOIN провайдерах, то приоритет отдается UNION провайдерам, т.к. они слева в LEFT JOIN.
        */
        removeRedundantBindingProviders: function (providersFieldsMap/**id: {provider, cubeFields:{field:hasOtherBinding}}*/, cube) {
		    function allFieldsBindingAndAllInOther(prov, mode){
		        var allFieldsBinding = true;
		        var allInOtherJoined = true;
		        for (var f in prov.cubeFields) if (typeof prov.cubeFields[f] !== 'undefined') {
		            if (!prov.cubeFields[f]) {
		                allFieldsBinding = false;
		                break;
		            }
		            var fieldInOtherJoined = false;
		            for (var id in providersFieldsMap) if (typeof providersFieldsMap[id] !== 'undefined') {
		                if (prov == providersFieldsMap[id]) continue;
		                if (prov.provider.id != id &&
		                        (!mode || mode == (providersFieldsMap[id].provider.getMode()||'union')) ) {
		                    if(typeof providersFieldsMap[id].cubeFields[f] !== 'undefined') {
		                        fieldInOtherJoined = true;
		                        break;
		                    }
                        }
		            }
		            if (!fieldInOtherJoined) {
		                allInOtherJoined = false;
		                break;
		            }
		        }
		        return allFieldsBinding && allInOtherJoined;
		    }

		    function checkBindingWithout(excludeId) {
		        // все общие поля оставшихся join провайдеров должны иметь другие биндинги с оставшимися провайдерами

                var cubeFields = cube.getManagedFields();
                for (var id in providersFieldsMap) if (id != excludeId && typeof providersFieldsMap[id] !== 'undefined') {
                    if (providersFieldsMap[id].provider.getMode() == 'join') {
                        for(var cubeField in providersFieldsMap[id].cubeFields) {
                            var binding = cubeFields[cubeField].binding;
                            // is shared field
                            if (binding.length > 1) {
                                var hasOn = false;
                                for(var b in binding) {
                                    // if provider exists
                                    if (binding[b].provider.id != excludeId
                                            && binding[b].provider.id != id
                                            && providersFieldsMap[binding[b].provider.id]) {
                                        hasOn = true;
                                    }
                                }
                                if (!hasOn) {
                                    return false;
                                }
                            }
                        }
                    }
                }
                return true;
		    }

            // first remove joins (in LEFT JOIN left is unions)
		    for (var id in providersFieldsMap) if (typeof providersFieldsMap[id] !== 'undefined') {
		        if (providersFieldsMap[id].provider.getMode() == 'join'
		                && allFieldsBindingAndAllInOther(providersFieldsMap[id])
		                && checkBindingWithout(id)) {
		            delete providersFieldsMap[id];
		        }
		    }
            // then remove unions - only fields in join
		    for (var id in providersFieldsMap) if (typeof providersFieldsMap[id] !== 'undefined') {
		        if ((providersFieldsMap[id].provider.getMode()||'union') == 'union'
		                && allFieldsBindingAndAllInOther(providersFieldsMap[id], 'join')
		                && checkBindingWithout(id)) {
		            delete providersFieldsMap[id];
		        }
		    }
        },

        extractProviders: function(query, cube) {
//if(MD5.md5(query) == '1441a7909c087dbbe7ce59881b9df8b9') debugger;
            var providers = [];
            $this.walkQueries(query, {}, null, function(q) {
                if (q.$provider) {
		            var provider = $this.getQueryDataProvider(q.$provider, cube);
                    if (providers.indexOf(provider) == -1) {
                        providers.push(provider);
                    }
                }
            });
            return providers;
        },

        mergeFilters: function (filter1, filter2 /**, ...*/){
            var result = {$and:[]};
            for(var i = 0; i < arguments.length; i++) {
                var filter = arguments[i];
                if (!filter) continue;
                for(var op in filter) {
                    if (op == '$and') {
                        result.$and = result.$and.concat(filter.$and);
                    } else {
                        var f = {};
                        f[op] = filter[op];
                        result.$and.push(f);
                    }
                }

            }
            return result.$and.length > 0 ? result : null;
        },

        extractType: function (exp, query, cube, getQuery) {
            function extractFieldType(field){
                if (query.$from) {
                    if (JSB.isString(query.$from)) {
                        var sourceQuery = getQuery(query.$from);
                        $this.throwError(!!sourceQuery, 'View "{}" is not defined', query.$from);
                    } else if (Object.keys(query.$from).length > 0) {
                        var sourceQuery = query.$from;
                    } else {
                        $this.throwError(false, 'Undefined source field "{}" in empty source for query "{}"', field, query.$from);
                    }
                    $this.throwError(sourceQuery.$select[field], 'Undefined result field "{}" in query "{}"', field, sourceQuery.$context);
                    var type = $this.extractType(sourceQuery.$select[field], sourceQuery, cube, getQuery);
                    return type;
                } else if (query.$provider) {
		            var provider = $this.getQueryDataProvider(query.$provider, cube);
                    var desc = provider.extractFields()[field];
                    $this.throwError(desc, 'Undefined field "{}" in data provider "{}"', field, query.$provider);
                    return desc.nativeType || desc.type;
                } else if (query.$join) {
debugger;
throw 'TODO';

                } else if (query.$recursive) {
debugger;
throw 'TODO';

                } else if (query.$union) {
                    for(var i = 0; i < query.$union.length; i++){
                        var unionQuery = query.$union[i];
                        if (unionQuery.$select[field]) {
                            return $this.extractType(unionQuery.$select[field], unionQuery, cube, getQuery);
                        }
                    }
                } else {
                    $this.throwError(false, 'Invalid source type in query "{}"', query.$context);
                }

            }

            function extractType(exp) {
                if (exp == null) {
                    return null;
                }
                if (JSB.isString(exp)) {
                    return extractFieldType(exp);
                }
                if (JSB.isArray(exp)) {
                    for(var i = 0; i < exp.length; i++) {
                        var type = extractType(exp[i]);
                        if (type) {
                            return type;
                        }
                    }
                }
                if (JSB.isObject(exp)) {
                    if (exp.$toString) return 'string';
                    if (exp.$toInt) return 'int';
                    if (exp.$toDouble) return 'double';
                    if (exp.$toBoolean) return 'boolean';
                    if (exp.$toDate) return 'date';
                    if (exp.$toTimestamp) return 'timestamp';
                    if (exp.$dateYear || exp.$dateYearDay || exp.$dateMonth || exp.$dateMonthDay || exp.$dateWeekDay
                        || exp.$dateTotalSeconds || exp.$dateIntervalOrder
                        || exp.$timeHour || exp.$timeMinute || exp.$timeSecond
                        ) return 'int';
                    if (exp.hasOwnProperty('$const')) {
                        if (exp.$type) return exp.$type;
                        if (JSB.isString(exp.$const)) return 'string';
                        if (JSB.isInteger(exp.$const)) return 'int';
                        if (JSB.isFloat(exp.$const)) return 'double';
                        if (JSB.isBoolean(exp.$const)) return 'boolean';
                        if (JSB.isDate(exp.$const)) return 'date';
                        throw new Error('Unsupported $const type ' + typeof exp.$const);
                    }
                    if (exp.$field) {
                        if (!exp.$context || exp.$context == query.$context) {
                            return extractFieldType(exp.$field);
                        } else {
                            var outerQuery = getQuery(exp.$context);
                            if (outerQuery.$recursive) {
                                outerQuery = outerQuery.$recursive.$start;
                            }
                            $this.throwError(outerQuery, 'Unknown query context "{}"', exp.$context);
                            $this.throwError(outerQuery.$select[exp.$field], 'Undefined result field "{}" in outer query "{}"', exp.$field, outerQuery.$context);
                            var fieldType = $this.extractType(outerQuery.$select[exp.$field], outerQuery, cube, getQuery);
                            return fieldType;
                        }
                    }
                    for(var op in exp) {
                        var type = extractType(exp[op]);
                        if (type) {
                            return type;
                        }
                    }
                }
                return null;
            }

            return extractType(exp);
        },

        queryHasBody: function(query) {
		    if (query.$filter && Object.keys(query.$filter).length > 0){
		        if (Object.keys(query.$filter).length != 1 || !query.$filter.$and || query.$filter.$and.length > 0) {
		            return true;
                }
		    }

		    if (query.$groupBy && query.$groupBy.length > 0) {
		        return true;
		    }

		    if (query.$sort && query.$sort.length > 0) {
		        return true;
		    }

		    if (query.$distinct || query.$limit || query.$offset) {
		        return true;
		    }

		    for(var alias in query.$select) {
		        var exp = query.$select[alias];
		        if (!JSB.isString(exp) && !exp.$field) {
		            return true;
		        }
		    }

		    return false;
		},

		likeToRegex: function (like) {
             function escape(s) {
                 return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
             }

             var pattern = like.replace(/[%_]|[^%_]/g, function(m) {
                 if (m == "%") {
                     return ".*";
                 } else if (m == "_") {
                     return ".";
                 } else {
                     return escape(m);
                 }
             });
             return (like.startsWith('%') ? '' : '^') + pattern + (like.endsWith('%') ? '' : '$');
        },

        walkParentForeignFields: function(query, rootQuery, callback) {
            var outerContexts = {};
            // collect outer contexts
            $this.walkQueries(rootQuery, {},
                function(q){
                    if (query.$context == q.$context) {
                        for (var i = this.path.length - 1; i >= 0; i--) {
                            if (this.path[i].$context != q.$context) {
                                outerContexts[this.path[i].$context] = this.path[i];
                            }
                        }
                        return false; // stop
                    }
                },
                null
            );

            // lookup fields from outer context
            $this.walkQueries(query, {
                    findView: function(name){
                        return rootQuery.$views[name];
                    }
                }, null,
                function(query){
                    $this.walkQueryForeignFields(query, function (field, context, q){
                        if (outerContexts[context||q.$context]) {
                            //outerFields[context+'/'+field] = {$field: field, $context: context};
                            return callback(field, context, q);
                        }
                    });
                }
            );
        },

        extractParentForeignFields: function(query, rootQuery) {
            var outerFields = {};
            $this.walkParentForeignFields(query, rootQuery, function(field, context, q){
                outerFields[context+'/'+field] = {$field: field, $context: context};
            });
            var fields = Object.keys(outerFields);
            return fields.length > 0 ? fields : null;
        },


	}
}