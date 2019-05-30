/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.GenerateGroupBy',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'java:java.util.HashMap',
		    'DataCube.Query.Visitors.Visitors',
        ],

        /** Generate/append $groupBy for expressions with $group */
		transform: function(executor, queryTask){
            var rootQuery = queryTask.query;
            var cube = queryTask.cube;
            Visitors.visit(rootQuery, {
                getUndefinedView: function(name){
//                    var slice = QueryUtils.getQuerySlice(name, cube);
//                    QueryUtils.throwError(slice, 'Query slice or named view is undefined: ' + name);
                    return {};
                },
                expression: {
                    before: function(exp) {
                        var query = this.getQuery();
                        if (exp.$group) {
                            var subExpression = exp.$group;
                            delete exp.$group;
                            QueryUtils.jsonReplaceBody(exp, subExpression)
                            if (!query.$groupBy) {
                                query.$groupBy = [];
                            }
                            for(var i in query.$groupBy) {
                                if(JSB.isEqual(query.$groupBy[i], subExpression)) {
                                    return; /// exists
                                }
                            }
                            query.$groupBy.push(JSB.clone(exp));
                        }
                    }
                }
            });
		    return rootQuery;
		},
	}
}