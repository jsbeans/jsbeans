{
	$name: 'DataCube.Query.QueryUtils',
	$singleton: true,

	$server: {
	    $require: ['DataCube.Query.QuerySyntax'],

        walkSubQueries: function (query, callback) {
            function collect(q) {
                if (JSB.isPlainObject(q)) {
                    if (q.$select) {
                        callback(q);
                    }
                    if (q.$from) {
                        callback(q.$from);
                    }
                    for (var f in q) if (q.hasOwnProperty(f)) {
                        collect(q[f]);
                    }
                } else if (JSB.isArray(q)) {
                    for (var i in q) {
                        collect(q[i]);
                    }
                }
            }
            collect(query);
        },

        walkQueryFields: function(dcQuery, includeSubQueries/**all or current query`s fields*/, callback /*(field, context, query)*/){
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
                        fieldsCallback($this.extractFields(exps[field, !includeSubQueries])); // right
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

            if (includeSubQueries) {
                this.walkSubQueries(dcQuery, walkQuery);
            } else {
                walkQuery(dcQuery);
            }
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
                    var binding = managedFields[field].binding;
                    callback(field, context, query, binding);
                }
            });
        },

        removeRedundantBindingProviders: function (providersFieldsMap/**id: {provider, cubeFields:{field:hasOtherBinding}}*/){
		    function allFieldsBindingAndAllInOther(prov){
		        var allFieldsBinding = true;
		        var allInOther = true;
		        for (var f in prov.cubeFields) if (prov.cubeFields.hasOwnProperty(f)) {
		            if (!prov.cubeFields[f]) {
		                allFieldsBinding = false;
		                break;
		            }
		            var fieldInOther = false;
		            for (var id in providersFieldsMap) if (providersFieldsMap.hasOwnProperty(id)) {
		                if (prov == providersFieldsMap[id]) continue;
		                if (prov.provider.id != id) {
		                    if(providersFieldsMap[id].cubeFields.hasOwnProperty(f)) {
		                        fieldInOther = true;
		                        break;
		                    }
                        }
		            }
		            if (!fieldInOther) {
		                allInOther = false;
		                break;
		            }
		        }
		        return allFieldsBinding && allInOther;
		    }

		    for (var id in providersFieldsMap) if (providersFieldsMap.hasOwnProperty(id)) {
		        if (allFieldsBindingAndAllInOther(providersFieldsMap[id])) {
		            delete providersFieldsMap[id];
		        }
		    }
        },

        extractFields: function(valueExp, skipSubQuery) {
            var cubeFields = {};
            function collect(q) {
                if (JSB.isString(q)) {
                    cubeFields[q] = {$field:q};
                } else if (JSB.isPlainObject(q) && q.$field) {
                    if (!JSB.isString(q.$field)) throw new Error('Invalid $field value type ' + typeof q.$field);
                    cubeFields[q.$field] = q;
                } else if (JSB.isPlainObject(q) && JSB.isNull(q.$const)) {
                    if (!q.$select || !skipSubQuery ) {
                        for (var f in q) if (q.hasOwnProperty(f)) {
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
        embedFilterToSubQuery: function (dcQuery, subQuery, filterName, additionalFilter, isAccepted) {
//debugger;
            if (!subQuery.$filter) subQuery.$filter = {};
            if (!subQuery.$filter.$and) subQuery.$filter.$and = [];

            var skipFields = this.collectSubQueryJoinFields(
                subQuery.$filter,
                function isForeignContext(context) {
                    return !!context && context == subQuery.$context;
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
                subQuery.$filter.$and.push(subFilter);
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
//debugger;
//Log.debug('\npropagateGlobalFilter START: ' + JSON.stringify(dcQuery,0,2));
                // recursive find all $select
                this.walkSubQueries(dcQuery, function(subQuery){
                    $this.embedFilterToSubQuery(
                        dcQuery, subQuery, '$filter',
                        dcQuery.$cubeFilter,
                        function(field){
//                            return $this.isOriginalCubeField(field, dcQuery, cubeOrDataProvider);
                            return true;
                        }
                    );
                });
                delete dcQuery.$cubeFilter;
//Log.debug('\npropagateGlobalFilter END: ' + JSON.stringify(dcQuery,0,2));
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
		upperGeneralFields: function(dcQuery, cubeOrDataProvider){
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



	}
}