{
	$name: 'DataCube.Query.Transforms.DefineContexts',
	$parent: 'DataCube.Query.Transforms.Transformer',
	$session: false,
	$server: {
		$require: [
		    'DataCube.Query.QueryUtils',
		    'DataCube.Query.Transforms.QueryTransformer'
        ],

		transform: function(rootQuery, cubeOrDataProvider){
            // ensure queries has defined $context
            $this.defineContexts(rootQuery);
		    return rootQuery;
		},

		defineContexts: function(rootQuery) {
debugger;
		    // update contexts
            var contextQuery = {};
            QueryUtils.walkQueries(rootQuery, {}, null,
                function leaveCallback(query){
                    /// fill or update query context
                    if (!query.$context) {
                        query.context = JSB.generateUid();
                        contextQuery[query.$context] = query;
                    } else {
                        if (contextQuery[query.$context]) {
                            if (contextQuery[query.$context] == query) {
                                return; /// is ok
                            } else {
debugger;
                                /// context is busy - rebuild query with new context
                                var context = JSB.generateUid();
                                var newQuery = QueryUtils.copyQuery(query, context);
                                QueryUtils.jsonReplaceBody(query, newQuery);
                                contextQuery[query.$context] = query;
                            }
                        } else {
                            contextQuery[query.$context] = query;
                        }
                    }
                }
            );
debugger
//            /// find views with name!=context
//            var contextNames = {};
//            for(var ctx in contextQuery) {
//                var query = contextQuery[ctx];
//                QueryUtils.throwError(ctx == query.$context, 'DefineContexts: Invalid context name');
//                for(var name in query.$views) {
//                    if (query.$views[name].$context != name) {
//                        contextNames[ctx] = contextNames[ctx]||{};
//                        contextNames[ctx][name] = query.$views[name].$context;
//                    }
//                }
//            }
		}
	}
}