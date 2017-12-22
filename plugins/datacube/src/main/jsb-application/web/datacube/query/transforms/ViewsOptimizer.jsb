{
	$name: 'DataCube.Query.ViewsOptimizer',

	$server: {
	    $require: [
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

        enabledByDefault: false,
//        enabledByDefault: {includeFrom:true},

        buildViews: function (dcQuery) {
            var enabled = dcQuery.$extractViews || $this.enabledByDefault;
            if (enabled.includeFrom) {
                // TODO: Optimize option includeFrom is not supported
                throw Error('Optimize option includeFrom is not supported');
            }
            try {
                $this.lookupLocalViews(dcQuery, function(view, count){
                    if (enabled && count > 1) {
                        for(var q in view.linkedQueries) {
                            var query = view.linkedQueries[q];
                            query.$select = $this._buildSelectFromView(query, view);
                            query.$filter = $this._buildFilterFromView(query.$filter, view);
                            query.$from = view.name;
                        }
                    }
                });
            } catch(e) {
                if(enabled) throw e;
                else Log.error(e);
            }
        },

        lookupViews: function (dcQuery, viewCallback) {
            var views = {}, viewsUseCount = {}, viewKeysOrder = [];
            $this.lookupLocalViews(dcQuery, function(viewKey, viewQuery, viewFields, query){
                viewsUseCount[viewKey] = (viewsUseCount[viewKey]||0) + 1
                if(!views[viewKey]) {
                    var view = views[viewKey] = {
                        key: viewKey,
                        name: 'v'+$this._extractKey(obj).substring(0,4),
                        fields:  viewFields,
                        query: viewQuery,
                        linkedQueries: [query],
                    };
                    viewKeysOrder.push(view);
                } else {
                    var view = views[viewKey];
                    view.linkedQueries.push(query);
                    $this._mergeFields(view.fields, viewFields);
                }
            });
            for (var i in viewKeysOrder) {
                var key = viewKeysOrder[i];
                viewCallback(views[key], viewsUseCount[key]);
            }
        },

        lookupLocalViews: function (dcQuery, localViewCallback) {
            dcQuery = JSB.merge(true, {}, dcQuery);

            $this.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
                if (query.$sql) {
                    return; // skip embedded SQL query
                }
                if (!$this._isQueryContainsView(query)) {
                    return; // skip no view query
                }

                var viewKey = $this._extractViewKey(query);
                var viewQuery = $this._extractViewQuery(query);
                var viewFields = $this._extractViewFields(query, viewKey, viewQuery);

                localViewCallback(viewKey, viewQuery, viewFields, query);
            });
        },

        _isQueryContainsView: function(query){
            // содержит $groupBy или $filter
            if (!(query.$groupBy && query.$groupBy.length > 0)
                    && !(query.$filter && Object.keys(query.$filter).length > 0)
                    /**&& !query.$from*/) {
                return false;
            }
            // если содержит $groupBy, то он не содержит полей внешних запросов
            if (query.$groupBy && query.$groupBy.length > 0) {
                var fields = QueryUtils.extractFields(query.$groupBy, false);
                for (var name in fields) {
                    var field = fields[name];
                    if (field.$context && field.$context != query.$context) {
                        return false;
                    }
                }
            }
            return true;
        },

        _extractKey: function(keyObject){
            return MD5.md5(/**sorted stringify*/JSB.stringify(obj));
        },

        _extractViewKey: function(query){
            var key = $this._extractViewQuery(query);
            return $this._extractKey(key);
        },

        _extractViewQuery: function(query){
            var viewQuery = {
                $groupBy: query.$groupBy,
                $filter: $this._extractFilterWithoutForeignFields(query),

            };
            return viewQuery;
        },

        _extractFilterWithoutForeignFields: function(query) {
            if (!query.$filter
                    || Object.keys(query.$filter).length == 0
                    || query.$filter.$and && query.$filter.$and.length == 0) {
                return {};
            }
            // $filter without foreign fields condition
            var foreignFields = QueryUtils.collectSubQueryJoinFields(query.$filter, function(context){
                return context != query.$context;
            });
            var subFilter = QueryUtils.filterFilterByFields(filter, function isAccepted(field, expr, opPath){
                return foreignFields.indexOf(field) == -1;
            });
            return /**is empty*/ !subFilter || subFilter.$and && subFilter.$and.length == 0
                    ? {}
                    : subFilter;
        },

        _extractViewFields: function(query, viewKey, viewQuery) {
            var viewFields = {};
            function addViewField(exp, alias) {
                var foundField;
                for(var f in viewFields) {
                    if (JSB.isEquals(viewFields[f], exp)) {
                        foundField = f;
                    }
                }
                var fieldAlias = alias || foundField;
                if (foundField) {
                    delete viewFields[foundField];
                }
                viewFields[fieldAlias] = exp;
            }

            function walkFieldsValue(fields, exp) {
                for (var i in fields){
                    if( !fields[i].$context || fields[i].$context == query.$context) {
                        addViewField(exp, 'vef_' + fields[i].$field);
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
                                walkFieldsValue($this.extractFields(left), left);
                                walkFieldsValue($this.extractFields(left), right);
                        }
                    } else {
                        // field: {$eq: expr}
                        walkFieldsValue([{$field: field}], {$field: field}); //left
                        walkFieldsValue($this.extractFields(exps[field]), exps[field]); //right
                    }
                }
            }

            // $select expressions as fields without subqueries with same view
            for (var alias in query.$select) {
                var subQueries = QueryUtils.findSubQueries(query.$select[alias]);
                if (subQueries) {
                    var hasSameView = false;
                    for(var i in subQueries) {
                        var subViewKey = $this._extractViewKey(subQueries[i]);
                        hasSameView = subViewKey == viewKey || hasSameView;
                    }
                }
                if (!subQueries && !hasSameView) {
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
        },

        _buildSelectFromView: function(query, view){
            // all view fields with aliases
            var select = {};
            for(var alias in view.fields){
                select[alias] = view.fields[alias];
            }
            // original skipped expressions and update field names
            for (var alias in query.$select) {
                var viewField;
                for(var f in view.fields){
                    if(JSB.isEquals(view.fields[f], query.$select[alias])){
                        viewField = f;
                    }
                }
                if (!viewField) {
                    select[alias] = query.$select[alias];
                }
            }
            return select;
        },

        _buildFilterFromView: function(filter, view){
            function updateValue(value)(
                for(var alias in view.fields){
                    if (JSB.isEquals(view.fields[alias], value)) {
                        return alias;
                    }
                }
                return value;
            )
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

            // replace $filter values with view fields aliases
            walkMultiFilter(filter);

            return filter;
        },
	}
}