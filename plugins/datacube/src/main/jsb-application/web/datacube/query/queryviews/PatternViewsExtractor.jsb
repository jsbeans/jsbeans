{
	$name: 'DataCube.Query.Views.PatternViewsExtractor',
	$parent: 'DataCube.Query.Views.SubQueryViewsExtractor',

	$server: {
	    $require: [
	        'DataCube.Query.QueryUtils',
		    'JSB.Crypt.MD5'
        ],

        /** @override */
        _walkAllViews: function (dcQuery, localViewCallback) {
debugger;
            QueryUtils.walkSubQueries(dcQuery, function(query, isFromQuery, isValueQuery, path){
                if (query.$sql) {
                    return; // skip embedded SQL query
                }
                if (!query.$filter && !query.$groupBy && !query.$from && !query.$sort && !query.$distinct) {
                    return; // skip simple cube
                }
                // skip not isolated subqueries
                var isIsolated = QueryUtils.checkQueryIsIsolated(query);
                if (!isIsolated) {
                    return;
                }

                // TODO extract patterns query

                var viewQuery = $this._extractViewQuery(query);
                var viewKey = $this._extractKey(viewQuery);
                var viewFields = $this._extractViewFields(query, viewKey, viewQuery);

                localViewCallback(viewKey, viewQuery, viewFields, query, isFromQuery);
            });
        },

        /** @override */
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

        /** @override */
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