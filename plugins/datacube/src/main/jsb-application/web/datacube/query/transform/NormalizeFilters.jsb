{
	$name: 'DataCube.Query.Transforms.NormalizeFilters',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],
        
        $bootstrap: function(){
        	QueryTransformer.register(this);
        },

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
                            case '$not':
                                var newCond = walkMultiFilter(exps[op]);
                                $and.push({$not: newCond});
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
                    QueryUtils.walkQueries(query, {}, null, function(query){
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
	}
}