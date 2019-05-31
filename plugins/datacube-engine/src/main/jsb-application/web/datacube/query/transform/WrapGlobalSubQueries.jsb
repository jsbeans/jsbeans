/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.WrapGlobalSubQueries',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(executor, queryTask){
            var dcQuery = queryTask.query;
		    QueryUtils.walkQueries(dcQuery, {}, null, function(query){
                var wrapper = $this.extractWrapper(query, dcQuery);
                if(wrapper) {
                    QueryUtils.jsonReplaceBody(query, wrapper);
                }
		    });
		    return dcQuery;
		},

		extractWrapper: function(query, dcQuery){
            function walk(exp, callback) {
                if (JSB.isObject(exp)) {
                    if (exp.$select) {
                        callback(exp);
                        return;
                    }
                    for (var f in exp) if (exp[f] != null) {
                        if (walk(exp[f], callback)) {
                            delete exp[f];
                        }
                    }
                } else if (JSB.isArray(exp)) {
                    for (var i = 0 ; i < exp.length; i++) {
                        walk(exp[i], callback);
                    }
                }
            }
            var clonedQuery = JSB.clone(query);
            var query2 = {
                $context: JSB.generateUid(),
                $select: {
                },
                $from: clonedQuery
            };
            if (clonedQuery.$views) {
                query2.$views = clonedQuery.$views;
                delete clonedQuery.$views;
            }
            var count = 0;
            for(var alias in clonedQuery.$select) {
                var e = clonedQuery.$select[alias];
                walk(e, function(subQuery){
                    if(!QueryUtils.extractParentForeignFields(subQuery, dcQuery)) {
                        count ++;
                        query2.$select[alias] = subQuery;
                        delete clonedQuery.$select[alias];
                    }
                });
                if (!query2.$select[alias]) {
                    query2.$select[alias] = alias;
                }
            }
            if(count > 0) {
                return query2;
            }
		},
	}
}