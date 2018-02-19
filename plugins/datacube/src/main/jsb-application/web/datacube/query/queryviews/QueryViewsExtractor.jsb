{
	$name: 'DataCube.Query.Views.PatternViewsExtractor',

	$server: {
	    $require: [
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

        enabledByDefault: false,
        defaultConfig: {minCount: 2, includeFrom: false},

        buildViews: function (dcQuery) {

            $this.currentConfig = (dcQuery.$extractViews || $this.enabledByDefault)
                    && JSB.merge({}, $this.defaultConfig, dcQuery.$extractViews||{});
//            if ($this.currentConfig.includeFrom) {
//                // TODO: Optimize option includeFrom is not supported
//                throw Error('Optimize option includeFrom is not supported');
//            }
            dcQuery = JSB.merge(true, {}, dcQuery);
            delete dcQuery.$extractViews;
            dcQuery.$views = dcQuery.$views || {};
            try {
debugger;
                $this.lookupViews(dcQuery, function(view, count){
                    if ($this.currentConfig && count >= $this.currentConfig.minCount) {
                        dcQuery.$views[view.name] = JSB.merge({$select: view.fields}, view.query);
                        for(var q in view.linkedQueries) {
                            var query = view.linkedQueries[q];
                            query.$select = $this._buildSelectFromView(query, view);
                            query.$filter = $this._buildFilterFromView(query, view);
                            if (!query.$filter) delete query.$filter;
                            delete query.$groupBy;
                            query.$from = view.name;
                        }
                    }
                });
            } catch(e) {
                if($this.currentConfig) throw e;
                else Log.error(e);
            }
            return dcQuery;
        },

        lookupViews: function (dcQuery, viewCallback) {
debugger;
            var views = {}, viewsUseCount = {}, viewKeysOrder = [];
            $this.lookupLocalViews(dcQuery, function(viewKey, viewQuery, viewFields, query){
                viewsUseCount[viewKey] = (viewsUseCount[viewKey]||0) + 1
                if(!views[viewKey]) {
                    var view = views[viewKey] = {
                        key: viewKey,
                        name: 'view'+(viewKeysOrder.length+1),
                        fields:  viewFields,
                        query: viewQuery,
                        linkedQueries: [query],
                    };
                    viewKeysOrder.push(viewKey);
                } else {
                    var view = views[viewKey];
                    view.linkedQueries.push(query);
                    view.fields = $this._mergeFields(view.fields, viewFields);
                }
            });

            for (var i in viewKeysOrder) {
                var key = viewKeysOrder[i];
                var view = views[key];
                var count = viewsUseCount[key];
                if (view.query.$from) {
                    $this._generateViewFromSelect(view);
                }

                viewCallback(view, count);
            }
        },

        lookupLocalViews: function (dcQuery, localViewCallback) {
debugger;

            QueryUtils.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery){
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
            var hasGroupBy = query.$groupBy && query.$groupBy.length > 0;
            var hasFilter = query.$filter && Object.keys(query.$filter).length > 0;
            var hasFrom = $this.currentConfig.includeFrom && query.$from;
            // содержит $groupBy или $filter, или $from
            if (!hasGroupBy && !hasFilter && !hasFrom) {
                return false;
            }
            // если содержит $groupBy, то он не содержит полей внешних запросов
            if (hasGroupBy) {
                var fields = QueryUtils.extractFields(query.$groupBy, false);
                for (var name in fields) {
                    var field = fields[name];
                    if (field.$context && field.$context != query.$context) {
                        return false;
                    }
                }
            }
//            // если содержит $from, то содержит $groupBy или $filter
//            if (hasFrom && !hasGroupBy && !hasFilter) {
//                return false;
//            }
            return true;
        },

        _extractKey: function(keyObject){
            return MD5.md5(/**sorted stringify*/JSB.stringify(keyObject));
        },

        _extractViewKey: function(query){
            var key = $this._extractViewQuery(query);
            return $this._extractKey(key);
        },

        _extractViewQuery: function(query){
            function extractViewFromQuery(from) {
                if (typeof from === 'object') {
                    var newFrom = JSB.merge(true,{}, from);
                    delete newFrom.$select;
                    return newFrom;
                }
                return from;
            }

            var viewQuery = {
                $groupBy: query.$groupBy,
                $filter: $this._extractFilterWithoutForeignFields(query),
                $from: extractViewFromQuery(query.$from),

            };
//            Log.debug('View: '+JSB.stringify(viewQuery, null,null,true));
            return viewQuery;
        },

        _extractFilterWithoutForeignFields: function(query) {
            if (!query.$filter
                    || Object.keys(query.$filter).length == 0
                    || query.$filter.$and && query.$filter.$and.length == 0) {
                return;
            }

            // $filter without foreign fields condition
            var subFilter = QueryUtils.extractIsolatedQueryFilter(query);

            if (subFilter && Object.keys(subFilter).length > 0) {
                return subFilter;
            }
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
                        var subViewKey = $this._extractViewKey(subQueries[i]);
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

        _generateViewFromSelect: function (view) {
            if (!view.query.$from) throw new Error('View ' + view.name + ' does not contain $from.$select');
            debugger;

            // collect $select from linkedQueries
            var select = view.query.$from.$select = {};
            for (var i in view.linkedQueries) {
                var query = view.linkedQueries[i];
                if (!query.$from || !query.$from.$select) throw new Error('View`s ' + view.name + ' linked query does not contain $from.$select');
                for (var alias in query.$from.$select) {
                    if (select[alias]) {
                        if (!JSB.isEqual(select[alias], query.$from.$select[alias])) {
                            throw new Error('Subquery contains duplicate aliases in $from.$select');
                        }
                    }
                    select[alias] = query.$from.$select[alias];
                }
            }
        },
	}
}