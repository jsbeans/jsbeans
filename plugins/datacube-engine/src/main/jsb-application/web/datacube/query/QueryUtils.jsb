{
	$name: 'DataCube.Query.QueryUtils',
	$singleton: true,

	$server: {
	    $require: [
	        'DataCube.Query.QuerySyntax',
	        'JSB.Workspace.WorkspaceController',
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
            if (ids.length > 1) {
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
             if (ids.length > 1) {
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

        /** Slice by id :
        *  a) 'sliceId' - in defaultCube
        *  b) 'wsId/sliceId' - in custom workspace
        */
        getQuerySlice: function(sliceId, defaultCube) {
            var ids = sliceId.split('/');
             if (ids.length == 2) {
                var wid = ids[0];
                var sid = ids[1];
                var ws = WorkspaceController.getWorkspace(wid);
                var provider = ws.entry(sid);
            } else {
                var sid = ids[0];
                var provider = defaultCube.getWorkspace().entry(sid);
            }
            $this.throwError(provider, 'Slice with id "{}" is undefined', sliceId);
            return provider;
        },

        hasDeclaredSource: function(query) {
            return query.$cube || !query.$provider
                && !query.$from
                && !query.$join && !query.$union
                && !query.$recursive;
        },

        findView: function(name, rootQuery){
            var view;
            $this.walkQueries(rootQuery, {},
                function(query){
                    if(query == rootQuery || query.$context == dcQuery.$context) {
                        // stop and go back
                        return false;
                    }
                },
                function(query){
                    if (!view) {
                        view = query.$views[name];
                    }
                    if (view) {
                        return false;
                    }
                }
            );
            return view;
        },

        walkQueries: function (dcQuery, options, enterCallback, leaveCallback/**false=break: callback(q) and this={query, nestedPath, fromPath, isView, isValueQuery, inFrom}*/) {
            options = JSB.merge({
                depth:0,
                findView: null,
                rootQuery: null,
                getExternalView: function(name){
                    debugger
                    findView.call(this, name);
                    $this.throwError(0, 'View "{}" is not defined', name);
                    return null;
                }
            }, options);
            var queryDepth = -1;
            var trace = options.trace || false;
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
                var view;
                for(var i = this.path.length - 1; i >= 0 ; i-- ){
                    if(this.path[i].$views) {
                        view = this.path[i].$views[name];
                        if (view) break;
                    }
                }
                if (!view && dcQuery.$views) {
                    view = dcQuery.$views[name];
                }

                if (!view) {
                    if (options.rootQuery && options.rootQuery != dcQuery) {
                        $this.walkQueries(options.rootQuery, {}, function(query){
                            view = query.$views[name];
                            if (view || query == options.rootQuery || query.$context == dcQuery.$context) {
                                return false;
                            }
                        });
                    }
                }


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

                        if (!fromQuery) {
                            fromQuery = options.getExternalView.call(this, query.$from);
                        }

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
                                query: query,
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
                } else if (JSB.isString(exp) && (this.inJoin || this.inUnion)) {
                    var fromQuery = findView.call(this, exp);
                    if (!fromQuery) {
                        fromQuery = options.getExternalView.call(this, exp);
                    }
                    var res = walkQuery.call(
                        {
                            query : fromQuery,
                            nestedPath: this.nestedPath.concat([key]),
                            fromPath: this.fromPath.concat([fromQuery]), // check ???
                            isView : true,
                            isValueQuery: false,
                            inFrom : false,
                            inJoin: this.inJoin,
                            inUnion: this.inUnion,
                            inRecursive: this.inRecursive,
                            path: path
                        },
                        fromQuery
                    );
                    if (res === false) return false;
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
                                    query: this.query,
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
                                query: this.query,
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
                        query: dcQuery,
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
		walkInputFieldsCandidates: function(query, cube, opts, callback) {
            $this.walkQueries(query, opts, null, function (q){
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
                                if (typeof exp[i] !== "string" || !QuerySyntax.constValueOperators[i] && !QuerySyntax.queryOperators[i]) {
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


        /**Обходит все выражения в запросе на предмет нахождения полей
          (поля текущего запроса + поля текущего запроса в подзапросах-ражениях).
          Попутно позволяет заменить поле на выражение, если калбек вернул значение:
          - выражение - производится замена
          - null/undefined - поле остается без изменений.
        */
		walkFields: function(dcQuery, fieldsCallback/**(field, context, query, path)*/) {
            function walkExpressionFields(exp, query, path) {
                if (JSB.isString(exp) && !exp.startsWith('$')) {
                    var res = fieldsCallback(exp, null, query, path);
                    if (res) return res;
                } else if (JSB.isObject(exp) && exp.$field) {
                    var isSelfOrInSubQuery = exp.$context && exp.$context == query.$context || !exp.$context && query == dcQuery;
                    var isJoinSource = exp.$context && query.$join && (
                        exp.$context == (JSB.isString(query.$join.$left) ? query.$join.$left : query.$join.$left.$context)
                        ||
                        exp.$context == (JSB.isString(query.$join.$right) ? query.$join.$right: query.$join.$right.$context)
                    );
                    if (isSelfOrInSubQuery || isJoinSource) {
                        var res = fieldsCallback(exp.$field, exp.$context, query, path);
                        if (res) {
                            $this.jsonReplaceBody(exp, res);
                        }
                    }
                } else if (JSB.isObject(exp)) {
                    if (!exp.$select) {
                        // value-expression
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            if (!JSB.isString(exp[f]) || !QuerySyntax.queryOperators[f]) {
                                var res = walkExpressionFields(exp[f], query, path.concat([f]));
                                if (res) {
                                    exp[f] = res;
                                }
                            }
                        }
                    } else if (exp == query){
                        // self query
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            if (!JSB.isString(exp[f]) || !QuerySyntax.queryOperators[f]) {
                                walkExpressionFields(exp[f], query, path.concat([f]));
                            }
                        }
                    } else {
                         // query-expression
                         if (exp.$context == dcQuery.$context) {
                            // if redefined context - break
                            return;
                         }
                         walkExpressionFields(exp, exp, path);
                     }
                } else if (JSB.isArray(exp)) {
                    for (var i = 0 ; i < exp.length; i++) {
                        var res = walkExpressionFields(exp[i], query, path.concat([i]));
                        if (res) {
                            exp[i] = res;
                        }
                    }
                }
            }

            walkExpressionFields(dcQuery, dcQuery, []);
		},

        /** Возвращает выходные поля источника запроса.
        */
		extractSourceFields: function(query, cube, rootQuery) {
		    if (query.$cube) {
		        var sourceFields = $this.getQueryCube(query.$cube, cube).getManagedFields();
		    } else if (query.$provider){
		        var provider = $this.getQueryDataProvider(query.$provider, cube);
		        var sourceFields = provider.extractFields();
		    } else if (query.$from) {
                if (JSB.isString(query.$from)) {
                    var fromQuery = query.$views ? query.$views[query.$from] : $this.findView(query.$from, rootQuery);
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

        /** Возвращает массив полей источника, которые используются в запросе или во вложенных запросах, привязанных к текущему.
        */
		extractInputFields: function(query) {
		    var inputFields = {};
		    var array = [];
		    $this.walkFields(query, function fieldsCallback(field, context, query, path){
		        if (!inputFields[context+field]) {
		            var f = inputFields[context+field] = {$field: field, $context: context};
		            array.push(f);
                }
		    });
//            var sourceFields = $this.extractSourceFields(query, cube, rootQuery);
//            var inputFields = {};
//            $this.walkInputFieldsCandidates(query, cube, {rootQuery:rootQuery}, function (field, context, q, isExp) {
//                if (sourceFields[field]) {
//                    inputFields[field] = true;
//                }
//                $this.throwError(sourceFields[field] || !isExp, 'Field "{}" is not defined in source', field);
//            });
            return array;
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
                        return callback(exp, query.$context||query.$context, query, false);
                    }
                } else if (JSB.isObject(exp) && exp.$field) {
                    $this.throwError(JSB.isString(exp.$field), 'Invalid $field value type "{}"', typeof exp.$field);
                    if (exp.$context) {
                        if (query.$context == exp.$context || !fixedContext) {
                            return callback(exp.$field, exp.$context, query, true);
                        } else if (query.$join && (query.$join.$left.$context == exp.$context || query.$join.$right.$context == exp.$context)) {
                            return callback(exp.$field, exp.$context, query, true);
                        }
                    } else {
                        return callback(exp.$field, query.$context, query, true);
                    }
                    if (exp.$context && fixedContext && query.$context == exp.$context) {
                        return callback(exp.$field, exp.$context, query, true);
                    } else if (!exp.$context && !fixedContext) {
                        return callback(exp.$field, exp.$context||query.$context, query, true);
                    }
                } else if (JSB.isObject(exp)) {
                    if (exp == query || !exp.$select) {
                        // if start query or any expression
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            var res = collect(exp[f], fixedContext);
                            if (res) {
                                exp[f] = res;
                            }
                        }
                    } else if(exp.$select && !skipSubQuery) {
                        // if enabled sub-query
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            var res = collect(exp[f], true);
                            if (res) {
                                exp[f] = res;
                            }
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for (var i = 0 ; i < exp.length; i++) {
                        var res = collect(exp[i], fixedContext);
                        if (res) {
                            exp[i] = res;
                        }
                    }
                }
            }

            return collect(valueExp, false);
        },

        walkExpressionFields: function(valueExp, query, skipSubQuery, callback) {
            function collect(exp, fixedContext) {
                if (JSB.isString(exp) && !exp.startsWith('$')) {
                    if (!fixedContext) {
                        return callback(exp, query.$context||query.$context, query, false);
                    }
                } else if (JSB.isObject(exp) && exp.$field) {
                    $this.throwError(JSB.isString(exp.$field), 'Invalid $field value type "{}"', typeof exp.$field);
                    if (exp.$context) {
                        if (query.$context == exp.$context || !fixedContext) {
                            return callback(exp.$field, exp.$context, query, true);
                        } else if (query.$join && (query.$join.$left.$context == exp.$context || query.$join.$right.$context == exp.$context)) {
                            return callback(exp.$field, exp.$context, query, true);
                        }
                    } else {
                        return callback(exp.$field, query.$context, query, true);
                    }
                    if (exp.$context && fixedContext && query.$context == exp.$context) {
                        return callback(exp.$field, exp.$context, query, true);
                    } else if (!exp.$context && !fixedContext) {
                        return callback(exp.$field, exp.$context||query.$context, query, true);
                    }
                } else if (JSB.isObject(exp)) {
                    if (exp == query || !exp.$select) {
                        // if start query or any expression
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            var res = collect(exp[f], fixedContext);
                            if (res) {
                                exp[f] = res;
                            }
                        }
                    } else if(exp.$select && !skipSubQuery) {
                        // if enabled sub-query
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            var res = collect(exp[f], true);
                            if (res) {
                                exp[f] = res;
                            }
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for (var i = 0 ; i < exp.length; i++) {
                        var res = collect(exp[i], fixedContext);
                        if (res) {
                            exp[i] = res;
                        }
                    }
                }
            }

            return collect(valueExp, false);
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

        /** Позволяет обойти выражения, выражения-подзапросы и поля фильтра.
            Если любой из калбеков возвращает:
         - null - условие удаляется,
         - undefined - остается как было,
         - новое выражение - производятся замена.
        */
        rebuildFilter: function(filter, fieldsCallback /**(field, context, opPath)*/, expressionCallback/**(expr, opPath)*/) {
            function walkExpressionFields(exp, path) {
                if (JSB.isString(exp) && !exp.startsWith('$')) {
                    var res = fieldsCallback(exp, null, path);
                    return res;
                } else if (JSB.isObject(exp) && exp.$field) {
                    var res = fieldsCallback(exp.$field, exp.$context, path);
                    if (res === null) return null;
                    if (res === undefined) return;
                    $his.jsonReplaceBody(exp, res);
                    return exp;
                } else if (JSB.isObject(exp)) {
                    // if or not embedded query-expression
                    if (!exp.$select) {
                        for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
                            var res = walkExpressionFields(exp[f], path.concat([f]));
                            if (res) {
                                exp[f] = res;
                            } else {
                                // если удаляется хоть одно поле, то удалить все выражение
                                return null;
                            }
                        }
                    } else {
                        if (JSB.isFunction(expressionCallback)) {
                            var newExp = expressionCallback(exp, path);
                            if (newExp === undefined){
                                return;
                            }
                            if (newExp == null) {
                                return null;
                            }
                            return newExp;
                        }
                    }
                    return exp;
                } else if (JSB.isArray(exp)) {
                    for (var i = 0 ; i < exp.length; i++) {
                        var res = walkExpressionFields(exp[i], path.concat([i]));
                        if (res) {
                            exp[i] = res;
                        } else {
                            return null;
                        }
                    }
                }
            }
            function walkExpression(exp, path) {
                if (JSB.isFunction(expressionCallback)) {
                    var newExp = expressionCallback(exp, path);
                    if (newExp === undefined){
                        return;
                    }
                    if (newExp == null) {
                        return null;
                    }
                    exp = newExp;
                } else {
                    // clone for changing in walkExpressionFields
                    exp = JSB.clone(exp);
                }

                var newExp = walkExpressionFields(exp, path);
                return newExp;
            }
            function walkBinaryCondition(op, args, path) {
                var newArgs = [];
                var notChanged = true;
                for (var i in args) {
                    var e = walkExpression(args[i], path.concat([i]));
                    if (e || e === undefined) {
                        notChanged = notChanged && e === undefined;
                        newArgs.push(e);
                    }
                }
                if (notChanged) {
                    return;
                }
                return newArgs.length  == args.length ? newArgs : null;
            }
            function walkAndOr(array, path) { /// returns args/null/undefined
                if (!JSB.isArray(array)) {
                    throw new Error('Unsupported expression type for operator $and/$or');
                }

                var args = [];
                var notChanged = true;
                for (var i in array) {
                    var e = walkMultiFilter(array[i], path);
                    if (e || e === undefined) {
                        notChanged = notChanged && e === undefined;
                        args.push(e?e:array[i]);
                    }
                }
                if (notChanged) {
                    return;
                }
                return args.length > 0 ? args : null;
            }
            function walkMultiFilter(exps, path) { /// returns exp/null/undefined
                if (!JSB.isObject(exps)) {
                    throw new Error('Unsupported expression type ' + exps);
                }

                var newFilter = {$and:[]};
                var notChanged = true;
                for (var field in exps) if (exps[field] != null) {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                            case '$and':
                                var args = walkAndOr(exps[op], path.concat([op]));
                                if (args || args === undefined) {
                                    notChanged = notChanged && args === undefined;
                                    if (op == '$or') {
                                        if (args.length == 1) {
                                            newFilter.$and.push(args[0]);
                                        } else {
                                            newFilter.$and.push({$or: args?args:exps.$or});
                                        }
                                    } else {
                                        newFilter.$and = newFilter.$and.concat(args?args:exps.$and);
                                    }
                                }
                                break;
                            case '$not':
                                var e = walkMultiFilter(exps[op], path.concat([op]));
                                if (e || e === undefined) {
                                 notChanged = notChanged && e === undefined;
                                    newFilter.$and.push({$not: e?e:exps.$not});
                                }
                                break;
                            default:
                                // $op: [left, right] expression
                                var args = walkBinaryCondition(op, exps[op], path.concat([op]));
                                if (args || args === undefined) {
                                    notChanged = notChanged && args === undefined;
                                    var e = {};
                                    e[op] = args?args: exps[op];
                                    newFilter.$and.push(e);
                                }
                        }
                    } else {
                        // field: {$eq: expr}
                        var opp = Object.keys(exps[field])[0];
                        var rightExpr = exps[field][opp];
                        // $op: [left, right] expression
                        var e = {};
                        e[oop] = [{$field:field}, rightExpr];
                        var args = walkBinaryCondition(oop, e[oop], path.concat([oop]));
                        if (args || args === undefined) {
                            notChanged = notChanged && args === undefined;
                            var e = {};
                            e[op] = args?args: exps[op];
                            newFilter.$and.push(e);
                        }
                    }
                }
                if (notChanged) {
                    return;
                }
                switch(Object.keys(newFilter.$and).length){
                    case 0 : return null;
                    case 1 : return newFilter.$and[0];
                }
                return newFilter;
            }

            var newFilter = walkMultiFilter(filter, ['$and']);
            return newFilter;
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

        extractCubeProvidersInQuery: function(query, cube, rootQuery) {
            $this.throwError(
                !query.$cube || query.$from || query.$provider || query.$join || query.$union || query.$recursive,
                'Query "{}" has not cube source', query.$context);


            var cubeFields = cube.getManagedFields();
            var provs = {}; // id: {provider, cubeFields}
            $this.walkInputFieldsCandidates(query, cube, {rootQuery:rootQuery}, function (field, context, q, isExp) {
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

//        defineContextQueries: function(dcQuery, getContextName) {
//            /// первым делом обойти и при встрече дублирующегося контекста (если один запрос - колонровать) переименовать
//            /// считается, что при встрече неуникального контекста, то на него "сверху", кробе юниона и джоина, никто не ссылается
//            /// следовательно переименовать надо все вложенное
//            var idx = 0;
//            var contextsMap = {};
//            function getContextNameNumbered(oldName){
//                if (!oldName) {
//                    var context = 'Q' + idx++;
//                    return contextsMap[context] = context;
//                }
//                if(!contextsMap[oldName]) {
//                    contextsMap[oldName] = 'Q' + idx++;
//                }
//
//                return contextsMap[oldName];
//
//            }
//            function getContextNameUNumbered(oldName) {
//                if (!oldName) {
//                    oldName = JSB.generateUid();
//                }
//                if(!contextsMap[oldName]) {
//                    if (this.path.length == 1) {
//                        return contextsMap[oldName] = 'RootQuery';
//                    }
//                    if (!this.inFrom && !this.inJoin && !this.inUnion) {
//                        var name = 'Expression';
//                    }
//                    if (this.query.$join) {
//                        var name = (name||'') + 'JoinQuery';
//                    } else if (this.query.$union) {
//                        var name = (name||'') + 'UnionQuery';
//                    } else if (this.query.$recursive) {
//                        var name = (name||'') + 'RecursiveQuery';
//                    } else if (!name) {
//                        var name = 'Query';
//                    }
//
//                    if(!contextsMap[name]) contextsMap[name] = 0;
//                    name += contextsMap[name]++;
//
//                    if (this.inJoin) {
//                        name += '-join-' + this.nestedPath[this.nestedPath.length -1].substring(1);
//                    } else if (this.inUnion) {
//                        name += '-union-' + this.nestedPath[this.nestedPath.length -1].substring(1);
//                    }
//                    return contextsMap[oldName] = name;
//                }
//                return contextsMap[oldName];
//            }
//
//            function walkExpression(exp, oldContext, newContext){
//                if (JSB.isObject(exp)) {
//                    if (exp.$from) {
//                        var sourceQuery = JSB.isString(exp.$from) ? dcQuery.$views[exp.$from] : exp.$from;
//                        walkExpression(sourceQuery, oldContext, newContext);
//                    }
//                    if (exp.$join || exp.$union || exp.$recursive) {
//                        walkExpression(exp.$join || exp.$union || exp.$recursive, oldContext, newContext);
//                    }
//                    for(var i in exp) {
//                        if (i !=='$from' && i !=='$join' && i !=='$union'
//                                && typeof exp[i] === "object" && exp[i] != null
//                        ) {
//                            walkExpression(exp[i], oldContext, newContext);
//                        }
//                    }
//                    if (exp.$context == oldContext) {
//                        exp.$context = newContext;
//                    }
//                } else if (JSB.isArray(exp)) {
//                    for(var i=0;i<exp.length;i++){
//                        if (typeof exp[i] === "object" && exp[i] != null) {
//                            walkExpression(exp[i], oldContext, newContext);
//                        }
//                    }
//                }
//            }
//debugger
//            var getContextName = getContextName || getContextNameUNumbered;
//            var oldContexts = {};
//            $this.walkQueries(dcQuery, {},
//                function enterCallback(query){
//                    /// на входе собрать названия контекстов и посчитать
//                    if (!query.$context) {
//                        query.$context = JSB.generateUid();
//                    }
//
//                    if (!oldContexts[query.$context]) {
//                        oldContexts[query.$context] = 1;
//                    } else if (!this.isView) {
//                        oldContexts[query.$context] += 1;
//                    }
//                }
//            );
//
//            var contextQueriesMap = {};
////            var oldViews = {};
//            var withView = {};
//            $this.walkQueries(dcQuery, {}, null,
//                function leaveCallback(query){
//                    var startQuery = !this.inJoin ? query : this.path[this.path.length-2];
//
//                    if (oldContexts[query.$context] > 1) {
//                        var newContext = getContextName.call(this, null);
////                        oldViews[query.$context] = newContext;
//                        walkExpression(startQuery, query.$context, newContext);
//                    }
//
////                    if (!this.isView || !oldViews[query.$context]) {
////                        var newContext = oldContexts[query.$context] > 1
////                                ? getContextName.call(this, query.$context)
////                                : getContextName.call(this, null);
////                        if (this.isView) {
////                            oldViews[query.$context] = newContext;
////                        }
////                        walkExpression(startQuery, query.$context, newContext);
////
////                        contextQueriesMap[query.$context] = query;
////                    }
//
//                    if (typeof query.$from === 'string') {
//                        withView[query.$context] = query;
//                    }
//                    if (query.$join && (JSB.isString(query.$join.$left) || JSB.isString(query.$join.$right))) {
//                        withView[query.$context] = query;
//                    }
//                    if (query.$union) {
//                        for(var i = 0; i < query.$union.length; i++) {
//                            if (JSB.isString(query.$union[i])) {
//                                withView[query.$context] = query;
//                                break;
//                            }
//                        }
//                    }
//                }
//            );
//
//debugger
//            var names = Object.keys(dcQuery.$views||{});
//            for(var i = 0; i < names.length; i++) {
//                var name = names[i];
//                var query = dcQuery.$views[name];
//                delete dcQuery.$views[name];
//                dcQuery.$views[query.$context] = query;
//                for(var ctx in withView) {
//                    var q = withView[ctx];
//                    if (q.$from == name) {
//                        q.$from = query.$context;
//                    }
//                    if (q.$join) {
//                        if (q.$join.$left == name) {
//                            q.$join.$left = query.$context;
//                        }
//                        if (q.$join.$right == name) {
//                            q.$join.$right = query.$context;
//                        }
//                    }
//                    if (q.$union) {
//                        for(var i = 0; i < q.$union.length; i++) {
//                            if (q.$union[i] == name) {
//                                q.$union[i] = query.$context;
//                            }
//                        }
//                    }
//                }
//                // TODO поддержкать вьюхи в $left/$right/$union
//
//            }
//
//            return contextQueriesMap;
//        },

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

        extractProviders: function(query, defaultCube) {
//if(MD5.md5(query) == '1441a7909c087dbbe7ce59881b9df8b9') debugger;
            var providers = [];
            $this.walkQueries(query, {}, null, function(q) {
                if (q.$provider) {
		            var provider = $this.getQueryDataProvider(q.$provider, defaultCube);
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
            $this.walkQueries(query, {rootQuery:rootQuery}, null,
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

        walkFilterExpressions: function(filter, opCallback/**()*/, exprCallback/*(exp, path)*/) {

            function walkAndOr(array, path) {
                $this.throwError(JSB.isArray(array), 'Unsupported expression type for operator $and/$or');

                for (var i = 0 ; i < array.length; i++) {
                    walkMultiFilter(array[i], path.concat([i]));
                }
            }

            function walkBinaryCondition(op, args, path) {
                for (var i = 0; i < args.length; i++) {
debugger
                    var res = exprCallback(args[i], path.concat([i]));
                    if (res) {
                        args[i] = res;
                    }
                }
            }

            function walkMultiFilter(exps, path) {
                $this.throwError(JSB.isObject(exps), 'Unsupported expression type {}', typeof exps);

                for (var field in exps) if (typeof exps[field] !== 'undefined') {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                            case '$and':
                                var res = walkAndOr(exps[op], path.concat([op]));
                                if (res) {
                                    exps[op] = res;
                                }
                                break;
                            case '$not':
                                var res = walkMultiFilter(exps[op], path.concat([op]));
                                if (res) {
                                    exps[op] = res;
                                }
                                break;
                            default:
                                // $op: [left, right] expression
                                walkBinaryCondition(op, exps[op], path.concat([op]));
                        }
                    } else {
                        // field: {$eq: expr}
                        var opp = Object.keys(exps[field])[0];
                        var rightExpr = exps[field][opp];
                        walkBinaryCondition(op, [{$field: field}, rightExpr], path.concat([op]));
                    }
                }
            }

            walkMultiFilter(filter,[]);
        },

//        renameViews: function(dcQuery, callback/**(oldName, path):newName*/){
//            function renameView(query, path){
//                debugger;
//            }
//            function walkExpression(exp, path) {
//                if (JSB.isObject(exp)) {
//                    // if or not embedded query-expression
//                    if (exp.$select) {
//                        if (exp.$from && JSB.string(exp.$from)) {
//                            var newName = callback(exp.$from, path);
//                            renameView(exp,path);
//                        }
//                        if (exp.)
//                    }
//                    for (var f in exp) if (exp[f] != null && !QuerySyntax.constValueOperators[f]) {
//                        walkExpression(exp[f], path.concat([f]));
//                    }
//                } else if (JSB.isArray(exp)) {
//                    for (var i = 0 ; i < exp.length; i++) {
//                        walkExpression(exp[i], path.concat([i]));
//                    }
//                }
//            }
//            walkExpression(dcQuery, []);
//        },

		updateContext: function(exp, oldContext, newContext, filter) {
		    var filter = filter || function() {return true;};

		    function walk(e) {
		        if (e == null) {
		        } else if(JSB.isObject(e)) {
		            for(var i in e) if (e.hasOwnProperty(i) && filter.call(e, e[i])) {
		                if (i == '$context') {
		                    if (e[i] == oldContext) {
		                        e[i] = newContext;
		                    }
		                } else {
		                    walk(e[i]);
		                }
		            }
		        } else if(JSB.isArray(e)) {
		            for(var i = 0; i < e.length; i++) if(filter.call(e, e[i])) {
		                walk(e[i]);
		            }
                }
		    }

		    walk(exp);
		},

		copyQuery: function(dcQuery, context) {
		    var dcQuery = JSB.merge(true, {}, dcQuery);
		    var oldContext = dcQuery.$context;

		    function walk(e) {
		        if (e == null) {
		        } else if(JSB.isObject(e)) {
		            for(var i in e) if (e.hasOwnProperty(i)) {
		                if (i == '$context') {
		                    if (e[i] == oldContext) {
		                        e[i] = context;
		                    } else {
		                        e[i] = context + '_' + e[i];
                            }
		                } else {
		                    walk(e[i]);
		                }
		            }
		        } else if(JSB.isArray(e)) {
		            for(var i = 0; i < e.length; i++) {
		                walk(e[i]);
		            }
                }
		    }

		    walk(dcQuery);
		    return dcQuery;
		},

        jsonReplaceBody: function(target, source) {
            for(var alias in target) {
                delete target[alias];
            }
            for(var alias in source) {
                target[alias] = source[alias];
            }
        },

		extractSliceDimensions: function(slice) {

		    // TODO move to slice.extractDimensions() + updated cache
		    var sliceDimensions = {};
		    var sliceQuery = slice.getQuery();

		    // collect self slice`s dimensions
		    var dimensions = $this.extractCubeDimensions(slice.getCube());
		    var outputFields = $this.extractOutputFields(sliceQuery);
		    for(var field in outputFields) {
		        if(dimensions[field]) {
		            sliceDimensions[field] = [slice.getId()];
		        }
		    }

            // recursively collect sub-slices`s dimensions
		    $this.walkQueries(sliceQuery, {
		        getExternalView : function(name) {
		            var subSlice = $this.getQuerySlice(name, slice.getCube());
		            var subDims = $this.extractSliceDimensions(subSlice);
		            // merge sub-dimensions
		            for(var field in subDims) {
		                if (!sliceDimensions[field]) {
		                    sliceDimensions[field] = [subSlice.getId()];
		                } else if (sliceDimensions[field].indexOf(subSlice.getId()) == -1) {
		                    sliceDimensions[field] = sliceDimensions[field].concat(subDims[field]);
		                }

		            }
		            return {};
		        }
		    }, function(){});

		    return sliceDimensions;
		},

		extractReplacementSlices: function(slice) {
		    // TODO
		    return slice.getReplacementSlices ? slice.getReplacementSlices() : {};
		},

		extractCubeDimensions: function(cube) {
		    // TODO
		    return cube.getDimensions? cube.getDimensions() : {
		        "INN": "INN",
		        "KPP": "KPP",
		        "OGRN":  "OGRN",
		        "LegalOrganization": "LegalOrganization",
		        "ChiefName":"ChiefName",
		    };
		},


	}
}