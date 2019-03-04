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

		transform: function(rootQuery, cubeOrDataProvider){
		    Visitors.extractedFields(rootQuery, function(){
                Visitors.visitProxy(rootQuery, {
                    query: {
                        before: function(query) {
                            var usedOutputFields = this.getUsedOutputFields(query);
                            var used = {};
                            for(var cf in usedOutputFields) {
                                used[usedOutputFields[cf].$field] = usedOutputFields[cf];
                            }

                            function removeUnusedFields(source){
                                for(var alias in source.$select) {
                                    if (!used[alias]) {
                                        delete source.$select[alias];
                                    }
                                }
                            }
                            /// patch output fields in query source
                            if (query.$from) {
                                var source = this.getQuery(query.$from);
                                removeUnusedFields(source);
                            } else if (query.$join) {
                                var left = this.getQuery(query.$join.$left);
                                removeUnusedFields(left);
                                var right = this.getQuery(query.$join.$right);
                                removeUnusedFields(right);
                            } else if (query.$recursive) {
                                var start = this.getQuery(query.$recursive.$start);
                                removeUnusedFields(start);
                                var next = this.getQuery(query.$recursive.$nextJoined);
                                removeUnusedFields(next);
                            } else if (query.$union) {
                                for(var i = 0; i < query.$union.length; i++) {
                                    var source = this.getQuery(query.$union[i]);
                                    removeUnusedFields(source);
                                }
                            }

                        }
                    }
                });
		    });
		    return rootQuery;
		},
	}
}