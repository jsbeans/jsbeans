{
	$name: 'DataCube.Query.Transforms.NestedQueryOptimization',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
	        'DataCube.Query.Transforms.QueryTransformer',
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

        $deprecated: 'код устарел относительно текущей версии движка',

        config: {
            onlyFrom: false,
            verify: true,
        },

		transform: function(dcQuery, cubeOrDataProvider){
debugger;
            QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] Query before NestedQueryOptimization: ' + JSON.stringify(dcQuery, 0, 2));
		    $this._buildViews(dcQuery);
		    return dcQuery;
		},


        _buildViews: function (dcQuery) {

            var views = {};
            QueryUtils.walkAllSubQueries(dcQuery, function(query, fromParentQuery, isValueQuery, isViewQuery, path){
                if (query.$sql) {
                    return false; // skip embedded SQL query
                }
                if ($this.config.onlyFrom && !fromParentQuery) {
                    return false; // extract only $from queries
                }

                if(!$this._checkQueryHasView(query, !!fromParentQuery)) {
                    return;
                }

                var viewQueryCore = $this._extractViewQueryCore(query, views);
                var viewKey = $this._extractKey(viewQueryCore);
//if(viewKey.indexOf('6b0b7') != -1) debugger; // TODO: fix recurse
                var viewFields = JSB.merge(true, {}, query.$select);

                $this._buildView(views, dcQuery, query, viewKey, viewQueryCore, viewFields, fromParentQuery, isViewQuery, path);
            });
            dcQuery.$views = views;
        },

        _buildView: function(views, dcQuery, query, viewKey, viewQueryCore, viewFields, fromParentQuery, isViewQuery, path) {
            function checkHasCircle(viewName) {
                var targetQuery = JSB.merge({}, query,{$views: views});
                var hasCircle = false;
                QueryUtils.walkAllSubQueries(targetQuery, function(subQuery){
                    if (subQuery.$context == viewName) {
                        hasCircle = true;
                    }
                });
                return hasCircle;
            }

            var debug = {queryContext: query.$context, viewKey: viewKey, viewQueryCore: viewQueryCore, viewFields: viewFields, isFromQuery: !!fromParentQuery, isViewQuery: !!isViewQuery};
            QueryUtils.logDebug('\n[qid='+dcQuery.$id+'] NestedQueryOptimization: ' + JSON.stringify(debug, 0, 2));

//debugger;
            if ($this.config.verify && !QueryUtils.checkQueryIsIsolated(JSB.merge({},viewQueryCore,{$from:null}))){
                throw new Error('Internal error: NestedQueryOptimization: View query core is not isolated');
            }

            /// store to $views
            var viewName = 'view' + viewKey.substring(0,6);
            var viewQuery = views[viewName];
            if (viewQuery) {
                if (checkHasCircle(viewName)) {
                    /// do not build circle view
                    return;
                }
                viewQuery.$select = $this._mergeFields(views[viewName].$select, viewFields);
            } else {
                viewQuery = views[viewName] = JSB.merge({$select: viewFields}, viewQueryCore);
            }

//            /// add external fields bindings
//            $this._extractJoinFields(query, viewQuery.$select);

            /// rename context: for all nested queries with external fields of current
            $this._fixViewContext(viewQuery, viewName);

            ///     replace rebuild query

            if (/**isFrom*/!!fromParentQuery
                  && /**isQueriesIsEqual (has no external fields)*/JSB.isEqual(
                        JSB.merge({}, viewQueryCore, {$select: null, $context: null, $id: null, $views:null}),
                        JSB.merge({}, query, {$select: null, $context: null, $id: null, $views:null}))){
//                        JSB.merge({}, viewQuery, skip),
//                        JSB.merge({}, viewQueryCore, skip))) {
                /// replace parent query source
                fromParentQuery.$from = viewName;
            } else {
                /// delete core from query
                for (var i in viewQueryCore) if (query.hasOwnProperty(i)) {
                    delete query[i];
                }
                query.$from = viewName;
                query.$filter = $this._buildFilterFromView(query, viewQuery); // TODO
                if (!query.$filter) delete query.$filter;
                query.$select = $this._buildSelectFromView(query, viewQuery); // TODO
            }
        },

//        _extractJoinFields: function (query, viewFields) {
//
//            function walkMultiFilter(exps, expressionCallback){
//                for (var field in exps) if (exps.hasOwnProperty(field)) {
//                    if (field.startsWith('$')) {
//                        var op = field;
//                        switch(op) {
//                            case '$or':
//                            case '$and':
//                                for (var i in exps[op]) {
//                                    walkMultiFilter(exps[op][i], fieldsCallback);
//                                }
//                                break;
//                            case '$not':
//                                walkMultiFilter(exps[op], fieldsCallback);
//                                break;
//                            default:
//                                // $op: [left, right] expression
//                                var ops = exps[op];
//                                var leftField = QueryUtils.extractAllFields([ops[0]], query.$context);
//                                var rightField = QueryUtils.extractAllFields([ops[1]], query.$context);
//                                var leftIsExternal = leftField.$context != query.$context;
//                                var rightIsExternal = rightField.$context != query.$context;
//                                debugger;
//                                if (leftIsExternal || rightIsExternal) {
//
//                                }
//
//                        }
//                    } else {
//                        // field: {$eq: expr}
//                        fieldsCallback([{$field: field, $context: query.$context}]); // left
//                        fieldsCallback($this.extractAllFields(exps[field], query.$context)); // right
//                    }
//                }
//            }
//
//            var externalFilter = QueryUtils.extractSelfOrExternalQueryFilter(query, /**selfElseExternal*/false);
//            var fields = {};
//            walkMultiFilter(externalFilter, function(exp){
//                var expKey = MD5.md5(JSON.stringify(exp));
//                for(var f in viewFields) if(viewFields.hasOwnProperty(f)) {
//                    if(!JSB.isEqual(exp, viewFields[f])) {
//                        fields['filterField' + expKey.substring(0,6)] = exp;
//                    }
//                }
//            });
//            return fields;
//        },

        _mergeFields: function(viewFields1, viewFields2) {

            /// Слияние по значению/выражению.
            /// Имя поля может измениться, если оно дублируется при отличающемся значении.
            /// В принципе, имя не имеет значение, т.к. замена в запросе
            //  тоже будет выполняться по значению дабы минимизировать дубли.
            // TODO: сделать переименование полей для удаления дублей вырежений

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

        _fixViewContext: function(viewQuery, newContext){
            function fixFields(exp, oldContext){
                if(exp == null) {
                } else if (typeof exp === 'object') {
                    if (exp.$field && exp.$context == oldContext) {
                        exp.$context = newContext;
                        return;
                    }
                    for(var i in exp) if (exp.hasOwnProperty(i)) {
                        fixFields(exp[i], oldContext);
                    }
                } else if (JSB.isArray(exp)) {
                    for(var i = 0; i < exp.length; i++){
                        fixFields(exp[i], oldContext);
                    }
                }
            }

            fixFields(viewQuery, /**oldContext*/viewQuery.$context);
            viewQuery.$context = newContext;
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
                            case '$not':
                                walkMultiFilter(exps[op], fieldsCallback);
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
            var filter = QueryUtils.extractSelfOrExternalQueryFilter(query, false);
            // replace $filter values with view fields aliases
            walkMultiFilter(filter);
            return filter;
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

        _checkQueryHasView: function(query, isFromQuery){
            if (!isFromQuery && !query.$filter && !query.$groupBy /*&& !query.$from*/ && !query.$sort && !query.$distinct) {
                return false; // skip simple cube
            }

//            // если в запросе внешние поля не используются или используются только в $filter
//            var isIsolated = QueryUtils.checkQueryIsIsolated(JSB.merge({},query, {$filter:{}}));
//            if (!isIsolated) {
//                return false;
//            }
            return true;
        },

        _extractViewQueryCore: function(query, views){
if(query.$context == "context_6") debugger;
            var viewQuery = JSB.merge(true, {}, query, {$filter:{}});
            delete viewQuery.$select;
            delete viewQuery.$context;
            delete viewQuery.$id;
            delete viewQuery.$views;
            viewQuery.$filter = QueryUtils.extractSelfOrExternalQueryFilter(query, true);
            if (viewQuery.$filter == null) delete viewQuery.$filter;
            return viewQuery;
        },

        _extractKey: function(keyObject){
            return MD5.md5(/**sorted stringify*/JSB.stringify(keyObject));
        },

	}
}