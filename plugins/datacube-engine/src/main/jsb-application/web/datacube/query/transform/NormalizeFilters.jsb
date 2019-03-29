{
	$name: 'DataCube.Query.Transforms.NormalizeFilters',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(dcQuery, cubeOrDataProvider){
            // standardize $filter
            $this.unwrapFilters(dcQuery, true);
		    return dcQuery;
		},

        /** Преобразует $filter к единому формату:
        *   - multifilter заменяется на $and: []
        *   - field: {$op: exp} заменяется на {$op: [field, exp]}
        */
		unwrapFilters: function(dcQuery, includeSubQueries) {
            function walkMultiFilter(exps){
                var $and = [];
                for (var field in exps) if (typeof exps[field] !== 'undefined') {
                    if (field.startsWith('$')) {
                        var op = field;
                        switch(op) {
                            case '$or':
                                var $or = [];
                                for (var i = 0; i < exps[op].length; i++) {
                                    if (!JSB.isEqual(exps[op][i], {})) {
                                        var newCond = walkMultiFilter(exps[op][i]);
                                        $or.push(newCond);
                                    }
                                }
                                $and.push({$or: $or});
                                break;
                            case '$and':
                                for (var i = 0; i < exps[op].length; i++) {
                                    if (!JSB.isEqual(exps[op][i], {})) {
                                        var newCond = walkMultiFilter(exps[op][i]);
                                        $and.push(newCond);
                                    }
                                }
                                break;
                            case '$not':
                                if (!JSB.isEqual(exps[op], {})) {
                                    var newCond = walkMultiFilter(exps[op]);
                                    $and.push({$not: newCond});
                                }
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
                    QueryUtils.walkQueries(query, {rootQuery:dcQuery, getExternalView:function(){return {};}}, null, function(query){
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

            function walkInnerConditions(exp) {
                /// find $cond and $filter
                if (JSB.isObject(exp)) {
                    if (exp.$cond) {
                        exp.$cond = walkMultiFilter(exp.$cond);
                    } else if (exp.$filter && !exp.$select) {
                        exp.$filter = walkMultiFilter(exp.$filter);
                    }
                    if (!exp.$select || includeSubQueries || exp == dcQuery) {
                        for(var i in exp) if (exp[i] != null) {
                            walkInnerConditions(exp[i]);
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for (var i=0; i < exp.length; i++) if (exp[i] != null) {
                        walkInnerConditions(exp[i]);
                    }
                }
            }

            walkQueryFilter(dcQuery, '$filter');
            walkQueryFilter(dcQuery, '$postFilter');
            walkInnerConditions(dcQuery);
		},
	}
}