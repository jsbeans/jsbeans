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

            var contextQuery = {};

		    /** 1) заполнить отсутствующие $context в запросе
		        2) собрать запросы с дублирующимися контекстами
		    */
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
		},
	}
}