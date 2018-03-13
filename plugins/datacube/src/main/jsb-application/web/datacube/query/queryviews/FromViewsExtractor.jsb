{
	$name: 'DataCube.Query.Views.FromViewsExtractor',

	$server: {
	    $require: [
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

        /** Выносит во $views:
            1) Одинаковые изолированные подзапросы, где различается только $select
            2) Одинаковые $from выносятся целиком
        */
        buildViews: function (dcQuery) {
//debugger;
            var views = {};
            $this.walkViews(dcQuery, function(view, count){
                if (!view.fixed && count < 1 ) return;

                views[view.name] = JSB.merge({$select: view.fields}, view.query);
                for(var q in view.linkedQueries) {
                    var query = view.linkedQueries[q];

                    if (view.linkedFromQueries.indexOf(query) == -1) {
                        query.$select = $this._buildSelectFromView(query, view);
                        query.$filter = $this._buildFilterFromView(query, view);
                        if (!query.$filter) delete query.$filter;
                        delete query.$groupBy;
                        query.$from = view.name;
                    } else {
                        // replace self query with name
                        QueryUtils.walkAllSubQueries(dcQuery, function(subQuery){
                            if (subQuery.$from && subQuery.$from.$context == query.$context) {
                                subQuery.$from = view.name;
                            }
                        });
                    }
                }
            });
            dcQuery.$views = views;
            return dcQuery;
        },

        walkViews: function(dcQuery, viewCallback) {
//debugger;
            var views = {}, viewsUseCount = {}, viewKeysOrder = [];
            $this._walkAllViews(dcQuery, function(viewKey, viewQuery, viewFields, linkedQuery, isFromQuery){
                if (!isFromQuery ) throw new Error('Internal error: failed view query type');
                if(!views[viewKey]) {
                    var view = views[viewKey] = {
                        key: viewKey,
                        name: linkedQuery.$context || 'view'+(viewKeysOrder.length+1),
                        fixed : isFromQuery,
                        fields:  viewFields,
                        query: viewQuery,
                        linkedQueries: [linkedQuery],
                        linkedFromQueries: [linkedQuery],
                    };
                    view.query.$context  = linkedQuery.$context || view.name;
                    viewKeysOrder.push(viewKey);
                    viewsUseCount[viewKey] = 1;
                } else {
                    var view = views[viewKey];
                    if (view.linkedQueries.indexOf(linkedQuery) == -1) {
                        view.linkedQueries.push(linkedQuery);
                    }
                    if (view.linkedFromQueries.indexOf(linkedQuery) == -1) {
                        view.linkedFromQueries.push(linkedQuery);
                    }
                    view.fields = $this._mergeFields(view.fields, viewFields);
                    viewsUseCount[viewKey] = viewsUseCount[viewKey] + 1;
                }
            });

            for (var i in viewKeysOrder) {
                var key = viewKeysOrder[i];
                var view = views[key];
                var count = viewsUseCount[key];
//                if (view.query.$from) {
//                    $this._generateViewFromSelect(view);
//                }
                viewCallback(view, count);
            }
        },

        _walkAllViews: function (dcQuery, localViewCallback) {
//debugger;
            QueryUtils.walkAllSubQueries(dcQuery, function(query, isFromQuery, isValueQuery, isViewQuery, path){
                if (query.$sql) {
                    return; // skip embedded SQL query
                }
                if (!isFromQuery && !query.$filter && !query.$groupBy /*&& !query.$from*/ && !query.$sort && !query.$distinct) {
                    return; // skip simple cube
                }

                if (!isFromQuery) {
                    return; // extract only $from queries
                }

                // skip not isolated subqueries
                var isIsolated = QueryUtils.checkQueryIsIsolated(query);
                if (!isIsolated) {
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

        _extractKey: function(keyObject){
            return MD5.md5(/**sorted stringify*/JSB.stringify(keyObject));
        },

        _extractViewQuery: function(query){
            var viewQuery = JSB.merge(true, {}, query);
            delete viewQuery.$select;
            delete viewQuery.$context;
//            {
//                $filter: query.$filter,
//                $groupBy: query.$groupBy,
//                $from: query.$from,
//                $distinct: query.$distinct,
//                $sort: query.$sort,
//                $limit: query.$limit,
//            };
            return viewQuery;
        },

        _mergeFields: function(viewFields1, viewFields2) {
            var keyExp = {};
            var keyAlias = {};
            for(var field in viewFields1) {
                var key = $this._extractKey(viewFields1[field]);
                keyExp[key] = viewFields1[field];
                keyAlias[key] = field;
            }
            for(var field in viewFields2) {
                var key = $this._extractKey(viewFields2[field]);
                keyExp[key] = viewFields2[field];
                keyAlias[key] = field.startsWith('vf_of_') ? keyAlias[key] || field : field;
            }
            var fields = {};
            for(var key in keyExp) {
                fields[keyAlias[key]] = keyExp[key];
            }
            return fields;
//            return JSB.merge({},viewFields1, viewFields2);
        },

//        _generateViewFromSelect: function (view) {
//            // collect $select from linkedQueries
//            var select = view.query.$from.$select = {};
//            for (var i in view.linkedQueries) {
//                var query = view.linkedQueries[i];
//                if (!query.$from || !query.$from.$select) throw new Error('View`s ' + view.name + ' linked query does not contain $from.$select');
//                for (var alias in query.$from.$select) {
//                    if (select[alias]) {
//                        if (!JSB.isEqual(select[alias], query.$from.$select[alias])) {
//                            throw new Error('Subquery contains duplicate aliases in $from.$select');
//                        }
//                    }
//                    select[alias] = query.$from.$select[alias];
//                }
//            }
//        },

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
//            for(var alias in view.fields){
//                select[alias] = view.fields[alias];
//            }
            for (var alias in query.$select) {
                var viewField = null;
                for(var f in view.fields){
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
            var filter = QueryUtils._extractFilterByContext(query, false, true);
            if(filter) {
                // replace $filter values with view fields aliases
                walkMultiFilter(filter);
                return filter;
            }
        },
	}
}