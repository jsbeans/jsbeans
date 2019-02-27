{
	$name: 'DataCube.Query.Transforms.GenerateGroupBy',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'java:java.util.HashMap',
		    'DataCube.Query.Visitors.PrintVisitor',
		    'DataCube.Query.Visitors.ProxyVisitor',
		    'DataCube.Query.Visitors.FieldsExtractor',
        ],

        /** Generate/append $groupBy for expressions with $group */
		transform: function(rootQuery, cubeOrDataProvider){
            try {
                var queryVisitor = new ProxyVisitor({
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

                queryVisitor.visit(rootQuery);

            } finally{
                queryVisitor && queryVisitor.destroy();
            }
		    return rootQuery;
		},
	}
}