{
	$name: 'DataCube.Query.QueryUtils',
	$singleton: true,

	$server: {
	    $require: [
	        'DataCube.Query.QuerySyntax',
		    'JSB.Crypt.MD5'
        ],

        /** Enumerate all sub-queries (from inners to root)*/
        walkSubQueries: function (query, callback/**callback(q, isFromQuery, isValueQuery)*/) {
            function collect(q, key) {
                if (JSB.isPlainObject(q)) {
                    // from
                    if (q.$from) {
                        collect(q.$from, '$from');
                    }
                    // inner values
                    for (var f in q) if (f != '$from' && q.hasOwnProperty(f)) {
                        collect(q[f], f);
                    }
                    // query
                    if (q.$select) {
                        callback(q, key == '$from', key != '$from' && q != query);
                    }
                } else if (JSB.isArray(q)) {
                    for (var i in q) {
                        collect(q[i], i);
                    }
                }
            }
            collect(query);
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
                                fieldsCallback($this.extractFields(exps[op], !includeSubQueries));
                        }
                    } else {
                        // field: {$eq: expr}
                        fieldsCallback([{$field: field, $context: null}]); // left
                        fieldsCallback($this.extractFields(exps[field], !includeSubQueries)); // right
                    }
                }
            }
            function walkQuery(query){
                function walkFields (fields) {
                    for (var f in fields) if (fields.hasOwnProperty(f)) {
                        var field = fields[f];
                        callback(field.$field, field.$context || query.$context, query);
                    }
                }

                // walk $select
                for(var alias in query.$select) {
                    walkFields([{$field: alias, $context: null}]);
                    walkFields($this.extractFields(query.$select[alias], true/**skipSubQuery*/));
                }

                // walk $filter
                walkMultiFilter(query.$filter, walkFields);

                // walk $groupBy
                walkFields($this.extractFields(query.$groupBy, true/**skipSubQuery*/));

                // walk $sort
                for (var i in query.$sort) {
                    var val = query.$sort[i];
                    if (val.$expr && val.$type) {
                        walkFields($this.extractFields(val.$expr, true/**skipSubQuery*/));
                    } else {
                        var field = Object.keys(val)[0];
                        walkFields([{$field: field, $context: null}]);
                    }
                }
                // TODO: walk $sql by "cube."

            }

//            if (includeSubQueries) {
//                this.walkSubQueries(dcQuery, walkQuery);
//            } else {
//                walkQuery(dcQuery);
//            }
            this.walkSubQueries(dcQuery, walkQuery);
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
                        throw 'Cube field is undefined: ' + field;
                    }
                    var binding = managedFields[field].binding;
                    callback(field, context, query, binding);
                }
            });
        },

        /** Удаляет провайдеры, все поля которых есть в других JOIN провайдерах, исключает лишние JOIN и UNION.
        Если поле есть и в UNION и в JOIN провайдерах, то приоритет отдается UNION провайдерам, т.к. они слева в LEFT JOIN.
        */
        removeRedundantBindingProviders: function (providersFieldsMap/**id: {provider, cubeFields:{field:hasOtherBinding}}*/) {
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
		                        (!mode || mode == (prov.provider.getMode()||'union')) ) {
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

            // first remove joins (in LEFT JOIN left is unions)
		    for (var id in providersFieldsMap) if (providersFieldsMap.hasOwnProperty(id)) {
		        if (providersFieldsMap[id].provider.getMode() == 'join'
		                && allFieldsBindingAndAllInOther(providersFieldsMap[id])) {
		            delete providersFieldsMap[id];
		        }
		    }
            // then remove unions - only fields in join
		    for (var id in providersFieldsMap) if (providersFieldsMap.hasOwnProperty(id)) {
		        if ((providersFieldsMap[id].provider.getMode()||'union') == 'union'
		                && allFieldsBindingAndAllInOther(providersFieldsMap[id], 'join')) {
		            delete providersFieldsMap[id];
		        }
		    }
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

        filterFilterByFields: function(filter, isAccepted /** boolean isAccepted(field, expr) */) {
//debugger;
            function filteredAndOr(array, isAccepted) {
                if (!JSB.isArray(array)) {
                    throw new Error('Unsupported expression type for operator $and/$or');
                }

                var resultArray = [];
                for (var i in array) {
                    var fil = filteredMultiFilter(array[i], isAccepted);
                    if (fil) {
                        resultArray.push(fil);
                    }
                }
                return resultArray.length > 0 ? resultArray : null;
            }

            function filteredBinaryCondition(op, args, isAccepted) {
                for (var i in args) {
                    var field = $this.extractSingleField(args[i]);
                    if (!isAccepted(field, args[i])) {
                        return null;
                    }
                }
                return args;
            }

            function filteredMultiFilter(exps, isAccepted) {
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
                                resultExps[op] = filteredAndOr(exps[op], isAccepted);
                                if (!resultExps[op]) delete resultExps[op];
                                break;
                            default:
                                // $op: [left, right] expression
                                resultExps[op] = filteredBinaryCondition(op, exps[op], isAccepted);
                                if (!resultExps[op]) delete resultExps[op];
                        }
                    } else {
                        // field: {$eq: expr}
                        if (isAccepted(field, field)) {
                            var rightExpr = exps[field][Object.keys(exps[field])[0]];
                            var rightField = $this.extractSingleField(rightExpr);
                            if (!rightField || isAccepted(rightField, rightExpr)) {
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

            var filtered = filteredMultiFilter(filter, isAccepted);
//Log.debug('\nfilterFilterByFields: \n' + JSON.stringify(filter) + '\n' + JSON.stringify(filtered));
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

            walkMultiFilter(subQueryFilter);
//Log.debug('\ncollectSubQueryJoinFields: ' + JSON.stringify(subQueryJoinFields));
            return subQueryJoinFields;
        },

        /** встроить дополнительный фильтр в текущий по $and с фильтрацией по названию используемого поля
        */
        embedFilterToSubQuery: function (query, additionalFilter, isAccepted) {
            if (!query.$filter) query.$filter = {};
            if (!query.$filter.$and) query.$filter.$and = [];

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
                query.$filter.$and.push(subFilter);
            }
//Log.debug('\nembededFilter: ' + JSON.stringify(subQuery.$filter));
//debugger;
        },

        /** Возвращает true, если поле принадлежит кубу/провайдеру и используется в запросе без модификаций
        */
        isOriginalCubeField: function (field, dcQuery, cubeOrDataProvider) {
            // return true if cube field selected as is
            var fields = cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube'
                        ? cubeOrDataProvider.getManagedFields()
                        : cubeOrDataProvider.extractFields();
//            if (fields[field] && (!dcQuery.$select[field] || dcQuery.$select[field] == field || dcQuery.$select[field].$field == field)) {
            if (fields[field] || (
                    dcQuery.$select[field] && (
                        dcQuery.$select[field] == field || dcQuery.$select[field].$field == field
                    )
                )) {
//Log.debug('\nisOriginalCubeField: ' + field + '=true');
                return true;
            }
//Log.debug('\nisOriginalCubeField: ' + field + '=false');
            return false;
        },

        /** Встроить глобальный фильтр в фильры главного и дочерних запросов, но с оговорками:
        * 1) если поле является join (сравнивается по eq с любым полем другого запроса), то пропускаем
        */
        propagateGlobalFilter: function(dcQuery, cubeOrDataProvider) {
            // if global filter defined then embed it to all queries/sub queries
            if (dcQuery.$cubeFilter && Object.keys(dcQuery.$cubeFilter).length > 0) {
                // recursive find all $select
                this.walkSubQueries(dcQuery, function(subQuery){
                    if (!subQuery.$from) {
                        $this.embedFilterToSubQuery(
                            subQuery,
                            dcQuery.$cubeFilter,
                            function(field){
    //                            return $this.isOriginalCubeField(field, dcQuery, cubeOrDataProvider);
                                return true;
                            }
                        );
                    }
                });
                delete dcQuery.$cubeFilter;
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
                        if (QuerySyntax.isAggregateOperator(f)) {
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

        /** Производит замену алиасов на поле куба, если алиас равен полю куба
        */
        patchSimpleFieldAliases: function(dcQuery, cubeOrDataProvider) {
            var fields = cubeOrDataProvider.getJsb().$name == 'DataCube.Model.Cube'
                        ? cubeOrDataProvider.getManagedFields()
                        : cubeOrDataProvider.extractFields();
		    var queriesByContext = {};
		    this.walkSubQueries(dcQuery, function(query){
                if (query.$context) {
                    queriesByContext[query.$context] = query;
                }
		    });

		    this.walkSubQueries(dcQuery, function(query){
                patchFields(query, query);
		    });

            function patchFields(exp, query) {
                var fieldName = JSB.isPlainObject(exp) && exp.$field;
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
                                exp.$field = cubeField;
                            }
                        }
                    }
                } else if (JSB.isPlainObject(exp)) {
                    if (!exp.$select || exp == query) {
                        for (var f in exp) if (exp.hasOwnProperty(f)) {
                            if (f != '$postFilter') {
                                patchFields(exp[f]);
                            }
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for (var i in exp) {
                        patchFields(exp[i]);
                    }
                }
            }
        },

        /** Обходит выражения со значением для указанного запроса и заменяет их, если callback вернул новое выражение*/
        updateValueExpressions: function (dcQuery, callback/**(exp, alias)*/){
            // обход так же будет со всеми подзапросами, чтобы захватить используемые поля заданного запроса в подзапросах
            var oldCallback = callback;
            callback = function(exps, alias){
                if (this == dcQuery) {
                    return oldCallback.call(this, exps, alias);
                }
            };

//            function walkMultiFilter(exps){
//                var replaceFields = {};
//                for (var field in exps) if (exps.hasOwnProperty(field)) {
//                    if (field.startsWith('$')) {
//                        var op = field;
//                        switch(op) {
//                            case '$or':
//                            case '$and':
//                                for (var i in exps[op]) {
//                                    walkMultiFilter(exps[op][i]);
//                                }
//                                break;
//                            default:
//                                // $op: [left, right] expression
//                                for(var i in exps[op]) {
//                                    var replace = callback.call(query, exps[op][i]);
//                                    if (replace) {
//                                        exps[op][i] = replace;
//                                    }
//                                }
//                        }
//                    } else {
//                        // field: {$eq: expr}
//                        var e = exps[field];
//                        var op = Object.keys(e)[0];
//                        var replaceField = callback.call(query, field);
//                        var replaceValue = callback.call(query, e[op]);
//                        if (replaceField && replaceValue) {
//                            var newExp = {};
//                            newExp[op] = [{$field: replaceField}, replaceValue];
//                            replaceFields[field] = newExp;
//                        }
//                    }
//                }
//
//                for (var rf in replaceFields) {
//                    delete exps[rf];
//                    if(!exps.$and) exps.$and = [];
//                    exps.$and.push(replaceFields[rf]);
//                }
//            }
            function walkQuery(query){
                // walk $select
                for(var alias in query.$select) {
                    var replace = callback.call(query, query.$select[alias], alias);
                    if (replace) {
                        query.$select[alias] = replace;
                    }
                }
//
//                // walk $filter
//                walkMultiFilter(query.$filter);
//
//                // walk $groupBy
//                for(var i in query.$groupBy) {
//                    var replace = callback.call(query, query.$groupBy[i], alias);
//                    if (replace) {
//                        query.$groupBy[i] = replace;
//                    }
//                }

                // walk $sort
                for (var i in query.$sort) {
                    var val = query.$sort[i];
                    var exp;
                    if (val.$expr && val.$type) {
                        exp = val.$expr;
                    } else {
                        exp = Object.keys(val)[0];
                    }
                    var replace = callback.call(query, exp);
                    if (replace) {
                        query.$sort[i] = {
                            $expr: replace,
                            $type: val.$type == null ? val.$type : val[exp]
                        }
                    }
                }
            }

            this.walkSubQueries(dcQuery, walkQuery);
        },
/*
{
  "$groupBy": [
    "date"
  ],
  "$context": "main",
  "$select": {
    "Дата": "date",
    "Количество": {
      "$count": 1
    },
    "Столбец_2": {
      "$select": {
        "max": {
          "$max": {
            "$field": "count"
          }
        }
      },
      "$from": {
        "$select": {
          "count": {
            "$count": 1
          }
        },
        "$groupBy": [
          "date"
        ]
      }
    },
    "Столбец_3": {
      "$select": {
        "max": {
          "$max": {
            "$field": "sum"
          }
        }
      },
      "$from": {
        "$select": {
          "sum": {
            "$sum": 1
          }
        },
        "$groupBy": [
          "date"
        ]
      }
    }
  }
}
*/

        /** Формирует для запроса $with*/
        buildWithViews: function (dcQuery){
            function extractViewBody(query){
                var key = {
                    $groupBy: query.$groupBy,
                    $filter: query.$filter,
                    $from: query.$from
                };
                return key;
            }
            function extractViewId(query){
                return MD5.md5(JSON.stringify(extractViewBody(query)));
            }
            function extractExpId(exp){
                return MD5.md5(JSON.stringify(exp));
            }
            function hasView(query){
                if (!query.$groupBy && !query.$filter && !query.$from) {
                    return false;
                }
                // ViewBody имеется хотя бы в одном подзапросе
                var viewId = extractViewId(query);
                var count = 0;
                $this.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
                    if (extractViewId(query) == viewId) {
                        count++;
                    }
                });
                return count > 1;
            }
            function ensureView(query, name){
                var id = extractViewId(query);
                if (views[id]) {
                    return views[id];
                }
                viewOrder.push(id);
                return views[id] = {
                    id: id,
                    body: extractViewBody(query),
                    fieldExpressions:{},
                    fieldAliases:{},
                    name: name || ('view_' + Object.keys(views).length)
                };
            }

            var views = {};
            var viewOrder = [];
debugger;
            // load existed $with
            dcQuery.$with = dcQuery.$with || {};
            for (var name in dcQuery.$with) {
                var view = ensureView(dcQuery.$with[name], name);
                for(var alias in dcQuery.$with[name].$select) {
                    var exp = dcQuery.$with[name].$select[alias];
                    var expId = extractExpId(exp);
                    view.fieldAliases[expId] = view.fieldAliases[expId] || alias;
                    view.fieldExpressions[expId] = view.fieldExpressions[expId] || exp;
                }
            }

            $this.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
                if (query.$sql) {
                    return; // skip embedded SQL query
                }

                if (!hasView(query)) {
                    return; // no view
                }
                var view = ensureView(query);
                $this.updateValueExpressions(query, function callback(exp, alias) {
                    // //TODO: не все выражения можно копировать - может образоваться рекурсия
                    var expId = extractExpId(exp);
                    view.fieldAliases[expId] = view.fieldAliases[expId] || alias;
                    view.fieldExpressions[expId] = view.fieldExpressions[expId] || exp;
                });
                // transform query: // replace values by view`s
                $this.updateValueExpressions(query, function callback(exp, alias) {
                    var expId = extractExpId(exp);
                    var fieldAlias = view.fieldAliases[expId] = view.fieldAliases[expId] || expId;

                    return {$field: fieldAlias, $context: view.name};
                });
                delete query.$groupBy;
                delete query.$filter;
                delete query.$from;
                query.$from = view.name;
            });

            dcQuery.$with = dcQuery.$with || {};
            for (var i in viewOrder) {
                var id = viewOrder[i];
                var view = views[id];
                dcQuery.$with[views.name] = JSB.merge({
                    $select: (function(){
                        var select = {};
                        for (var fid in fieldAliases) {
                            var fieldAlias = view.fieldAliases[expId];
                            var fieldExpr = view.fieldExpressions[expId];
                            select[fieldAlias] = fieldExpr;
                        }
                        return select;
                    })()
                }, view.body);
            }

            // TODO build $with and replace value expressions and $from
        },

        /** Разворачивает $gr* агрегаторы в натуральные подзапросы */
		unwrapGrOperators: function(dcQuery) {
		    function unwrapForQuery(query) {
                function createSubQuery(op, exp) {
                    var innerOp;
                    switch(op){
                        case '$grmaxcount': innerOp = 'count'; break;
                        case '$grmaxsum': innerOp = 'sum'; break;
                        case '$grmaxavg': innerOp = 'avg'; break;
                    }
                    return {
                        $select: {
                            "max": {
                                $max: {$field: innerOp}
                            }
                        },
                        $from: {
                            $select: (function(){
                                var sel = {};
                                sel[innerOp] = {};
                                sel[innerOp]['$'+innerOp] = exp;
                                return sel;
                            })(),
                            $groupBy: query.$groupBy && JSB.clone(query.$groupBy) || undefined,
                            $filter: query.$filter && JSB.clone(query.$filter) || undefined,
                            $from: query.$from || undefined
                        }
                    };
                }

                function unwrapExpression(exp, setFunc) {
                    if (JSB.isPlainObject(exp)) {
                        if (exp.$select) return; // skip subquery

                        var key = Object.keys(exp)[0];
                        if (key.startsWith('$grmax')) {
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

                for (var alias in dcQuery.$select) if(dcQuery.$select.hasOwnProperty(alias)) {
                    unwrapExpression(dcQuery.$select[alias], function(newExp){
                        dcQuery.$select[alias] = newExp;
                    });
                }
            } // unwrapForQuery

            this.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
                unwrapForQuery(query);
            });
		}

	}
}