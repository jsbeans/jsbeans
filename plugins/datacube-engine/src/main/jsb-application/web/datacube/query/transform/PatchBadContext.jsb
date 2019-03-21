{
	$name: 'DataCube.Query.Transforms.PatchBadContext',
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
            Visitors.visitProxy(rootQuery, {
                getUndefinedView: function(name){
                    return {};
                },
                field: {
                    before: function(field, context) {
                        var query = this.getQuery();
                        var targetQuery = this.getQuery(context);
                        if (query.$from && query.$from == targetQuery || query.$from == context) {
                            delete this.getCurrent().$context;
                        }

                    }
                }
            });
		    return rootQuery;
		},
	}
}