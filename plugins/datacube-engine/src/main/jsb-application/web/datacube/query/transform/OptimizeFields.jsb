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
		    'DataCube.Query.Visitors.ProxyVisitor',
		    'DataCube.Query.Visitors.FieldsExtractor',
        ],

		transform: function(rootQuery, cubeOrDataProvider){
            try {
                var fieldsExtractor = new FieldsExtractor(rootQuery);
                fieldsExtractor.parse();

//                var contextUsedFields = {};
//                var contextUsedInputFields = {};
//                visitor.forEachQuery(function(query){
//                    contextUsedInputFields[query.$context] = visitor.getUsedInputFields(query);
//                    contextUsedFields[query.$context] = visitor.getUsedFields(query);
//                });

                debugger

                /// TODO сразу удалять поля нельзя, т.к. есть вьюхи, в которых поля могут использоваться по-разному

                var queryVisitor = new ProxyVisitor({
                    query: {
                        before: function(query) {
                            var usedInputFields = fieldsExtractor.getUsedInputFields(query);
                            var used = {};
                            for(var cf in usedInputFields) {
                                used[usedInputFields[cf].$field] = usedInputFields[cf];
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
                            } else if (query.$join) {
                                var left = this.getQuery(query.$join.$left);
                                removeUnusedFields(left);
                                var right = this.getQuery(query.$join.$right);
                                removeUnusedFields(right);
                            }
                        }
                    }
                });

            } finally{
                fieldsExtractor && fieldsExtractor.destroy();
                queryVisitor && queryVisitor.destroy();
            }
		    return rootQuery;
		},
	}
}