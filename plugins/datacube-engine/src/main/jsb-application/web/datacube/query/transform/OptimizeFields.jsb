/** DataCube - jsBeans extension | jsbeans.org (MIT Licence) | (c) Special Information Systems, LLC */

{
	$name: 'DataCube.Query.Transforms.OptimizeFields',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer',
		    'java:java.util.HashMap',
		    'DataCube.Query.Visitors.PrintVisitor',
		    'DataCube.Query.Visitors.Visitors',
        ],

		transform: function(executor, queryTask){
            var rootQuery = queryTask.query;
            var cubeOrDataProvider = queryTask.cube;
		    Visitors.extractedFields(rootQuery, function(fieldsExtractor){
                Visitors.visit(rootQuery, {
                    query: {
                        before: function(query) {
                            if (this.getExpressionKey(-2) == '$recursive') {
                                // not optimize $recursive.$start & $recursive.$joinedNext
                                return;
                            }
                            var usedOutputFields = fieldsExtractor.getUsedOutputFields(query);
                            if (usedOutputFields) {
                                for(var alias in query.$select) {
                                    if (!usedOutputFields[alias]) {
                                        delete query.$select[alias];
                                    }
                                }
                            }
//                            /// patch output fields in query source
//                            if (query.$from) {
//                                var source = this.getQuery(query.$from);
//                                removeUnusedFields(source);
//                            } else if (query.$join) {
//                                var left = this.getQuery(query.$join.$left);
//                                removeUnusedFields(left);
//                                var right = this.getQuery(query.$join.$right);
//                                removeUnusedFields(right);
//                            } else if (query.$recursive) {
//                                var start = this.getQuery(query.$recursive.$start);
//                                removeUnusedFields(start);
//                                var next = this.getQuery(query.$recursive.$nextJoined);
//                                removeUnusedFields(next);
//                            } else if (query.$union) {
//                                for(var i = 0; i < query.$union.length; i++) {
//                                    var source = this.getQuery(query.$union[i]);
//                                    removeUnusedFields(source);
//                                }
//                            }

                        }
                    }
                });
		    });
		    return rootQuery;
		},
	}
}