{
	$name: 'DataCube.Query.Transforms.NestedQueryOptimization',
	$parent: 'DataCube.Query.Transforms.Transformer',

	$server: {
		$require: [
	        'DataCube.Query.Transforms.QueryTransformer',
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

        /**
        * 1) Выделяет подзапросы с одинаковой основной частью
        * 2) объединяет их в один с общим $select
        * 3) формирует вьюху во $views
        * 4) заменяет тело исходных "оптимизированных" запросов на обращение к вьюхе:
        * 4.1) если запрос лежал во $from - заменяется прямым обращением к вьюхе
        * 4.2) если запрос лежал в $select - заменяется запросом к вьюхе с выбором полей вьюхи как есть
        */
		transform: function(dcQuery, cubeOrDataProvider){

            QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] Query before NestedQueryOptimization: ' + JSON.stringify(dcQuery, 0, 2));

		    var resultQuery = $this._buildViews(dcQuery);
		    return resultQuery;
		},


        _buildViews: function (dcQuery) {
            var views = {};
            $this._walkViews(dcQuery, true, function(view, count){
                // extract only if fixed or multiple
                if (!view.fixed && count < 2 ) return;

                view.fixed = true; // store view

                views[view.name] = JSB.merge({$select: view.fields}, view.query);
                $this._fixViewFieldsForeignContext(view);
                $this._rebuildLinkedQueries(dcQuery, view);
            });
            dcQuery.$views = views;
            return dcQuery;
        },

        _fixViewFieldsForeignContext: function(view){
            function fixFields(exp, oldContext){
                if (typeof exp === 'object') {
                    if (exp.$field && exp.$context == oldContext) {
                        exp.$context = view.query.$context;
                        return;
                    }
                    for(var i in exp) if (exp.hasOwnProperty(i)) {
                        fixFields(exp[i], oldContext);
                    }
                } else if (JSB.isArray(exp)) {
                    for(var i in exp){
                        fixFields(exp[i], oldContext);
                    }
                }
            }
//debugger;
            for(var q in view.linkedQueries) {
                var query = view.linkedQueries[q];
                if (query.$context != view.query.$context) {
                    for(var f in view.fields){
                        fixFields(view.fields[f], query.$context);
                    }
                }
            }
        },

        _rebuildLinkedQueries: function(dcQuery, view){
//if ($this.getJsb().$name.indexOf('LinkedNestedQueryOptimization') != -1)
//    debugger;
            for(var q in view.linkedQueries) {
                var query = view.linkedQueries[q];
                query.$select = $this._buildSelectFromView(query, view);
                query.$filter = $this._buildFilterFromView(query, view);
                if (!query.$filter) delete query.$filter;
                delete query.$groupBy;
                query.$from = view.name;
            }

            for(var q in view.linkedFromQueries) {
                var query = view.linkedFromQueries[q];
                query.$from = view.name;
            }
        },

        _walkViews: function(dcQuery, includeFrom, viewCallback) {
if ($this.getJsb().$name.indexOf('LinkedNestedQueryOptimization') != -1)
    debugger;

            function findParentFromQuery(query, callback){
                var parentFromQuery = null;
                // replace self query with name
                QueryUtils.walkAllSubQueries(dcQuery, function(subQuery){
                    if (subQuery.$from && subQuery.$from == query
                            || typeof subQuery.$from === 'string' && subQuery.$from == query.$context
                            || typeof subQuery.$from === 'object' && subQuery.$from.$context == query.$context) {
                        parentFromQuery = subQuery;
                        callback(subQuery);
                    }
                });
                if (!parentFromQuery) {
                    throw new Error('Internal error: From query parent not found for query ' + query.$context);
                }
                return parentFromQuery;
            }

            var views = {}, viewsUseCount = {}, viewKeysOrder = [];
            $this._walkAllViews(dcQuery, includeFrom, function(viewKey, viewQuery, viewFields, linkedQuery, isFromQuery){
//                if (!isFromQuery) throw new Error('Internal error: failed view query type');
                if(!views[viewKey]) {
                    var view = views[viewKey] = {
                        key: viewKey,
                        name: linkedQuery.$context || 'view'+(viewKeysOrder.length+1),
                        fixed : !!isFromQuery,
                        fields:  viewFields,
                        query: viewQuery,
                        linkedQueries: [],
                        linkedFromQueries: [],
                    };
                    view.query.$context  = linkedQuery.$context || view.name;
                    viewKeysOrder.push(viewKey);
                    viewsUseCount[viewKey] = 1;
                } else {
                    var view = views[viewKey];
                    view.fields = $this._mergeFields(view.fields, viewFields);
                    viewsUseCount[viewKey] = viewsUseCount[viewKey] + 1;
                }

                if (!isFromQuery && view.linkedQueries.indexOf(linkedQuery) == -1) {
                    view.linkedQueries.push(linkedQuery);
                }
                if (isFromQuery) {
                    findParentFromQuery(linkedQuery, function(fromQuery){
                        if (view.linkedFromQueries.indexOf(fromQuery) == -1) {
                            view.linkedFromQueries.push(fromQuery);
                        }
                    });
                }
            });

            for (var i in viewKeysOrder) {
                var key = viewKeysOrder[i];
                var view = views[key];
                var count = viewsUseCount[key];
                viewCallback(view, count);
            }
        },

        _walkAllViews: function (dcQuery, includeFrom, localViewCallback) {
//debugger;
            QueryUtils.walkAllSubQueries(dcQuery, function(query, isFromQuery, isValueQuery, isViewQuery, path){
                if (query.$sql) {
                    return false; // skip embedded SQL query
                }
                if (!includeFrom && !isFromQuery) {
                    return false; // extract only $from queries
                }

                if(!$this._checkQueryHasView(query, isFromQuery)) {
                    return;
                }

                var viewQuery = $this._extractViewQuery(query);
                var viewKey = $this._extractKey(viewQuery);
                if (isFromQuery) {
                    var viewFields = JSB.merge(true, {}, query.$select);
                } else {
                    var viewFields = $this._extractViewFields(query, viewKey, viewQuery);
                }

                localViewCallback(viewKey, viewQuery, viewFields, query, isFromQuery);
            });
        },

        _checkQueryHasView: function(query, isFromQuery){
            if (!isFromQuery && !query.$filter && !query.$groupBy /*&& !query.$from*/ && !query.$sort && !query.$distinct) {
                return false; // skip simple cube
            }
            // skip not isolated subqueries
            var isIsolated = QueryUtils.checkQueryIsIsolated(query);
            if (!isIsolated) {
                return false;
            }
            return true;
        },

        _extractKey: function(keyObject){
            return MD5.md5(/**sorted stringify*/JSB.stringify(keyObject));
        },

        _extractViewQuery: function(query){
            var viewQuery = JSB.merge(true, {}, query);
            delete viewQuery.$select;
            delete viewQuery.$context;
            delete viewQuery.$id;
            delete viewQuery.$views;
            return viewQuery;
        },

        _mergeFields: function(viewFields1, viewFields2) {
            /// Слияние по значению/выражению.
            /// Имя поля может измениться, если оно дублируется при отличающемся значении.
            /// В принципе, имя не имеет значение, т.к. замена в запросе
            //  тоже будет выполняться по значению дабы минимизировать дубли.
            var keyExp = {};
            var keyAlias = {};
            var aliasKey = {};
            for(var field in viewFields1) {
                var key = $this._extractKey(viewFields1[field]);
                keyExp[key] = viewFields1[field];
                if (!aliasKey[field]) {
                    aliasKey[field] = key;
                    keyAlias[key] = field;
                } else if (aliasKey[field] != key) {
                    field = field + '_' + Object.keys(aliasKey).length;
                    keyAlias[key] = field;
                    aliasKey[field] = key;
                }
            }
            for(var field in viewFields2) {
                var key = $this._extractKey(viewFields2[field]);
                keyExp[key] = viewFields2[field];
//                keyAlias[key] = field.startsWith('vf_of_') ? keyAlias[key] || field : field;
                if (!aliasKey[field]) {
                    aliasKey[field] = key;
                    keyAlias[key] = field;
                } else if (aliasKey[field] != key) {
                    field = field + '_' + Object.keys(aliasKey).length;
                    keyAlias[key] = field;
                    aliasKey[field] = key;
                }
            }
            var fields = {};
            for(var key in keyExp) {
                fields[keyAlias[key]] = keyExp[key];
            }
            return fields;
        },

        _extractViewFields: function(query, viewKey, viewQuery) {
            var viewFields = {};
            function addViewField(exp, alias) {
                var foundField = null;
                for(var f in viewFields) {
                    if (JSB.isEqual(viewFields[f], exp)) {
                        foundField = f;
                    }
                }
                var fieldAlias = alias || 'vf_of_'+foundField;
                if (foundField) {
                    delete viewFields[foundField];
                }
                viewFields[fieldAlias] = exp;
            }

            function walkFieldsValue(fields, exp) {
                for (var i in fields){
                    if( !fields[i].$context || fields[i].$context == query.$context) {
                        // only if use fields (not const)
                        var hasFields = Object.keys(QueryUtils.extractAllFields(exp)).length > 0;
                        if(hasFields){
                            addViewField(exp, 'vef_' + fields[i].$field);
                        }
                    }
                }
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
                                var left = exps[op][0];
                                var right = exps[op][1];
                                walkFieldsValue(QueryUtils.extractFields(left), left);
                                walkFieldsValue(QueryUtils.extractFields(left), right);
                        }
                    } else {
                        // field: {$eq: expr}
                        walkFieldsValue([{$field: field}], {$field: field}); //left
                        walkFieldsValue(QueryUtils.extractFields(exps[field]), exps[field]); //right
                    }
                }
            }
//            var aa = "";
//debugger;

            // $select expressions as fields without subqueries with same view
            for (var alias in query.$select) {
                var subQueries = QueryUtils.findSubQueries(query.$select[alias]);
                if (subQueries && subQueries.length > 0) {
                    var hasSameView = false;
                    for(var i in subQueries) {
                        var subViewKey = $this._extractKey($this._extractViewQuery(subQueries[i]));
                        hasSameView = subViewKey == viewKey || hasSameView;
                    }
                }
                if (!subQueries || !hasSameView) {
                    addViewField(query.$select[alias], 'vf_' + alias);
                }
            }

            // $sort expressions as fields
            for (var i in query.$sort) {
                var val = query.$sort[i];
                if (val.$expr && val.$type) {
                    addViewField(val.$expr, null);
                } else {
                    var field = Object.keys(val)[0];
                    addViewField({$field:field}, 'vef_' + field);
                }
            }

            // $filter expressions as fields (skip foreign fields)
            walkMultiFilter(query.$filter);
            return viewFields;
        },

        _buildSelectFromView: function(query, view){
            var select = {};
            for (var alias in query.$select) {
                var viewField = null;
                for(var f in view.fields){
                    // поиск по значению/выражению
                    if(JSB.isEqual(view.fields[f], query.$select[alias])){
                        viewField = f;
                        break;
                    }
                }
                if (!viewField) {
                    select[alias] = query.$select[alias]; // TODO: fix fields
                } else {
                    select[alias] = viewField;
                }
            }
            return select;
        },

        _buildFilterFromView: function(query, view){
            function updateValue(value){
                for(var alias in view.fields){
                    if (JSB.isEqual(view.fields[alias], value)) {
                        return alias;
                    }
                }
                return value;
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
                                exps[op][0] = updateValue(exps[op][0]); // left
                                exps[op][1] = updateValue(exps[op][1]); // right
                        }
                    } else {
                        // field: {$eq: expr}
                        var op =  Object.keys(exps[field])[0];
                        var val = exps[field][op];
                        delete exps[field][op];
                        delete exps[field];
                        exps[updateValue(field)] = {};
                        exps[Object.keys(exps)[0]][op] = updateValue(val);
                    }
                }
            }

            // remove view filter from $filter

            // get only foreign fields
            var filter = QueryUtils._extractFilterByContext(query, false, true);
            if(filter) {
                // replace $filter values with view fields aliases
                walkMultiFilter(filter);
                return filter;
            }
        },
	}
}