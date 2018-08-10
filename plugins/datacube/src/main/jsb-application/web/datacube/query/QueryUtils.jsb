{
	$name: 'DataCube.Query.QueryUtils',
	$singleton: true,

	$server: {
	    $require: [
	        'DataCube.Query.QuerySyntax',
		    'JSB.Crypt.MD5'
        ],

        logDebug: function(){
            if (Config.get('jsbeans.debug')) {
                Log.debug.apply(Log, arguments);
            }
        },

        walkAllSubQueries: function (dcQuery, callback) {
            $this._walkQueries(dcQuery, true, callback);
        },

        walkSubQueries: function (dcQuery, callback) {
            $this._walkQueries(dcQuery, false, callback);
        },

        /**
        * Обходит рекурсивно (от листьев к главному запросу) любой тип запроса, в следующем порядке:
        *    - подзапрос $from или вьюха из $views
        *    - подзапросы в выражениях условий, сортировки, группировки (все, кроме $from и $select)
        *    - подзапросы в $select
        */
        _walkQueries: function (query, includeViews, callback/**callback(q, isFromQuery, isValueQuery, isViewQuery, parents)*/) {
            var trace = false;
            if(trace) {
                var oldCallback = callback;
                $this.logDebug('[qid='+query.$id+'] Walk sub-queries start');
                callback = function(q, isFromQuery, isValueQuery, isViewQuery, parents){
                    $this.logDebug('[qid='+query.$id+'] Sub-query: '+q.$context+' (isInFrom='+isFromQuery+', isValue='+isValueQuery+', isView='+isViewQuery+')');
                    return oldCallback.apply(this, arguments);
                }
            }


            function collect(q, key, isView, path, queryParentFrom) {
                function findView(name) {
                    if (q.$views && q.$views[name]) return q.$views[name];
                    for (var p in path) {
                        if (path[p].$views && path[p].$views[name]) return path[p].$views[name];
                    }
                    if (query.$views && query.$views[name]) return query.$views[name];
                }

                if (JSB.isPlainObject(q)) {
                    // from
                    if (q.$from) {
                        if (typeof q.$from === 'string' && includeViews) {
                            collect(findView(q.$from), '$from', true, [], q);
                        } else if (JSB.isPlainObject(q.$from)) {
                            collect(q.$from, '$from', true, [], q);
                        }
                    }

                    if (q.$select) {
                        path = path.slice().concat([q]);
                    }
                    // inner values
                    for (var f in q) if (f != '$from' && f != '$select' && f != '$views' && q.hasOwnProperty(f)) {
                        collect(q[f], f, false, path);
                    }
                    // select
                    if (q.$select) {
                        collect(q.$select, '$select', false, path);
                    }
                    // self query
                    if (q.$select) {
                        callback(q, key == '$from' ? queryParentFrom : null, key != '$from' && q != query, isView, path);
                    }
                } else if (JSB.isArray(q)) {
                    for (var i in q) {
                        collect(q[i], i, false, path);
                    }
                }
            }
            collect(query, null, false, []);
            trace && $this.logDebug('[qid='+query.$id+'] Walk sub-queries complete');
        },

        walkQueryForeignFields: function(dcQuery, callback /*(field, context, query)*/){
            $this.walkCurrentQueryFields(dcQuery, function(field, context, curQuery){
                if (context != dcQuery.$context) {
                    callback(field, context, curQuery);
                }
            });
        },

        walkQueryFields: function(dcQuery, includeSubQueries/**all or current query`s fields*/, callback /*(field, context, query)*/){
            if (!includeSubQueries) {
                // обход так же будет со всеми подзапросами, чтобы захватить используемые поля заданного запроса в подзапросах
                var oldCallback = callback;
                callback = function(field, context, query){
                    if (query == dcQuery) {
                        oldCallback(field, context, query);
                    }
                };
            }

            $this._walkQueries(dcQuery, includeSubQueries, function(query) {
                $this.walkCurrentQueryFields(query, callback);
            });
        },

        walkCurrentQueryFields: function (query, callback){
            function walkMultiFilter(exps, fieldsCallback){
                for (var field in exps) if (exps.hasOwnProperty(field)) {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                            case '$and':
                                for (var i in exps[op]) {
                                    walkMultiFilter(exps[op][i], fieldsCallback);
                                }
                                break;
                            default:
                                // $op: [left, right] expression
                                fieldsCallback($this.extractAllFields(exps[op], query.$context));
                        }
                    } else {
                        // field: {$eq: expr}
                        fieldsCallback([{$field: field, $context: query.$context}]); // left
                        fieldsCallback($this.extractAllFields(exps[field], query.$context)); // right
                    }
                }
            }

            function walkFields (fields) {
                for (var f in fields) {
                    var field = fields[f];
                    callback(field.$field, field.$context || query.$context, query);
                }
            }

            // walk $select
            for(var alias in query.$select) {
                walkFields([{$field: alias, $context: null}]);
                walkFields($this.extractAllFields(query.$select[alias], query.$context));
            }

            // walk $filter
            walkMultiFilter(query.$filter, walkFields);

            // walk $groupBy
            walkFields($this.extractAllFields(query.$groupBy, query.$context));

            // walk $sort
            for (var i in query.$sort) {
                var val = query.$sort[i];
                if (val.$expr && val.$type) {
                    walkFields($this.extractAllFields(val.$expr, query.$context));
                } else {
                    var field = Object.keys(val)[0];
                    walkFields([{$field: field, $context: null}]);
                }
            }
            // TODO: walk $sql by "cube."

        },

        walkDataProviderFields: function(dcQuery, includeSubQueries, provider, callback/**(field, context, query)*/){
		    var queriesByContext = {};
		    this.walkSubQueries(dcQuery, function(query){
                if (query.$context) {
                    queriesByContext[query.$context] = query;
                }
		    });
		    this.walkQueryFields(dcQuery, includeSubQueries, function(field, context, query) {
		        var isFieldNotAlias = $this.isOriginalCubeField(
		                field, context && queriesByContext[context] || query, provider);
                if (isFieldNotAlias) {
                    callback(field, context, query);
                }
            });
        },

        walkCubeFields: function(dcQuery, includeSubQueries, cube, callback/**(field, context, query, binding)*/){
		    var queriesByContext = {};
		    this.walkSubQueries(dcQuery, function(query){
                if (query.$context) {
                    queriesByContext[query.$context] = query;
                }
		    });
		    this.walkQueryFields(dcQuery, includeSubQueries, function(field, context, query) {
		        var fieldQuery = context && queriesByContext[context];
		        var isFieldNotAlias = $this.isOriginalCubeField(
		                field, fieldQuery || query, cube);
                if (isFieldNotAlias) {
                    var managedFields = cube.getManagedFields();
                    if (!managedFields[field]) {
                        throw new Error('Cube field is undefined: ' + field);
                    }
                    var binding = managedFields[field].binding;
                    callback(field, context, query, binding);
                }
            });
        },

        /** Удаляет провайдеры, все поля которых есть в других JOIN провайдерах, исключает лишние JOIN и UNION.
        Если поле есть и в UNION и в JOIN провайдерах, то приоритет отдается UNION провайдерам, т.к. они слева в LEFT JOIN.
        */
        removeRedundantBindingProviders: function (providersFieldsMap/**id: {provider, cubeFields:{field:hasOtherBinding}}*/, cube) {
		    function allFieldsBindingAndAllInOther(prov, mode){
		        var allFieldsBinding = true;
		        var allInOtherJoined = true;
		        for (var f in prov.cubeFields) if (prov.cubeFields.hasOwnProperty(f)) {
		            if (!prov.cubeFields[f]) {
		                allFieldsBinding = false;
		                break;
		            }
		            var fieldInOtherJoined = false;
		            for (var id in providersFieldsMap) if (providersFieldsMap.hasOwnProperty(id)) {
		                if (prov == providersFieldsMap[id]) continue;
		                if (prov.provider.id != id &&
		                        (!mode || mode == (providersFieldsMap[id].provider.getMode()||'union')) ) {
		                    if(providersFieldsMap[id].cubeFields.hasOwnProperty(f)) {
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
                for (var id in providersFieldsMap) if (id != excludeId && providersFieldsMap.hasOwnProperty(id)) {
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

//            var fields = {};
//            for (var id in providersFieldsMap) if (providersFieldsMap.hasOwnProperty(id)) {
//		        for (var f in providersFieldsMap[id].cubeFields) {
//		            fields[f] = fields[f] || [];
//		        }
//            }
//            for (var f in fields) if (fields.hasOwnProperty(f)) {
//                var binding = cube.getManagedFields()[f].binding;
//                for (var b in binding) {
//                    fields[f].push(binding[b].provider.name + '/' + binding[b].field);
//                }
//            }
//debugger;

            // first remove joins (in LEFT JOIN left is unions)
		    for (var id in providersFieldsMap) if (providersFieldsMap.hasOwnProperty(id)) {
		        if (providersFieldsMap[id].provider.getMode() == 'join'
		                && allFieldsBindingAndAllInOther(providersFieldsMap[id])
		                && checkBindingWithout(id)) {
		            delete providersFieldsMap[id];
		        }
		    }
            // then remove unions - only fields in join
		    for (var id in providersFieldsMap) if (providersFieldsMap.hasOwnProperty(id)) {
		        if ((providersFieldsMap[id].provider.getMode()||'union') == 'union'
		                && allFieldsBindingAndAllInOther(providersFieldsMap[id], 'join')
		                && checkBindingWithout(id)) {
		            delete providersFieldsMap[id];
		        }
		    }
        },

        extractAllFields: function(valueExp, defaultContext) {
            var cubeFields = {};
            function collect(q) {
                if (JSB.isString(q) && !q.startsWith('$')) {
                    cubeFields[defaultContext+'.'+ q] = {$field:q, $context: defaultContext};
                } else if (JSB.isPlainObject(q) && q.$field) {
                    if (!JSB.isString(q.$field)) throw new Error('Invalid $field value type ' + typeof q.$field);
                    cubeFields[(q.$context||defaultContext)+'.'+q.$field] = q;
                } else if (JSB.isPlainObject(q) && JSB.isNull(q.$const)) {
                    // skip subqueries
                    if (!q.$select) {
                        for (var f in q) if (q.hasOwnProperty(f)) {
                            if (!f.startsWith('$')) {
                                cubeFields[defaultContext+'.'+ f] = {$field:f, $context: defaultContext};
                            }
                            collect(q[f]);
                        }
                    }
                } else if (JSB.isArray(q)) {
                    for (var i in q) {
                        collect(q[i]);
                    }
                }
            }

            collect(valueExp);
            var fields = [];
            for(var f in cubeFields) if(cubeFields.hasOwnProperty(f)) {
                fields.push(cubeFields[f]);
            }
            return fields;
        },

        extractFields: function(valueExp, skipSubQuery) {
            var cubeFields = {};
            function collect(q) {
                if (JSB.isString(q) && !q.startsWith('$')) {
                    cubeFields[q] = {$field:q};
                } else if (JSB.isPlainObject(q) && q.$field) {
                    if (!JSB.isString(q.$field)) throw new Error('Invalid $field value type ' + typeof q.$field);
                    cubeFields[q.$field] = q;
                } else if (JSB.isPlainObject(q) && JSB.isNull(q.$const)) {

                    if (!q.$select || !skipSubQuery ) {
                        for (var f in q) if (q.hasOwnProperty(f)) {
                            if (!f.startsWith('$')) {
                                cubeFields[f] = {$field:f};
                            }
                            collect(q[f]);
                        }
                    }
                } else if (JSB.isArray(q)) {
                    for (var i in q) {
                        collect(q[i]);
                    }
                }
            }

            collect(valueExp);
            return cubeFields;
        },

        extractSingleField: function (valueExp) {
            var cubeFields = this.extractFields(valueExp);
            var len = Object.keys(cubeFields).length;
            if (len == 0) {
                return null;
            } else if (len > 1) {
                // skip multi fields expression
                return null;
            }
            return Object.keys(cubeFields)[0];
        },

        filterFilterByFields: function(filter, isAccepted /** boolean isAccepted(field, expr, opPath) */) {
//debugger;
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
                    var field = $this.extractSingleField(args[i]);
                    if (!isAccepted(field, args[i], path)) {
                        return null;
                    }
                }
                return args;
            }

            function filteredMultiFilter(exps, isAccepted, path) {
                if (!JSB.isPlainObject(exps)) {
                    throw new Error('Unsupported expression type ' + exps);
                }

                var resultExps = {};
                for (var field in exps) if (exps.hasOwnProperty(field)) {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                            case '$and':
                                resultExps[op] = filteredAndOr(exps[op], isAccepted, path.concat([op]));
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
                            var rightField = $this.extractSingleField(rightExpr);
                            if (!rightField || isAccepted(rightField, rightExpr, path.concat([opp]))) {
                                resultExps[field] = exps[field];
                            } else {
                                //check
                                debugger;
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

        /** true - запрос и его подзапросы не используют поля запросов выше текущего
        */
        checkQueryIsIsolated: function(dcQuery){
            var allowedContexts = {};
            $this.walkAllSubQueries(dcQuery, function(subQuery, isFromQuery, isValueQuery){
                allowedContexts[subQuery.$context] = subQuery;
            });

            var isIsolated = true;
            $this.walkAllSubQueries(dcQuery, function(query){
                $this.walkQueryForeignFields(query, function(field, context, curQuery){
                    if (!allowedContexts[context]) {
                        isIsolated = false;
                    }
                });
            });
            return isIsolated;
        },

        extractIsolatedQueryFilter: function(dcQuery) {
            function checkIsolated(expr){
                var isIsolated = true;
                var contexts = {};
                $this.walkSubQueries(expr, function(subQuery, isFromQuery, isValueQuery){
                    contexts[subQuery.$context] = subQuery;
                });
                if (Object.keys(contexts).length > 0) {
                    for(var ctx in contexts) if (contexts.hasOwnProperty(ctx)) {
                        var q = contexts[ctx];
                        $this.walkQueryForeignFields(q,
                            function(field, context, curQuery){
                                isIsolated = false;
                            }
                        );
                    }
                } else {
                    var fields = $this.extractAllFields(expr, dcQuery.$context);
                    for(var f in fields) {
                        if (f.context != dcQuery.$context) {
                            isIsolated = false;
                            break;
                        }
                    }
                }
                return isIsolated;
            }

            function filteredAndOr(array, path) {
                if (!JSB.isArray(array)) {
                    throw new Error('Unsupported expression type for operator $and/$or');
                }

                var resultArray = [];
                for (var i in array) {
                    var fil = filteredMultiFilter(array[i], path);
                    if (fil) {
                        resultArray.push(fil);
                    }
                }
                return resultArray.length > 0 ? resultArray : null;
            }

            function filteredBinaryCondition(op, args, path) {
                for (var i in args) {
                    if (!checkIsolated(args[i])) {
                        return null;
                    }
                }
                return args;
            }

            function filteredMultiFilter(exps, path) {
                if (!JSB.isPlainObject(exps)) {
                    throw new Error('Unsupported expression type ' + exps);
                }

                var resultExps = {};
                for (var field in exps) if (exps.hasOwnProperty(field)) {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                            case '$and':
                                resultExps[op] = filteredAndOr(exps[op], path.concat([op]));
                                if (!resultExps[op]) delete resultExps[op];
                                break;
                            default:
                                // $op: [left, right] expression
                                resultExps[op] = filteredBinaryCondition(op, exps[op], path.concat([op]));
                                if (!resultExps[op]) delete resultExps[op];
                        }
                    } else {
                        // field: {$eq: expr}
                        var opp = Object.keys(exps[field])[0];
                        var rightExpr = exps[field][opp];


                        if (isIsolated) {
                            resultExps[field] = exps[field];
                        }
                    }
                }
                return Object.keys(resultExps).length > 0 ? resultExps : null;
            }

            var filtered = filteredMultiFilter(dcQuery.$filter, ['$and']);
            return filtered;
        },

        /** Находит и возвращает массив с названиями полей куба, используемых в фильтре для слияния (join) текущего запроса с другим/родительским
        * (формально не слияния, а привязке к строке (row) из родительского запроса).
        * Признак join поля - оператор $eq и слева и справа поля куба, но одно из полей принадлежит стороннему контексту/запорсу
        */
        collectSubQueryJoinFields: function (subQueryFilter, isForeignContext) {
            // Collect join fields. Join field is:
            // - operator is $eq and left is field and right is field and one from foreign context

            var subQueryJoinFields = [];

            function walkAndOr(array) {
                if (!JSB.isArray(array)) {
                    throw new Error('Unsupported expression type for operator ' + op);
                }

                var resultArray = [];
                for (var i in array) {
                    var fil = walkMultiFilter(array[i]);
                    if (fil) {
                        resultArray.push(fil);
                    }
                }
                return resultArray.length > 0 ? resultArray : null;
            }

            function walkBinaryCondition(op, args) {
                var leftFields = $this.extractFields(args[0]);
                var rightFields = $this.extractFields(args[1]);
                if (Object.keys(leftFields).length == 1 && Object.keys(rightFields).length == 1) {
                    var leftName = Object.keys(leftFields)[0];
                    var rightName = Object.keys(rightFields)[0];
                    var leftContext = leftFields[leftName].$context;
                    var rightContext = rightFields[rightName].$context;
                    if (!isForeignContext(leftContext) && isForeignContext(rightContext)) {
                        subQueryJoinFields.push(leftName);
                    }
                    if (isForeignContext(leftContext) && !isForeignContext(rightContext)) {
                        subQueryJoinFields.push(rightName);
                    }
                }
            }

            function walkMultiFilter(exps) {
                if (!JSB.isPlainObject(exps)) {
                    throw new Error('Unsupported expression type ' + exps);
                }

                for (var field in exps) if (exps.hasOwnProperty(field)) {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                            case '$and':
                                walkAndOr(exps[op]);
                                break;
                            case '$eq':
                                walkBinaryCondition(op, exps[op]);
                                break;
                            default:
                                // $op: [left, right] expression
                                // ignore other operators
                        }
                    } else {
                        // field: {$eq: expr}
                        var leftField = field;
                        var rightFields = $this.extractFields(exps[field]);
                        if (Object.keys(rightFields).length == 1) {
                            var rightField = Object.keys(rightFields)[0];
                            var rightContext = rightFields[rightField].$context;
                            if (isForeignContext(rightContext, rightField)) {
                                subQueryJoinFields.push(leftField);
                            }
                        }
                    }
                }
            }

            walkMultiFilter(subQueryFilter||{});
//Log.debug('\ncollectSubQueryJoinFields: ' + JSON.stringify(subQueryJoinFields));
            return subQueryJoinFields;
        },

        /** встроить дополнительный фильтр в текущий по $and с фильтрацией по названию используемого поля
        */
        embedFilterToSubQuery: function (cubeOrDataProvider, query, additionalFilter, isAccepted) {
            if (query.$from) {
                // skip query with $from
                return;
            }

            var cubeFields = {};
            $this.walkQueryFields(query, /**includeSubQueries=*/false, function (field, context, query) {
                if ($this.isOriginalCubeField(field, query, cubeOrDataProvider)) {
                    cubeFields[field] = true;
                }
            });
            if (Object.keys(cubeFields).length == 0) {
                // skip abstract query (without from)
                return;
            }

            var skipFields = this.collectSubQueryJoinFields(
                query.$filter,
                function isForeignContext(context) {
                    return !!context && context != query.$context;
                }
            );
            //Log.debug('\nskipFields: ' + JSON.stringify(skipFields));
            var subFilter = this.filterFilterByFields(
                additionalFilter,
                function isAccepted2(field){
                    return isAccepted(field) && skipFields.indexOf(field) == -1;
                }
            );

            if (subFilter) {
                if (!query.$filter) query.$filter = {};
                if (!query.$filter.$and) query.$filter.$and = [];
                query.$filter.$and.push(subFilter);
            }
            //Log.debug('\nembededFilter: ' + JSON.stringify(subQuery.$filter));
        },

        isQueryFromCube: function(query) {
            if (!query.$from) {
                return true;
            }
            return false;
        },

        /** Возвращает true, если поле принадлежит кубу/провайдеру и используется в запросе без модификаций
        */
        isOriginalCubeField: function (field, dcQuery, cubeOrDataProvider) {
            if (!$this.isQueryFromCube(dcQuery)) {
                return false;
            }
            // return true if cube field selected as is
            var fields = cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube'
                        ? cubeOrDataProvider.getManagedFields()
                        : cubeOrDataProvider.extractFields();
            if (fields[field]) {
                return true;
            }
            if (dcQuery.$select[field] && (
                    dcQuery.$select[field] == field
                    || dcQuery.$select[field].$field == field)) {
                return true;
            }
            return false;
        },

        /** Встроить глобальный фильтр в фильры главного и дочерних запросов, но с оговорками:
        * 1) если поле является join (сравнивается по eq с любым полем другого запроса), то пропускаем        *
        // TODO 2) если запрос содержит $recursiveTree: если $startFilter содержит поля из глобального фильтра, то вставлять не в $filter, а в $startFilter
        */
        propagateGlobalFilter: function(dcQuery, cubeOrDataProvider) {
            var cubeFilter = {$and:[]};
            this.walkAllSubQueries(dcQuery, function(subQuery){
                if (subQuery.$cubeFilter && Object.keys(subQuery.$cubeFilter).length > 0){
                    if(cubeFilter.$and.indexOf(subQuery.$cubeFilter) == -1) {
                        cubeFilter.$and.push(subQuery.$cubeFilter);
                    }
                    delete subQuery.$cubeFilter;
                }
            });

            var embeddedQueries = [];
            // if global filter defined then embed it to all queries/sub queries
            if (cubeFilter.$and.length > 0) {
                // recursive find all $select
                this.walkAllSubQueries(dcQuery, function(subQuery){
                    if (!subQuery.$from && embeddedQueries.indexOf(subQuery) == -1) {
                        $this.embedFilterToSubQuery(
                            cubeOrDataProvider,
                            subQuery,
                            cubeFilter.$and.length == 1 ? cubeFilter.$and[0] : cubeFilter,
                            function(field){
    //                            return $this.isOriginalCubeField(field, dcQuery, cubeOrDataProvider);
                                return true;
                            }
                        );
                        embeddedQueries.push(subQuery);
                    }
                });
            }
        },

        /** Добавляет поля куба/провайдера если $select:{}
        */
        generateDefaultSelect: function(dcQuery, cubeOrDataProvider) {
            if (Object.keys(dcQuery.$select).length == 0) {
                if (cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube') {
                    // add all cube fields
                    var managedFields = cubeOrDataProvider.getManagedFields();
                    for (var f in managedFields) if (managedFields.hasOwnProperty(f)) {
                        var binding = managedFields[f].binding;
                        var name = f.replace(new RegExp('"','g'),'');
                        dcQuery.$select[name] = f;
                    }
                } else {
                    // add all cube fields
                    var fields = cubeOrDataProvider.extractFields();
                    for(var field in fields) if (fields.hasOwnProperty(field)){
                        var name = field.replace(new RegExp('"','g'),'');
                         dcQuery.$select[name] = field;
                    }
                }
            }
		},

		isAggregatedExpression: function(expr){
		    function findAggregated(e) {
                if (JSB.isPlainObject(e)) {
                    for (var f in e) if (e.hasOwnProperty(f)) {
                        if (QuerySyntax.isAggregateOperator(f, true)) {
                            return true;
                        }
                        findAggregated(e[f]);
                    }
                } else if (JSB.isArray(e)) {
                    for (var i in e) {
                        findAggregated(e[i]);
                    }
                }
                return false;
		    }
		    return findAggregated(expr);
		},

        /** Поднять в запросе наверх (изменить порядок ключей в json) поля/алиасы, которые используются в других полях
        */
		upperGeneralFields: function(dcQuery){
		    function copyWithTopField(fieldName, obj) {
		        var res = {};
		        res[fieldName] = obj[fieldName];
		        for (var f in obj) if (obj.hasOwnProperty(f) && f != fieldName) {
		            res[f] = obj[f];
		        }
		        return res;
		    }

		    function isFieldLinkedWith(field, exp) {
                if (JSB.isPlainObject(exp)) {
                    if (exp.$field
                            && exp.$context == dcQuery.$context
                            && exp.$field == field) {
                        return true;
                    } else {
                        for(var p in exp) if (exp.hasOwnProperty(p)) {
                            if (isFieldLinkedWith(field, exp[p])) {
                                return true;
                            }
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for(var i in exp) {
                        if (isFieldLinkedWith(field, exp[i])) {
                            return true;
                        }
                    }
                } else if (JSB.isString(exp) && exp == field) {
                    // not true - defined without context (see top where isPlainObject)
                    return false;
                }
                return false;
		    }

            var select = dcQuery.$select;
		    var topFields = {};
		    for (var field in select) if (select.hasOwnProperty(field)) {
                var list = false;
                for (var nextField in select) {
                    if (nextField == field) {
                        list = true;
                    } else if (list && select.hasOwnProperty(nextField)) {
                        if (isFieldLinkedWith(field, select[nextField])) {
                            topFields[field] = Object.keys(topFields).length;
                        }
                    }
                }
		    }

            for (var field in topFields) if (topFields.hasOwnProperty(field)) {
		        select = copyWithTopField(field, select);
		    }
		    dcQuery.$select = select;
		},

        /** Если groupBy не задан, то анализирует декларации выходных полей запроса на предмет агрегации
        * и добавляет в groupBy все поля, которые не являются агрегационными
        */
		generateDefaultGroupBy: function(dcQuery) {
		    if (dcQuery.$groupBy) {
                return;
		    }

            // TODO: support multi fields in select (n-operators)
            var aggregateFunctions = QuerySyntax.schemaAggregateOperators;
            function findField(exp, aggregated){
                if (JSB.isString(exp)) {
                    return {
                        field: exp,
                        aggregated: aggregated || false
                    };
                }
                if (JSB.isPlainObject(exp) && JSB.isNull(exp.$const)) {
                    if (Object.keys(exp).length == 1) {
                        var op = Object.keys(exp)[0];
                        if (aggregateFunctions[op]) {
                            return findField(exp[op], true);
                        } else {
                            return findField(exp[op], aggregated);
                        }
                    } else {
                        if (exp.$field && (!exp.$context || exp.$context == dcQuery.$context)) {
                            return findField(exp.$field, aggregated);
                        }
                    }
                }
                if (JSB.isArray(exp)) {
                    for (var i in exp) {
                        var f = findField(exp[i], aggregated);
                        if (f.field) return f;
                    }
                }
                return {
                    field: null,
                    aggregated: aggregated || false
                };
            }

            var aggregatedFields = [];
            var groupFields = [];
            var unknownAggregate = false;
            for (var alias in dcQuery.$select) {
                var field = findField(dcQuery.$select[alias], false);
                if (field.aggregated && field.field){
                    if (aggregatedFields.indexOf(field.field) == -1)
                        aggregatedFields.push(field.field);
                } else if (field.field) {
                    if (groupFields.indexOf(field.field) == -1)
                        groupFields.push(field.field);
                } else {
                    unknownAggregate = true;
                }
            }

//                // add filter fields to groupBy
//                for (var alias in dcQuery.$filter){
//                    var field = findField(dcQuery.$select[alias], false);
//                    if (field.field && groupFields.indexOf(field.field) == -1) {
//                        groupFields.push(field.field);
//                    }
//                }

            if (groupFields.length == 0 && unknownAggregate) {
                throw new Error("Define $groupBy");
            }
            // if not group by all fields
            if (Object.keys(dcQuery.$select).length != aggregatedFields.length
                && Object.keys(dcQuery.$select).length != groupFields.length) {
                dcQuery.$groupBy = groupFields;
            }
		},

        mergeFilters: function (dcQuery){
            if (dcQuery.$postFilter) {
                if (!dcQuery.$filter) dcQuery.$filter = {};
                if (!dcQuery.$filter.$and) dcQuery.$filter.$and = [];
                dcQuery.$filter.$and.push(dcQuery.$postFilter);
                delete dcQuery.$postFilter;
            }
        },

        unwrapSort: function(dcQuery) {
		    $this.walkAllSubQueries(dcQuery, function(query){
		        if (query.$sort) {
                    for(var i = 0; i < query.$sort.length; i++) {
                        var e = query.$sort[i];
                        if (!e.$expr) {
                            if(Object.keys(e).length !== 1) {
                                throw new Error('Invalid $sort definition: ' + JSON.stringify(e));
                            }
                            query.$sort[i] = {
                                $expr : Object.keys(e)[0],
                                $type: e[Object.keys(e)[0]]
                            };
                        }
                    }
                }
		    });
        },

        /** Производит замену алиасов на поле куба, если алиас равен полю куба
        */
        patchSimpleFieldAliases: function(dcQuery, cubeOrDataProvider) {
            var fields = cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube'
                        ? cubeOrDataProvider.getManagedFields()
                        : cubeOrDataProvider.extractFields();
		    var queriesByContext = {};
		    this.walkAllSubQueries(dcQuery, function(query){
                if (query.$context) {
                    queriesByContext[query.$context] = query;
                }
		    });

		    this.walkAllSubQueries(dcQuery, function(query){
                patchFields(query, query);
		    });

            function patchFields(exp, query) {
                var fieldName = JSB.isPlainObject(exp) && exp.$field || typeof exp === 'string' && !exp.startsWith('$') && exp;
                if (fieldName) {
                    var fieldQuery = exp.$context || query.$context ? queriesByContext[exp.$context || query.$context] : query;
                    var isAlias = !!fieldQuery.$select[fieldName];
                    if (isAlias) {

                        var isSimpleFiledAlias = fieldQuery.$select[fieldName].$field && fieldQuery.$select[fieldName].$field != fieldName
                                    || JSB.isString(fieldQuery.$select[fieldName]) && !fieldQuery.$select[fieldName].startsWith('$') && fieldQuery.$select[fieldName] != fieldName;
                        if (isSimpleFiledAlias) {
                            var cubeField = fieldQuery.$select[fieldName].$field && fieldQuery.$select[fieldName].$field
                                    || JSB.isString(fieldQuery.$select[fieldName]) && fieldQuery.$select[fieldName];
                            if(fields[cubeField]) {
                                // replace alias to field
                                return cubeField;
                            }
                        }
                    }
                } else if (JSB.isPlainObject(exp)) {
                    if (!exp.$select || exp == query) {
                        for (var f in exp) if (exp.hasOwnProperty(f)) {
//                            if (f != '$postFilter') {
                                var res = patchFields(exp[f], query);
                                if (res) {
                                    exp[f] = res;
                                }
//                            }
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for (var i in exp) {
                        var res = patchFields(exp[i], query);
                        if (res) {
                            exp[i] = res;
                        }
                    }
                }
            }
        },

        /** Разворачивает $gr* агрегаторы в натуральные подзапросы */
		unwrapGOperators: function(dcQuery) {
		    function unwrapForQuery(query) {
                function createSubQuery(op, exp) {
                    var innerOp;
                    switch(op){
                        case '$gavg':
                        case '$gmin':
                        case '$gmax':
                        case '$gsum':
                        case '$gcount':
                            switch(op){
                                case '$gavg': innerOp = 'avg'; break
                                case '$gmin': innerOp = 'min'; break
                                case '$gmax': innerOp = 'max'; break
                                case '$gsum': innerOp = 'sum'; break
                                case '$gcount': innerOp = 'count'; break
                            }
                            var subQuery = {};
                            subQuery.$select = {};
                            subQuery.$select[innerOp] = {};
                            subQuery.$select[innerOp]['$'+innerOp] = exp;
                            subQuery.$filter = query.$filter && JSB.clone(query.$filter);
                            subQuery.$from = query.$from;
                            return subQuery;
                    }
                    switch(op){
                        case '$grmaxcount': innerOp = 'count'; break;
                        case '$grmaxsum': innerOp = 'sum'; break;
                        case '$grmaxavg': innerOp = 'avg'; break;

                        case '$grmax': innerOp = 'value'; break;
                        case '$grmin': innerOp = 'value'; break;
                        default:
                            throw new Error('Unknown operator ' + op);
                    }
                    return {
                        $select: (function(){
                            var sel = {};
                            switch(op){
                                case '$grmaxcount':
                                case '$grmaxsum':
                                case '$grmaxavg':
                                case '$grmax':
                                    sel['max'] = {$max: {$field: innerOp}};
                                    break;
                                case '$grmin':
                                    sel['min'] = {$min: {$field: innerOp}};
                                    break;
                                break;
                            }
                            return sel;
                        })(),
                        $from: (function(){
                            var subQuery = {};
                            subQuery.$select = {};
                            subQuery.$select[innerOp] = {};
                            if (innerOp == 'value') {
                                subQuery.$select[innerOp] = exp;
                            } else {
                                subQuery.$select[innerOp]['$'+innerOp] = exp;
                            }
                            subQuery.$groupBy = query.$groupBy && JSB.clone(query.$groupBy);
                            subQuery.$filter = query.$filter && JSB.clone(query.$filter);
                            subQuery.$from = query.$from;
                            return subQuery;
                        })()
                    };
                }

                function unwrapExpression(exp, setFunc) {
                    if (JSB.isPlainObject(exp)) {
                        if (exp.$select) return; // skip subquery

                        var key = Object.keys(exp)[0];
                        if (key.startsWith('$grmax') || key.startsWith('$grmin')
                                || key == '$gmax' || key == '$gmin'
                                || key == '$gcount' || key == '$gsum' || key == '$gavg') {
                            setFunc(createSubQuery(key, exp[key]));
                        }
                        for (var f in exp) if(exp.hasOwnProperty(f)) {
                            unwrapExpression(exp[f], function(newExp){
                               exp[f] = newExp;
                           });
                        }
                    } else if (JSB.isArray(exp)) {
                        for (var i in exp) {
                            unwrapExpression(exp[i], function(newExp){
                                exp[i] = newExp;
                            });
                        }
                    }
                }

                for (var alias in query.$select) if(query.$select.hasOwnProperty(alias)) {
                    unwrapExpression(query.$select[alias], function(newExp){
                        query.$select[alias] = newExp;
                    });
                }
            } // unwrapForQuery

            this.walkAllSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
                unwrapForQuery(query);
            });
		},

        /** Разворачивает $postFilter:
        *  1) если фильтруется группировочное поле (оно же поле куба), то переносится в основной фильтр
        *  2) если фильтруется выходное поле, то создается запрос-обертка с $filter
        */
		unwrapPostFilters: function(dcQuery) {
		    function unwrapForQuery(query) {
		        function subFilter(post) {
		            return $this.filterFilterByFields(query.$postFilter, function isAccepted(field, expr, opPath){
		                if (field == null) return true;
		                if (!query.$groupBy || query.$groupBy.length === 0) {
		                    return post;
		                }
                        for(var i = 0; i < query.$groupBy.length; i++){
                            var g = query.$groupBy[i];
                            if (typeof g === 'string' || typeof g.$field === 'string' && (!g.$context || g.$context == query.$context)) {
                                if((g.$field || g) == field) {
                                    return post;
                                }
                            }
                        }
                        return !post;
                    });
		        }

		        // embed group fields to main filter
		        if (query.$postFilter && Object.keys(query.$postFilter).length > 0) {
                    var filter = subFilter(true);
                    if (filter) {
                        if (!query.$filter) query.$filter = {};
                        if (!query.$filter.$and) query.$filter.$and = [];
                        query.$filter.$and.push(filter);
                        query.$postFilter = subFilter(false);
                        if (!query.$postFilter) delete query.$postFilter;
                    }
		        }

		        // create wrap query for post filter
		        if (query.$postFilter && Object.keys(query.$postFilter).length > 0) {
    		        var queryFields = ['$context', '$select', '$filter', '$groupBy', '$from', '$distinct', '$sort', '$sql'];
    		        var postFilter = query.$postFilter;
                    delete query.$postFilter;
		            var subQuery = {};
		            // move query fields to subQuery
		            for (var i in queryFields) {
		                var field = queryFields[i];
		                if (query.hasOwnProperty(field)) {
		                    subQuery[field] = query[field];
		                    delete query[field];
		                }

		            }
		            // build $select
		            query.$select = {};
                    for(var alias in subQuery.$select) if (subQuery.$select.hasOwnProperty(alias)) {
                        query.$select[alias] = alias;
                    }

                    // build post filter query
                    query.$filter = postFilter;
                    query.$from = subQuery;
		        }
		    }

            this.walkAllSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
                unwrapForQuery(query);
            });
		},

        _extractFilterByContext: function (query, includeCurrent, includeForeign){
            var skipFields = $this.collectSubQueryJoinFields(
                query.$filter|| {},
                function isSkipped(context) {
                    var isForeignContext = !!context && context != query.$context;
                    return !includeCurrent && !includeForeign ||
                            isForeignContext ? !includeForeign : !includeCurrent;
                }
            );
            var filter = $this.filterFilterByFields(query.$filter||{}, function(filteredField, filteredExpr, path){
                return skipFields.indexOf(filteredField) == -1;
            });
            return filter;
        },

        findSubQueries: function(exp) {
            var subQueries = [];
            function walk(e){
                if (JSB.isNull(e)) {
                    return;
                }
                if (JSB.isObject(e)) {
                    if (e.$select) {
                        subQueries.push(e);
                    }
//                    if (JSB.isObject(e.$from)) {
//                        subQueries.push(e.$from);
//                    }
                }
                if (JSB.isObject(e)) {
                    for(var i in e) if (e.hasOwnProperty(i)) {
                        walk(e[i]);
                    }
                } else if (JSB.isArray(e)) {
                    for(var i in e) {
                        walk(e[i]);
                    }
                }
                return subQueries.length > 0 ? subQueries : null;
            }

            walk(exp);
            return subQueries;
        },

        /** Преобразует $filter к единому формату:
        *   - multifilter заменяется на $and: []
        *   - field: {$op: exp} заменяется на {$op: [field, exp]}
        */
		unwrapFilters: function(dcQuery, includeSubQueries) {
            function walkMultiFilter(exps){
                var $and = [];
                for (var field in exps) if (exps.hasOwnProperty(field)) {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                                var $or = [];
                                for (var i in exps[op]) {
                                    var newCond = walkMultiFilter(exps[op][i]);
                                    $or.push(newCond);
                                }
                                $and.push({$or: $or});
                                break;
                            case '$and':
                                for (var i in exps[op]) {
                                    var newCond = walkMultiFilter(exps[op][i]);
                                    $and.push(newCond);
                                }
                                break;
                            default:
                                // $op: [left, right] expression
                                var cond = {};
                                cond[op] = exps[op];
                                $and.push(cond);
                        }
                    } else {
                        var op = Object.keys(exps[field])[0];
                        var exp = exps[field][op];
                        var cond = {};
                        cond[op] = [{$field: field}, exp];
                        $and.push(cond);
                    }
                }

                if (Object.keys($and).length == 0) {
                    return {};
                }
                return Object.keys($and).length == 1
                        ? $and[Object.keys($and)[0]]
                        : {$and: $and};
            }
            function walkQueryFilter(query, name){
                if (includeSubQueries) {
                    $this.walkAllSubQueries(query, function(query, isFromQuery, isValueQuery){
                        walkSingleQueryFilter(query, name);
                    });
                } else {
                    walkSingleQueryFilter(query, name);
                }
            }
            function walkSingleQueryFilter(query, name){
                // main filter
                if (query[name]) {
                    query[name] = walkMultiFilter(query[name]);
                    if (Object.keys(query[name]).length == 0) {
                        delete query[name];
                    }
                }
                // $recursiveTree embedded filter
                if (query.$recursiveTree) {
                    query.$recursiveTree.$startFilter = walkMultiFilter(query.$recursiveTree.$startFilter);
                }
            }

            walkQueryFilter(dcQuery, '$filter');
            walkQueryFilter(dcQuery, '$postFilter');
		},

        extractType: function (exp, query, cubeOrDataProvider, queryByContext) {
            var fields = cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube'
                        ? cubeOrDataProvider.getManagedFields()
                        : cubeOrDataProvider.extractFields();

            function extractFieldType(field){
                if (query.$from) {
                    if(typeof query.$from == 'string') {
                        var select = queryByContext(query.$from).$select;
                    } else {
                        var select = query.$from.$select;
                    }
                    var fromFieldExpression = select[field];
                    var fieldType = $this.extractType(fromFieldExpression, query.$from, cubeOrDataProvider, queryByContext);
                } else {
                    var fieldType = fields[exp] && $this.getFieldJdbcType(cubeOrDataProvider, exp) || null;
                }
                return fieldType;
            }

            if (JSB.isString(exp)) {
                var fieldType = extractFieldType(exp);
                return fieldType;
            }
            if (JSB.isArray(exp)) {
                for(var i in exp) {
                    var type = $this.extractType(exp[i], query, cubeOrDataProvider, queryByContext);
                    if (type) {
                        return type;
                    }
                }
            }
            if (exp == null) {
                return exp;
            }
            if (JSB.isObject(exp)) {
                if (exp.$toString) return 'string';
                if (exp.$toInt) return 'int';
                if (exp.$toDouble) return 'double';
                if (exp.$toBoolean) return 'boolean';
                if (exp.$toDate) return 'date';
                if (exp.$toTimestamp) return 'timestamp';
                if (exp.$dateYear) return 'int';
                if (exp.$dateMonth) return 'int';
                if (exp.$dateTotalSeconds) return 'int';
                if (exp.$dateIntervalOrder) return 'int';
                if (exp.$const) {
                    if (JSB.isString(exp.$const)) return 'string';
                    if (JSB.isInteger(exp.$const)) return 'int';
                    if (JSB.isFloat(exp.$const)) return 'double';
                    if (JSB.isBoolean(exp.$const)) return 'boolean';
                    if (JSB.isDate(exp.$const)) return 'date';
                    throw new Error('Unsupported $const type ' + typeof exp.$const);
                }
                if (exp.$field) {
                    if (!exp.$context || exp.$context == query.$context) {
                        var fieldType = extractFieldType(exp.$field);
                        return fieldType;
                    } else {
                        var outerQuery = queryByContext(query.$context);
                        if (!outerQuery) throw new Error('Unknown query context ' + query.$context);
                        var fieldType = $this.extractType(outerQuery.$select[exp.$field], outerQuery, cubeOrDataProvider, queryByContext);
                        return fieldType;
                    }
                }
                for(var op in exp) {
                    var type = $this.extractType(exp[op], query, cubeOrDataProvider, queryByContext);
                    if (type) {
                        return type;
                    }
                }
            }
            return null;
        },

        getFieldJdbcType: function(cubeOrDataProvider, field) {
            if (cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube') {
                var cubeFields = cubeOrDataProvider.getManagedFields();
//                for(var cubeField in cubeFields) if(cubeFields.hasOwnProperty(cubeField)) {
                var binding = cubeFields[field].binding;
                for (var i in binding) {
                    return binding[i].nativeType || binding[i].type;
                }
//                }
            } else {
                var desc = cubeOrDataProvider.extractFields()[field];
                return desc.nativeType || desc.type;
            }
            return null;
        },

        defineContextQueries: function(dcQuery){
            var idx = 0;
            var contextQueries = {};
            $this.walkAllSubQueries(dcQuery, function(query,isFromQuery, isValueQuery, isViewQuery){
                if (!query.$context) query.$context = 'context_' + idx++;
                if (contextQueries[query.$context] && contextQueries[query.$context] != query) {
                    // remove if context has no links
                    var hasLinks = false;
                    $this.walkQueryFields(query, false, function(field, context, q){
                        if (query != q) {
                            hasLinks = true;
                        }
                    });
                    if (!hasLinks) {
                        query.$context = 'context_' + idx++;
                    } else {
                        throw new Error('Duplicate query context: ' + query.$context);
                    }
                }
                contextQueries[query.$context] = query;
            });

            // TODO clear field contexts (remove self context from fields)
            return contextQueries;
        },

		unwrapMacros: function(dcQuery) {
            $this.walkAllSubQueries(dcQuery, function(subQuery, isFromQuery, isValueQuery){
                // unwrap macros and $grmax* to complex expressions
                QuerySyntax.unwrapMacros(subQuery);
            });
		},
	}
}